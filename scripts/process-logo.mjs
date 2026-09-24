/**
 * Converts the supplied BrandSpace logo (3D render on a white studio floor)
 * into a transparent asset that sits cleanly on the dark site theme.
 *
 * The artwork itself is untouched: only the studio background, soft floor
 * shadow and floor reflection are removed. Edge pixels are "decontaminated"
 * (white fringe un-mixed) so the logo has no halo on dark backgrounds.
 *
 * Usage: node scripts/process-logo.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "assets/source/brandspace-logo.jpg";
// The floor reflection starts just below the speech-bubble tail.
const FLOOR_Y = 494;

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const C = info.channels;
const at = (x, y) => (y * W + x) * C;

// 1. Flood-fill the neutral, light studio background from the image border.
const isBackground = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  // Light floor (even with a green bounce) or neutral grey contact shadows.
  // The artwork is either saturated green or near-black.
  return min >= 168 || (max - min < 30 && max > 92);
};
const bg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push([x, 0], [x, H - 1]);
for (let y = 0; y < H; y++) stack.push([0, y], [W - 1, y]);
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const k = y * W + x;
  if (bg[k]) continue;
  // The source has a 1px grey frame; treat the outer 3px as background.
  const border = x < 3 || y < 3 || x >= W - 3 || y >= H - 3;
  if (!border && !isBackground(at(x, y))) continue;
  bg[k] = 1;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}
// Everything below the floor line is reflection.
for (let y = FLOOR_Y; y < H; y++) for (let x = 0; x < W; x++) bg[y * W + x] = 1;

// 2. Distance (in px, up to R) from each foreground pixel to the background.
const R = 3;
const out = Buffer.alloc(W * H * 4);
const white = [255, 255, 255];

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const k = y * W + x;
    const i = at(x, y);
    const o = k * 4;
    const p = [data[i], data[i + 1], data[i + 2]];
    if (bg[k] && y >= FLOOR_Y) continue; // transparent
    // Find nearest "solid" foreground pixel (at least R px inside the shape).
    let nearBg = false;
    for (let dy = -R; dy <= R && !nearBg; dy++)
      for (let dx = -R; dx <= R; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        if (bg[yy * W + xx]) { nearBg = true; break; }
      }
    if (!bg[k] && !nearBg) {
      out[o] = p[0]; out[o + 1] = p[1]; out[o + 2] = p[2]; out[o + 3] = 255;
      continue;
    }
    // Edge / background pixel: un-mix from the local background colour using
    // the nearest solid artwork colour.
    let best = null, bestD = Infinity, bgc = null, bgD = Infinity;
    for (let dy = -6; dy <= 6; dy++)
      for (let dx = -6; dx <= 6; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        const kk = yy * W + xx;
        const d = dx * dx + dy * dy;
        if (bg[kk]) {
          if (d > 0 && d < bgD && yy < FLOOR_Y) { bgD = d; bgc = at(xx, yy); }
          continue;
        }
        let solid = true;
        for (let ey = -R; ey <= R && solid; ey++)
          for (let ex = -R; ex <= R; ex++) {
            const x2 = xx + ex, y2 = yy + ey;
            if (x2 < 0 || y2 < 0 || x2 >= W || y2 >= H || bg[y2 * W + x2]) { solid = false; break; }
          }
        if (!solid) continue;
        if (d < bestD) { bestD = d; best = at(xx, yy); }
      }
    if (best === null) continue; // pure background / shadow → transparent
    if (bg[k] && bestD > 4) continue; // shadow pixels away from the edge
    const fg = [data[best], data[best + 1], data[best + 2]];
    const back = bgc === null ? white : [data[bgc], data[bgc + 1], data[bgc + 2]];
    const v = [fg[0] - back[0], fg[1] - back[1], fg[2] - back[2]];
    const w = [p[0] - back[0], p[1] - back[1], p[2] - back[2]];
    const vv = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    let a = vv > 1 ? (v[0] * w[0] + v[1] * w[1] + v[2] * w[2]) / vv : 0;
    a = Math.max(0, Math.min(1, a));
    if (bg[k]) a *= 0.7;
    if (a < 0.06) continue;
    out[o] = fg[0]; out[o + 1] = fg[1]; out[o + 2] = fg[2]; out[o + 3] = Math.round(a * 255);
  }
}

await mkdir("public/brand", { recursive: true });
const base = sharp(out, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 0 });
const trimmed = await base.png().toBuffer({ resolveWithObject: true });
console.log("trimmed logo:", trimmed.info.width, "x", trimmed.info.height);

// Pad to a square canvas so every consumer can use a 1:1 box.
const side = Math.max(trimmed.info.width, trimmed.info.height) + 16;
const square = sharp({
  create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
}).composite([{ input: trimmed.data, gravity: "center" }]);
const squarePng = await square.png().toBuffer();

await sharp(squarePng).png({ compressionLevel: 9 }).toFile("public/brand/brandspace-logo.png");
await sharp(squarePng).webp({ quality: 92, alphaQuality: 100 }).toFile("public/brand/brandspace-logo.webp");

// App icons: logo on the brand's deep background so they read on any surface.
const icon = async (size, file, pad) => {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(squarePng).resize(inner, inner, { kernel: "lanczos3" }).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 8, g: 10, b: 9, alpha: 1 } },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(file);
};
await icon(512, "src/app/icon.png", 0.1);
await icon(180, "src/app/apple-icon.png", 0.12);
await icon(192, "public/brand/icon-192.png", 0.1);
await icon(512, "public/brand/icon-512.png", 0.1);
console.log("done");
