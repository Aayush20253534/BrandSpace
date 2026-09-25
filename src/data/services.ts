/**
 * BrandSpace services. Copy here drives service pages, the home Services
 * section, footer, contact form options and structured data.
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
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  bestFor: string[];
  /** Blog category slugs. Related articles render only after blog approval. */
  insightCategories: string[];
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
    seoTitle: "Web Development & SEO in Prayagraj",
    seoDescription:
      "Custom web development and SEO for businesses in Prayagraj and across India. Fast Next.js websites, technical SEO, local search foundations and conversion-focused UX.",
    keywords: ["web development Prayagraj", "SEO Prayagraj", "Next.js website development", "technical SEO", "website design Prayagraj"],
    bestFor: [
      "Businesses replacing an outdated or slow website",
      "Local companies that need search visibility and lead generation",
      "Brands that need a custom site rather than a recycled template",
    ],
    insightCategories: ["web-development", "seo", "business-growth"],
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
    seoTitle: "Social Media Management in Prayagraj",
    seoDescription:
      "Social media management for businesses in Prayagraj: content strategy, reels, carousels, shoots, copywriting, community management and monthly performance reviews.",
    keywords: ["social media management Prayagraj", "Instagram management Prayagraj", "content marketing Prayagraj", "social media agency"],
    bestFor: [
      "Businesses that post inconsistently or without a clear content system",
      "Brands that need one visual and verbal identity across social channels",
      "Teams that want strategy, production and community management handled together",
    ],
    insightCategories: ["social-media", "digital-marketing", "business-growth"],
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
    seoTitle: "Meta Ads Management in Prayagraj",
    seoDescription:
      "Facebook and Instagram ads management for businesses in Prayagraj and across India, with funnel strategy, tracking, creative testing and lead-quality optimisation.",
    keywords: ["Meta Ads Prayagraj", "Facebook ads agency Prayagraj", "Instagram ads management", "lead generation ads", "performance marketing Prayagraj"],
    bestFor: [
      "Businesses ready to turn a proven offer into a repeatable lead source",
      "Teams that need proper tracking instead of boosted-post reporting",
      "Brands that want creative testing tied to enquiries, bookings or sales",
    ],
    insightCategories: ["meta-advertising", "digital-marketing", "business-growth"],
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
    seoTitle: "Google Business Profile Optimization in Prayagraj",
    seoDescription:
      "Google Business Profile optimization and local SEO in Prayagraj, covering categories, services, reviews, photos, NAP consistency, citations and Maps visibility.",
    keywords: ["Google Business Profile optimization Prayagraj", "local SEO Prayagraj", "Google Maps ranking Prayagraj", "Google Business Profile management"],
    bestFor: [
      "Clinics, hotels, restaurants, stores and local service businesses",
      "Businesses with incomplete or inconsistent Google Maps information",
      "Teams that want more calls, directions and enquiries from nearby searches",
    ],
    insightCategories: ["google-business-profile", "seo", "business-growth"],
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
    seoTitle: "Digital Branding Agency in Prayagraj",
    seoDescription:
      "Digital branding for businesses in Prayagraj: positioning, logo systems, colour and typography, brand guidelines, collateral and consistent rollout across web and social.",
    keywords: ["branding agency Prayagraj", "brand identity Prayagraj", "logo design Prayagraj", "digital branding", "brand strategy"],
    bestFor: [
      "New businesses that need a coherent identity before launch",
      "Established companies whose current brand no longer reflects their quality",
      "Teams that need one system across website, social, print and signage",
    ],
    insightCategories: ["branding", "business-growth"],
  },
];

export const serviceNames = services.map((service) => service.name);

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
