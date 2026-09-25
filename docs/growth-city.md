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
- `p` is followed with a critically-damped filter with a top speed (0.45 progress per second), so
  aggressive trackpad flicks, wheel bursts and touch flings play out at a steady, cinematic pace —
  and scrolling backwards reverses everything exactly. *Skip intro* lifts the speed limit.
- The section is 620svh on phones and 880svh from `md` up. Scene slices (`growthScenes[].range`)
  give Identity, Presence, Discovery, Growth City and the final reveal the most room.
- `storyTimeline` in `src/data/growthCity.ts` maps progress to footage frames: each scene plays its
  transformation over roughly the first 60% of its slice, then holds (drifting a few frames) while
  its copy is read — scroll → transformation → brief hold → next transformation.
- Scene copy is choreographed with GSAP when a scene takes over: the label line draws, the headline
  rises word by word through its mask (from above when scrolling back), the detail follows and the
  previous scene leaves first. The finale is staged: the real logo glides in with scroll, then the
  wordmark, tagline and CTAs play in on their own clock (and rewind if you scroll back).
- The final logo is always the **real supplied artwork** (`/public/brand/brandspace-logo.png`),
  animated in code. It is never generated.
- Reduced-motion users (and visitors without JavaScript) get a static hero with the logo and CTA —
  no long scroll.
- Low-power devices (≤4 cores, ≤4 GB memory, Save-Data, or small screens) render at lower
  resolution and density.

## Two render modes

1. **Code-rendered city.** Every element is a pure function of `p`, so it is exact in both
   directions and weighs nothing to download. The aerial road layout is measured from the logo:
   the shop sits exactly where the logo's play button is, and the camera lands the real logo on top
   of it. It is used whenever the manifest is `null`, and reduced-motion users always get its
   static aerial.
2. **Pre-rendered footage (active now).** When `src/data/growthCityFrames.json` contains a
   manifest, the canvas plays a WebP frame sequence instead. Frames load progressively (every
   16th, 8th, 4th…), so the story is scrubbable almost immediately, and adjacent frames are
   cross-faded for sub-frame smoothness. A minimal loader shows until the first keyframes arrive.
   Desktop uses 16:9 frames; portrait devices use a centre-cropped 9:16 set so the central business
   stays in frame. The manifest's `timeline` maps scroll progress to frames piecewise-linearly, so
   each clip can take its own share of the scroll; the hand-tuned `storyTimeline` in
   `src/data/growthCity.ts` refines that with holds so each beat lands under its copy. Re-tune it if
   the footage is ever re-imported.

## Generating the footage with Higgsfield (≤ 50 credits)

> **Status:** generated and imported on 2026-09-24 for 37.5 credits (no re-rolls). See
> [Generated footage](#generated-footage-2026-09-24). Downloading results needs network access to
> Higgsfield's output CDN (`d8j0ntlcm91z4.cloudfront.net`).

Only the camera journey itself is generated. Typography, overlays, transitions, the logo reveal and
all UI stay in code.

### Budget

| Step | Model | Qty | Credits |
| --- | --- | --- | --- |
| Keyframes K1–K5 | `gpt_image_2_5` (16:9, 1k, quality high) | 5 | 7.5 |
| Transitions V1–V4 (start + end frame, 5 s, sound off) | `kling3_0` std | 4 | 30 |
| Contingency (one keyframe + one clip re-roll) | | | 9 (not needed) |
| **Total spent** | | | **37.5** |

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

### Generated footage (2026-09-24)

All keyframes: `gpt_image_2_5`, variant `flare`, `quality: high`, `1k`, 16:9 (1344×752), 1.5 credits
each, each one using the previous keyframe as `image_references`. All clips: `kling3_0`, `std`,
5 s, `sound: off`, 16:9 (1280×716, 24 fps), 7.5 credits each, previous/next keyframe as
`start_image`/`end_image`. Total 37.5 credits.

| Asset | Higgsfield job | Result |
| --- | --- | --- |
| K1 | `3b0efdc2-28ae-4b57-9495-aa2e2ffc9c6d` | Lonely shop, lamp, starry green-black sky |
| K2 | `f128c053-6d44-4045-8785-577470b187b7` | Same framing; awning, blank green sign, website hologram, light-lines |
| K3 | `d086cb02-91db-4c76-80b1-53cecd662c77` | Higher; roads, three plazas with map pins, billboards |
| K4 | `9b768013-922a-4423-aecc-f7f3394898bb` | ~45° aerial; traffic, people, dozens of buildings |
| K5 | `7b8542e0-cfa6-41d5-be8c-b8fba407db89` | Top-down; triangular park district + three plaza rings (echoes the logo) |
| V1 | `82bc5ca0-7134-4ced-a778-dd393245c044` | Locked-off transformation of the shop |
| V2 | `6ede11f2-5dbf-4ef7-aa11-2a14650bb640` | Crane up and back; roads, pins, billboards |
| V3 | `e1552338-81b2-4bbf-8953-bd5596df6ef9` | Crane continues; the city fills in |
| V4 | `db27b56a-2b54-4f9c-a7bd-896fae6699ef` | Tilts to top-down by ~2.7 s, then holds |

Prompt notes, on top of the prompts above:

- K2 is effectively an edit of K1 (same camera), so V1 is a near-locked shot of the shop
  transforming in place rather than a push-in; V2–V4 then form one continuous crane up to top-down.
- K3–K5 keep the shop at the centre of the frame (so it stays inside the 9:16 mobile crop) and
  place the three plazas to its right in the same zig-zag every time; K3 and K4 keep the website
  hologram above the shop and K4 already starts the triangular park, so V2–V4 read as camera moves
  rather than morphs. The hologram fades out in V4 as the view turns top-down.
- Kling suggested its "IN THE DARK" preset for V1; it was declined (`declined_preset_id`) to keep
  the planned start/end-frame transition.

### Import

```bash
# needs ffmpeg on PATH (or FFMPEG_PATH). No system ffmpeg? Grab a static build from PyPI:
pip install imageio-ffmpeg
export FFMPEG_PATH="$(python3 -c 'import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())')"

node scripts/growth-city-frames.mjs v1.mp4 v2.mp4 v3.mp4 v4.mp4   # files or URLs, story order
npm run build
```

The script drops each clip's duplicate first frame (shared keyframes), writes
`public/growth-city/{desktop,mobile}/frame_XXXX.webp` and the manifest. URLs are downloaded to
`assets/growth-city/raw/` (git-ignored). Frame URLs in the manifest carry a content hash (`?v=…`)
because `/growth-city/*` is served with an immutable cache header, so a re-import never shows
returning visitors stale frames. Run `node scripts/growth-city-frames.mjs --reset` to switch back to
the coded city.

`STOPS` sets the scroll progress at each clip boundary (default: evenly spaced). The current
footage was imported with the command below: V1 gets the first 35% of the scroll so the awning
lands under "Build your identity" and the website under "Create your presence", V2's pins and
billboards land under "Get discovered" and "Reach the right people", and V4 reaches its top-down
hold (p ≈ 0.88) just as the dimming and logo reveal begin.

```bash
STOPS=0,0.35,0.5,0.75,1 node scripts/growth-city-frames.mjs \
  https://d8j0ntlcm91z4.cloudfront.net/user_3Jh1FIVe6vC92KuQLB0zhEKSirw/hf_20260924_093425_82bc5ca0-7134-4ced-a778-dd393245c044.mp4 \
  https://d8j0ntlcm91z4.cloudfront.net/user_3Jh1FIVe6vC92KuQLB0zhEKSirw/hf_20260924_093351_6ede11f2-5dbf-4ef7-aa11-2a14650bb640.mp4 \
  https://d8j0ntlcm91z4.cloudfront.net/user_3Jh1FIVe6vC92KuQLB0zhEKSirw/hf_20260924_093746_e1552338-81b2-4bbf-8953-bd5596df6ef9.mp4 \
  https://d8j0ntlcm91z4.cloudfront.net/user_3Jh1FIVe6vC92KuQLB0zhEKSirw/hf_20260924_093813_db27b56a-2b54-4f9c-a7bd-896fae6699ef.mp4
```

With the defaults (12 fps, WebP q68) that is 241 frames: 14.6 MB for desktop (1280×716, dense city
frames reach ~100 KB each) and 5.1 MB for mobile (403×716). Scrubbing starts after the first
progressive pass (~1 MB desktop, ~0.35 MB mobile); the rest streams in the background. Lowering
`QUALITY` barely helps (q56 saves ~13%): the weight is the city's fine light detail.

The logo fades in centred over the final aerial, which is dimmed automatically for legibility; with
this footage its play triangle lands over the shop's triangular park district.
