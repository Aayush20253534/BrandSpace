import framesManifest from "./growthCityFrames.json";

/**
 * "The BrandSpace Growth City" — the scroll-controlled cinematic hero.
 *
 * Progress `p` runs 0 → 1 across the pinned section. Each scene owns a
 * slice of that range; overlay copy fades in and out inside its slice.
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
    range: [0, 0.11],
  },
  {
    id: "brand-identity",
    label: "Identity",
    overlay: "Build your identity.",
    detail: "Signage, colour and a voice people recognise at a glance.",
    range: [0.11, 0.23],
  },
  {
    id: "digital-presence",
    label: "Presence",
    overlay: "Create your presence.",
    detail: "A website engineered to be the heart of your digital world.",
    range: [0.23, 0.35],
  },
  {
    id: "seo-discovery",
    label: "Discovery",
    overlay: "Get discovered.",
    detail: "Search and maps that lead new customers straight to you.",
    range: [0.35, 0.47],
  },
  {
    id: "social-media",
    label: "Social",
    overlay: "Reach the right people.",
    detail: "Content that travels further than your storefront ever could.",
    range: [0.47, 0.58],
  },
  {
    id: "ads-customers",
    label: "Growth Engine",
    overlay: "Turn attention into growth.",
    detail: "Campaigns that bring real customers through the door.",
    range: [0.58, 0.7],
  },
  {
    id: "growth-city",
    label: "Growth City",
    overlay: "Build your space.",
    detail: "Everything here grew from one business, connected.",
    range: [0.7, 0.84],
  },
  {
    id: "brandspace",
    label: "BrandSpace",
    overlay: "",
    detail: "",
    range: [0.84, 1],
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

export const growthCityFrames = framesManifest as { desktop: FrameSet; mobile: FrameSet } | null;

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
