import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import { absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FinalCta } from "@/components/home/FinalCta";
import { ArrowUpRight } from "@/components/ui/Icons";

export const metadata: Metadata = pageMetadata({
  title: "Digital Growth Services in Prayagraj",
  description:
    "BrandSpace services for businesses in Prayagraj and across India: web development and SEO, social media management, Meta ads, Google Business Profile optimization and digital branding.",
  path: "/services",
  keywords: [
    "digital marketing agency Prayagraj",
    "web development Prayagraj",
    "SEO Prayagraj",
    "social media management Prayagraj",
    "Meta Ads Prayagraj",
    "branding agency Prayagraj",
  ],
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "BrandSpace digital growth services",
          itemListElement: services.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: service.name,
            url: absoluteUrl(`/services/${service.slug}`),
          })),
        }}
      />

      <PageHero
        crumbs={crumbs}
        eyebrow="Services"
        title={"Five disciplines.\\n*One growth system.*"}
        intro="BrandSpace combines web, search, social, paid acquisition and brand identity so each channel strengthens the others. Start with the discipline your business needs now, then connect the rest when it makes sense."
      />

      <section aria-labelledby="services-list-title" className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-bs">
          <SectionLabel index="01" tone="dark">
            What we do
          </SectionLabel>
          <h2 id="services-list-title" className="font-display-tight mt-6 max-w-4xl text-[clamp(2.6rem,5.6vw,5.4rem)] font-semibold">
            Built around the <span className="font-serif font-normal italic text-green-deep">business outcome.</span>
          </h2>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[10px] bg-ink/10 lg:mt-20 lg:grid-cols-2">
            {services.map((service, index) => (
              <article key={service.slug} className="group bg-paper p-7 sm:p-10">
                <p className="text-xs font-semibold tabular-nums text-green-deep">0{index + 1}</p>
                <h3 className="font-display mt-6 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold tracking-[-0.03em]">
                  <Link href={`/services/${service.slug}`} className="transition-colors hover:text-green-deep">
                    {service.name}
                  </Link>
                </h3>
                <p className="mt-3 font-serif text-xl italic text-ink/75">{service.kicker}</p>
                <p className="mt-6 max-w-xl leading-relaxed text-ink/70">{service.what}</p>
                <p className="mt-6 border-t border-ink/10 pt-5 text-sm leading-relaxed text-ink/65">
                  <span className="font-semibold text-ink">Outcome:</span> {service.outcome}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-8 inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-green-deep"
                >
                  Explore service
                  <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title={"Build the right\\ngrowth *system.*"}
        body="Tell us where growth is getting stuck. We’ll recommend the smallest useful combination of services rather than selling you channels you do not need."
      />
    </>
  );
}
