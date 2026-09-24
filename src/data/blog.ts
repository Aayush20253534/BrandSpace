import { unsplash, type Photo } from "@/lib/images";

/**
 * Blog index: categories, authors and article metadata.
 * Article bodies live in src/content/blog/<slug>.md (Markdown).
 * Covers are topic-matched editorial photography (see src/lib/images.ts).
 *
 * ⚠️ Articles are temporary launch content written by the BrandSpace team
 * brief; review and edit before publishing under a founder's name.
 */

export type BlogCategory = {
  slug: string;
  name: string;
  description: string;
};

export const blogCategories: BlogCategory[] = [
  { slug: "web-development", name: "Web Development", description: "Building fast, conversion-focused websites that do real work for a business." },
  { slug: "seo", name: "SEO", description: "Practical search engine optimisation for businesses that want to be found." },
  { slug: "digital-marketing", name: "Digital Marketing", description: "Funnels, channels and campaigns that turn attention into customers." },
  { slug: "meta-advertising", name: "Meta Advertising", description: "Facebook and Instagram advertising that is measured on results." },
  { slug: "social-media", name: "Social Media", description: "Content systems and community building for growing brands." },
  { slug: "branding", name: "Branding", description: "Identity, positioning and consistency — the foundations of a memorable brand." },
  { slug: "business-growth", name: "Business Growth", description: "How digital channels compound into sustainable business growth." },
  { slug: "google-business-profile", name: "Google Business Profile", description: "Local visibility on Google Search and Maps." },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string; // BlogCategory slug
  author: string; // team member slug
  publishedAt: string; // ISO date
  updatedAt?: string;
  cover: Photo;
  featured?: boolean;
  keywords: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "google-business-profile-optimization-checklist",
    title: "The Google Business Profile Checklist Every Local Business Needs",
    excerpt:
      "Your Google Business Profile is often the first thing a nearby customer sees. Here is the practical checklist we use to turn it into a steady source of calls, visits and bookings.",
    category: "google-business-profile",
    author: "dev-raj",
    publishedAt: "2026-09-10",
    cover: unsplash(
      "1548345680-f5475ea5df84",
      "A hand holding a smartphone showing a local business listing on a map, with its star rating and Directions and Call buttons.",
      { name: "henry perks", href: "https://unsplash.com/photos/person-holding-black-smartphone-BJXAxQ1L7dI" },
      "50% 45%",
    ),
    featured: true,
    keywords: ["Google Business Profile", "local SEO", "Google Maps ranking", "reviews"],
  },
  {
    slug: "why-your-website-loses-customers-in-3-seconds",
    title: "Why Your Website Loses Customers in the First Three Seconds",
    excerpt:
      "Most visitors decide whether to stay before your page has finished loading. What happens in those first seconds — and how to design and build for them.",
    category: "web-development",
    author: "ayush-kumar-jha",
    publishedAt: "2026-08-21",
    cover: unsplash(
      "1481487196290-c152efe083f5",
      "A laptop on a dark desk displaying a restaurant website’s homepage, beside a small cactus and a glass bottle.",
      { name: "Igor Miske", href: "https://unsplash.com/photos/macbook-pro-showing-vegetable-dish-JVSgcV8_vb4" },
      "50% 55%",
    ),
    keywords: ["website speed", "Core Web Vitals", "conversion rate", "web design"],
  },
  {
    slug: "local-seo-guide-for-small-businesses",
    title: "Local SEO for Small Businesses: A Practical Playbook",
    excerpt:
      "You don’t need to outrank the whole internet — just the businesses near you. A step-by-step approach to local search that small teams can actually maintain.",
    category: "seo",
    author: "ayush-kumar-jha",
    publishedAt: "2026-08-04",
    cover: unsplash(
      "1589820745206-c6b6d3602361",
      "A busy shopping street in an Indian city at dusk, lined with illuminated shop signs.",
      { name: "Aman Upadhyay", href: "https://unsplash.com/photos/people-walking-on-street-during-night-time-NAjYWkVPwnc" },
      "50% 60%",
    ),
    keywords: ["local SEO", "small business SEO", "search rankings", "Prayagraj"],
  },
  {
    slug: "meta-ads-for-local-businesses",
    title: "Meta Ads for Local Businesses: Stop Boosting Posts, Start Getting Leads",
    excerpt:
      "The Boost button is the most expensive way to advertise on Facebook and Instagram. How to structure Meta campaigns around an offer, a funnel and a number you care about.",
    category: "meta-advertising",
    author: "dev-raj",
    publishedAt: "2026-07-16",
    cover: unsplash(
      "1516251193007-45ef944ab0c6",
      "A hand holding up a phone showing an Instagram profile among the digital billboards of a busy city square.",
      { name: "Jakob Owens", href: "https://unsplash.com/photos/smartphone-displaying-instagram-profile-in-city-WUmb_eBrpjs" },
      "45% 50%",
    ),
    keywords: ["Meta Ads", "Facebook ads", "Instagram ads", "lead generation"],
  },
  {
    slug: "what-a-brand-identity-really-includes",
    title: "What a Brand Identity Really Includes (and Why a Logo Isn’t Enough)",
    excerpt:
      "A logo is a signature, not a personality. The components of a complete brand identity — and how they keep a growing business consistent everywhere.",
    category: "branding",
    author: "aayush-thakur",
    publishedAt: "2026-06-25",
    cover: unsplash(
      "1636247499734-893da2bcfc1c",
      "A complete brand identity laid out on a table: letterhead, brochures, folders and cards in blue, orange and white.",
      { name: "MK", href: "https://unsplash.com/photos/a-series-of-brochures-designed-to-look-like-a-building-E6XStmd5wfk" },
      "50% 50%",
    ),
    keywords: ["brand identity", "branding", "logo design", "brand guidelines"],
  },
  {
    slug: "social-media-content-system",
    title: "A Social Media Content System That Doesn’t Burn Out Your Team",
    excerpt:
      "Consistency beats virality. How to build content pillars, a realistic calendar and a production rhythm that keeps your brand visible month after month.",
    category: "social-media",
    author: "dev-raj",
    publishedAt: "2026-06-05",
    cover: unsplash(
      "1695408247109-3bf125ad0538",
      "A content creator photographing a woman cooking in a bright kitchen during a social media shoot.",
      { name: "Wesley Tingey", href: "https://unsplash.com/photos/a-woman-taking-a-picture-of-herself-in-a-kitchen-RAH1ipSQh24" },
      "60% 40%",
    ),
    keywords: ["social media strategy", "content calendar", "Instagram", "content pillars"],
  },
  {
    slug: "digital-marketing-funnel-that-converts",
    title: "How to Build a Digital Marketing Funnel That Actually Converts",
    excerpt:
      "Awareness, consideration, conversion, loyalty. A plain-English guide to mapping your channels to the way customers really decide.",
    category: "digital-marketing",
    author: "akhil-kumar",
    publishedAt: "2026-05-14",
    cover: unsplash(
      "1529119368496-2dfda6ec2804",
      "Two people in silhouette pointing at a wall of sticky notes and printouts during a strategy session.",
      { name: "Startaê Team", href: "https://unsplash.com/photos/person-pointing-white-paper-on-wall-7tXA8xwe4W4" },
      "50% 45%",
    ),
    keywords: ["marketing funnel", "digital marketing", "conversion", "customer journey"],
  },
  {
    slug: "digital-growth-flywheel",
    title: "The Growth Flywheel: How Website, Search, Social and Ads Compound",
    excerpt:
      "Channels work better together than alone. Why the businesses that grow fastest treat their digital presence as one connected system.",
    category: "business-growth",
    author: "akhil-kumar",
    publishedAt: "2026-04-22",
    cover: unsplash(
      "1551288049-bebda4e38f71",
      "A laptop showing a website analytics dashboard with bar charts, trend lines and session metrics.",
      { name: "Luke Chesser", href: "https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00" },
      "50% 40%",
    ),
    keywords: ["business growth", "digital strategy", "marketing flywheel", "growth"],
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return blogCategories.find((c) => c.slug === slug);
}

export function postsByDate() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function relatedPosts(slug: string, limit = 3) {
  const post = getPost(slug);
  if (!post) return [];
  const others = postsByDate().filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  const keywordOverlap = (p: BlogPost) =>
    p.keywords.filter((k) => post.keywords.some((pk) => pk.toLowerCase() === k.toLowerCase())).length;
  const rest = others
    .filter((p) => p.category !== post.category)
    .sort((a, b) => keywordOverlap(b) - keywordOverlap(a));
  return [...sameCategory, ...rest].slice(0, limit);
}
