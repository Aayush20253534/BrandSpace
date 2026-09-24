import type { FrameSet } from "@/data/growthCity";

/**
 * Scroll-scrubbed image sequence player for pre-rendered cinematic footage.
 *
 * Frames load progressively (every 16th, then 8th, 4th, 2nd, all) so the
 * sequence is scrubbable almost immediately and sharpens as it streams.
 * Adjacent frames are cross-faded for sub-frame smoothness, which keeps
 * slow trackpad scrolling fluid in both directions.
 */
export class FramePlayer {
  private ctx: CanvasRenderingContext2D;
  private images: (HTMLImageElement | null)[];
  private W = 1;
  private H = 1;
  private dpr = 1;
  private aborted = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private set: FrameSet,
  ) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D unavailable");
    this.ctx = ctx;
    this.images = new Array(set.count).fill(null);
  }

  private src(i: number) {
    return this.set.pattern.replace("{i}", String(i + 1).padStart(this.set.pad, "0"));
  }

  /** Resolves once the first frame is ready; keeps streaming the rest. */
  async load(onProgress?: (loaded: number, total: number) => void) {
    const n = this.set.count;
    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < n; i += step) {
        if (seen.has(i)) continue;
        seen.add(i);
        order.push(i);
      }
    }
    // Fetch the final frame early so the end of the story is never blank.
    const lastAt = order.indexOf(n - 1);
    if (lastAt > 1) {
      order.splice(lastAt, 1);
      order.splice(1, 0, n - 1);
    }

    let loaded = 0;
    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = this.src(i);
        const done = () => {
          if (!this.aborted) {
            this.images[i] = img;
            loaded++;
            onProgress?.(loaded, n);
          }
          resolve();
        };
        img.decode().then(done, () => resolve());
      });

    await loadOne(order[0]!);
    // Stream the rest with limited concurrency.
    const queue = order.slice(1);
    const worker = async () => {
      while (queue.length && !this.aborted) await loadOne(queue.shift()!);
    };
    void Promise.all(Array.from({ length: 6 }, worker));
  }

  destroy() {
    this.aborted = true;
  }

  resize(w: number, h: number, dpr: number) {
    this.W = w;
    this.H = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
  }

  private nearest(i: number, dir: 1 | -1) {
    for (let j = i; j >= 0 && j < this.images.length; j += dir) if (this.images[j]) return j;
    return -1;
  }

  private drawCover(img: HTMLImageElement, alpha: number) {
    const { W, H } = this;
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    this.ctx.globalAlpha = 1;
  }

  render(p: number) {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const f = p * (this.set.count - 1);
    const i0 = Math.floor(f);
    const a = this.nearest(i0, -1);
    const b = this.nearest(Math.min(this.set.count - 1, i0 + 1), 1);
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
