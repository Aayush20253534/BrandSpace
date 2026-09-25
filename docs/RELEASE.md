# Production release verification

BrandSpace has two release gates.

## 1. Local/source release gate

Run before the final production deployment:

```powershell
npm run release:verify
```

This runs lint, TypeScript, performance budgets, source security checks, a production build, dependency audit, and the release source/build verifier.

The source verifier checks:

- canonical production origin
- route/build manifest coverage
- sitemap and robots indexing rules
- draft-blog noindex gate
- security headers and contact API controls
- critical logo, OG, portfolio, blog and Growth City assets
- service/project/blog/team/testimonial reference integrity
- verified-only metrics, testimonials and founder detail gates
- stale production-domain placeholders

## 2. Live production gate

After Vercel has deployed the commit:

```powershell
$env:RELEASE_URL="https://brandspaces.in"
npm run release:check:live
```

The live check is intentionally non-destructive. It verifies public route status, titles, descriptions, canonicals, sitemap/robots, JSON-LD, security headers, 404 behavior, critical assets and safe rejection paths on `/api/contact`.

It does **not** submit a real contact enquiry or consume a valid Turnstile token.

You can also run the GitHub Actions workflow **Production release check** manually and provide the deployed origin.

## Blog publication gate

`site.blogIndexingEnabled` remains `false` while launch articles are awaiting editorial approval. During that state:

- blog pages remain browsable
- blog pages must emit `noindex`
- blog URLs must stay out of the sitemap

After every article and author attribution is approved, change the flag to `true`, run `npm run release:verify`, deploy, then run the live release check again.

## Search Console handoff

After the production live gate passes:

1. Submit `https://brandspaces.in/sitemap.xml` in Google Search Console.
2. Inspect the home page, `/services`, priority service pages and important case studies.
3. Request indexing only for pages that are intended to be indexable.
4. Do not request indexing for blog pages while the editorial gate is disabled.
