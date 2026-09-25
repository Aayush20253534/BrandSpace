import { execFileSync } from "node:child_process";
import {
  expectedIndexablePaths,
  fileExists,
  loadReleaseState,
  read,
  root,
  unique,
} from "./release-utils.mjs";

const failures = [];
const passed = [];

const check = (condition, message) => {
  if (condition) passed.push(message);
  else failures.push(message);
};


const state = await loadReleaseState();

check(state.productionOrigin === "https://brandspaces.in", "canonical production origin is https://brandspaces.in");
check(state.serviceSlugs.length > 0, "service slugs discovered");
check(state.projectSlugs.length > 0, "portfolio slugs discovered");
check(state.blogPostSlugs.length > 0, "blog slugs discovered");
check(state.teamSlugs.length > 0, "team slugs discovered");

for (const [label, values] of [
  ["service slugs", state.serviceSlugs],
  ["project slugs", state.projectSlugs],
  ["blog category slugs", state.blogCategorySlugs],
  ["blog post slugs", state.blogPostSlugs],
  ["team slugs", state.teamSlugs],
  ["testimonial ids", state.testimonialIds],
]) {
  check(unique(values).length === values.length, `${label} are unique`);
}

for (const ref of state.projectServiceRefs) {
  check(state.serviceSlugs.includes(ref), `portfolio service reference exists: ${ref}`);
}
for (const ref of state.projectTestimonialRefs) {
  check(state.testimonialIds.includes(ref), `portfolio testimonial reference exists: ${ref}`);
}
for (const ref of state.testimonialProjectRefs) {
  check(state.projectSlugs.includes(ref), `testimonial project reference exists: ${ref}`);
}
for (const ref of state.serviceCategoryRefs) {
  check(state.blogCategorySlugs.includes(ref), `service insight category exists: ${ref}`);
}
for (const ref of state.blogCategoryRefs) {
  check(state.blogCategorySlugs.includes(ref), `blog category reference exists: ${ref}`);
}
for (const ref of state.blogAuthorRefs) {
  check(state.teamSlugs.includes(ref), `blog author reference exists: ${ref}`);
}

const requiredRouteFiles = [
  "src/app/page.tsx",
  "src/app/services/page.tsx",
  "src/app/services/[slug]/page.tsx",
  "src/app/portfolio/page.tsx",
  "src/app/portfolio/[slug]/page.tsx",
  "src/app/about/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/privacy-policy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/blog/category/[category]/page.tsx",
  "src/app/api/contact/route.ts",
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/app/not-found.tsx",
];

for (const file of requiredRouteFiles) check(await fileExists(file), `route source exists: ${file}`);

const criticalAssets = [
  "public/brand/brandspace-logo.png",
  "public/brand/icon-192.png",
  "public/brand/icon-512.png",
  "public/og/brandspace-og.jpg",
  "public/growth-city/desktop/frame_0001.webp",
  "public/growth-city/mobile/frame_0001.webp",
];
for (const asset of criticalAssets) check(await fileExists(asset), `critical asset exists: ${asset}`);

for (const preview of state.portfolioPreviewPaths) {
  check(await fileExists(`public${preview}`), `portfolio preview exists: ${preview}`);
}
for (const slug of state.blogPostSlugs) {
  check(await fileExists(`src/content/blog/${slug}.md`), `blog Markdown exists: ${slug}`);
}

const [sitemap, robots, blogLayout, nextConfig, contactRoute, jsonLd, results, testimonials, metrics, founders] =
  await Promise.all([
    read("src/app/sitemap.ts"),
    read("src/app/robots.ts"),
    read("src/app/blog/layout.tsx"),
    read("next.config.ts"),
    read("src/app/api/contact/route.ts"),
    read("src/components/seo/JsonLd.tsx"),
    read("src/components/home/Results.tsx"),
    read("src/components/home/Testimonials.tsx"),
    read("src/components/portfolio/MetricsRow.tsx"),
    read("src/components/about/FoundingTeam.tsx"),
  ]);

check(sitemap.includes("site.blogIndexingEnabled"), "sitemap obeys blog indexing gate");
check(sitemap.includes('url("/services")'), "sitemap includes service hub");
check(sitemap.includes('url(`/services/${service.slug}`)'), "sitemap includes service detail pages");
check(!sitemap.includes("const now = new Date()"), "sitemap does not fake static lastModified timestamps");
check(robots.includes('disallow: ["/api/"]'), "robots excludes API routes");

if (!state.blogIndexingEnabled) {
  check(blogLayout.includes("index: false"), "draft blog subtree is noindex");
  check(blogLayout.includes("noarchive: true"), "draft blog subtree is noarchive");
}

for (const marker of [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
]) {
  check(nextConfig.includes(marker), `security header configured: ${marker}`);
}

for (const marker of [
  "BODY_LIMIT_BYTES",
  "originAllowed",
  "verifyTurnstile",
  "data.success !== true",
  "allowedTurnstileHostnames",
  "Unexpected Turnstile action on a valid token",
  "rateLimited",
]) {
  check(contactRoute.includes(marker), `contact API control present: ${marker}`);
}

check(jsonLd.includes('replace(/</g, "\\\\u003c")'), "JSON-LD escapes HTML parser break-out");
check(results.includes('project.metrics.status !== "verified"'), "homepage metrics require verified status");
check(testimonials.includes("verifiedTestimonials"), "homepage testimonials use verified-only collection");
check(metrics.includes('status !== "verified"'), "portfolio metrics require verified status");
check(founders.includes('m.status === "verified"'), "founder details require verified status");

const sourceRoots = ["src/app", "src/components", "src/data", "src/lib"];
const staleTokens = ["brandspaced.in", "YOUR-DOMAIN.example"];
for (const token of staleTokens) {
  let found = false;
  for (const sourceRoot of sourceRoots) {
    const command = process.platform === "win32" ? "git.exe" : "git";
    try {
      const output = execFileSync(command, ["grep", "-n", "-F", token, "--", sourceRoot], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      if (output.trim()) found = true;
    } catch {
      // git grep exits 1 when no match exists.
    }
  }
  check(!found, `stale production token absent: ${token}`);
}

check(await fileExists(".next/BUILD_ID"), "production build exists (.next/BUILD_ID)");

const appManifestPath = ".next/server/app-paths-manifest.json";
if (await fileExists(appManifestPath)) {
  const manifest = JSON.parse(await read(appManifestPath));
  const keys = Object.keys(manifest);
  const expectedBuiltRoutes = [
    "/page",
    "/services/page",
    "/services/[slug]/page",
    "/portfolio/page",
    "/portfolio/[slug]/page",
    "/contact/page",
    "/api/contact/route",
    "/robots.txt/route",
    "/sitemap.xml/route",
  ];
  for (const route of expectedBuiltRoutes) {
    check(keys.includes(route), `Next build manifest contains ${route}`);
  }
} else {
  failures.push("Next app path manifest is missing; run a production build before the release source gate");
}

const indexable = expectedIndexablePaths(state);
check(indexable.length >= 10, `release route inventory contains ${indexable.length} indexable paths`);

console.log(`[release] ${passed.length} source/build checks passed`);
console.log(
  `[release] routes: ${indexable.length} indexable, ${state.serviceSlugs.length} services, ${state.projectSlugs.length} case studies, ${state.blogPostSlugs.length} blog drafts`,
);
console.log(`[release] blog indexing: ${state.blogIndexingEnabled ? "enabled" : "disabled (review gate active)"}`);

if (failures.length) {
  console.error("\nRelease source gate failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[release] source/build release gate passed.");
