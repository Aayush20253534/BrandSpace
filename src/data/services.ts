/**
 * BrandSpace services. Copy here drives the home Services section,
 * footer, contact form options and structured data.
 */

export type ServiceVisual = "web" | "social" | "ads" | "gbp" | "brand";

export type Service = {
  slug: string;
  name: string;
  /** Short label for compact lists (footer, form, chips). */
  shortName: string;
  kicker: string;
  what: string;
  how: string[];
  outcome: string;
  visual: ServiceVisual;
};

export const services: Service[] = [
  {
    slug: "web-development-seo",
    name: "Web Development + SEO",
    shortName: "Web Development + SEO",
    kicker: "Websites engineered to be found — and chosen.",
    what:
      "We design and build fast, conversion-focused websites on modern frameworks, structured from day one so search engines understand them and customers trust them.",
    how: [
      "Conversion-led information architecture and UX",
      "Custom design systems — never recycled templates",
      "Next.js builds tuned for Core Web Vitals",
      "Technical SEO, schema and local search foundations",
      "Analytics and lead tracking wired in at launch",
    ],
    outcome:
      "A website that loads fast, ranks for the searches that matter and turns visitors into enquiries.",
    visual: "web",
  },
  {
    slug: "social-media-management",
    name: "Social Media Management",
    shortName: "Social Media",
    kicker: "A voice people follow, save and share.",
    what:
      "We plan, create and manage content that gives your brand a consistent voice and gives people a reason to stay close to it.",
    how: [
      "Content pillars built from your audience and offer",
      "Monthly calendars across reels, carousels and stories",
      "Shoots, design and copywriting handled in-house",
      "Community management and response playbooks",
      "Monthly insight reviews that shape the next month",
    ],
    outcome:
      "A recognisable presence that builds trust long before a customer contacts you.",
    visual: "social",
  },
  {
    slug: "meta-ads",
    name: "Meta Ads",
    shortName: "Meta Ads",
    kicker: "Paid reach that pays for itself.",
    what:
      "Performance campaigns across Facebook and Instagram, built around a clear offer and measured against real business results — not vanity metrics.",
    how: [
      "Offer, audience and funnel strategy",
      "Structured creative testing across hooks and formats",
      "Pixel, Conversions API and event tracking setup",
      "Budget pacing and weekly optimisation",
      "Lead-quality feedback loops with your team",
    ],
    outcome:
      "Predictable enquiries and sales at a cost per result you can plan around.",
    visual: "ads",
  },
  {
    slug: "google-business-profile-optimization",
    name: "Google Business Profile Optimization",
    shortName: "Google Business Profile",
    kicker: "Own the map when customers search nearby.",
    what:
      "We turn your Google Business Profile into your hardest-working local storefront — visible when nearby customers search, and convincing when they compare.",
    how: [
      "Category, service and attribute optimisation",
      "Regular photo, post and offer updates",
      "Review generation and response systems",
      "Local citations and NAP consistency",
      "Map-pack visibility tracking by keyword",
    ],
    outcome:
      "More calls, direction requests and walk-ins from people ready to buy nearby.",
    visual: "gbp",
  },
  {
    slug: "digital-branding",
    name: "Digital Branding",
    shortName: "Digital Branding",
    kicker: "Look as good as your business really is.",
    what:
      "Identity systems that make a business instantly recognisable — from logo and typography to the voice that ties every touchpoint together.",
    how: [
      "Brand strategy and positioning",
      "Logo, colour and typography systems",
      "Brand guidelines and ready-to-use templates",
      "Signage, packaging and print collateral",
      "Consistent rollout across web and social",
    ],
    outcome:
      "A brand people remember, recognise and are willing to pay more for.",
    visual: "brand",
  },
];

export const serviceNames = services.map((s) => s.name);
