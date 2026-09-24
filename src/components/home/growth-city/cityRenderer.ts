/**
 * Code-rendered "Growth City" — a lightweight 2.5D canvas illustration
 * driven entirely by scroll progress `p` (0 → 1).
 *
 * One continuous orthographic camera: it starts low and close on a lone
 * shop, orbits and cranes up while the world grows around it, then tilts
 * to a top-down aerial where the road layout mirrors the BrandSpace logo
 * (the shop sits exactly where the logo's play button is).
 *
 * Not a simulation: every element is a pure function of `p` (plus a slow
 * ambient clock for traffic), so scrubbing forward/backward is exact.
 */

type Pt = { x: number; y: number };
export type Quality = "high" | "low";

/* ------------------------------------------------------------------ */
/* Math helpers                                                        */
/* ------------------------------------------------------------------ */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const DEG = Math.PI / 180;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Key = [p: number, v: number];
function track(keys: Key[], p: number) {
  if (p <= keys[0]![0]) return keys[0]![1];
  for (let i = 1; i < keys.length; i++) {
    const [p1, v1] = keys[i]!;
    const [p0, v0] = keys[i - 1]!;
    if (p <= p1) return lerp(v0, v1, easeInOut((p - p0) / (p1 - p0)));
  }
  return keys[keys.length - 1]![1];
}

function distToSegment(p: Pt, a: Pt, b: Pt) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  const t = l2 ? clamp01(((p.x - a.x) * dx + (p.y - a.y) * dy) / l2) : 0;
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function pointInPoly(p: Pt, poly: Pt[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!, b = poly[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/* ------------------------------------------------------------------ */
/* World layout — measured from the supplied logo (plan units)         */
/* ------------------------------------------------------------------ */

const N1 = { x: 454, y: -317, r: 66 };
const N2 = { x: 564, y: -70, r: 82 };
const N3 = { x: 316, y: 250, r: 77 };
const P = { x: 184, y: -202 };
const Q = { x: 135, y: 195 };
const PLAZAS = [N1, N2, N3];

/** The logo's speech-bubble outline: the shop's own district. */
const DISTRICT: Pt[] = [
  { x: -239, y: -284 },
  { x: 300, y: -15 },
  { x: -64, y: 200 },
  { x: -118, y: 365 },
  { x: -146, y: 247 },
  { x: -234, y: 299 },
];
const DASHES: [Pt, Pt][] = [
  [{ x: -8, y: -400 }, { x: 107, y: -290 }],
  [{ x: 212, y: -477 }, { x: 212, y: -317 }],
];
const COMPOSITION_CENTER = { x: 170, y: -40 };

type Road = {
  pts: Pt[];
  cum: number[];
  len: number;
  /** p range over which the road is drawn out. */
  grow: [number, number];
  width: number;
  kind: "ring" | "link-green" | "link-dark" | "avenue" | "grid" | "blvd";
};

function makeRoad(pts: Pt[], grow: [number, number], width: number, kind: Road["kind"]): Road {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1]! + Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y));
  return { pts, cum, len: cum[cum.length - 1]!, grow, width, kind };
}

function pointAt(road: Road, d: number): Pt {
  const dd = Math.max(0, Math.min(road.len, d));
  let i = 1;
  while (i < road.cum.length - 1 && road.cum[i]! < dd) i++;
  const a = road.pts[i - 1]!, b = road.pts[i]!;
  const seg = road.cum[i]! - road.cum[i - 1]!;
  const t = seg ? (dd - road.cum[i - 1]!) / seg : 0;
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

/** Point on a circle edge facing `from`. */
function edgeToward(c: { x: number; y: number; r: number }, from: Pt): Pt {
  const dx = from.x - c.x, dy = from.y - c.y;
  const l = Math.hypot(dx, dy) || 1;
  return { x: c.x + (dx / l) * c.r, y: c.y + (dy / l) * c.r };
}

type Building = {
  x0: number; y0: number; x1: number; y1: number;
  h: number; appear: number; dist: number;
  tone: number; lit: string; dash: number[]; roof: string | null;
};

type Billboard = { at: Pt; appear: number; hueA: string; hueB: string; seed: number; w: number; h: number; lift: number };
type Car = { road: number; offset: number; speed: number; dir: 1 | -1; warm: boolean; appear: number };
type Walker = { road: number; offset: number; speed: number; appear: number };

/* ------------------------------------------------------------------ */
/* Renderer                                                            */
/* ------------------------------------------------------------------ */

export type Camera = {
  zoom: number;
  a: number; // plan rotation (rad)
  k: number; // ground squash = sin(pitch)
  zf: number; // height factor = cos(pitch)
  ox: number; // screen offset
  oy: number;
};

export class CityRenderer {
  private ctx: CanvasRenderingContext2D;
  private W = 1;
  private H = 1;
  private dpr = 1;
  private quality: Quality;
  private roads: Road[] = [];
  private pathways: Road[] = [];
  private buildings: Building[] = [];
  private billboards: Billboard[] = [];
  private cars: Car[] = [];
  private walkers: Walker[] = [];
  private stars: { x: number; y: number; r: number; a: number }[] = [];
  private order: Building[] = [];
  cam: Camera = { zoom: 1, a: 0, k: 1, zf: 0, ox: 0, oy: 0 };

  constructor(private canvas: HTMLCanvasElement, quality: Quality) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D unavailable");
    this.ctx = ctx;
    this.quality = quality;
    this.buildWorld();
  }

  resize(w: number, h: number, dpr: number) {
    this.W = Math.max(1, w);
    this.H = Math.max(1, h);
    this.dpr = dpr;
    this.canvas.width = Math.round(this.W * dpr);
    this.canvas.height = Math.round(this.H * dpr);
    const rnd = mulberry32(7);
    this.stars = Array.from({ length: this.quality === "high" ? 140 : 70 }, () => ({
      x: rnd() * this.W,
      y: rnd() * this.H * 0.75,
      r: rnd() * 1.1 + 0.2,
      a: rnd() * 0.5 + 0.1,
    }));
  }

  /* ---------------- world ---------------- */

  private buildWorld() {
    const low = this.quality === "low";

    // Composition roads (grow during Discovery).
    const topEdgeNearP = { x: 150, y: -89 };
    const bottomEdgeNearQ = { x: 100, y: 117 };
    const ring = makeRoad([...DISTRICT, DISTRICT[0]!], [0.36, 0.45], 16, "ring");
    const linkPN1 = makeRoad([topEdgeNearP, P, edgeToward(N1, P)], [0.37, 0.44], 18, "link-green");
    const linkPN2 = makeRoad([P, edgeToward(N2, P)], [0.39, 0.46], 18, "link-dark");
    const linkN2N3 = makeRoad([edgeToward(N2, N3), edgeToward(N3, N2)], [0.41, 0.47], 18, "link-dark");
    const linkN3Q = makeRoad([edgeToward(N3, Q), Q, bottomEdgeNearQ], [0.4, 0.46], 18, "link-dark");
    const avenueW = makeRoad([{ x: -236, y: 10 }, { x: -2100, y: 10 }], [0.38, 0.5], 18, "avenue");
    const avenueE = makeRoad([edgeToward(N2, { x: 3000, y: -70 }), { x: 2300, y: -70 }], [0.44, 0.56], 18, "avenue");
    const avenueS = makeRoad([edgeToward(N3, { x: 316, y: 3000 }), { x: 316, y: 1600 }], [0.45, 0.57], 16, "avenue");
    const avenueN = makeRoad([edgeToward(N1, { x: 454, y: -3000 }), { x: 454, y: -1600 }], [0.45, 0.57], 16, "avenue");
    const blvd1 = makeRoad(DASHES[0]!, [0.8, 0.86], 26, "blvd");
    const blvd2 = makeRoad(DASHES[1]!, [0.8, 0.86], 26, "blvd");
    this.roads = [ring, linkPN1, linkPN2, linkN2N3, linkN3Q, avenueW, avenueE, avenueS, avenueN, blvd1, blvd2];

    // City grid (grows with the city).
    const gridStep = 320;
    for (let y = -1440; y <= 1440; y += gridStep) {
      if (Math.abs(y - 10) < 60 || Math.abs(y + 70) < 60) continue;
      if (y > -560 && y < 420) {
        // Split around the composition.
        this.roads.push(makeRoad([{ x: -2100, y }, { x: -420, y }], [0.7, 0.8], 12, "grid"));
        this.roads.push(makeRoad([{ x: 820, y }, { x: 2300, y }], [0.7, 0.8], 12, "grid"));
      } else {
        this.roads.push(makeRoad([{ x: -2100, y }, { x: 2300, y }], [0.7, 0.8], 12, "grid"));
      }
    }
    for (let x = -1920; x <= 2240; x += gridStep) {
      if (Math.abs(x - 316) < 60 || Math.abs(x - 454) < 60) continue;
      if (x > -420 && x < 820) {
        this.roads.push(makeRoad([{ x, y: -1600 }, { x, y: -640 }], [0.7, 0.8], 12, "grid"));
        this.roads.push(makeRoad([{ x, y: 520 }, { x, y: 1600 }], [0.7, 0.8], 12, "grid"));
      } else {
        this.roads.push(makeRoad([{ x, y: -1600 }, { x, y: 1600 }], [0.7, 0.8], 12, "grid"));
      }
    }

    // Digital pathways from the shop (Presence) that later become roads.
    this.pathways = [
      makeRoad([{ x: 0, y: 0 }, { x: 60, y: -60 }, topEdgeNearP, P, edgeToward(N1, P)], [0.25, 0.37], 2, "avenue"),
      makeRoad([{ x: 0, y: 0 }, { x: 150, y: -40 }, { x: 300, y: -15 }, edgeToward(N2, { x: 300, y: -15 })], [0.26, 0.38], 2, "avenue"),
      makeRoad([{ x: 0, y: 0 }, { x: 40, y: 90 }, bottomEdgeNearQ, Q, edgeToward(N3, Q)], [0.27, 0.39], 2, "avenue"),
      makeRoad([{ x: 0, y: 0 }, { x: -120, y: 10 }, { x: -236, y: 10 }, { x: -900, y: 10 }], [0.26, 0.4], 2, "avenue"),
    ];

    // Buildings on a jittered grid, skipping roads, plazas and the district.
    const rnd = mulberry32(2026);
    const cell = 80;
    const segs: [Pt, Pt, number][] = [];
    for (const r of this.roads) for (let i = 1; i < r.pts.length; i++) segs.push([r.pts[i - 1]!, r.pts[i]!, r.width / 2 + 16]);
    const maxDist = 2300;
    for (let gx = -2080; gx < 2280; gx += cell) {
      for (let gy = -1560; gy < 1560; gy += cell) {
        if (low && rnd() < 0.45) continue;
        const shrinkX = 10 + rnd() * 14;
        const shrinkY = 10 + rnd() * 14;
        const b = { x0: gx + shrinkX, y0: gy + shrinkY, x1: gx + cell - shrinkX, y1: gy + cell - shrinkY };
        const c = { x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 };
        const half = Math.max(b.x1 - b.x0, b.y1 - b.y0) / 2;
        if (pointInPoly(c, DISTRICT) || DISTRICT.some((v) => Math.hypot(v.x - c.x, v.y - c.y) < 70)) continue;
        // keep the district outline clear
        let near = false;
        for (let i = 0; i < DISTRICT.length && !near; i++) {
          if (distToSegment(c, DISTRICT[i]!, DISTRICT[(i + 1) % DISTRICT.length]!) < half + 30) near = true;
        }
        if (near) continue;
        if (PLAZAS.some((n) => Math.hypot(n.x - c.x, n.y - c.y) < n.r + half + 26)) continue;
        if (segs.some(([a, bb, w]) => distToSegment(c, a, bb) < w + half)) continue;
        if (DASHES.some(([a, bb]) => distToSegment(c, a, bb) < half + 40)) continue;
        if (rnd() < 0.12) continue; // occasional open lots

        const dist = Math.hypot(c.x - 100, c.y);
        const falloff = 1 - Math.min(1, dist / maxDist);
        const tower = rnd() < 0.08 + falloff * 0.1;
        const h = (tower ? 140 + rnd() * 180 : 26 + rnd() * 90) * (0.45 + falloff * 0.75);
        // First ring rises with the ads scene, the rest with the growth scene.
        const appear = dist < 700 ? 0.6 + (dist / 700) * 0.08 + rnd() * 0.015 : 0.69 + ((dist - 700) / (maxDist - 700)) * 0.12 + rnd() * 0.02;
        const warm = rnd();
        this.buildings.push({
          ...b,
          h,
          appear,
          dist,
          tone: rnd(),
          lit: warm < 0.62 ? "255,208,150" : warm < 0.9 ? "226,238,255" : "120,230,160",
          dash: [2 + rnd() * 4, 3 + rnd() * 6, 1 + rnd() * 3, 2 + rnd() * 5],
          roof: rnd() < 0.18 ? (rnd() < 0.5 ? "91,209,123" : "255,255,255") : null,
        });
      }
    }

    // Social billboards along the new roads.
    const bbSpots: [Pt, number][] = [
      [{ x: 280, y: -330 }, 0.49], [{ x: 410, y: -170 }, 0.5], [{ x: 470, y: 110 }, 0.51],
      [{ x: 190, y: 330 }, 0.52], [{ x: -420, y: -60 }, 0.5], [{ x: -620, y: 80 }, 0.53],
      [{ x: 700, y: -150 }, 0.54], [{ x: 380, y: 430 }, 0.55], [{ x: 600, y: -420 }, 0.55],
    ];
    const palettes: [string, string][] = [
      ["#5bd17b", "#0d3a22"], ["#f2a65a", "#5a1f3b"], ["#7cc6ff", "#1b2a6b"],
      ["#ff7a9c", "#3b1240"], ["#e8e1c6", "#394b3c"], ["#9b8cff", "#1d1a45"],
    ];
    bbSpots.forEach(([at, appear], i) => {
      const pal = palettes[i % palettes.length]!;
      this.billboards.push({ at, appear, hueA: pal[0], hueB: pal[1], seed: i, w: 64 + (i % 3) * 10, h: 40 + (i % 2) * 8, lift: 34 + (i % 3) * 8 });
    });

    // Traffic.
    const carRoads = this.roads.map((r, i) => ({ r, i })).filter(({ r }) => r.kind !== "blvd");
    const carCount = low ? 90 : 190;
    for (let i = 0; i < carCount; i++) {
      const { r, i: idx } = carRoads[Math.floor(rnd() * carRoads.length)]!;
      const isGrid = r.kind === "grid";
      this.cars.push({
        road: idx,
        offset: rnd() * r.len,
        speed: 28 + rnd() * 46,
        dir: rnd() < 0.5 ? 1 : -1,
        warm: rnd() < 0.55,
        appear: isGrid ? 0.72 + rnd() * 0.08 : 0.6 + rnd() * 0.08,
      });
    }
    // Customers walking toward the shop along the pathways.
    const walkerCount = low ? 26 : 48;
    for (let i = 0; i < walkerCount; i++) {
      const road = Math.floor(rnd() * this.pathways.length);
      this.walkers.push({ road, offset: rnd() * this.pathways[road]!.len, speed: 10 + rnd() * 14, appear: 0.6 + rnd() * 0.06 });
    }
  }

  /* ---------------- camera ---------------- */

  private updateCamera(p: number) {
    const S = Math.min(this.W, this.H * 1.25);
    const portrait = this.H > this.W * 1.1;
    const span = track(
      [
        [0, 250], [0.1, 190], [0.21, 225], [0.25, 340], [0.3, 600], [0.36, 700], [0.46, 980], [0.57, 1260],
        [0.69, 1650], [0.83, 2700], [0.92, portrait ? 2500 : 2900], [1, portrait ? 2400 : 2800],
      ],
      p,
    );
    const zoom = S / span;
    const aDeg = track([[0, 22], [0.2, 28], [0.4, 38], [0.56, 45], [0.8, 46], [0.93, 0], [1, 0]], p);
    const pitch = track([[0, 15], [0.2, 20], [0.35, 27], [0.5, 32], [0.7, 37], [0.83, 50], [0.93, 90], [1, 90]], p);
    const tx = track([[0, 0], [0.22, 0], [0.34, 30], [0.57, 140], [0.83, COMPOSITION_CENTER.x], [1, COMPOSITION_CENTER.x]], p);
    const ty = track([[0, 0], [0.22, 0], [0.34, -60], [0.57, -40], [0.83, COMPOSITION_CENTER.y], [1, COMPOSITION_CENTER.y]], p);
    const tz = track([[0, 24], [0.2, 30], [0.28, 96], [0.36, 90], [0.5, 30], [0.83, 0], [1, 0]], p);

    const a = aDeg * DEG;
    const k = Math.sin(pitch * DEG);
    const zf = Math.cos(pitch * DEG);
    const xr = tx * Math.cos(a) - ty * Math.sin(a);
    const yr = tx * Math.sin(a) + ty * Math.cos(a);
    const sx = xr;
    const sy = yr * k - tz * zf;
    // Keep the subject clear of the overlay copy: right of centre on wide
    // screens, above it on portrait. Recentres for the aerial finale.
    const settle = ramp(p, 0.8, 0.9);
    const focusX = portrait ? this.W * 0.5 : this.W * lerp(0.6, 0.5, settle);
    const focusY = portrait ? this.H * 0.42 : this.H * lerp(0.43, 0.5, settle);
    this.cam = { zoom, a, k, zf, ox: focusX - sx * zoom, oy: focusY - sy * zoom };
  }

  /** World (plan x, y, height z) → screen CSS px. */
  project(x: number, y: number, z = 0): Pt {
    const { zoom, a, k, zf, ox, oy } = this.cam;
    const ca = Math.cos(a), sa = Math.sin(a);
    const xr = x * ca - y * sa;
    const yr = x * sa + y * ca;
    return { x: xr * zoom + ox, y: (yr * k - z * zf) * zoom + oy };
  }

  /** Ground-plane transform so plan-space drawing (roads, rings) is exact. */
  private groundTransform() {
    const { zoom, a, k, ox, oy } = this.cam;
    const d = this.dpr;
    const ca = Math.cos(a), sa = Math.sin(a);
    this.ctx.setTransform(d * zoom * ca, d * zoom * k * sa, -d * zoom * sa, d * zoom * k * ca, d * ox, d * oy);
  }

  private screenTransform() {
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /** Screen-space transform of the logo image so it overlays the aerial layout. */
  logoPlacement(geom: { size: number; anchor: Pt; planPerPx: number }) {
    const shop = this.project(0, 0, 0);
    const scale = this.cam.zoom * geom.planPerPx; // screen px per logo px
    return { x: shop.x - geom.anchor.x * scale, y: shop.y - geom.anchor.y * scale, size: geom.size * scale };
  }

  /* ---------------- frame ---------------- */

  render(p: number, time: number) {
    const ctx = this.ctx;
    this.updateCamera(p);
    const { W, H } = this;
    const aerial = ramp(p, 0.84, 0.93);
    const finale = ramp(p, 0.88, 0.95);

    // Sky / void
    this.screenTransform();
    const bright = ramp(p, 0.11, 0.3) * 0.5 + ramp(p, 0.58, 0.84) * 0.5;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `rgb(${4 + bright * 4},${6 + bright * 8},${6 + bright * 6})`);
    g.addColorStop(0.55, `rgb(${7 + bright * 6},${10 + bright * 14},${9 + bright * 9})`);
    g.addColorStop(1, `rgb(${5 + bright * 3},${7 + bright * 6},${6 + bright * 4})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Stars fade as the city lights come up and the camera tilts down.
    const starA = (1 - ramp(p, 0.55, 0.8)) * (1 - aerial);
    if (starA > 0.01) {
      ctx.fillStyle = "#dfe8e2";
      for (const s of this.stars) {
        const tw = 0.6 + 0.4 * Math.sin(time * 0.0012 + s.x);
        ctx.globalAlpha = s.a * starA * tw;
        ctx.fillRect(s.x, s.y * (1 - ramp(p, 0.3, 0.7) * 0.4), s.r, s.r);
      }
      ctx.globalAlpha = 1;
    }

    this.drawGround(p, time, aerial, finale);
    this.drawRoads(p, time, aerial, finale);
    this.drawPathways(p, time);
    this.drawPlazas(p, time, finale);
    this.drawMovers(p, time, finale);
    this.drawBuildingsAndShop(p, time, aerial, finale);
    this.drawBillboards(p, time, aerial);
    this.drawWebsitePanel(p, time);
    this.drawDiscovery(p, time, aerial);

    // Vignette
    this.screenTransform();
    const v = ctx.createRadialGradient(W / 2, H * 0.5, Math.min(W, H) * 0.25, W / 2, H * 0.5, Math.max(W, H) * 0.75);
    v.addColorStop(0, "rgba(4,6,5,0)");
    v.addColorStop(1, `rgba(4,6,5,${0.78 + finale * 0.1})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);

    // Final dim so the real logo can take over.
    const dim = ramp(p, 0.9, 0.97);
    if (dim > 0) {
      ctx.fillStyle = `rgba(5,7,6,${dim * 0.8})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ---------------- layers ---------------- */

  private drawGround(p: number, time: number, aerial: number, finale: number) {
    const ctx = this.ctx;
    this.groundTransform();
    const { zoom } = this.cam;

    // Pool of light around the shop — widens as the brand comes alive.
    const glowR = lerp(160, 520, ramp(p, 0.1, 0.35)) + ramp(p, 0.58, 0.84) * 700;
    const lamp = 0.5 + 0.5 * ramp(p, 0.11, 0.2);
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
    rg.addColorStop(0, `rgba(${lerp(70, 91, lamp)},${lerp(80, 209, lamp)},${lerp(70, 123, lamp)},${0.1 + lamp * 0.08})`);
    rg.addColorStop(0.45, `rgba(40,90,60,${0.04 + lamp * 0.03})`);
    rg.addColorStop(1, "rgba(20,40,30,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(0, 0, glowR, 0, Math.PI * 2);
    ctx.fill();

    // Digital grid expanding from the shop.
    const gridA = ramp(p, 0.24, 0.34) * (1 - finale * 0.6);
    if (gridA > 0.01) {
      const R = lerp(120, 2600, easeOut(ramp(p, 0.24, 0.72)));
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = `rgba(91,209,123,${0.07 * gridA})`;
      ctx.lineWidth = 1 / zoom;
      ctx.beginPath();
      for (let x = -2080; x <= 2280; x += 80) {
        ctx.moveTo(x, -1600);
        ctx.lineTo(x, 1600);
      }
      for (let y = -1600; y <= 1600; y += 80) {
        ctx.moveTo(-2080, y);
        ctx.lineTo(2280, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // The shop's district — the logo's speech bubble.
    const dA = ramp(p, 0.13, 0.3);
    if (dA > 0.01) {
      ctx.beginPath();
      roundedPoly(ctx, DISTRICT, 40);
      ctx.fillStyle = `rgba(91,209,123,${0.035 * dA + finale * 0.1})`;
      ctx.fill();
    }
    void time;
    void aerial;
  }

  private drawRoads(p: number, time: number, aerial: number, finale: number) {
    const ctx = this.ctx;
    this.groundTransform();
    const { zoom } = this.cam;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const road of this.roads) {
      const grow = easeInOut(ramp(p, road.grow[0], road.grow[1]));
      if (grow <= 0.001) continue;
      const comp = road.kind !== "grid" && road.kind !== "avenue";
      const fade = road.kind === "grid" || road.kind === "avenue" ? 1 - finale * 0.55 : 1;
      const len = road.len * grow;

      ctx.beginPath();
      tracePartial(ctx, road, len);

      // asphalt
      ctx.strokeStyle = road.kind === "blvd" ? `rgba(91,209,123,${0.25 + finale * 0.55})` : `rgba(14,20,17,${0.95 * fade})`;
      ctx.lineWidth = road.width;
      ctx.stroke();

      // glowing edge
      const green = road.kind === "link-green" || road.kind === "ring" || road.kind === "blvd";
      const edgeA = (road.kind === "grid" ? 0.14 : 0.32) * fade + (comp ? finale * 0.55 : 0);
      ctx.strokeStyle = green || comp ? `rgba(91,209,123,${edgeA})` : `rgba(190,220,200,${edgeA * 0.8})`;
      ctx.lineWidth = road.width + 3 / zoom + (comp ? finale * 6 : 0);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // re-fill asphalt centre so only the edges glow
      if (road.kind !== "blvd") {
        ctx.strokeStyle = road.kind === "link-green" ? `rgba(40,110,66,${0.9 * fade})` : `rgba(12,17,14,${fade})`;
        ctx.lineWidth = road.width - 3;
        ctx.stroke();
      }

      // centre markings
      if (road.kind !== "blvd" && aerial < 0.95) {
        ctx.setLineDash([10, 14]);
        ctx.lineDashOffset = -time * 0.01;
        ctx.strokeStyle = `rgba(230,240,232,${0.18 * fade * (1 - aerial)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (road.kind === "link-green") {
        ctx.strokeStyle = `rgba(91,209,123,${0.5 + finale * 0.5})`;
        ctx.lineWidth = road.width * 0.55;
        ctx.stroke();
      }
    }
  }

  private drawPathways(p: number, time: number) {
    const ctx = this.ctx;
    const show = ramp(p, 0.25, 0.3) * (1 - ramp(p, 0.44, 0.52));
    if (show <= 0.01) return;
    this.groundTransform();
    const { zoom } = this.cam;
    for (const path of this.pathways) {
      const grow = easeOut(ramp(p, path.grow[0], path.grow[1]));
      if (grow <= 0) continue;
      ctx.beginPath();
      tracePartial(ctx, path, path.len * grow);
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `rgba(91,209,123,${0.18 * show})`;
      ctx.lineWidth = 9 / zoom;
      ctx.stroke();
      ctx.setLineDash([6 / zoom, 8 / zoom]);
      ctx.lineDashOffset = -time * 0.02;
      ctx.strokeStyle = `rgba(150,240,180,${0.85 * show})`;
      ctx.lineWidth = 1.6 / zoom;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalCompositeOperation = "source-over";
      // travelling head
      const head = pointAt(path, path.len * grow);
      ctx.fillStyle = `rgba(190,255,210,${show})`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 3.5 / zoom, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawPlazas(p: number, time: number, finale: number) {
    const ctx = this.ctx;
    const a = ramp(p, 0.4, 0.47);
    if (a <= 0.01) return;
    this.groundTransform();
    PLAZAS.forEach((n, i) => {
      const s = easeOut(ramp(p, 0.4 + i * 0.015, 0.47 + i * 0.015));
      if (s <= 0) return;
      const r = n.r * s;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20,34,26,${0.95})`;
      ctx.fill();
      ctx.lineWidth = 3 + finale * 5;
      ctx.strokeStyle = `rgba(91,209,123,${0.45 + finale * 0.5})`;
      ctx.stroke();
      // green core that fills in for the logo composition
      const core = 0.18 + finale * 0.75;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 0.78, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(91,209,123,${core})`;
      ctx.fill();
      // slow pulse ring
      const t = ((time * 0.0004 + i * 0.33) % 1) * (1 - finale);
      if (t > 0) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * (1 + t * 1.2), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(91,209,123,${0.35 * (1 - t)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  private drawMovers(p: number, time: number, finale: number) {
    const ctx = this.ctx;
    const traffic = ramp(p, 0.59, 0.66);
    if (traffic <= 0.01) return;
    this.screenTransform();
    const tsec = time / 1000;
    ctx.globalCompositeOperation = "lighter";
    const fadeOut = 1 - finale * 0.7;

    for (const c of this.cars) {
      const vis = ramp(p, c.appear, c.appear + 0.03) * fadeOut;
      if (vis <= 0.01) continue;
      const road = this.roads[c.road]!;
      if (ramp(p, road.grow[0], road.grow[1]) < 1) continue;
      let d = (c.offset + c.dir * c.speed * tsec) % road.len;
      if (d < 0) d += road.len;
      const pt = pointAt(road, d);
      // keep to the right lane
      const s = this.project(pt.x, pt.y, 1.5);
      if (s.x < -20 || s.y < -20 || s.x > this.W + 20 || s.y > this.H + 20) continue;
      const r = Math.max(0.9, Math.min(2.4, this.cam.zoom * 3));
      ctx.fillStyle = c.warm ? `rgba(255,214,160,${0.9 * vis})` : `rgba(255,90,80,${0.8 * vis})`;
      ctx.fillRect(s.x - r / 2, s.y - r / 2, r, r);
      ctx.fillStyle = c.warm ? `rgba(255,200,140,${0.12 * vis})` : `rgba(255,80,70,${0.1 * vis})`;
      ctx.fillRect(s.x - r * 2, s.y - r * 2, r * 4, r * 4);
    }

    for (const w of this.walkers) {
      const vis = ramp(p, w.appear, w.appear + 0.04) * (1 - ramp(p, 0.8, 0.86));
      if (vis <= 0.01) continue;
      const path = this.pathways[w.road]!;
      // walk toward the shop (decreasing distance), loop
      let d = path.len - ((w.offset + w.speed * tsec) % path.len);
      if (d < 0) d += path.len;
      const pt = pointAt(path, d);
      const s = this.project(pt.x, pt.y, 2);
      const r = Math.max(1, Math.min(2.6, this.cam.zoom * 3.2));
      ctx.fillStyle = `rgba(150,245,180,${0.9 * vis})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  private drawBuildingsAndShop(p: number, time: number, aerial: number, finale: number) {
    this.screenTransform();
    const { a, zf, zoom } = this.cam;
    const sa = Math.sin(a), ca = Math.cos(a);

    // Visible buildings, depth-sorted back → front.
    const vis = this.order;
    vis.length = 0;
    const margin = 200;
    for (const b of this.buildings) {
      if (p < b.appear) continue;
      const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
      const s = this.project(cx, cy, 0);
      if (s.x < -margin || s.x > this.W + margin || s.y < -margin * 2 || s.y > this.H + margin) continue;
      vis.push(b);
    }
    const depth = (b: { x0: number; x1: number; y0: number; y1: number }) => ((b.x0 + b.x1) / 2) * sa + ((b.y0 + b.y1) / 2) * ca;
    vis.sort((m, n) => depth(m) - depth(n));

    const shop = { x0: -30, y0: -24, x1: 30, y1: 24 };
    const shopDepth = depth(shop);
    let shopDrawn = false;
    const cityDim = 1 - finale * 0.55;

    for (const b of vis) {
      if (!shopDrawn && depth(b) > shopDepth) {
        this.drawShop(p, time, aerial, finale);
        shopDrawn = true;
      }
      const rise = easeOut(ramp(p, b.appear, b.appear + 0.035));
      const h = b.h * rise;
      this.drawBox(b, h, b, cityDim, zoom, zf, time);
    }
    if (!shopDrawn) this.drawShop(p, time, aerial, finale);
  }

  private drawBox(
    r: { x0: number; y0: number; x1: number; y1: number },
    h: number,
    b: Building,
    dim: number,
    zoom: number,
    zf: number,
    time: number,
  ) {
    const ctx = this.ctx;
    const P1 = this.project(r.x1, r.y0, 0), P2 = this.project(r.x1, r.y1, 0), P3 = this.project(r.x0, r.y1, 0);
    const T0 = this.project(r.x0, r.y0, h), T1 = this.project(r.x1, r.y0, h), T2 = this.project(r.x1, r.y1, h), T3 = this.project(r.x0, r.y1, h);
    const shade = 12 + b.tone * 10;
    const faces = zf > 0.03 && h > 0.5;

    if (faces) {
      // Which vertical faces point at the camera depends on the orbit angle;
      // with a ∈ [0°, 50°] the +y face and +x face are the visible pair.
      // +y face (front)
      poly(ctx, [P3, P2, T2, T3], `rgb(${shade + 4},${shade + 10},${shade + 6})`);
      // +x face (side)
      poly(ctx, [P1, P2, T2, T1], `rgb(${shade - 3},${shade + 2},${shade})`);

      // windows as dashed floor lines
      const screenH = Math.abs(P2.y - T2.y);
      if (screenH > 10) {
        const floors = Math.max(1, Math.floor(h / 13));
        ctx.setLineDash(b.dash.map((d) => d * zoom * 1.3));
        ctx.lineWidth = Math.max(0.6, zoom * 2.2);
        const flick = 0.75 + 0.25 * Math.sin(time * 0.0007 + b.x0 * 0.01);
        ctx.strokeStyle = `rgba(${b.lit},${0.55 * dim * flick})`;
        ctx.beginPath();
        for (let f = 1; f <= floors; f++) {
          const z = (f / (floors + 1)) * h;
          const a1 = this.project(r.x0 + 3, r.y1, z), a2 = this.project(r.x1 - 3, r.y1, z);
          ctx.moveTo(a1.x, a1.y);
          ctx.lineTo(a2.x, a2.y);
          const b1 = this.project(r.x1, r.y1 - 3, z), b2 = this.project(r.x1, r.y0 + 3, z);
          ctx.moveTo(b1.x, b1.y);
          ctx.lineTo(b2.x, b2.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    // roof
    poly(ctx, [T0, T1, T2, T3], `rgb(${shade + 12},${shade + 18},${shade + 14})`);
    ctx.strokeStyle = `rgba(160,200,175,${0.12 * dim})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    if (b.roof && h > 4) {
      const c = this.project((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2, h + 1);
      const blink = 0.5 + 0.5 * Math.sin(time * 0.003 + b.x0);
      ctx.fillStyle = `rgba(${b.roof},${(0.45 + 0.4 * blink) * dim})`;
      const s = Math.max(1.2, zoom * 4);
      ctx.fillRect(c.x - s / 2, c.y - s / 2, s, s);
    }
  }

  private drawShop(p: number, time: number, aerial: number, finale: number) {
    const ctx = this.ctx;
    const brand = easeInOut(ramp(p, 0.12, 0.21));
    const x0 = -30, y0 = -24, x1 = 30, y1 = 24, h = 36;
    const pr = (x: number, y: number, z: number) => this.project(x, y, z);
    const zf = this.cam.zf;

    // Warm light spill in front of the door.
    this.groundTransform();
    const spill = ctx.createRadialGradient(0, y1 + 10, 0, 0, y1 + 10, 90);
    spill.addColorStop(0, `rgba(${lerp(255, 120, brand)},${lerp(200, 240, brand)},${lerp(140, 170, brand)},${0.16 + brand * 0.12})`);
    spill.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = spill;
    ctx.beginPath();
    ctx.arc(0, y1 + 10, 90, 0, Math.PI * 2);
    ctx.fill();
    this.screenTransform();

    const P1 = pr(x1, y0, 0), P2 = pr(x1, y1, 0), P3 = pr(x0, y1, 0);
    const T0 = pr(x0, y0, h), T1 = pr(x1, y0, h), T2 = pr(x1, y1, h), T3 = pr(x0, y1, h);

    // Facade colour shifts from tired grey to the brand's deep ink.
    const fr = lerp(52, 16, brand), fg = lerp(55, 24, brand), fb = lerp(52, 19, brand);
    if (zf > 0.03) {
      poly(ctx, [P3, P2, T2, T3], `rgb(${fr},${fg},${fb})`);
      poly(ctx, [P1, P2, T2, T1], `rgb(${fr - 10},${fg - 8},${fb - 9})`);

      // Face-local projector for the front (+y) face: s ∈ [0,1] along x, z height.
      const F = (s: number, z: number) => pr(lerp(x0, x1, s), y1, z);
      // Door
      poly(ctx, [F(0.4, 0), F(0.6, 0), F(0.6, 18), F(0.4, 18)], `rgba(${lerp(90, 30, brand)},${lerp(80, 60, brand)},${lerp(60, 40, brand)},1)`);
      // Shop window — dim at first, bright once branded
      const win = 0.35 + brand * 0.65;
      poly(ctx, [F(0.1, 5), F(0.34, 5), F(0.34, 20), F(0.1, 20)], `rgba(255,${lerp(190, 225, brand)},${lerp(130, 170, brand)},${0.35 * win})`);
      poly(ctx, [F(0.66, 5), F(0.9, 5), F(0.9, 20), F(0.66, 20)], `rgba(255,${lerp(190, 225, brand)},${lerp(130, 170, brand)},${0.35 * win})`);
      // Door light
      poly(ctx, [F(0.43, 2), F(0.57, 2), F(0.57, 16), F(0.43, 16)], `rgba(255,220,170,${0.12 + brand * 0.3})`);

      // Awning (slides out with the brand)
      if (brand > 0.01) {
        const out = 10 * brand;
        const A = pr(x0 + 2, y1, 24), B = pr(x1 - 2, y1, 24), C = pr(x1 - 2, y1 + out, 19), D = pr(x0 + 2, y1 + out, 19);
        poly(ctx, [A, B, C, D], `rgba(91,209,123,${0.95 * brand})`);
        // stripes
        ctx.strokeStyle = `rgba(13,42,23,${0.5 * brand})`;
        ctx.lineWidth = Math.max(0.5, this.cam.zoom * 1.2);
        ctx.beginPath();
        for (let i = 1; i < 8; i++) {
          const s = i / 8;
          const u = pr(lerp(x0 + 2, x1 - 2, s), y1, 24), v = pr(lerp(x0 + 2, x1 - 2, s), y1 + out, 19);
          ctx.moveTo(u.x, u.y);
          ctx.lineTo(v.x, v.y);
        }
        ctx.stroke();

        // Sign box with a glowing brand mark (no text → never malformed)
        const sg = [F(0.2, 27), F(0.8, 27), F(0.8, 34), F(0.2, 34)];
        poly(ctx, sg, `rgba(8,12,10,${brand})`);
        ctx.globalCompositeOperation = "lighter";
        const glow = 0.55 + 0.45 * brand + 0.08 * Math.sin(time * 0.004);
        poly(ctx, [F(0.24, 28.5), F(0.76, 28.5), F(0.76, 32.5), F(0.24, 32.5)], `rgba(91,209,123,${0.22 * brand * glow})`);
        // small play-mark
        poly(ctx, [F(0.46, 29), F(0.56, 30.5), F(0.46, 32)], `rgba(140,255,180,${brand * glow})`);
        ctx.globalCompositeOperation = "source-over";
      }
    }

    // Roof — becomes the glowing play-mark in the aerial finale.
    poly(ctx, [T0, T1, T2, T3], `rgb(${lerp(70, 26, brand)},${lerp(72, 36, brand)},${lerp(70, 30, brand)})`);
    if (aerial > 0.05) {
      const tri = [pr(-20, -22, h + 0.5), pr(26, 0, h + 0.5), pr(-20, 22, h + 0.5)];
      poly(ctx, tri, `rgba(8,10,9,${aerial})`);
      ctx.strokeStyle = `rgba(91,209,123,${aerial * (0.4 + finale * 0.6)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Lamp post (scene 1 mood) — fades once the city is lit.
    const lampA = 1 - ramp(p, 0.3, 0.45);
    if (lampA > 0.01 && zf > 0.2) {
      const base = pr(-48, 34, 0), top = pr(-48, 34, 30);
      ctx.strokeStyle = `rgba(90,96,92,${lampA})`;
      ctx.lineWidth = Math.max(1, this.cam.zoom * 1.4);
      ctx.beginPath();
      ctx.moveTo(base.x, base.y);
      ctx.lineTo(top.x, top.y);
      ctx.stroke();
      const flick = 0.85 + 0.15 * Math.sin(time * 0.013) * Math.sin(time * 0.0071);
      const glowR = 26 * this.cam.zoom;
      const lg = ctx.createRadialGradient(top.x, top.y, 0, top.x, top.y, glowR);
      lg.addColorStop(0, `rgba(255,214,160,${0.7 * lampA * flick})`);
      lg.addColorStop(1, "rgba(255,214,160,0)");
      ctx.fillStyle = lg;
      ctx.fillRect(top.x - glowR, top.y - glowR, glowR * 2, glowR * 2);
    }
    void finale;
  }

  private drawBillboards(p: number, time: number, aerial: number) {
    const ctx = this.ctx;
    const scene = ramp(p, 0.48, 0.53);
    if (scene <= 0.01) return;
    const flatten = 1 - ramp(p, 0.8, 0.88);
    if (flatten <= 0.01) return;
    this.screenTransform();
    const { zoom, zf } = this.cam;
    const active = ramp(p, 0.59, 0.64);

    const sorted = [...this.billboards].sort((m, n) => this.project(m.at.x, m.at.y).y - this.project(n.at.x, n.at.y).y);
    for (const bb of sorted) {
      const s = easeOut(ramp(p, bb.appear, bb.appear + 0.03)) * flatten;
      if (s <= 0.01) continue;
      const base = this.project(bb.at.x, bb.at.y, 0);
      const w = bb.w * zoom * s;
      const hh = bb.h * zoom * zf * s;
      const lift = bb.lift * zoom * zf * s;
      if (base.x < -w || base.x > this.W + w || base.y < -lift - hh || base.y > this.H + 40) continue;
      // pole
      ctx.fillStyle = `rgba(40,48,44,${s})`;
      ctx.fillRect(base.x - Math.max(0.6, zoom), base.y - lift, Math.max(1.2, zoom * 2), lift);
      const x = base.x - w / 2, y = base.y - lift - hh;
      // glow when ads activate
      if (active > 0) {
        ctx.globalCompositeOperation = "lighter";
        const gr = ctx.createRadialGradient(base.x, y + hh / 2, 0, base.x, y + hh / 2, w * 0.95);
        gr.addColorStop(0, hexA(bb.hueA, 0.28 * active * s));
        gr.addColorStop(1, hexA(bb.hueA, 0));
        ctx.fillStyle = gr;
        ctx.fillRect(base.x - w, y - hh / 2, w * 2, hh * 2);
        ctx.globalCompositeOperation = "source-over";
      }
      // content: abstract campaign imagery
      const lg = ctx.createLinearGradient(x, y, x + w, y + hh);
      const shift = 0.5 + 0.5 * Math.sin(time * 0.0006 + bb.seed);
      lg.addColorStop(0, hexA(bb.hueB, s));
      lg.addColorStop(0.5 + 0.3 * (shift - 0.5), hexA(bb.hueA, s * (0.7 + active * 0.3)));
      lg.addColorStop(1, hexA(bb.hueB, s));
      ctx.fillStyle = lg;
      ctx.fillRect(x, y, w, hh);
      if (w > 16) {
        // post furniture: avatar dot, caption bars, heart
        ctx.fillStyle = `rgba(255,255,255,${0.85 * s})`;
        ctx.beginPath();
        ctx.arc(x + w * 0.12, y + hh * 0.2, Math.max(1, hh * 0.08), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.55 * s})`;
        ctx.fillRect(x + w * 0.1, y + hh * 0.72, w * 0.46, Math.max(0.8, hh * 0.06));
        ctx.fillRect(x + w * 0.1, y + hh * 0.83, w * 0.3, Math.max(0.8, hh * 0.05));
        heart(ctx, x + w * 0.84, y + hh * 0.78, Math.max(1.5, hh * 0.09), `rgba(255,255,255,${(0.6 + active * 0.4) * s})`);
      }
      ctx.strokeStyle = `rgba(255,255,255,${0.14 * s})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, hh - 1);
    }
    void aerial;
  }

  private drawWebsitePanel(p: number, time: number) {
    const ctx = this.ctx;
    const inA = ramp(p, 0.24, 0.3);
    const outA = 1 - ramp(p, 0.42, 0.52);
    const vis = inA * outA;
    if (vis <= 0.01) return;
    this.screenTransform();
    const { zoom, zf, a } = this.cam;
    // Stands behind the shop, always facing the camera.
    const back = 150;
    const cx = -Math.sin(a) * back, cy = -Math.cos(a) * back;
    const base = this.project(cx, cy, 34);
    const w = 330 * zoom;
    const h = 196 * zoom * zf;
    const x = base.x - w / 2, y = base.y - h;
    const assemble = (i: number) => easeOut(ramp(p, 0.245 + i * 0.012, 0.275 + i * 0.012));

    ctx.save();
    ctx.globalAlpha = vis;
    // frame draws itself
    const frame = assemble(0);
    ctx.fillStyle = `rgba(8,18,12,${0.55 * frame})`;
    ctx.fillRect(x, y, w, h * frame);
    ctx.strokeStyle = "rgba(91,209,123,0.55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const per = 2 * (w + h);
    ctx.setLineDash([per * frame, per]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);

    const u = (fx: number) => x + w * fx;
    const v = (fy: number) => y + h * fy;
    // browser bar
    const bar = assemble(1);
    ctx.fillStyle = `rgba(91,209,123,${0.12 * bar})`;
    ctx.fillRect(x, y, w * bar, h * 0.09);
    ctx.fillStyle = `rgba(255,255,255,${0.5 * bar})`;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(u(0.03 + i * 0.022), v(0.045), Math.max(1, h * 0.012), 0, Math.PI * 2);
      ctx.fill();
    }
    // nav
    const nav = assemble(2);
    ctx.fillStyle = `rgba(255,255,255,${0.35 * nav})`;
    for (let i = 0; i < 4; i++) ctx.fillRect(u(0.55 + i * 0.09), v(0.15), w * 0.06 * nav, Math.max(1, h * 0.012));
    ctx.fillStyle = `rgba(91,209,123,${0.9 * nav})`;
    ctx.fillRect(u(0.05), v(0.14), w * 0.08 * nav, Math.max(1.5, h * 0.03));
    // headline
    const head = assemble(3);
    ctx.fillStyle = `rgba(240,245,240,${0.85 * head})`;
    ctx.fillRect(u(0.05), v(0.28), w * 0.42 * head, h * 0.06);
    ctx.fillRect(u(0.05), v(0.37), w * 0.3 * head, h * 0.06);
    ctx.fillStyle = `rgba(240,245,240,${0.3 * head})`;
    ctx.fillRect(u(0.05), v(0.48), w * 0.36 * head, h * 0.018);
    ctx.fillRect(u(0.05), v(0.52), w * 0.28 * head, h * 0.018);
    // CTA
    const cta = assemble(4);
    ctx.fillStyle = `rgba(91,209,123,${cta})`;
    roundRect(ctx, u(0.05), v(0.6), w * 0.14 * cta, h * 0.07, h * 0.035);
    ctx.fill();
    // hero visual
    const hero = assemble(5);
    const hg = ctx.createLinearGradient(u(0.55), v(0.26), u(0.95), v(0.66));
    hg.addColorStop(0, `rgba(91,209,123,${0.55 * hero})`);
    hg.addColorStop(1, `rgba(20,60,40,${0.4 * hero})`);
    ctx.fillStyle = hg;
    ctx.fillRect(u(0.55), v(0.26), w * 0.4, h * 0.4 * hero);
    // cards
    for (let i = 0; i < 3; i++) {
      const c = assemble(6 + i);
      ctx.fillStyle = `rgba(255,255,255,${0.07 * c})`;
      ctx.fillRect(u(0.05 + i * 0.31), v(0.75), w * 0.28, h * 0.18 * c);
      ctx.fillStyle = `rgba(91,209,123,${0.6 * c})`;
      ctx.fillRect(u(0.07 + i * 0.31), v(0.79), w * 0.04, Math.max(1, h * 0.02));
    }
    // scan line shimmer
    const scan = (time * 0.00025) % 1;
    const sg = ctx.createLinearGradient(0, v(scan) - h * 0.1, 0, v(scan) + h * 0.1);
    sg.addColorStop(0, "rgba(91,209,123,0)");
    sg.addColorStop(0.5, "rgba(91,209,123,0.07)");
    sg.addColorStop(1, "rgba(91,209,123,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(x, Math.max(y, v(scan) - h * 0.1), w, h * 0.2);
    // tether beams to the shop
    const shopTop = this.project(0, 0, 36);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(91,209,123,${0.25 * frame})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(shopTop.x, shopTop.y);
    ctx.lineTo(x + w * 0.2, y + h);
    ctx.moveTo(shopTop.x, shopTop.y);
    ctx.lineTo(x + w * 0.8, y + h);
    ctx.stroke();
    ctx.restore();
  }

  private drawDiscovery(p: number, time: number, aerial: number) {
    const ctx = this.ctx;
    const a = ramp(p, 0.37, 0.42) * (1 - ramp(p, 0.56, 0.64)) * (1 - aerial);
    if (a <= 0.01) return;
    const { zoom, zf } = this.cam;

    // Discovery radar from the shop
    this.groundTransform();
    for (let i = 0; i < 2; i++) {
      const t = (time * 0.00025 + i * 0.5) % 1;
      ctx.beginPath();
      ctx.arc(0, 0, 80 + t * 900, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(91,209,123,${0.25 * (1 - t) * a})`;
      ctx.lineWidth = 2 / zoom;
      ctx.stroke();
    }

    // Map pins dropping on the new destinations
    this.screenTransform();
    const pins: [Pt, number][] = [[N1, 0.4], [N2, 0.415], [N3, 0.43], [{ x: -700, y: 10 }, 0.44], [{ x: 1000, y: -70 }, 0.45]];
    for (const [pt, at] of pins) {
      const drop = ramp(p, at, at + 0.02);
      if (drop <= 0) continue;
      const bounce = drop < 1 ? easeOut(drop) : 1;
      const z = 60 + (1 - bounce) * 80;
      const s = this.project(pt.x, pt.y, z * zf);
      const size = Math.max(5, Math.min(18, zoom * 22));
      pin(ctx, s.x, s.y, size, a * Math.min(1, drop * 2));
    }

    // Floating search pill above the shop
    const sA = ramp(p, 0.37, 0.41) * (1 - ramp(p, 0.47, 0.52));
    if (sA > 0.01) {
      const top = this.project(0, 0, 60 + 8 * Math.sin(time * 0.0015));
      const w = Math.max(90, 170 * zoom), h = w * 0.2;
      ctx.globalAlpha = sA;
      ctx.fillStyle = "rgba(10,16,12,0.85)";
      roundRect(ctx, top.x - w / 2, top.y - h, w, h, h / 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(91,209,123,0.6)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // magnifier
      ctx.strokeStyle = "rgba(91,209,123,0.95)";
      ctx.lineWidth = Math.max(1.2, h * 0.08);
      ctx.beginPath();
      ctx.arc(top.x - w / 2 + h * 0.55, top.y - h / 2 - h * 0.04, h * 0.18, 0, Math.PI * 2);
      ctx.moveTo(top.x - w / 2 + h * 0.68, top.y - h / 2 + h * 0.1);
      ctx.lineTo(top.x - w / 2 + h * 0.82, top.y - h / 2 + h * 0.24);
      ctx.stroke();
      // typed query bars
      const typed = ramp(p, 0.38, 0.43);
      ctx.fillStyle = "rgba(230,240,232,0.7)";
      ctx.fillRect(top.x - w / 2 + h * 1.1, top.y - h / 2 - h * 0.06, (w - h * 1.6) * typed, Math.max(1, h * 0.12));
      if (Math.floor(time / 500) % 2 === 0) {
        ctx.fillStyle = "rgba(91,209,123,0.9)";
        ctx.fillRect(top.x - w / 2 + h * 1.12 + (w - h * 1.6) * typed, top.y - h * 0.72, 1.4, h * 0.44);
      }
      ctx.globalAlpha = 1;
    }
  }
}

/* ------------------------------------------------------------------ */
/* Drawing helpers                                                     */
/* ------------------------------------------------------------------ */

function poly(ctx: CanvasRenderingContext2D, pts: Pt[], fill: string) {
  ctx.beginPath();
  ctx.moveTo(pts[0]!.x, pts[0]!.y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function tracePartial(ctx: CanvasRenderingContext2D, road: Road, len: number) {
  ctx.moveTo(road.pts[0]!.x, road.pts[0]!.y);
  for (let i = 1; i < road.pts.length; i++) {
    if (road.cum[i]! <= len) {
      ctx.lineTo(road.pts[i]!.x, road.pts[i]!.y);
    } else {
      const e = pointAt(road, len);
      ctx.lineTo(e.x, e.y);
      break;
    }
  }
}

function roundedPoly(ctx: CanvasRenderingContext2D, pts: Pt[], r: number) {
  const n = pts.length;
  const start = pts[0]!, last = pts[n - 1]!;
  ctx.moveTo((start.x + last.x) / 2, (start.y + last.y) / 2);
  for (let i = 0; i < n; i++) {
    const a = pts[i]!, b = pts[(i + 1) % n]!;
    ctx.arcTo(a.x, a.y, b.x, b.y, r);
  }
  ctx.closePath();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, fill: string) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.9);
  ctx.bezierCurveTo(x - s * 1.4, y, x - s * 0.6, y - s * 1.1, x, y - s * 0.3);
  ctx.bezierCurveTo(x + s * 0.6, y - s * 1.1, x + s * 1.4, y, x, y + s * 0.9);
  ctx.fill();
}

function pin(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#5bd17b";
  ctx.beginPath();
  ctx.moveTo(x, y + s * 1.3);
  ctx.bezierCurveTo(x - s * 0.2, y + s * 0.8, x - s * 0.72, y + s * 0.35, x - s * 0.72, y - s * 0.1);
  ctx.arc(x, y - s * 0.1, s * 0.72, Math.PI, 0);
  ctx.bezierCurveTo(x + s * 0.72, y + s * 0.35, x + s * 0.2, y + s * 0.8, x, y + s * 1.3);
  ctx.fill();
  ctx.fillStyle = "#070908";
  ctx.beginPath();
  ctx.arc(x, y - s * 0.1, s * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${clamp01(a)})`;
}

export const _test = { track, ramp, smooth };
