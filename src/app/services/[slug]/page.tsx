import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogCategories, blogPosts } from "@/data/blog";
import { projects } from "@/data/portfolio";
import { getService, services } from "@/data/services";
import { site } from "@/data/site";
import { breadcrumbSchema, pageMetadata, servicePageSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FinalCta } from "@/components/home/FinalCta";
import { WhatsAppButton } from "@/components/ui/Button";
import { ArrowUpRight, Check } from "@/components/ui/Icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return pageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedProjects = projects.filter((project) => project.services.includes(service.slug));
  const relatedPosts = site.blogIndexingEnabled
    ? blogPosts.filter((post) => service.insightCategories.includes(post.category)).slice(0, 3)
    : [];
  const otherServices = services.filter((item) => item.slug !== service.slug);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.shortName, path: `/services/${service.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={servicePageSchema(service)} />

      <PageHero
        crumbs={crumbs}
        eyebrow="BrandSpace service"
        title={service.name}
        intro={service.kicker}
      >
        <div className="mt-8">
          <WhatsAppButton
            variant="light"
            message={`Hi BrandSpace, I’m interested in ${service.name} and would like to discuss my business/project.`}
            label={`Talk to BrandSpace about ${service.name} on WhatsApp`}
          >
            Discuss this service
          </WhatsAppButton>
        </div>
      </PageHero>

      <section aria-labelledby="service-overview-title" className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-bs grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="01" tone="dark">
              The service
            </SectionLabel>
            <h2 id="service-overview-title" className="font-display-tight mt-6 text-[clamp(2.5rem,5vw,4.8rem)] font-semibold">
              Built to move a <span className="font-serif font-normal italic text-green-deep">business metric.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[1.15rem] leading-relaxed text-ink/75">{service.what}</p>
            <div className="mt-10 border-t border-ink/10 pt-8">
              <p className="eyebrow text-ink/60">Business outcome</p>
              <p className="mt-4 font-serif text-[clamp(1.7rem,3vw,2.7rem)] italic leading-snug text-ink">{service.outcome}</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="included-title" className="bg-ink py-24 text-paper sm:py-32">
        <div className="container-bs">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel index="02">What is included</SectionLabel>
              <h2 id="included-title" className="font-display-tight mt-6 text-[clamp(2.4rem,5vw,4.8rem)] font-semibold">
                The work behind the <span className="font-serif font-normal italic text-green">outcome.</span>
              </h2>
            </div>
            <ol className="border-t border-paper/10 lg:col-span-6 lg:col-start-7">
              {service.how.map((item, index) => (
                <li key={item} className="flex gap-5 border-b border-paper/10 py-6">
                  <span className="mt-0.5 text-xs font-semibold tabular-nums text-green">0{index + 1}</span>
                  <span className="text-lg leading-snug text-paper/80">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-20 grid gap-10 border-t border-paper/10 pt-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-paper/60">A strong fit for</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
              {service.bestFor.map((item) => (
                <li key={item} className="rounded-[8px] border border-paper/10 p-6 text-paper/75">
                  <Check size={17} className="mb-5 text-green" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section aria-labelledby="service-work-title" className="bg-paper py-24 text-ink sm:py-32">
          <div className="container-bs">
            <SectionLabel index="03" tone="dark">
              Relevant work
            </SectionLabel>
            <h2 id="service-work-title" className="font-display-tight mt-6 text-[clamp(2.5rem,5vw,4.8rem)] font-semibold">
              See the service in <span className="font-serif font-normal italic text-green-deep">context.</span>
            </h2>
            <div className="mt-14 grid gap-px overflow-hidden rounded-[8px] bg-ink/10 lg:grid-cols-2">
              {relatedProjects.map((project) => (
                <article key={project.slug} className="group bg-paper p-7 sm:p-9">
                  <p className="eyebrow text-ink/60">{project.industry} · {project.location}</p>
                  <h3 className="font-display mt-5 text-3xl font-semibold tracking-[-0.03em]">
                    <Link href={`/portfolio/${project.slug}`} className="transition-colors hover:text-green-deep">
                      {project.name}
                    </Link>
                  </h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-ink/65">{project.summary}</p>
                  <Link href={`/portfolio/${project.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-green-deep">
                    Read case study
                    <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section aria-labelledby="service-insights-title" className="bg-ink-2 py-24 text-paper sm:py-32">
          <div className="container-bs">
            <SectionLabel index="04">Related insights</SectionLabel>
            <h2 id="service-insights-title" className="font-display-tight mt-6 text-[clamp(2.4rem,5vw,4.6rem)] font-semibold">
              Understand the <span className="font-serif font-normal italic text-green">thinking.</span>
            </h2>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {relatedPosts.map((post) => {
                const category = blogCategories.find((item) => item.slug === post.category);
                return (
                  <article key={post.slug} className="rounded-[8px] border border-paper/10 p-7">
                    <p className="eyebrow text-green">{category?.name ?? post.category}</p>
                    <h3 className="font-display mt-5 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                      <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-green">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-paper/60">{post.excerpt}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="other-services-title" className="bg-paper py-20 text-ink sm:py-24">
        <div className="container-bs">
          <p id="other-services-title" className="eyebrow text-ink/60">Other BrandSpace services</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {otherServices.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold transition-colors hover:border-green-deep hover:text-green-deep"
              >
                {item.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title={`Ready to make\\n${service.shortName.toLowerCase()} *work harder?*`}
        body={`Tell us what your business needs from ${service.shortName.toLowerCase()}. We’ll recommend a practical scope tied to the outcome, not a pile of deliverables.`}
      />
    </>
  );
}
