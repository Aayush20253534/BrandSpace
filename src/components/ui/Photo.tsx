"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";

const UNSPLASH = "https://images.unsplash.com/";

/**
 * Unsplash's image CDN resizes and re-encodes on request, so remote editorial
 * photos skip Next's optimiser: every srcset entry asks Unsplash for exactly
 * that width (WebP/AVIF via auto=format). No double processing, no upstream
 * fetch of the full-size original for a thumbnail.
 */
const unsplashLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
};

/** next/image, with Unsplash photos served straight from Unsplash's CDN. Local images are unchanged. */
export function Photo(props: ImageProps) {
  const remote = typeof props.src === "string" && props.src.startsWith(UNSPLASH);
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is required by ImageProps and passed through
  return <Image {...props} loader={remote ? unsplashLoader : props.loader} />;
}
