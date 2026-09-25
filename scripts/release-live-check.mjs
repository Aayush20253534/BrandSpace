import {
  expectedIndexablePaths,
  loadReleaseState,
  normalizePathname,
} from "./release-utils.mjs";

const state = await loadReleaseState();
const canonicalOrigin = state.productionOrigin;
const releaseOrigin = new URL(process.env.RELEASE_URL?.trim() || canonicalOrigin).origin;
const TIMEOUT_MS = 12_000;
const failures = [];
let passed = 0;

const check = (condition, message) => {
  if (condition) passed++;
  else failures.push(message);
};

const fetchRelease = async (pathname, init = {}) => {
  const url = new URL(pathname, releaseOrigin);
  return fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      "User-Agent": "BrandSpace-Release-Check/1.0",
      ...(init.headers ?? {}),
    },
    ...init,
  });
};

const attrs = (tag) => {
  const result = {};
  for (const match of tag.matchAll(/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return result;
};

const findTag = (html, tagName, predicate) => {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  for (const tag of tags) {
    const parsed = attrs(tag);
    if (predicate(parsed)) return parsed;
  }
  return null;
};

const titleText = (html) => html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";

const pageCache = new Map();
const getPage = async (pathname) => {
  if (pageCache.has(pathname)) return pageCache.get(pathname);
  const response = await fetchRelease(pathname);
  const html = await response.text();
  const result = { response, html };
  pageCache.set(pathname, result);
  return result;
};

console.log(`[live] target: ${releaseOrigin}`);
console.log(`[live] canonical: ${canonicalOrigin}`);

const publicPaths = expectedIndexablePaths(state);
for (const pathname of publicPaths) {
  try {
    const { response, html } = await getPage(pathname);
    check(response.status === 200, `${pathname}: expected 200, got ${response.status}`);
    check(titleText(html).length > 0, `${pathname}: missing <title>`);
    const description = findTag(html, "meta", (a) => a.name?.toLowerCase() === "description");
    check(Boolean(description?.content), `${pathname}: missing meta description`);

    const canonical = findTag(html, "link", (a) => a.rel?.toLowerCase().split(/\s+/).includes("canonical"));
    const expectedCanonical = new URL(pathname, canonicalOrigin).toString();
    let canonicalMatches = false;
    if (canonical?.href) {
      try {
        canonicalMatches = new URL(canonical.href, canonicalOrigin).toString() === expectedCanonical;
      } catch {
        canonicalMatches = false;
      }
    }
    check(canonicalMatches, `${pathname}: canonical is ${canonical?.href ?? "missing"}, expected ${expectedCanonical}`);

    const robots = findTag(html, "meta", (a) => a.name?.toLowerCase() === "robots");
    check(!robots?.content?.toLowerCase().includes("noindex"), `${pathname}: unexpectedly marked noindex`);
  } catch (error) {
    failures.push(`${pathname}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const { response, html } = await getPage("/");
  const headers = response.headers;
  const csp = headers.get("content-security-policy") ?? "";

  check(csp.includes("default-src 'self'"), "homepage: CSP default-src missing");
  check(csp.includes("frame-ancestors 'none'"), "homepage: CSP frame-ancestors missing");
  check(csp.includes("object-src 'none'"), "homepage: CSP object-src missing");
  check((headers.get("strict-transport-security") ?? "").includes("max-age="), "homepage: HSTS missing");
  check(headers.get("x-content-type-options")?.toLowerCase() === "nosniff", "homepage: X-Content-Type-Options incorrect");
  check(headers.get("x-frame-options")?.toUpperCase() === "DENY", "homepage: X-Frame-Options incorrect");
  check(headers.get("referrer-policy") === "strict-origin-when-cross-origin", "homepage: Referrer-Policy incorrect");
  check((headers.get("permissions-policy") ?? "").includes("geolocation=()"), "homepage: Permissions-Policy missing geolocation restriction");
  check(headers.get("cross-origin-opener-policy") === "same-origin", "homepage: COOP incorrect");
  check(headers.get("origin-agent-cluster") === "?1", "homepage: Origin-Agent-Cluster missing");
  check(!headers.has("x-powered-by"), "homepage: X-Powered-By should be absent");

  check(!html.includes("Sample testimonial for layout"), "homepage: placeholder testimonial leaked into HTML");
  check(!html.includes("Illustrative placeholder"), "homepage: placeholder metrics leaked into HTML");
  check(html.includes('"@type":"ProfessionalService"'), "homepage: organization JSON-LD missing");
} catch (error) {
  failures.push(`homepage security/schema checks: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const robots = await fetchRelease("/robots.txt");
  const text = await robots.text();
  check(robots.status === 200, `robots.txt: expected 200, got ${robots.status}`);
  check(/Disallow:\s*\/api\//i.test(text), "robots.txt: /api/ is not disallowed");
  check(!/Disallow:\s*\/\s*$/im.test(text), "robots.txt: production site is globally disallowed");
  check(text.includes(`${canonicalOrigin}/sitemap.xml`), "robots.txt: canonical sitemap URL missing");
} catch (error) {
  failures.push(`robots.txt: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const sitemap = await fetchRelease("/sitemap.xml");
  const xml = await sitemap.text();
  check(sitemap.status === 200, `sitemap.xml: expected 200, got ${sitemap.status}`);
  const sitemapPaths = new Set(
    [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((match) => {
        try {
          return normalizePathname(new URL(match[1]).pathname);
        } catch {
          return null;
        }
      })
      .filter(Boolean),
  );

  for (const pathname of publicPaths) {
    check(sitemapPaths.has(normalizePathname(pathname)), `sitemap.xml: missing ${pathname}`);
  }

  if (!state.blogIndexingEnabled) {
    check(![...sitemapPaths].some((pathname) => pathname === "/blog" || pathname.startsWith("/blog/")), "sitemap.xml: draft blog URLs leaked into sitemap");
  }
} catch (error) {
  failures.push(`sitemap.xml: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const { response, html } = await getPage("/blog");
  check(response.status === 200, `/blog: expected 200, got ${response.status}`);
  const robots = findTag(html, "meta", (a) => a.name?.toLowerCase() === "robots");
  if (state.blogIndexingEnabled) {
    check(!robots?.content?.toLowerCase().includes("noindex"), "/blog: indexing enabled but page is noindex");
  } else {
    check(robots?.content?.toLowerCase().includes("noindex"), "/blog: draft gate active but page is not noindex");
  }

  const firstPost = state.blogPostSlugs[0];
  if (firstPost) {
    const post = await getPage(`/blog/${firstPost}`);
    const postRobots = findTag(post.html, "meta", (a) => a.name?.toLowerCase() === "robots");
    if (!state.blogIndexingEnabled) {
      check(postRobots?.content?.toLowerCase().includes("noindex"), `/blog/${firstPost}: draft article is not noindex`);
    }
  }
} catch (error) {
  failures.push(`blog indexing checks: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const missing = await fetchRelease("/__brandspace_release_check_missing__");
  check(missing.status === 404, `404 route: expected 404, got ${missing.status}`);
} catch (error) {
  failures.push(`404 route: ${error instanceof Error ? error.message : String(error)}`);
}

for (const asset of [
  ["/brand/brandspace-logo.png", "image/"],
  ["/og/brandspace-og.jpg", "image/"],
]) {
  try {
    const response = await fetchRelease(asset[0]);
    check(response.status === 200, `${asset[0]}: expected 200, got ${response.status}`);
    check((response.headers.get("content-type") ?? "").startsWith(asset[1]), `${asset[0]}: unexpected content type`);
  } catch (error) {
    failures.push(`${asset[0]}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const frame = await fetchRelease("/growth-city/desktop/frame_0001.webp");
  check(frame.status === 200, `Growth City frame: expected 200, got ${frame.status}`);
  const cache = frame.headers.get("cache-control") ?? "";
  check(cache.includes("immutable") && cache.includes("max-age=31536000"), "Growth City frame: immutable one-year cache header missing");
} catch (error) {
  failures.push(`Growth City cache check: ${error instanceof Error ? error.message : String(error)}`);
}

const sameOriginHeaders = { Origin: releaseOrigin, "Sec-Fetch-Site": "same-origin" };

try {
  const response = await fetchRelease("/api/contact", { method: "GET" });
  check(response.status === 405, `contact API GET: expected 405, got ${response.status}`);
  check((response.headers.get("cache-control") ?? "").includes("no-store"), "contact API GET: no-store header missing");
  check((response.headers.get("x-robots-tag") ?? "").includes("noindex"), "contact API GET: X-Robots-Tag noindex missing");
} catch (error) {
  failures.push(`contact API GET: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const response = await fetchRelease("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://example.invalid",
      "Sec-Fetch-Site": "cross-site",
    },
    body: "{}",
  });
  check(response.status === 403, `contact API cross-origin POST: expected 403, got ${response.status}`);
} catch (error) {
  failures.push(`contact API cross-origin POST: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const response = await fetchRelease("/api/contact", {
    method: "POST",
    headers: { ...sameOriginHeaders, "Content-Type": "text/plain" },
    body: "{}",
  });
  check(response.status === 415, `contact API content-type guard: expected 415, got ${response.status}`);
} catch (error) {
  failures.push(`contact API content-type guard: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const response = await fetchRelease("/api/contact", {
    method: "POST",
    headers: { ...sameOriginHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ oversized: "x".repeat(17 * 1024) }),
  });
  check(response.status === 413, `contact API body limit: expected 413, got ${response.status}`);
} catch (error) {
  failures.push(`contact API body limit: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const response = await fetchRelease("/api/contact", {
    method: "POST",
    headers: { ...sameOriginHeaders, "Content-Type": "application/json" },
    body: "{",
  });
  check(response.status === 400, `contact API malformed JSON: expected 400, got ${response.status}`);
} catch (error) {
  failures.push(`contact API malformed JSON: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const firstService = state.serviceSlugs[0];
  if (firstService) {
    const { html } = await getPage(`/services/${firstService}`);
    check(html.includes(`#service-${firstService}`), `service page: Service JSON-LD missing for ${firstService}`);
  }
} catch (error) {
  failures.push(`service schema check: ${error instanceof Error ? error.message : String(error)}`);
}

console.log(`[live] ${passed} checks passed`);

if (failures.length) {
  console.error(`\nLive release check failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[live] production release checks passed.");
