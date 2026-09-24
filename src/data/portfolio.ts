import type { ContentStatus } from "./site";

/**
 * Portfolio / case studies.
 *
 * ⚠️ METRICS ARE TEMPORARY DESIGN PLACEHOLDERS.
 * Every `metrics` block is marked `status: "placeholder"` and the UI labels
 * it as illustrative. Replace the numbers with verified client results and
 * switch `status` to "verified" — no component changes are needed.
 *
 * Narrative copy (challenge / approach) is also draft copy to be confirmed
 * with each client. Website previews live in /public/portfolio/<slug>/.
 */

export type Metric = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** One short line explaining what the number measures. */
  context: string;
};

export type Project = {
  slug: string;
  name: string;
  url: string;
  industry: string;
  location: string;
  year: number;
  /** One-line positioning used on cards. */
  summary: string;
  overview: string;
  challenge: string;
  approach: { title: string; body: string }[];
  highlights: string[];
  /** Service slugs from src/data/services.ts */
  services: string[];
  /**
   * Colours sampled from the live site. `mood` (optional) is the softer tone
   * used for ambient light behind the project (defaults to `accent`).
   */
  palette: { bg: string; fg: string; accent: string; mood?: string };
  /** Desktop screenshot (16:9). `null` renders a designed placeholder frame. */
  preview: { src: string; width: number; height: number; alt: string } | null;
  metrics: {
    status: ContentStatus;
    revenue: Metric;
    roas: Metric;
    leads: Metric;
  };
  testimonialId: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "casa-de-grande",
    name: "Casa De Grande",
    url: "https://casa-mauve-three.vercel.app/",
    industry: "Boutique Hospitality",
    location: "Prayagraj",
    year: 2026,
    summary: "A cinematic booking experience for a boutique hotel.",
    overview:
      "Casa De Grande is a boutique hotel in Prayagraj with arched façades, warm interiors and a service culture that guests remember. We built a website that sells that feeling — an editorial, image-led journey from arrival to the room, with booking always one tap away.",
    challenge:
      "Guests were discovering the hotel through aggregator listings that flattened it into a price and a thumbnail. The brand needed a direct channel that communicated its character and made booking direct the obvious choice.",
    approach: [
      {
        title: "Story-led architecture",
        body: "We structured the site as a stay — The Arrival, The Threshold, The Room — so every scroll reveals a little more of the experience.",
      },
      {
        title: "Luxury visual language",
        body: "A restrained serif-and-sans system, champagne accents and full-bleed night photography give the hotel a premium, confident presence.",
      },
      {
        title: "Direct booking focus",
        body: "Persistent Book Now actions, clear room information and fast-loading imagery reduce friction between inspiration and enquiry.",
      },
    ],
    highlights: [
      "Scroll-told arrival narrative",
      "Editorial serif typography system",
      "Always-visible booking CTA",
      "Local SEO for Prayagraj stays",
    ],
    services: ["web-development-seo", "digital-branding"],
    palette: { bg: "#0e1726", fg: "#f4efe4", accent: "#d8c29a", mood: "#d8c29a" },
    preview: {
      src: "/portfolio/casa-de-grande/hero.webp",
      width: 1600,
      height: 900,
      alt: "Casa De Grande website hero showing the illuminated arched hotel façade at dusk with the headline ‘Stay somewhere worth remembering.’",
    },
    metrics: {
      status: "placeholder",
      revenue: { label: "Revenue Growth", value: 42, prefix: "+", suffix: "%", context: "Direct booking revenue, first two quarters" },
      roas: { label: "ROAS", value: 3.8, suffix: "x", decimals: 1, context: "Return on ad spend, Meta campaigns" },
      leads: { label: "Qualified Enquiries", value: 67, prefix: "+", suffix: "%", context: "Booking enquiries vs. previous period" },
    },
    testimonialId: "casa-de-grande",
    featured: true,
  },
  {
    slug: "bar-code",
    name: "Bar Code",
    url: "https://barcode-ruddy-gamma.vercel.app/",
    industry: "Nightlife & Dining",
    location: "Civil Lines, Prayagraj",
    year: 2026,
    summary: "A premium nightlife brand, translated to the web.",
    overview:
      "Bar Code is a premium bar, restaurant and party venue in Civil Lines, Prayagraj. The website brings the venue’s black-and-gold atmosphere online and turns late-night browsing into table reservations.",
    challenge:
      "Nightlife is chosen on mood. The venue needed a web presence that felt as considered as its interiors, while making drinks, food, events and reservations easy to explore on a phone.",
    approach: [
      {
        title: "Atmosphere first",
        body: "Low-key lighting, gold detailing and product photography set the tone within the first second.",
      },
      {
        title: "Frictionless reservations",
        body: "Reserve actions open WhatsApp directly, so guests can book a table in the channel they already use.",
      },
      {
        title: "Built for discovery",
        body: "Clear sections for experience, drinks, food, gallery and visit details — structured for local search.",
      },
    ],
    highlights: [
      "Black-and-gold luxury identity",
      "WhatsApp table reservations",
      "Menu and gallery storytelling",
      "Mobile-first layout for late-night browsing",
    ],
    services: ["web-development-seo", "social-media-management", "meta-ads"],
    palette: { bg: "#0b0906", fg: "#f3ecdd", accent: "#c9a45c", mood: "#8e2a3a" },
    preview: {
      src: "/portfolio/bar-code/hero.webp",
      width: 1600,
      height: 900,
      alt: "Bar Code website hero with a glass of lager beside a black-and-gold Bar Code bottle and the headline ‘Where the night meets the experience.’",
    },
    metrics: {
      status: "placeholder",
      revenue: { label: "Revenue Growth", value: 35, prefix: "+", suffix: "%", context: "Weekend covers and event revenue" },
      roas: { label: "ROAS", value: 4.6, suffix: "x", decimals: 1, context: "Event and offer campaigns on Meta" },
      leads: { label: "Table Reservations", value: 58, prefix: "+", suffix: "%", context: "Reservations via website and WhatsApp" },
    },
    testimonialId: "bar-code",
    featured: true,
  },
  {
    slug: "zobhunger",
    name: "ZOBHUNGER",
    url: "https://zobhungr.com/",
    industry: "Workforce & Field Execution",
    location: "India",
    year: 2026,
    summary: "Clarity for a nationwide workforce partner.",
    overview:
      "ZOBHUNGER helps businesses build and deploy workforce, sales, promoter and field teams across India. The website presents a broad, operational offering in a way decision-makers understand in seconds.",
    challenge:
      "Staffing sounds the same everywhere. ZOBHUNGER needed to explain permanent, contract, project-based and on-demand models — and prove operational depth — without overwhelming buyers.",
    approach: [
      {
        title: "Plan → Deploy → Review",
        body: "We framed the offer around the client’s own workflow, so the value is obvious before a single service page is opened.",
      },
      {
        title: "Two audiences, one site",
        body: "Clear routes for businesses hiring a workforce and for people looking for their next role.",
      },
      {
        title: "Credibility built in",
        body: "Partner logos, coverage and engagement models are surfaced early, supporting B2B trust.",
      },
    ],
    highlights: [
      "Engagement-model navigation",
      "Dual B2B and candidate journeys",
      "Crisp red-and-white identity system",
      "Lead capture for workforce enquiries",
    ],
    services: ["web-development-seo", "digital-branding"],
    palette: { bg: "#fbf7f7", fg: "#1a1214", accent: "#d3202f", mood: "#c8323d" },
    preview: {
      src: "/portfolio/zobhunger/hero.webp",
      width: 1600,
      height: 900,
      alt: "ZOBHUNGER website hero with the headline ‘Build, deploy & execute with the right workforce’ and a photo of field team members in red uniforms.",
    },
    metrics: {
      status: "placeholder",
      revenue: { label: "Revenue Growth", value: 28, prefix: "+", suffix: "%", context: "New contract value from inbound leads" },
      roas: { label: "ROAS", value: 3.1, suffix: "x", decimals: 1, context: "Lead-generation campaigns" },
      leads: { label: "Qualified Leads", value: 74, prefix: "+", suffix: "%", context: "B2B workforce enquiries" },
    },
    testimonialId: "zobhunger",
    featured: true,
  },
  {
    slug: "rovauto",
    name: "Rovauto",
    url: "https://rovauto.com/",
    industry: "Automotive Services",
    location: "Prayagraj",
    year: 2026,
    summary: "Verified garage booking for Prayagraj.",
    overview:
      "Rovauto connects vehicle owners in Prayagraj with verified garages for repair, maintenance, pickup and doorstep service — with transparent pricing, live tracking and a service warranty. “Gaadi Apki, Guarantee Hamari.”",
    challenge:
      "Trust is the biggest barrier in vehicle servicing. The platform had to reassure first-time users, explain a two-sided marketplace and make booking a service feel fast and safe.",
    approach: [
      {
        title: "Trust signals up front",
        body: "Verified garages, service warranty, transparent pricing and live tracking are stated in the first viewport.",
      },
      {
        title: "Two-sided journeys",
        body: "Dedicated paths for vehicle owners booking a service and garages applying to partner.",
      },
      {
        title: "Local search strategy",
        body: "Pages and profiles structured around how people in Prayagraj search for car repair and servicing.",
      },
    ],
    highlights: [
      "Book Service conversion flow",
      "Partner onboarding journey",
      "High-energy lime identity",
      "Google Business Profile alignment",
    ],
    services: ["web-development-seo", "google-business-profile-optimization", "meta-ads"],
    palette: { bg: "#0c0d0b", fg: "#f5f7f0", accent: "#b4ef1f", mood: "#a6d83a" },
    preview: {
      src: "/portfolio/rovauto/hero.webp",
      width: 1600,
      height: 900,
      alt: "Rovauto website hero showing a modern garage with a car on a lift and the headline ‘Verified Vehicle Service and Garage Booking in Prayagraj.’",
    },
    metrics: {
      status: "placeholder",
      revenue: { label: "Revenue Growth", value: 51, prefix: "+", suffix: "%", context: "Gross booking value" },
      roas: { label: "ROAS", value: 4.2, suffix: "x", decimals: 1, context: "Service booking campaigns" },
      leads: { label: "Service Bookings", value: 89, prefix: "+", suffix: "%", context: "Completed bookings vs. launch month" },
    },
    testimonialId: "rovauto",
    featured: true,
  },
  {
    slug: "lotus-family-dental",
    name: "Lotus Family Dental",
    url: "https://lotusfamilydental.me/",
    industry: "Healthcare · Dental",
    location: "India",
    year: 2026,
    summary: "A calm, reassuring front door for a family dental clinic.",
    overview:
      "Lotus Family Dental provides dental care for patients of every age. The website is designed to feel calm and approachable, answering the questions patients have before they book — and making booking simple.",
    challenge:
      "Many patients delay dental visits out of anxiety. The clinic needed an online presence that feels welcoming, communicates expertise clearly and turns searches into appointments.",
    approach: [
      {
        title: "Reassurance by design",
        body: "Soft palette, generous whitespace and plain-language treatment explanations reduce first-visit anxiety.",
      },
      {
        title: "Appointment-first journeys",
        body: "Calls, WhatsApp and appointment actions are always within reach on mobile.",
      },
      {
        title: "Local visibility",
        body: "Treatment pages and Google Business Profile work together for nearby dental searches.",
      },
    ],
    highlights: [
      "Treatment explainers in plain language",
      "Mobile appointment actions",
      "Google Business Profile optimisation",
      "Review-led trust building",
    ],
    services: ["web-development-seo", "google-business-profile-optimization"],
    palette: { bg: "#f5fbfa", fg: "#14201f", accent: "#0b8a80", mood: "#6fc3b8" },
    preview: {
      src: "/portfolio/lotus-family-dental/hero.webp",
      width: 1600,
      height: 900,
      alt: "Lotus Family Dental website hero introducing the clinic’s four specialist dentists above the headline ‘Best Dental Clinic in Allahabad for Advanced & Painless Dental Care’, with a teal Book Appointment button.",
    },
    metrics: {
      status: "placeholder",
      revenue: { label: "Revenue Growth", value: 31, prefix: "+", suffix: "%", context: "New-patient treatment revenue" },
      roas: { label: "ROAS", value: 3.4, suffix: "x", decimals: 1, context: "Local awareness campaigns" },
      leads: { label: "Appointment Requests", value: 63, prefix: "+", suffix: "%", context: "Calls, WhatsApp and form bookings" },
    },
    testimonialId: "lotus-family-dental",
    featured: false,
  },
  {
    slug: "eclectic-dental-care",
    name: "Eclectic Dental Care",
    url: "https://eclecticdentalcare.in/",
    industry: "Healthcare · Dental",
    location: "India",
    year: 2026,
    summary: "Modern dentistry, presented with clarity.",
    overview:
      "Eclectic Dental Care offers modern general and cosmetic dentistry. The website presents the clinic with clarity and confidence, helping patients understand treatments and book with ease.",
    challenge:
      "Patients compare clinics on trust, technology and convenience. The clinic needed a site and local presence that stand out in search results and make the decision easy.",
    approach: [
      {
        title: "Clinical, not cold",
        body: "A clean visual system that signals precision while staying warm and human.",
      },
      {
        title: "Treatment-led structure",
        body: "Each core treatment gets a clear page answering cost, process and recovery questions.",
      },
      {
        title: "Search and social together",
        body: "Consistent profiles, reviews and content so patients see the same trusted clinic everywhere.",
      },
    ],
    highlights: [
      "Treatment-focused information architecture",
      "Fast, accessible mobile experience",
      "Google Business Profile optimisation",
      "Social content aligned with the website",
    ],
    services: ["web-development-seo", "google-business-profile-optimization", "social-media-management"],
    palette: { bg: "#fbf7f2", fg: "#35261f", accent: "#a9452f", mood: "#d99a86" },
    preview: {
      src: "/portfolio/eclectic-dental-care/hero.webp",
      width: 1600,
      height: 900,
      alt: "Eclectic Dental Care website hero on a warm cream background with the serif headline ‘Best Dental Clinic in Prayagraj.’ and terracotta ‘Book an appointment’ and WhatsApp buttons.",
    },
    metrics: {
      status: "placeholder",
      revenue: { label: "Revenue Growth", value: 38, prefix: "+", suffix: "%", context: "Treatment revenue from new patients" },
      roas: { label: "ROAS", value: 3.9, suffix: "x", decimals: 1, context: "Treatment awareness campaigns" },
      leads: { label: "Appointment Enquiries", value: 55, prefix: "+", suffix: "%", context: "Enquiries across web, phone and WhatsApp" },
    },
    testimonialId: "eclectic-dental-care",
    featured: false,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
