import type { FrameSet, FrameTimeline } from "@/data/growthCity";

type ConnectionInfo = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithPerformanceHints = Navigator & {
  deviceMemory?: number;
  connection?: ConnectionInfo;
};

/**
 * Scroll-scrubbed image sequence player for pre-rendered cinematic footage.
 *
 * The player keeps a sparse set of anchor frames resident, prewarms only a
 * coarse refinement tier, and loads exact neighbouring frames on demand while
 * the user scrubs. This avoids eagerly decoding all 241 frames into memory.
 */
export class FramePlayer {
  private ctx: CanvasRenderingContext2D;
  private images: (HTMLImageElement | null)[];
  private lastUsed: number[];
  private anchors = new Set<number>();
  private queue: number[] = [];
  private queued = new Set<number>();
  private pending = new Set<number>();
  private pendingImages = new Set<HTMLImageElement>();
  private attempts = new Map<number, number>();
  private W = 1;
  private H = 1;
  private dpr = 1;
  private aborted = false;
  private activeLoads = 0;
  private clock = 0;
  private hotCenter = 0;
  private initialPending = new Set<number>();
  private initialTotal = 0;
  private initialResolve: (() => void) | null = null;
  private progressCallback: ((loaded: number, total: number) => void) | null = null;
  private warmScheduled = false;
  private idleHandle: number | null = null;
  private warmTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly concurrency: number;
  private readonly initialStep: number;
  private readonly warmStep: number;
  private readonly maxResident: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private set: FrameSet,
    private timeline?: FrameTimeline,
  ) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D unavailable");
    this.ctx = ctx;
    this.images = new Array(set.count).fill(null);
    this.lastUsed = new Array(set.count).fill(0);

    const nav = navigator as NavigatorWithPerformanceHints;
    const connection = nav.connection;
    const effectiveType = connection?.effectiveType ?? "";
    const constrained =
      connection?.saveData === true || effectiveType === "slow-2g" || effectiveType === "2g";
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const limitedHardware =
      (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;

    this.concurrency = constrained ? 2 : coarsePointer || limitedHardware ? 3 : 4;
    this.initialStep = constrained ? 24 : coarsePointer ? 16 : 12;
    this.warmStep = constrained ? 0 : coarsePointer || limitedHardware ? 8 : 4;
    this.maxResident = constrained ? 28 : coarsePointer ? 48 : 44;
  }

  private src(i: number) {
    return this.set.pattern.replace("{i}", String(i + 1).padStart(this.set.pad, "0"));
  }

  private sample(step: number) {
    const last = this.set.count - 1;
    const ordered = [0, 1, 2, last];
    for (let i = 0; i < this.set.count; i += step) ordered.push(i);
    ordered.push(last);

    const seen = new Set<number>();
    return ordered.filter((i) => {
      if (i < 0 || i > last || seen.has(i)) return false;
      seen.add(i);
      return true;
    });
  }

  /**
   * Resolves when the sparse startup set is ready. The `total` reported to the
   * loader is the startup set, not all 241 frames.
   */
  load(onProgress?: (loaded: number, total: number) => void) {
    const initial = this.sample(this.initialStep);
    this.anchors = new Set(initial);
    this.initialPending = new Set(initial);
    this.initialTotal = initial.length;
    this.progressCallback = onProgress ?? null;
    this.enqueue(initial, true);

    return new Promise<void>((resolve) => {
      this.initialResolve = resolve;
      this.pump();
    }).then(() => this.scheduleWarm());
  }

  private enqueue(indices: number[], priority = false) {
    const fresh = indices.filter((i) => {
      if (i < 0 || i >= this.set.count) return false;
      if (this.images[i] || this.pending.has(i) || this.queued.has(i)) return false;
      this.queued.add(i);
      return true;
    });

    if (!fresh.length) return;
    this.queue = priority ? [...fresh, ...this.queue] : [...this.queue, ...fresh];
    this.pump();
  }

  private pump() {
    while (!this.aborted && this.activeLoads < this.concurrency && this.queue.length) {
      const i = this.queue.shift()!;
      this.queued.delete(i);
      if (this.images[i] || this.pending.has(i)) continue;

      this.pending.add(i);
      this.activeLoads++;
      void this.loadIndex(i).then((settled) => {
        this.pending.delete(i);
        this.activeLoads--;

        if (settled) this.settleInitial(i);
        else this.enqueue([i], true);

        this.pump();
      });
    }
  }

  /**
   * Returns true when the index is settled (loaded or failed twice), false when
   * it should be retried once.
   */
  private async loadIndex(i: number) {
    const attempt = (this.attempts.get(i) ?? 0) + 1;
    this.attempts.set(i, attempt);

    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = i === 0 ? "high" : "low";
    this.pendingImages.add(img);

    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Frame ${i} failed to load`));
        img.src = this.src(i);
      });

      try {
        await img.decode();
      } catch {
        // A completed load can still be drawable when decode() rejects.
      }

      if (this.aborted || !img.naturalWidth) return true;
      this.images[i] = img;
      this.touch(i);
      this.trim();
      return true;
    } catch {
      return attempt >= 2;
    } finally {
      img.onload = null;
      img.onerror = null;
      this.pendingImages.delete(img);
    }
  }

  private settleInitial(i: number) {
    if (!this.initialPending.delete(i)) return;
    const settled = this.initialTotal - this.initialPending.size;
    this.progressCallback?.(settled, this.initialTotal);

    if (this.initialPending.size === 0) {
      this.progressCallback = null;
      const resolve = this.initialResolve;
      this.initialResolve = null;
      resolve?.();
    }
  }

  private scheduleWarm() {
    if (this.warmScheduled || this.warmStep <= 0 || this.aborted) return;
    this.warmScheduled = true;

    const warm = () => {
      if (this.aborted) return;
      this.enqueue(this.sample(this.warmStep));
    };

    if ("requestIdleCallback" in window) {
      this.idleHandle = window.requestIdleCallback(warm, { timeout: 1500 });
    } else {
      this.warmTimer = setTimeout(warm, 500);
    }
  }

  private ensureAround(i: number) {
    this.hotCenter = i;
    this.enqueue([i, i + 1, i - 1, i + 2, i - 2, i + 3, i - 3], true);
  }

  private touch(i: number) {
    this.lastUsed[i] = ++this.clock;
  }

  private trim() {
    let resident = this.images.reduce((count, image) => count + (image ? 1 : 0), 0);
    if (resident <= this.maxResident) return;

    while (resident > this.maxResident) {
      let victim = -1;
      let oldest = Number.POSITIVE_INFINITY;

      for (let i = 0; i < this.images.length; i++) {
        if (!this.images[i]) continue;
        if (this.anchors.has(i)) continue;
        if (Math.abs(i - this.hotCenter) <= 4) continue;
        if (this.lastUsed[i] < oldest) {
          oldest = this.lastUsed[i];
          victim = i;
        }
      }

      if (victim < 0) break;
      const image = this.images[victim];
      this.images[victim] = null;
      this.lastUsed[victim] = 0;
      if (image) image.src = "";
      resident--;
    }
  }

  destroy() {
    this.aborted = true;
    this.queue = [];
    this.queued.clear();

    if (this.idleHandle !== null && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(this.idleHandle);
    }
    if (this.warmTimer !== null) clearTimeout(this.warmTimer);

    for (const image of this.pendingImages) image.src = "";
    this.pendingImages.clear();

    for (let i = 0; i < this.images.length; i++) {
      const image = this.images[i];
      if (image) image.src = "";
      this.images[i] = null;
    }
  }

  resize(w: number, h: number, dpr: number) {
    this.W = w;
    this.H = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
  }

  private nearest(i: number, dir: 1 | -1) {
    for (let j = i; j >= 0 && j < this.images.length; j += dir) {
      if (this.images[j]) return j;
    }
    return -1;
  }

  private drawCover(img: HTMLImageElement, alpha: number) {
    const { W, H } = this;
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    this.ctx.globalAlpha = 1;
  }

  /** Frame position for progress `p`: along the timeline when there is one, else linear. */
  private frameAt(p: number) {
    const last = this.set.count - 1;
    const tl = this.timeline;
    if (!tl || tl.length < 2) return p * last;
    let i = 1;
    while (i < tl.length - 1 && p > tl[i]![0]) i++;
    const [p0, f0] = tl[i - 1]!;
    const [p1, f1] = tl[i]!;
    const t = p1 > p0 ? Math.min(1, Math.max(0, (p - p0) / (p1 - p0))) : 1;
    return Math.min(last, Math.max(0, f0 + (f1 - f0) * t));
  }

  render(p: number) {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const f = this.frameAt(p);
    const i0 = Math.floor(f);
    this.ensureAround(i0);

    const a = this.nearest(i0, -1);
    const b = this.nearest(Math.min(this.set.count - 1, i0 + 1), 1);
    if (a >= 0) this.touch(a);
    if (b >= 0) this.touch(b);

    if (a < 0 && b < 0) {
      ctx.fillStyle = "#050706";
      ctx.fillRect(0, 0, this.W, this.H);
      return;
    }
    if (a < 0 || b < 0 || a === b) {
      this.drawCover(this.images[a >= 0 ? a : b]!, 1);
      return;
    }

    const t = (f - a) / (b - a);
    this.drawCover(this.images[a]!, 1);
    if (t > 0.01) this.drawCover(this.images[b]!, t);
  }
}
