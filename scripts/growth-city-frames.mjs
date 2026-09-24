/**
 * Converts the Higgsfield Growth City clips into scroll-scrubbable frame
 * sequences and switches the homepage hero from the code-rendered city to
 * the footage.
 *
 *   node scripts/growth-city-frames.mjs clip1.mp4 clip2.mp4 clip3.mp4 clip4.mp4
 *   node scripts/growth-city-frames.mjs https://…/clip1.mp4 …   (URLs are downloaded)
 *   node scripts/growth-city-frames.mjs --reset                   (back to the coded city)
 *
 * Clips must be in story order and share first/last frames (start/end
 * keyframes), so the duplicate first frame of every clip after the first is
 * dropped for a seamless cut. Requires `ffmpeg` on PATH (or FFMPEG_PATH).
 *
 * Options (env): FPS=12  QUALITY=68  DESKTOP_W=1280  MOBILE_H=960
 */
import { spawnSync } from "node:child_process";
import { mkdir, readdir, rm, writeFile, rename } from "node:fs/promises";
import { createWriteStream, existsSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import sharp from "sharp";

const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";
const FPS = Number(process.env.FPS ?? 12);
const QUALITY = Number(process.env.QUALITY ?? 68);
const DESKTOP_W = Number(process.env.DESKTOP_W ?? 1280);
const MOBILE_H = Number(process.env.MOBILE_H ?? 960);
const MANIFEST = "src/data/growthCityFrames.json";
const OUT = "public/growth-city";
const RAW = "assets/growth-city/raw";
const TMP = "assets/growth-city/.tmp";

const args = process.argv.slice(2);
if (args[0] === "--reset") {
  await writeFile(MANIFEST, "null\n");
  console.log("Growth City reset to the code-rendered city.");
  process.exit(0);
}
if (!args.length) {
  console.error("Pass the clips in story order (files or URLs). See the header of this script.");
  process.exit(1);
}
if (spawnSync(FFMPEG, ["-version"]).status !== 0) {
  console.error(`ffmpeg not found (tried "${FFMPEG}"). Install it or set FFMPEG_PATH.`);
  process.exit(1);
}

await mkdir(RAW, { recursive: true });
await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });

// 1. Resolve inputs (download URLs).
const clips = [];
for (const [i, a] of args.entries()) {
  if (/^https?:\/\//.test(a)) {
    const file = path.join(RAW, `clip-${String(i + 1).padStart(2, "0")}.mp4`);
    console.log("downloading", a);
    const res = await fetch(a);
    if (!res.ok || !res.body) throw new Error(`Download failed (${res.status}) for ${a}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
    clips.push(file);
  } else {
    if (!existsSync(a)) throw new Error(`Missing file ${a}`);
    clips.push(a);
  }
}

// 2. Extract frames per clip, dropping the shared first frame of later clips.
const frames = [];
for (const [i, clip] of clips.entries()) {
  const dir = path.join(TMP, `c${i}`);
  await mkdir(dir, { recursive: true });
  const r = spawnSync(FFMPEG, ["-loglevel", "error", "-i", clip, "-vf", `fps=${FPS}`, path.join(dir, "f_%05d.png")], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed on ${clip}`);
  const files = (await readdir(dir)).filter((f) => f.endsWith(".png")).sort();
  frames.push(...(i === 0 ? files : files.slice(1)).map((f) => path.join(dir, f)));
  console.log(`${clip}: ${files.length} frames`);
}

// 3. Encode desktop (16:9) and mobile (centre-cropped 9:16) sequences.
await rm(OUT, { recursive: true, force: true });
await mkdir(`${OUT}/desktop`, { recursive: true });
await mkdir(`${OUT}/mobile`, { recursive: true });
const pad = 4;
let meta = null;
for (const [i, f] of frames.entries()) {
  const name = `frame_${String(i + 1).padStart(pad, "0")}.webp`;
  const img = sharp(f);
  meta ??= await img.metadata();
  await img.clone().resize({ width: DESKTOP_W }).webp({ quality: QUALITY, effort: 5 }).toFile(`${OUT}/desktop/${name}`);
  const cropW = Math.round((meta.height * 9) / 16);
  await img
    .clone()
    .extract({ left: Math.round((meta.width - cropW) / 2), top: 0, width: cropW, height: meta.height })
    .resize({ height: Math.min(MOBILE_H, meta.height) })
    .webp({ quality: QUALITY - 4, effort: 5 })
    .toFile(`${OUT}/mobile/${name}`);
  if (i % 24 === 0) process.stdout.write(`\rencoding ${i + 1}/${frames.length}`);
}
process.stdout.write("\n");

const desktopH = Math.round((DESKTOP_W * meta.height) / meta.width);
const mobileH = Math.min(MOBILE_H, meta.height);
const manifest = {
  desktop: { pattern: "/growth-city/desktop/frame_{i}.webp", count: frames.length, pad, width: DESKTOP_W, height: desktopH },
  mobile: { pattern: "/growth-city/mobile/frame_{i}.webp", count: frames.length, pad, width: Math.round((mobileH * 9) / 16), height: mobileH },
};
await writeFile(`${MANIFEST}.tmp`, JSON.stringify(manifest, null, 2) + "\n");
await rename(`${MANIFEST}.tmp`, MANIFEST);
await rm(TMP, { recursive: true, force: true });
console.log(`Done: ${frames.length} frames. Manifest written to ${MANIFEST}.`);
