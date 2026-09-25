import { access, readFile } from "node:fs/promises";
import path from "node:path";

export const root = process.cwd();

export const fileExists = async (relativePath) => {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
};

export const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

export function between(source, start, end) {
  const from = source.indexOf(start);
  if (from < 0) return "";
  const to = source.indexOf(end, from + start.length);
  return source.slice(from, to < 0 ? source.length : to);
}

export const quotedValues = (source, property) => {
  const pattern = new RegExp(`\\b${property}:\\s*"([^"]+)"`, "g");
  return [...source.matchAll(pattern)].map((match) => match[1]);
};

export const arrayValues = (source, property) => {
  const pattern = new RegExp(`\\b${property}:\\s*\\[([\\s\\S]*?)\\]`, "g");
  const values = [];
  for (const match of source.matchAll(pattern)) {
    for (const item of match[1].matchAll(/"([^"]+)"/g)) values.push(item[1]);
  }
  return values;
};

export const unique = (values) => [...new Set(values)];

export function normalizePathname(value) {
  const pathname = new URL(value, "https://release.invalid").pathname;
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

export async function loadReleaseState() {
  const [site, services, portfolio, blog, team, testimonials] = await Promise.all([
    read("src/data/site.ts"),
    read("src/data/services.ts"),
    read("src/data/portfolio.ts"),
    read("src/data/blog.ts"),
    read("src/data/team.ts"),
    read("src/data/testimonials.ts"),
  ]);

  const productionOrigin = site.match(/const PRODUCTION_SITE_URL = "([^"]+)"/)?.[1];
  const blogIndexingEnabled = site.match(/blogIndexingEnabled:\s*(true|false)/)?.[1] === "true";

  const serviceBlock = between(services, "export const services", "export const serviceNames");
  const projectBlock = between(portfolio, "export const projects", "export function getProject");
  const categoryBlock = between(blog, "export const blogCategories", "export type BlogPost");
  const postBlock = between(blog, "export const blogPosts", "export function getPost");
  const teamBlock = between(team, "export const team", "export function getTeamMember");
  const testimonialBlock = between(testimonials, "export const testimonials", "export const verifiedTestimonials");

  return {
    productionOrigin,
    blogIndexingEnabled,
    serviceSlugs: quotedValues(serviceBlock, "slug"),
    projectSlugs: quotedValues(projectBlock, "slug"),
    blogCategorySlugs: quotedValues(categoryBlock, "slug"),
    blogPostSlugs: quotedValues(postBlock, "slug"),
    teamSlugs: quotedValues(teamBlock, "slug"),
    testimonialIds: quotedValues(testimonialBlock, "id"),
    projectServiceRefs: arrayValues(projectBlock, "services"),
    projectTestimonialRefs: quotedValues(projectBlock, "testimonialId"),
    serviceCategoryRefs: arrayValues(serviceBlock, "insightCategories"),
    blogCategoryRefs: quotedValues(postBlock, "category"),
    blogAuthorRefs: quotedValues(postBlock, "author"),
    testimonialProjectRefs: quotedValues(testimonialBlock, "project"),
    portfolioPreviewPaths: quotedValues(projectBlock, "src").filter((value) => value.startsWith("/portfolio/")),
  };
}

export function expectedIndexablePaths(state) {
  return unique([
    "/",
    "/services",
    ...state.serviceSlugs.map((slug) => `/services/${slug}`),
    "/portfolio",
    ...state.projectSlugs.map((slug) => `/portfolio/${slug}`),
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    ...(state.blogIndexingEnabled
      ? [
          "/blog",
          ...state.blogCategorySlugs.map((slug) => `/blog/category/${slug}`),
          ...state.blogPostSlugs.map((slug) => `/blog/${slug}`),
        ]
      : []),
  ]);
}
