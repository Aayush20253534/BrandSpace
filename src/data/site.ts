/**
 * Global BrandSpace configuration: identity, contact details, navigation.
 * Edit here — every component reads from this file.
 */

const PRODUCTION_SITE_URL = "https://brandspaces.in";

function normalizeSiteUrl(value: string) {
  const url = new URL(value);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error(`Production site URL must use HTTPS: ${value}`);
  }
  return url.origin;
}

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalizeSiteUrl(explicit);

  // Never let canonical/OG/schema URLs silently become a vercel.app hostname
  // in production just because an environment variable was forgotten.
  if (process.env.NODE_ENV === "production") return PRODUCTION_SITE_URL;

  const vercel = process.env.VERCEL_URL;
  if (vercel) return normalizeSiteUrl(`https://${vercel}`);
  return "http://localhost:3000";
}

export const site = {
  name: "BrandSpace",
  tagline: "Future of Business Growth",
  description:
    "BrandSpace is a digital growth agency in Prayagraj building high-performance websites, SEO, social media, Meta ads, Google Business Profiles and brand identities that turn attention into measurable growth.",
  url: resolveSiteUrl(),
  locale: "en_IN",

  email: "brandspace.contact@gmail.com",
  phone: {
    display: "+91 9454509113",
    e164: "+919454509113",
  },
  whatsapp: {
    /** Digits only, international format, for wa.me links. */
    number: "919454509113",
    defaultMessage:
      "Hi BrandSpace, I’m interested in your services and would like to discuss my business/project.",
  },
  address: {
    line1: "IIHMF, MNNIT Allahabad",
    locality: "Prayagraj",
    region: "Uttar Pradesh",
    postalCode: "211004",
    country: "India",
    countryCode: "IN",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=MNNIT+Allahabad+Prayagraj",
  },

  /**
   * Social profiles. Leave `href` empty to hide a network until the
   * profile is live — nothing renders for empty entries.
   */
  socials: [
    { label: "Instagram", href: "" },
    { label: "LinkedIn", href: "" },
    { label: "Facebook", href: "" },
    { label: "X", href: "" },
  ],

  /**
   * While case-study metrics, testimonials and founder bios are placeholders,
   * components show a discreet "illustrative" note next to them. Records
   * marked `status: "verified"` never show the note. Set to false only once
   * all placeholder content has been replaced.
   */
  flagPlaceholderContent: true,

  /**
   * The launch articles are still under editorial review. Keep them browsable
   * for review, but out of search until every article has been approved.
   */
  blogIndexingEnabled: false,
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
] as const;

export type ContentStatus = "placeholder" | "verified";

export const activeSocials = site.socials.filter((s) => s.href.length > 0);
