# The BrandSpace Growth City

The homepage opens with a scroll-controlled cinematic story: one lonely business grows — through
branding, a website, search, social and ads — into a thriving city, whose aerial road layout
dissolves into the real BrandSpace logo.

```
LONELY BUSINESS → BRANDING → WEBSITE → SEO → SOCIAL → ADS + CUSTOMERS → GROWTH CITY → BRANDSPACE
```

## How it works

| Piece | File |
| --- | --- |
| Scene copy, progress ranges, frame manifest, logo alignment | `src/data/growthCity.ts` |
| Pinned section, scroll smoothing, overlays, logo reveal, CTA | `src/components/home/growth-city/GrowthCity.tsx` |
| Code-rendered 2.5D city (current default) | `src/components/home/growth-city/cityRenderer.ts` |
| Frame-sequence player for pre-rendered footage | `src/components/home/growth-city/framePlayer.ts` |
| Footage → frames converter | `scripts/growth-city-frames.mjs` |

- The section is pinned with CSS `position: sticky`; scroll position maps to progress `p` (0 → 1).
- `p` is followed with a critically-damped filter, so trackpads, wheels, flings and touch all feel
  smooth — and scrolling backwards reverses everything exactly.
- The final logo is always the **real supplied artwork** (`/public/brand/brandspace-logo.png`),
  animated in code. It is never generated.
- Reduced-motion users get a static aerial hero with the logo and CTA — no 700vh scroll.
- Low-power devices (≤4 cores, ≤4 GB memory, Save-Data, or small screens) render at lower
  resolution and density.

## Two render modes

1. **Code-rendered city (active now).** Every element is a pure function of `p`, so it is exact in
   both directions and weighs nothing to download. The aerial road layout is measured from the logo:
   the shop sits exactly where the logo's play button is, and the camera lands the real logo on top
   of it.
2. **Pre-rendered footage.** When `src/data/growthCityFrames.json` contains a manifest, the canvas
   plays a WebP frame sequence instead. Frames load progressively (every 16th, 8th, 4th…), so the
   story is scrubbable almost immediately, and adjacent frames are cross-faded for sub-frame
   smoothness. A minimal loader shows until the first keyframes arrive. Desktop uses 16:9 frames;
   portrait devices use a centre-cropped 9:16 set so the central business stays in frame.

## Generating the footage with Higgsfield (≤ 50 credits)

> **Network note:** the Claude Code cloud environment that built this site could not reach
> Higgsfield's output CDN (`d8j0ntlcm91z4.cloudfront.net`), so no footage was generated or
> downloaded yet. Allow that host in the environment's network settings, or run the steps below
> from any machine with normal internet access.

Only the camera journey itself is generated. Typography, overlays, transitions, the logo reveal and
all UI stay in code.

### Budget

| Step | Model | Qty | Credits |
| --- | --- | --- | --- |
| Keyframes K1–K5 | `gpt_image_2_5` (16:9, 1k) | 5 | ≈ 2.5–5 |
| Transitions V1–V4 (start + end frame, 5 s, sound off) | `kling3_0` std | 4 | 30 |
| Contingency (one keyframe + one clip re-roll) | | | ≈ 8.5 |
| **Total** | | | **≈ 41–44** |

(`seedance_2_0_mini` at 5 credits per clip is a cheaper alternative for the transitions: ≈ 25 total.)

### Shared style suffix

> Photorealistic cinematic night scene, premium commercial lighting, deep black and emerald-green
> colour palette with warm accent lights, subtle atmospheric haze, anamorphic lens, 16:9. No text,
> no lettering, no logos, no watermarks.

### Keyframes (each one uses the previous keyframe as an image reference for continuity)

- **K1 — The lonely business.** A single small modern single-storey shop with a flat roof and one
  warm-lit window stands alone at the centre of a vast, dark, empty plain at night. Low camera,
  slightly off-axis. A lone street lamp beside it casts a warm pool of light. Starry deep
  green-black sky, faint horizon, light ground mist. Quiet, minimal, full of potential.
- **K2 — Identity & presence.** *(ref: K1)* Same shop, same camera, same world. The shop now has a
  sleek black façade, an emerald-green striped awning and a glowing green sign panel with no
  readable text; the interior glows warmly. Behind it floats a large, elegant translucent holographic
  website interface drawn in thin green lines. Fine green light-lines begin to extend from the shop
  across the dark ground. Slightly brighter ambience.
- **K3 — Discovery & social.** *(ref: K2)* Camera higher and further back. The light-lines have
  become illuminated roads leading from the shop to three circular plazas marked by subtle green
  map-pin beacons. Elegant digital billboards with abstract colourful campaign imagery stand beside
  the roads. The first low buildings appear.
- **K4 — Ads & customers.** *(ref: K3)* Higher three-quarter aerial. Light trails of traffic flow
  along the roads toward the central shop; tiny figures walk toward it; billboards glow brightly;
  dozens of new illuminated buildings rise around the plazas. The world is visibly active.
- **K5 — Growth City.** *(ref: K4)* Top-down aerial at night of a thriving premium city. At its
  centre, a triangular green-lit park district containing the small original shop; glowing emerald
  avenues connect the district to three circular illuminated plazas arranged in a zig-zag to its
  right, with two short glowing boulevards above the district. Dense lit buildings and active roads
  fill the frame; dark negative space around the centre.

### Transitions (start frame → end frame)

- **V1 K1→K2:** one continuous take. Slow cinematic push-in, then a gentle rise as the shop
  transforms: brand colours and awning appear, the holographic website assembles behind it,
  light-lines begin extending across the ground. No cuts, no morphing of the building.
- **V2 K2→K3:** the camera continues rising and pulling back smoothly; light-lines widen into
  illuminated roads, plazas and pin beacons appear, billboards light up one by one.
- **V3 K3→K4:** continuous crane up and back; traffic starts flowing, people walk toward the shop,
  buildings rise around the plazas.
- **V4 K4→K5:** the camera keeps pulling back and rises into a perfectly top-down aerial of the
  finished city; motion eases out and holds.

### Import

```bash
# needs ffmpeg on PATH (or FFMPEG_PATH). No system ffmpeg? Grab a static build from PyPI:
pip install imageio-ffmpeg
export FFMPEG_PATH="$(python3 -c 'import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())')"

node scripts/growth-city-frames.mjs v1.mp4 v2.mp4 v3.mp4 v4.mp4   # files or URLs, story order
npm run build
```

The script drops each clip's duplicate first frame (shared keyframes), writes
`public/growth-city/{desktop,mobile}/frame_XXXX.webp` and the manifest. With the defaults
(12 fps, WebP q68) four 5-second clips come to roughly 240 frames and 6–9 MB, streamed
progressively. Run `node scripts/growth-city-frames.mjs --reset` to switch back to the coded city.

After importing, compare the final aerial frame with the logo reveal. The logo fades in centred over
the footage, which is dimmed automatically for legibility.
