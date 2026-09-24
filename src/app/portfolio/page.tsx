import type { Metadata } from "next";
import { projects } from "@/data/portfolio";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { PortfolioList } from "@/components/portfolio/PortfolioList";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio — Websites & Growth Case Studies",
  description:
    "Case studies from BrandSpace: websites, SEO, social media and Meta ads for hospitality, nightlife, automotive, workforce and healthcare brands in Prayagraj and across India.",
  path: "/portfolio",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/portfolio" },
];

export default function PortfolioPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "BrandSpace case studies",
          itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `/portfolio/${p.slug}`,
            name: p.name,
          })),
        }}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Portfolio"
        title={"Work that *moves the needle.*"}
        intro="Every project starts with a business problem, not a template. Here’s how we’ve helped hotels, venues, garages, clinics and workforce companies look better, get found and grow."
      />
      <section aria-label="Case studies" className="bg-ink pb-24 text-paper sm:pb-32">
        <div className="container-bs">
          <PortfolioList />
        </div>
      </section>
      <FinalCta
        title={"Your business\ncould be *next.*"}
        body="Tell us what you’re building. We’ll show you how a website, search, social and ads can work together for your business."
      />
    </>
  );
}
