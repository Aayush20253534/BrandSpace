import type { ContentStatus } from "./site";

/**
 * Founding team.
 *
 * ⚠️ Roles, focus areas and bios are TEMPORARY and will be replaced with
 * the founders' own copy. Portraits: add a 4:5 image to /public/team/ and
 * set `photo` — until then an editorial monogram portrait is rendered.
 */

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  focus: string[];
  bio: string;
  photo: { src: string; alt: string } | null;
  links?: { label: string; href: string }[];
  status: ContentStatus;
};

export const team: TeamMember[] = [
  {
    slug: "akhil-kumar",
    name: "Akhil Kumar",
    role: "Co-Founder · Growth Strategy",
    focus: ["Growth strategy", "Client partnerships", "Measurement"],
    bio:
      "Akhil leads strategy and client partnerships. He turns a client’s goals into a clear growth plan across web, search and social, and stays close to every account — from the first conversation to the monthly review — so the work stays tied to real business outcomes.",
    photo: null,
    status: "placeholder",
  },
  {
    slug: "aayush-thakur",
    name: "Aayush Thakur",
    role: "Co-Founder · Brand & Design",
    focus: ["Brand identity", "Art direction", "UI design"],
    bio:
      "Aayush shapes how BrandSpace clients look and feel. He leads identity, art direction and interface design, building visual systems that stay consistent from a storefront sign to a social feed to a website.",
    photo: null,
    status: "placeholder",
  },
  {
    slug: "ayush-kumar-jha",
    name: "Ayush Kumar Jha",
    role: "Co-Founder · Web Engineering & SEO",
    focus: ["Web development", "Technical SEO", "Performance"],
    bio:
      "Ayush leads engineering. He builds the fast, accessible websites behind BrandSpace projects and owns the technical SEO that helps them get found — from site structure and schema to Core Web Vitals.",
    photo: null,
    status: "placeholder",
  },
  {
    slug: "dev-raj",
    name: "Dev Raj",
    role: "Co-Founder · Performance Marketing",
    focus: ["Meta Ads", "Social media", "Local growth"],
    bio:
      "Dev runs performance marketing and social. He plans and optimises Meta campaigns, content calendars and Google Business Profiles, focusing on the numbers that matter to a business: enquiries, bookings and sales.",
    photo: null,
    status: "placeholder",
  },
];

export function getTeamMember(slug: string) {
  return team.find((m) => m.slug === slug);
}
