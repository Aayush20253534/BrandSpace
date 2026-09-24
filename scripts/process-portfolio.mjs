/**
 * Optimises client website screenshots for the portfolio.
 * Source screenshots live in assets/source/<slug>.<ext> (browser captures
 * at ~1920×1080). The browser scrollbar on the right edge is cropped out and
 * every preview is written as a 1600×900 (16:9) WebP.
 *
 * Usage: node scripts/process-portfolio.mjs [slug …]   (default: all)
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

/**
 * `crop` (optional) picks the 16:9 window in source pixels. Without it the
 * top-left of the capture is used, minus the scrollbar.
 */
const shots = [
  { slug: "casa-de-grande", src: "casa-de-grande.webp" },
  { slug: "bar-code", src: "bar-code.webp" },
  { slug: "rovauto", src: "rovauto.webp" },
  { slug: "zobhunger", src: "zobhunger.webp" },
  { slug: "lotus-family-dental", src: "lotus-family-dental.png" },
  // The capture ends in an empty band below the hero; a tighter 16:9 window
  // keeps the whole hero (and its side margins) without the blank strip.
  { slug: "eclectic-dental-care", src: "eclectic-dental-care.png", crop: { left: 118, top: 0, width: 1680, height: 945 } },
];

const only = process.argv.slice(2);

for (const shot of shots) {
  if (only.length && !only.includes(shot.slug)) continue;
  const src = `assets/source/${shot.src}`;
  const meta = await sharp(src).metadata();
  let crop = shot.crop;
  if (!crop) {
    // Remove the ~20px scrollbar, keep 16:9.
    const width = Math.min(meta.width - 22, 1896);
    const height = Math.min(Math.round((width * 9) / 16), meta.height);
    crop = { left: 0, top: 0, width, height };
  }
  await mkdir(`public/portfolio/${shot.slug}`, { recursive: true });
  await sharp(src)
    .extract(crop)
    .resize(1600, 900, { fit: "cover", position: "top" })
    .webp({ quality: 84, effort: 6 })
    .toFile(`public/portfolio/${shot.slug}/hero.webp`);
  console.log(shot.slug, "→", crop.width, "x", crop.height);
}
