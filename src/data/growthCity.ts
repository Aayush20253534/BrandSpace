import framesManifest from "./growthCityFrames.json";

/**
 * "The BrandSpace Growth City" — the scroll-controlled cinematic hero.
 *
 * Progress `p` runs 0 → 1 across the pinned section. Each scene owns a
 * slice of that range; its copy is revealed when the scene begins and
 * leaves when the next one starts. Identity, Presence, Discovery, Growth City
 * and the final reveal get the widest slices so each change can land.
 */

export type GrowthScene = {
  id: string;
  /** Rail label (desktop). */
  label: string;
  /** Overlay line shown on screen. */
  overlay: string;
  /** Short supporting line under the overlay. */
  detail: string;
  range: [number, number];
};

export const growthScenes: GrowthScene[] = [
  {
    id: "lonely-business",
    label: "The Business",
    overlay: "Every business starts somewhere.",
    detail: "Real potential — but invisible to the people looking for it.",
    range: [0, 0.09],
  },
  {
    id: "brand-identity",
    label: "Identity",
    overlay: "Build your identity.",
    detail: "Signage, colour and a voice people recognise at a glance.",
    range: [0.09, 0.21],
  },
  {
    id: "digital-presence",
    label: "Presence",
    overlay: "Create your presence.",
    detail: "A website engineered to be the heart of your digital world.",
    range: [0.21, 0.34],
  },
  {
    id: "seo-discovery",
    label: "Discovery",
    overlay: "Get discovered.",
    detail: "Search and maps that lead new customers straight to you.",
    range: [0.34, 0.48],
  },
  {
    id: "social-media",
    label: "Social",
    overlay: "Reach the right people.",
    detail: "Content that travels further than your storefront ever could.",
    range: [0.48, 0.58],
  },
  {
    id: "ads-customers",
    label: "Growth Engine",
    overlay: "Turn attention into growth.",
    detail: "Campaigns that bring real customers through the door.",
    range: [0.58, 0.69],
  },
  {
    id: "growth-city",
    label: "Growth City",
    overlay: "Build your space.",
    detail: "Everything here grew from one business, connected.",
    range: [0.69, 0.83],
  },
  {
    id: "brandspace",
    label: "BrandSpace",
    overlay: "",
    detail: "",
    range: [0.83, 1],
  },
];

/**
 * Pre-rendered cinematic footage (Higgsfield) converted to frame sequences.
 * `scripts/growth-city-frames.mjs` writes growthCityFrames.json; while it
 * contains `null` the code-rendered city is used. See docs/growth-city.md.
 */
export type FrameSet = {
  /** Path pattern, `{i}` is replaced by the zero-padded frame index. */
  pattern: string;
  count: number;
  pad: number;
  width: number;
  height: number;
};

/** Scroll progress → frame index at each clip boundary, piecewise-linear in between. */
export type FrameTimeline = [progress: number, frame: number][];

export const growthCityFrames = framesManifest as { desktop: FrameSet; mobile: FrameSet; timeline?: FrameTimeline } | null;

/**
 * Pacing for the current footage (overrides the manifest's even timeline).
 * Each scene plays its transformation over roughly the first 60% of its
 * slice, then the picture holds — drifting only a few frames — while the
 * copy is read: scroll → transformation → brief hold → next transformation.
 * Frame numbers refer to the 241-frame import documented in docs/growth-city.md;
 * re-tune these pairs if the footage is ever re-imported.
 */
export const storyTimeline: FrameTimeline = [
  [0, 0], [0.09, 12], //                The Business — the lone shop, almost still
  [0.165, 25], [0.21, 28], //           Identity — awning and sign light up, then hold
  [0.29, 46], [0.34, 56], //            Presence — the website hologram assembles, lines reach out
  [0.43, 100], [0.48, 108], //          Discovery — camera rises, roads and map pins appear, hold
  [0.54, 128], [0.58, 136], //          Social — billboards light up along the roads, hold
  [0.65, 178], [0.69, 190], //          Growth Engine — the city fills in around the shop, hold
  [0.77, 220], [0.83, 232], //          Growth City — the tilt to top-down, then hold on the plan
  [0.9, 240], [1, 240], //              BrandSpace — the final aerial rests under the logo
];

/**
 * Geometry linking the supplied logo artwork to the city layout, so the
 * final aerial composition dissolves exactly into the real logo.
 * Units: logo image pixels of /public/brand/brandspace-logo.png.
 * (Re-measure if scripts/process-logo.mjs changes its crop.)
 */
export const logoGeometry = {
  size: 421,
  /** Centre of the play triangle in the logo image — anchors to the shop. */
  anchor: { x: 122.5, y: 235.8 },
  /** City plan units per logo pixel. */
  planPerPx: 2.2,
};
