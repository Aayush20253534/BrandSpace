# BrandSpace SEO — Remaining Action Plan

**Site:** https://brandspaces.in  
**Audit date:** 25 September 2026  
**Codebase:** `Aayush20253534/BrandSpace`  
**Branch:** `claude/brandspace-website-build-3g7vaw`  
**Audit baseline:** Part 7 (`b97367a`) plus the local canonical-normalization verifier fix  
**Production verification:** 146 live checks passed

---

## 1. Current status

The major **code-side SEO foundation is complete**.

Already implemented:

- Canonical URLs and production-domain protection
- `robots.txt`
- XML sitemap
- Draft-blog indexing gate
- Unique metadata for primary pages
- Open Graph / Twitter metadata
- Organization / ProfessionalService structured data
- Service structured data
- Breadcrumb structured data
- Article and case-study structured data
- `/services` hub and five indexable service pages
- Internal linking between services and relevant case studies
- Absolute portfolio URLs in structured data
- Verified-only testimonials and metrics
- Founder-detail verification gate
- Security headers
- Contact API hardening
- Core Web Vitals / Growth City performance work
- Performance and security CI checks
- Production release verifier
- Live-domain release verifier
- 404, canonical, sitemap, robots and live security verification

**Do not spend more time repeatedly rewriting title tags, adding meta-keywords, or generating dozens of location pages.** The next SEO gains will come mainly from publishing trustworthy content, building real authority, strengthening local signals, and measuring results.

---

# P0 — Do these before treating SEO as fully launched

## 2. Finish the current deployment housekeeping

### 2.1 Commit and push the canonical verifier fix

```powershell
git add .
git commit -m "fix: normalize canonical URL in release verification"
git push origin claude/brandspace-website-build-3g7vaw
```

After the deployment completes:

```powershell
$env:RELEASE_URL="https://brandspaces.in"
npm run release:check:live
```

Expected:

```text
[live] 146 checks passed
[live] production release checks passed.
```

---

## 3. Fix the Turnstile contact-form problem

This is technically a conversion issue rather than a ranking issue, but organic traffic is useless if leads cannot submit the form.

Verify in Cloudflare Turnstile:

- The **site key and secret key come from the same widget**
- `brandspaces.in` is an allowed hostname
- The widget is intended for the production site

Verify in Vercel:

```text
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

After changing `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, **redeploy**, because public environment variables are embedded in the client build.

Recommended code follow-up:

- Log safe Turnstile diagnostics in Vercel:
  - `error-codes`
  - `hostname`
  - `action`
- Never log the Turnstile token or secret.

---

# P0 — Google Search Console

## 4. Submit the production sitemap

In Google Search Console, submit:

```text
https://brandspaces.in/sitemap.xml
```

The sitemap already contains only URLs intended for indexing.

Do not submit draft blog URLs separately while:

```ts
blogIndexingEnabled: false
```

---

## 5. Inspect and request indexing for the important pages

Use **URL Inspection → Test Live URL → Request Indexing** for the important pages after the final deployment.

Start with:

```text
https://brandspaces.in/
https://brandspaces.in/services
https://brandspaces.in/services/web-development-seo
https://brandspaces.in/services/social-media-management
https://brandspaces.in/services/meta-ads
https://brandspaces.in/services/google-business-profile-optimization
https://brandspaces.in/services/digital-branding
https://brandspaces.in/portfolio
https://brandspaces.in/about
https://brandspaces.in/contact
```

Then inspect all six case studies:

```text
/portfolio/casa-de-grande
/portfolio/bar-code
/portfolio/zobhunger
/portfolio/rovauto
/portfolio/lotus-family-dental
/portfolio/eclectic-dental-care
```

Do **not** request indexing for the blog until the articles are approved.

---

## 6. Check Search Console after indexing starts

Check Search Console approximately weekly during the launch period, then monthly.

Monitor:

- Indexed vs excluded pages
- Crawled, currently not indexed
- Duplicate/canonical issues
- Search queries
- Impressions
- Clicks
- CTR
- Average position
- Core Web Vitals
- Manual actions
- Security issues

Do not panic over daily ranking movement. New sites and newly changed sites take time to settle.

---

# P0 — Domain canonicalization

## 7. Make one hostname the permanent primary domain

Your canonical URLs use:

```text
https://brandspaces.in
```

But the site is also reachable as:

```text
https://www.brandspaces.in
```

In Vercel Domains, make:

```text
brandspaces.in
```

the primary production domain and configure:

```text
www.brandspaces.in
→ permanent redirect
→ brandspaces.in
```

Do not leave both versions independently accessible forever and rely only on canonical tags.

Also ensure:

```text
http://brandspaces.in
http://www.brandspaces.in
```

redirect to HTTPS.

---

# P0 — Validate the local-business identity

## 8. Confirm whether the IIHMF / MNNIT location is a legitimate public business address

The website currently publishes:

```text
IIHMF, MNNIT Allahabad
Prayagraj, Uttar Pradesh 211004
```

and uses it in BrandSpace entity/local structured data.

Before strengthening local SEO around it, confirm:

- BrandSpace is legitimately located there
- The business is permitted to publicly represent that address
- Customers can actually visit the location if you describe it as a customer-facing office
- The address matches how the business is represented elsewhere

If customers **do not** visit the office, treat BrandSpace as a **service-area business** in Google Business Profile rather than pretending it is a walk-in storefront.

This is more important than squeezing another keyword into an H1.

---

# P0 — Google Business Profile

## 9. Create/claim and verify BrandSpace's Google Business Profile

If BrandSpace is eligible, create or claim the profile and complete verification.

Use exactly the same core identity as the website:

```text
BrandSpace
https://brandspaces.in
+91 9454509113
```

Keep NAP information consistent everywhere.

### Complete the profile

Fill in:

- Correct primary category
- Relevant secondary categories
- Website
- Phone
- Address or service area, depending on eligibility
- Business description
- Services
- Opening/contact hours where appropriate
- Logo
- Cover image
- Real team/workspace/project photos
- Social profiles when available

Do not add categories merely because they contain attractive keywords.

---

## 10. Build a legitimate review process

Ask **real clients** for honest Google reviews after meaningful work has been delivered.

Good candidates are real BrandSpace clients where the relationship can be confirmed.

Do not:

- Buy reviews
- Offer discounts for positive reviews
- Create fake accounts
- Ask only for five-star reviews
- Write reviews on behalf of clients

Reply to reviews professionally, including negative ones.

---

# P0 — Replace remaining placeholder authority signals

## 11. Verify founder profiles

The code correctly suppresses detailed founder claims until approved.

For each founder, finalize:

- Correct full name
- Exact BrandSpace role
- 2–4 sentence factual biography
- Real focus areas
- Professional portrait
- LinkedIn URL
- Other genuine public profile URLs if useful

Then change that founder's:

```ts
status: "placeholder"
```

to:

```ts
status: "verified"
```

Do this only after the person approves the profile.

---

## 12. Add BrandSpace social profiles

`site.ts` currently leaves social-profile URLs empty.

Create/complete real BrandSpace profiles such as:

- LinkedIn
- Instagram
- Facebook
- X only if BrandSpace genuinely plans to use it

Then populate the real URLs in:

```text
src/data/site.ts
```

This will automatically strengthen the entity's `sameAs` relationships instead of inventing social profiles in schema.

Use consistent:

- Brand name
- Logo
- Website
- Phone
- Description
- Address/service area where appropriate

---

## 13. Replace placeholder testimonials

All current testimonials are intentionally marked as placeholders and therefore are not published as verified proof.

For each real testimonial:

1. Get written client approval.
2. Use the client's real wording or an explicitly approved edited version.
3. Confirm name, company and role.
4. Add a real portrait only with permission.
5. Set:

```ts
status: "verified"
```

Never publish the current sample testimonials as if clients actually said them.

---

## 14. Replace placeholder performance metrics

The case-study metrics are also correctly hidden until verified.

For each project, obtain real evidence for metrics such as:

- Leads
- Enquiries
- Bookings
- Revenue
- Conversion rate
- Organic traffic
- Local search visibility
- Ad ROAS

Record:

- Measurement period
- Baseline period
- Data source
- What changed
- Any limitations

Then update the case study and set:

```ts
metrics.status = "verified"
```

Real evidence will do more for authority and conversions than decorative percentages ever could.

---

# P1 — Publish the blog properly

## 15. Editorially review all eight draft articles

The current blog is intentionally:

```ts
blogIndexingEnabled: false
```

This is correct.

Before enabling indexing, review every article for:

- Factual accuracy
- Original analysis
- Real BrandSpace experience
- Useful examples
- Sources where claims need support
- Correct author attribution
- Grammar and readability
- No invented statistics
- No generic AI filler
- No claims that BrandSpace cannot substantiate
- Updated screenshots/examples where useful

Current draft topics include:

- Google Business Profile optimization
- Website speed/conversion
- Local SEO
- Meta Ads
- Brand identity
- Social media systems
- Marketing funnels
- Digital growth flywheel

---

## 16. Make articles demonstrate first-hand experience

Before publishing, add details that only someone doing the work would know.

Examples:

- Screenshots from actual BrandSpace projects
- Before/after website examples
- Search Console screenshots with client permission
- Core Web Vitals improvements
- Real local SEO observations
- Ad-testing methodology
- Lessons from a project
- Original checklists/templates
- Mistakes BrandSpace encountered and fixed

Google's current guidance strongly favors useful, original, people-first content rather than mass-produced search-engine-first pages.

---

## 17. Verify authors before indexing articles

Every blog post already has an author relationship.

Before publication:

- Confirm the correct founder actually owns/reviews the article
- Finalize that founder's bio
- Add a real profile/portrait
- Link the byline to useful information about the author

Do not publish a detailed SEO article under a founder's name merely because the data file currently assigns it to them.

---

## 18. Enable blog indexing only after approval

When the articles are ready:

```ts
blogIndexingEnabled: true
```

Then run:

```powershell
npm run release:verify
```

Deploy.

Then:

```powershell
$env:RELEASE_URL="https://brandspaces.in"
npm run release:check:live
```

After the live check passes, resubmit the sitemap in Search Console and inspect the most important articles.

### Better long-term option

If BrandSpace wants to publish articles gradually, change the blog system later from one global switch to per-article states such as:

```ts
status: "draft" | "published"
```

Then only published articles should:

- enter the sitemap
- appear in public blog listings
- be indexable
- generate article structured data

---

# P1 — Upgrade case studies into authority assets

## 19. Get client approval for every case-study narrative

`src/data/portfolio.ts` explicitly notes that some challenge/approach copy is still draft.

Get confirmation from each client on:

- Business description
- Problem/challenge
- Work performed
- Results
- Screenshots
- Brand usage
- Testimonial
- Metrics

The strongest SEO case studies are evidence, not agency fiction wearing a nice font.

---

## 20. Replace temporary project URLs with final client domains

Where projects eventually move from Vercel preview URLs to production custom domains, update the portfolio data.

For example, prefer a client's permanent production domain over:

```text
*.vercel.app
```

when the final public domain exists and is stable.

Keep only genuine live client URLs.

---

## 21. Add deeper evidence to important case studies

For the strongest projects, add:

- Project timeline
- Services actually delivered
- Technical stack where relevant
- Before/after screenshots
- Performance measurements
- Search/SEO improvements
- Conversion improvements
- Client-approved outcome data
- A short methodology section

Prioritize a few excellent case studies over many shallow ones.

---

# P1 — Build real external authority

## 22. Earn links from real relationships

Good backlink opportunities for BrandSpace include:

- Client project/credits pages
- Client announcements about launches
- Partner websites
- Founder profiles
- Local entrepreneurship communities
- MNNIT / alumni / startup ecosystem coverage where legitimately available
- Local business publications
- Podcasts/interviews
- Event sponsorship or speaker pages
- Useful guest contributions to relevant publications

### Client attribution links

A genuine, client-approved:

```text
Website by BrandSpace
```

or contextual project-credit link can be useful.

However, do **not** turn every client footer into a mass-distributed, keyword-rich SEO link network.

Avoid anchors such as:

```text
Best SEO Agency in Prayagraj
Best Website Development Company Prayagraj
```

repeated across sites.

Use natural branded attribution when it genuinely belongs there.

If a link is paid/sponsored or contractually required primarily as promotion, qualify it appropriately rather than trying to pass ranking credit.

---

## 23. Finish the planned BrandSpace backlinks carefully

You previously considered links from projects such as:

- CASA
- Barcode
- Style Club
- ZOBHUNGR

If the clients approve attribution:

- Use BrandSpace-branded anchor text
- Link to `https://brandspaces.in`
- Keep the link natural and visible
- Do not keyword-stuff it
- Do not create dozens of nearly identical partner/footer links solely for ranking purposes

Contextual case-study/launch links are preferable when available.

---

## 24. Build accurate local citations

Create or correct BrandSpace listings only on legitimate platforms relevant to the company/location.

Keep the same:

```text
Business name
Phone
Website
Address/service area
```

Avoid low-quality "submit to 500 directories" services. Those are mostly archaeological remains from worse eras of SEO.

---

# P1 — Measurement

## 25. Add analytics and conversion tracking

The audited codebase does **not currently show a GA4 or equivalent analytics integration**.

Add measurement before doing months of SEO and then discovering that everyone has opinions but nobody has data.

At minimum track:

### Organic acquisition

- Landing page
- Source / medium
- Organic sessions
- New users
- Engaged sessions

### Business conversions

- Successful contact form submission
- WhatsApp CTA click
- Phone click
- Email click
- Portfolio/case-study CTA click

### SEO landing-page conversions

Measure conversions separately for:

```text
/
/services/*
/portfolio/*
/blog/*
```

GA4 is fine. Privacy-friendly alternatives are also fine. The important part is consistent conversion measurement.

---

## 26. Connect Search Console and analytics reporting

Create one monthly report containing:

- Organic clicks
- Organic impressions
- CTR
- Top queries
- Top landing pages
- Leads from organic traffic
- WhatsApp conversions from organic
- Search visibility by service
- Core Web Vitals
- Indexed page count

SEO should ultimately be measured against qualified business outcomes, not screenshots of a keyword tool.

---

# P1 — Core Web Vitals in the real world

## 27. Monitor field data after traffic accumulates

The repository now has performance budgets, but Google's Core Web Vitals assessment uses real-world field data when available.

Monitor:

- LCP
- INP
- CLS

Use:

- Search Console Core Web Vitals
- PageSpeed Insights / CrUX
- Chrome UX Report once enough traffic exists

Pay particular attention to the homepage because of Growth City.

Do not chase a synthetic Lighthouse 100 at the expense of the cinematic design if real-user metrics are already healthy.

---

# P2 — Search-result appearance

## 28. Run Google's Rich Results Test manually

Test at least:

```text
/
 /services/web-development-seo
 /portfolio/casa-de-grande
```

Confirm Google can parse the structured data without critical errors.

The release checker proves that JSON-LD exists. Google's Rich Results Test confirms how Google's tooling interprets it.

---

## 29. Review titles and snippets using actual Search Console data

Do not blindly rewrite all titles now.

Once pages receive impressions:

- Find high-impression / low-CTR pages
- Compare the query with the title and description
- Improve only where the snippet does not match search intent
- Keep page titles accurate rather than clickbait-heavy

Google may rewrite titles/snippets, so evaluate actual SERP behavior instead of treating metadata like an exact advertisement renderer.

---

# P2 — Local relevance

## 30. Strengthen Prayagraj relevance naturally

BrandSpace already has useful Prayagraj context.

Add local evidence over time through:

- Real Prayagraj client case studies
- Local business examples
- Local events/projects
- Photos from actual work
- Local partnerships
- Google Business Profile activity
- Legitimate local mentions/links

Do not create pages like:

```text
/seo-agency-prayagraj
/seo-company-prayagraj
/best-seo-company-prayagraj
/top-seo-services-prayagraj
```

with substantially the same content.

The five current service pages are enough as the commercial foundation.

---

# P2 — Content expansion

## 31. Build topic clusters from real customer questions

Once the initial eight articles are approved, expand from questions clients actually ask.

Potential clusters:

### Web Development + SEO

- Website redesign checklist
- SEO migration checklist
- Core Web Vitals for local businesses
- What a good business website needs
- Choosing between template and custom development

### Google Business Profile / Local SEO

- Local ranking troubleshooting
- Review-generation process
- NAP consistency
- Service-area business setup
- Google Maps visibility case studies

### Meta Ads

- Lead-quality diagnosis
- Tracking setup
- Creative-testing framework
- When Meta Ads make sense
- Landing-page vs WhatsApp lead flows

### Social Media

- Content pillars
- Reels workflow
- Monthly content planning
- Measuring business outcomes rather than vanity metrics

### Branding

- Rebrand checklist
- Brand consistency
- Naming/positioning
- Website-brand alignment

Only publish a topic when BrandSpace can add useful first-hand insight.

---

# P2 — Image SEO

## 32. Continue replacing generic imagery with original project media

Where possible, use:

- Real screenshots
- Team photography
- Work-in-progress photos
- Client-approved campaign assets
- Brand-system examples

Keep:

- Descriptive alt text
- Accurate dimensions
- WebP/AVIF where appropriate
- Responsive image sizing
- Useful filenames

Do not stuff location/service keywords into every alt attribute.

---

# P2 — Brand/entity reinforcement

## 33. Keep company facts identical across the web

Use the same core facts across:

- Website
- Google Business Profile
- LinkedIn
- Instagram
- Client credits
- Directories
- Press mentions
- Founder profiles

Especially keep consistent:

```text
BrandSpace
https://brandspaces.in
+91 9454509113
brandspace.contact@gmail.com
```

Address/service-area information must also be consistent once the correct public-location strategy is decided.

---

# Monthly SEO operating routine

## Week 1

- Review Search Console performance
- Review indexation/exclusions
- Review GBP search queries and interactions
- Check contact/WhatsApp conversions

## Week 2

- Publish or materially improve one useful content asset
- Add internal links from relevant existing pages

## Week 3

- Obtain one real client review, testimonial, case-study approval, partner mention or editorial backlink opportunity
- Update one case study with stronger evidence

## Week 4

- Review Core Web Vitals
- Check broken links / 404s
- Run release verification if the site changed materially
- Compare organic traffic against enquiries, not only rankings

---

# Things BrandSpace should NOT do

Avoid:

- Buying backlink packages
- Automated directory blasts
- Fake Google reviews
- Fake testimonials
- Fake case-study metrics
- Publishing the draft blog just to increase page count
- Creating dozens of near-identical city pages
- Keyword stuffing headings, footers or alt text
- Repeated exact-match backlink anchors
- Changing article dates simply to appear fresh
- Generating large volumes of thin AI articles
- Obsessing over meta-keywords
- Adding review schema for reviews that are not genuine and eligible
- Claiming a customer-facing office where customers cannot actually visit

---

# Recommended execution order

| Priority | Task | Owner/action |
|---|---|---|
| 1 | Fix Turnstile form submission | Technical |
| 2 | Commit/push final Part 7 verifier fix | Technical |
| 3 | Force `www` → apex domain redirect | Vercel/DNS |
| 4 | Submit sitemap in Search Console | Manual |
| 5 | Request indexing for core pages | Manual |
| 6 | Confirm correct public address/service-area model | Business |
| 7 | Create/verify Google Business Profile | Manual |
| 8 | Add analytics + conversion events | Technical |
| 9 | Finalize real social profiles | Business |
| 10 | Verify founder profiles | Founders |
| 11 | Obtain real client testimonials | Client relations |
| 12 | Obtain verified case-study metrics | Analytics/client |
| 13 | Review all eight blog articles | Editorial |
| 14 | Enable blog indexing | Technical |
| 15 | Add client-approved backlinks/credits | Partnerships |
| 16 | Build legitimate local citations/mentions | Local SEO |
| 17 | Monitor Search Console + GBP monthly | Ongoing |
| 18 | Expand content from actual customer questions | Ongoing |

---

# Definition of “SEO launch complete”

BrandSpace can consider the first SEO launch complete when all of these are true:

- Final Part 7 fix is deployed
- Live release checker passes
- Contact form works in production
- `www` permanently redirects to the chosen canonical hostname
- Search Console sitemap is submitted and processed
- Core service pages are indexed
- Google Business Profile is verified and accurate
- Public business address/service-area strategy is truthful
- Analytics tracks organic leads and WhatsApp clicks
- Real founder information is verified
- Real social profiles are connected
- At least the strongest case studies have approved narratives
- Fake/sample testimonials and metrics remain hidden until replaced
- Blog articles are editorially approved before indexing
- BrandSpace has begun earning legitimate external mentions and reviews

At that point, the remaining work is not “technical SEO setup.” It is the ongoing work that actually moves rankings: **better proof, better content, stronger reputation, more legitimate mentions, and consistent measurement.**

---

# Official references

- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Search Console getting started: https://developers.google.com/search/docs/monitor-debug/search-console-start
- Sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google page experience / Core Web Vitals: https://developers.google.com/search/docs/appearance/page-experience
- Google Search spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google Business Profile local ranking: https://support.google.com/business/answer/7091
- Google Business Profile reviews: https://support.google.com/business/answer/3474122
