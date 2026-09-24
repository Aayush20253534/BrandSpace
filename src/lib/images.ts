/**
 * Editorial photography.
 *
 * Blog covers and the homepage editorial break use real photography from
 * Unsplash (free to use under the Unsplash License). Every remote `src` shares
 * one fixed query so next.config's `remotePatterns` can allow exactly these
 * URLs; framing is art-directed in CSS with `position` (object-position).
 */

/** Must match `images.remotePatterns[].search` in next.config.ts. */
export const UNSPLASH_QUERY = "?auto=format&fit=crop&w=2400&q=80";

export type Photo = {
  /** Full-size source for next/image (optimised by Next). */
  src: string;
  /** 1200×630 crop for Open Graph / social cards. */
  og: string;
  alt: string;
  /** CSS object-position, e.g. "50% 40%". */
  position?: string;
  credit: { name: string; href: string };
};

export function unsplash(
  id: string,
  alt: string,
  credit: { name: string; href: string },
  position?: string,
): Photo {
  const base = `https://images.unsplash.com/photo-${id}`;
  return {
    src: `${base}${UNSPLASH_QUERY}`,
    og: `${base}?auto=format&fit=crop&w=1200&h=630&q=80`,
    alt,
    position,
    credit,
  };
}

/** Homepage editorial break. */
export const editorialPhotos = {
  studio: unsplash(
    "1758520145147-c30bc656f314",
    "A designer working late at a lamp-lit desk in a dark, open-plan studio.",
    { name: "Vitaly Gariev", href: "https://unsplash.com/photos/man-working-late-at-a-dimly-lit-office-desk-l12wb6pAzuQ" },
    "30% 55%",
  ),
  sketch: unsplash(
    "1611241893603-3c359704e0ee",
    "Hands sketching a logo mark on a drawing tablet beside a coffee mug.",
    { name: "Kelly Sikkema", href: "https://unsplash.com/photos/person-drawing-on-tablet-at-workspace-Dx1b5ucschA" },
    "40% 50%",
  ),
} as const;
