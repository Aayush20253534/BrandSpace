# BrandSpace — Future of Business Growth

The website for **BrandSpace**, a digital growth agency in Prayagraj offering Web Development + SEO,
Social Media Management, Meta Ads, Google Business Profile Optimization and Digital Branding.

Built with **Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · GSAP · Lenis**.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Growth City cinematic hero → Services → Selected Work → Editorial break → Why BrandSpace → Results → Process → Insights → Client Feedback → CTA |
| `/portfolio`, `/portfolio/[slug]` | Case-study portfolio (6 projects) with full case study pages |
| `/about` | Story, vision, mission, philosophy, approach, difference, **Meet the Founding Team** |
| `/blog`, `/blog/[slug]`, `/blog/category/[category]` | Markdown blog with categories, TOC, related articles, sharing |
| `/contact` | Conversion-focused contact page with validated project-brief form |
| `/privacy-policy`, `/terms` | Legal templates (have them reviewed before launch) |

All pages are statically generated except `POST /api/contact`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build && npm start
```

## Editing content

Presentation components never hard-code business content. Edit these files:

| File | Controls |
| --- | --- |
| `src/data/site.ts` | Name, tagline, email, phone, WhatsApp number & message, address, social links, site URL |
| `src/data/services.ts` | The five services (what / how / outcome) |
| `src/data/portfolio.ts` | Projects, screenshots, metrics, narratives |
| `src/data/testimonials.ts` | Client feedback & reviewer photos |
| `src/data/team.ts` | Founders: roles, bios, portraits |
| `src/data/approach.ts` | Why-BrandSpace pillars and the 6-step process |
| `src/data/blog.ts` + `src/content/blog/*.md` | Blog index/metadata + article bodies (Markdown) |
| `src/lib/images.ts` | Editorial photography (blog covers, homepage editorial break) and photo credits |
| `src/data/growthCity.ts` | Growth City scene copy, scene ranges and the footage pacing timeline |

### ⚠️ Placeholder content to replace before launch

These are **temporary design placeholders**. Each record carries `status: "placeholder"` and the UI
shows a discreet "illustrative" note beside it until you switch the record to `"verified"`:

- **Portfolio metrics** (Revenue Growth, ROAS, Lead/Conversion Growth), `src/data/portfolio.ts`
- **Testimonials**: quotes, reviewer names, roles and photos, `src/data/testimonials.ts`
- **Founder roles, bios and portraits**: `src/data/team.ts`. Add 4:5 photos to `/public/team/`
  and set `photo`. Until then, editorial monogram portraits are rendered.
- **Case-study narratives** (challenge/approach) and the **services delivered** per project
- **Blog articles** are launch drafts attributed to founders; review before publishing.
- **Social profiles**: add URLs in `site.socials`; empty entries are hidden.

Set `flagPlaceholderContent: false` in `site.ts` only once everything has been replaced.

## WhatsApp conversion

Primary CTAs ("Let's Grow", "Start Growing", "Start Your Project", "Talk to BrandSpace") open
`https://wa.me/919454509113` in a new tab with a pre-filled message. On phones this opens the
WhatsApp app. Change the number or message in `src/data/site.ts`.

## Contact form

Client and server share one zod schema (`src/lib/contact.ts`). Protection: honeypot field, minimum
fill time, per-IP rate limiting and optional Cloudflare Turnstile. Configure delivery with
environment variables:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Send enquiries by email via Resend |
| `CONTACT_FROM_EMAIL` | Verified sender, e.g. `BrandSpace Website <hello@yourdomain>` |
| `CONTACT_TO_EMAIL` | Recipient (defaults to brandspace.contact@gmail.com) |
| `CONTACT_WEBHOOK_URL` | Alternative: POST enquiries as JSON (Make, Zapier, Slack, Sheets…) |
| `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Enable Cloudflare Turnstile |

Without a delivery method, development logs the enquiry. Production returns a friendly error that
points visitors to WhatsApp and email, so enquiries are never silently lost.

## SEO

- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards (`src/lib/seo.ts`)
- JSON-LD: Organization, ProfessionalService (LocalBusiness), WebSite, BreadcrumbList, BlogPosting,
  Blog, CreativeWork (case studies), AboutPage, ContactPage
- `sitemap.xml`, `robots.txt`, web manifest, app icons, default OG image (`/public/og`)
- **Set `NEXT_PUBLIC_SITE_URL`** (e.g. `https://www.yourdomain.com`) in production. On Vercel it
  falls back to the project's production domain automatically.

## The Growth City hero

See **[docs/growth-city.md](docs/growth-city.md)**: how the scroll story works, the code-rendered
city, and the exact Higgsfield prompts, credit budget and import script for cinematic footage.

## Asset scripts

| Script | Does |
| --- | --- |
| `node scripts/process-logo.mjs` | Cuts the supplied logo (`assets/source/brandspace-logo.jpg`) to a transparent PNG/WebP + app icons |
| `node scripts/process-portfolio.mjs [slug …]` | Optimises portfolio screenshots from `assets/source/` into 1600×900 WebP (optional per-project crop) |
| `node scripts/generate-og.mjs` | Renders the default social share image (needs Chromium) |
| `node scripts/growth-city-frames.mjs` | Converts Higgsfield clips into Growth City frame sequences (needs ffmpeg) |

## Editorial photography

Blog covers and the homepage editorial break use real, topic-matched photography from
[Unsplash](https://unsplash.com/license) (free to use under the Unsplash License), defined in
`src/lib/images.ts` with alt text, art-directed framing (`position`) and a photographer credit
(shown under each article's hero image). Photos render through `<Photo>`
(`src/components/ui/Photo.tsx`), which asks Unsplash's CDN for exactly the width each `srcset` entry
needs; `next.config.ts` also allows those URLs in `images.remotePatterns`. A light BrandSpace grade
(tint, soft floor shadow, corner grid) is applied in CSS by `<Cover>` and eases off on hover.

To change a cover, pick a free (non-Unsplash+) photo, copy its `photo-…` id and update the
`unsplash(id, alt, credit, position)` call in `src/data/blog.ts`.

## Accessibility & motion

Semantic landmarks, skip link, one `h1` per page, labelled controls, focus-visible styles,
keyboard-operable menu (focus trap, Escape), WCAG AA text contrast (verified with axe-core), and
`prefers-reduced-motion` support throughout: smooth scrolling, reveals and the cinematic hero all
fall back to static presentations.

### Motion building blocks

| Piece | Use |
| --- | --- |
| `data-reveal="up / fade / words / clip / line"` | CSS reveals toggled by `<InViewObserver>` (no JS per element) |
| `data-center` | Gets `data-active` while crossing the middle of the viewport (e.g. Results rows) |
| `data-fx="parallax / zoom / drift / progress"` | Scroll-linked GSAP ScrollTrigger effects from `<ScrollFx>`; `data-fx-media` (`md` or `lg`) limits them by breakpoint |
| `HorizontalScroll` | Selected Work; panels opt into `data-hs-panel`, `data-hs-scale`, `data-hs-ghost` |

Everything is skipped for `prefers-reduced-motion`, and all ScrollTriggers are killed when their
elements leave the page.
