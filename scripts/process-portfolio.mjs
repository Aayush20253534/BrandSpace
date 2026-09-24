/**
 * Optimises client website screenshots for the portfolio.
 * Source screenshots live in assets/source/<slug>.webp (browser captures
 * at ~1920×1080). The browser scrollbar on the right edge is cropped out.
 *
 * Usage: node scripts/process-portfolio.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const shots = ["casa-de-grande", "bar-code", "rovauto", "zobhunger"];

for (const slug of shots) {
  const src = `assets/source/${slug}.webp`;
  const meta = await sharp(src).metadata();
  // Remove the ~20px scrollbar, keep 16:9.
  const width = Math.min(meta.width - 22, 1896);
  const height = Math.round((width * 9) / 16);
  await mkdir(`public/portfolio/${slug}`, { recursive: true });
  await sharp(src)
    .extract({ left: 0, top: 0, width, height: Math.min(height, meta.height) })
    .resize(1600, 900, { fit: "cover", position: "top" })
    .webp({ quality: 84, effort: 6 })
    .toFile(`public/portfolio/${slug}/hero.webp`);
  console.log(slug, "→", width, "x", height);
}
