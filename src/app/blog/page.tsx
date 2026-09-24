import type { Metadata } from "next";
import { postsByDate } from "@/data/blog";
import { readingTime } from "@/lib/blog";
import { absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryNav } from "@/components/blog/CategoryNav";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = pageMetadata({
  title: "Blog — Web, SEO, Social & Growth Insights",
  description:
    "Practical guides on websites, SEO, Google Business Profile, Meta ads, social media, branding and business growth from the BrandSpace team in Prayagraj.",
  path: "/blog",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

export default function BlogPage() {
  const posts = postsByDate();
  const featured = posts.find((p) => p.featured) ?? posts[0]!;
  const rest = posts.filter((p) => p.slug !== featured.slug);

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "BrandSpace Blog",
          url: absoluteUrl("/blog"),
          blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/blog/${p.slug}`), datePublished: p.publishedAt })),
        }}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="The BrandSpace Blog"
        title={"Ideas for businesses that *want to grow.*"}
        intro="Straight-talking guides on websites, search, social, advertising and branding — written for business owners, not marketers."
      >
        <div className="mt-12">
          <CategoryNav />
        </div>
      </PageHero>

      <section aria-label="Featured article" className="bg-ink pb-20 text-paper sm:pb-28">
        <div className="container-bs">
          <h2 className="eyebrow mb-8 text-paper/45">Featured</h2>
          <PostCard post={featured} minutes={readingTime(featured.slug)} size="lg" eager />
        </div>
      </section>

      <section aria-labelledby="latest-title" className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-bs">
          <h2 id="latest-title" className="font-display-tight text-[clamp(2.4rem,5vw,4.4rem)] font-semibold">
            Latest articles
          </h2>
          <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} minutes={readingTime(p.slug)} tone="light" />
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title={"Rather talk it\n*through?*"}
        body="Every business is different. Tell us about yours and we’ll share practical ideas for your website, search, social and ads."
      />
    </>
  );
}
