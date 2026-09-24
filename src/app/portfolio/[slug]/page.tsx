import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { displayUrl, getProject, projects } from "@/data/portfolio";
import { services } from "@/data/services";
import { getTestimonial } from "@/data/testimonials";
import { breadcrumbSchema, caseStudySchema, pageMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { RevealText } from "@/components/motion/RevealText";
import { BrowserFrame } from "@/components/portfolio/BrowserFrame";
import { MetricsRow } from "@/components/portfolio/MetricsRow";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Avatar } from "@/components/ui/Avatar";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { WhatsAppButton } from "@/components/ui/Button";
import { ArrowUpRight, Check } from "@/components/ui/Icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.name} Case Study — ${p.industry}`,
    description: `${p.summary} How BrandSpace helped ${p.name} (${p.location}) with ${p.services
      .map((s) => services.find((x) => x.slug === s)?.name)
      .filter(Boolean)
      .join(", ")}.`,
    path: `/portfolio/${p.slug}`,
    image: p.preview ? { url: p.preview.src, width: 1600, height: 900, alt: p.preview.alt } : undefined,
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projects.indexOf(p);
  const next = projects[(index + 1) % projects.length]!;
  const testimonial = getTestimonial(p.testimonialId);
  const serviceList = p.services.map((s) => services.find((x) => x.slug === s)).filter((s) => s !== undefined);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: p.name, path: `/portfolio/${p.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={caseStudySchema({
          name: p.name,
          description: p.overview,
          path: `/portfolio/${p.slug}`,
          image: p.preview?.src,
          clientUrl: p.url,
          year: p.year,
          services: serviceList.map((s) => s.name),
        })}
      />

      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink pt-[calc(var(--header-h)+3.5rem)] text-paper sm:pt-[calc(var(--header-h)+5rem)]">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full blur-3xl" style={{ background: `${p.palette.accent}18` }} />
        <div className="container-bs relative z-[2]">
          <Breadcrumbs items={crumbs} />
          <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p data-reveal="up" className="eyebrow flex items-center gap-3 text-paper/55">
                <span className="text-green">Case {pad2(index + 1)}</span>
                <span className="h-px w-8 bg-paper/20" aria-hidden />
                {p.industry}
              </p>
              <RevealText as="h1" text={p.name} className="font-display-tight mt-5 text-[clamp(3.4rem,10vw,9.5rem)] font-semibold" />
              <p data-reveal="up" className="mt-6 max-w-2xl font-serif text-[clamp(1.5rem,2.6vw,2.3rem)] italic leading-snug text-paper/85">
                {p.summary}
              </p>
            </div>
            <dl data-reveal="up" className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm lg:col-span-4">
              <div>
                <dt className="eyebrow text-paper/40">Location</dt>
                <dd className="mt-1.5 text-paper/85">{p.location}</dd>
              </div>
              <div>
                <dt className="eyebrow text-paper/40">Year</dt>
                <dd className="mt-1.5 text-paper/85">{p.year}</dd>
              </div>
              <div className="col-span-2">
                <dt className="eyebrow text-paper/40">Services</dt>
                <dd className="mt-1.5 text-paper/85">{serviceList.map((s) => s.name).join(" · ")}</dd>
              </div>
              <div className="col-span-2">
                <dt className="eyebrow text-paper/40">Live site</dt>
                <dd className="mt-1.5">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-green hover:text-green-bright">
                    {displayUrl(p.url)}
                    <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="relative mt-16 sm:mt-20">
            <div data-reveal="clip" className="relative z-[1]">
              <BrowserFrame project={p} priority sizes="(min-width: 1536px) 1480px, 100vw" />
            </div>
          </div>
        </div>
        <div className="h-20 sm:h-28" />
      </section>

      {/* Brief & challenge */}
      <section aria-labelledby="brief-title" className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-bs grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="01" tone="dark">
              The brief
            </SectionLabel>
          </div>
          <div className="lg:col-span-8">
            <h2 id="brief-title" data-reveal="up" className="font-display text-[clamp(1.7rem,3vw,2.7rem)] font-medium leading-[1.2] tracking-[-0.025em]">
              {p.overview}
            </h2>
            <div className="mt-14 grid gap-10 border-t border-ink/10 pt-10 sm:grid-cols-2">
              <div data-reveal="up">
                <h3 className="eyebrow text-ink/45">The challenge</h3>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/75">{p.challenge}</p>
              </div>
              <div data-reveal="up">
                <h3 className="eyebrow text-ink/45">What we delivered</h3>
                <ul className="mt-4 space-y-2.5">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[1.02rem] leading-snug text-ink/80">
                      <Check size={17} className="mt-0.5 shrink-0 text-green-deep" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section aria-labelledby="impact-title" className="bg-ink py-24 text-paper sm:py-32">
        <div className="container-bs">
          <SectionLabel index="02">Impact</SectionLabel>
          <RevealText id="impact-title" as="h2" text={"The numbers that *matter.*"} className="font-display-tight mt-6 text-[clamp(2.5rem,5.4vw,5rem)] font-semibold" />
          <div className="mt-14 sm:mt-20">
            <MetricsRow project={p} />
          </div>
        </div>
      </section>

      {/* Approach */}
      <section aria-labelledby="approach-title" className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-bs">
          <SectionLabel index="03" tone="dark">
            Approach
          </SectionLabel>
          <RevealText
            id="approach-title"
            as="h2"
            text={"How we *built it.*"}
            className="font-display-tight mt-6 text-[clamp(2.5rem,5.4vw,5rem)] font-semibold"
            accentClassName="font-serif italic font-normal tracking-[-0.02em] text-green-deep"
          />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[8px] bg-ink/10 sm:mt-20 lg:grid-cols-3">
            {p.approach.map((a, i) => (
              <li key={a.title} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 90}ms` }} className="bg-paper p-8 sm:p-10">
                <span className="font-display-tight text-6xl font-semibold text-green-deep">{pad2(i + 1)}</span>
                <h3 className="mt-8 font-display text-2xl font-semibold tracking-[-0.02em]">{a.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/70">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Visual details — only when real screenshots exist */}
      {p.preview && (
        <section aria-label="Design details" className="bg-ink py-24 text-paper sm:py-32">
          <div className="container-bs grid gap-6 md:grid-cols-12">
            <div data-reveal="clip" className="md:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] ring-1 ring-paper/10">
                <Image
                  src={p.preview.src}
                  alt={`Detail of the ${p.name} homepage hero`}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="rv-zoom object-cover object-left-top"
                  style={{ transformOrigin: "left top" }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6 md:col-span-5">
              <div data-reveal="clip" className="flex-1">
                <div className="relative h-full min-h-[14rem] overflow-hidden rounded-[10px] ring-1 ring-paper/10">
                  <Image src={p.preview.src} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="rv-zoom scale-[1.25] object-cover object-right" />
                </div>
              </div>
              <div data-reveal="up" className="rounded-[10px] bg-ink-3 p-6 ring-1 ring-paper/10">
                <p className="eyebrow text-paper/45">Visual language</p>
                <div className="mt-5 flex gap-3">
                  {[p.palette.bg, p.palette.fg, p.palette.accent].map((c) => (
                    <span key={c} className="flex flex-1 flex-col gap-2">
                      <span className="h-16 rounded-[6px] ring-1 ring-paper/15" style={{ background: c }} />
                      <span className="text-[0.7rem] uppercase tracking-[0.12em] text-paper/50">{c}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {testimonial && (
        <section aria-label="Client feedback" className="bg-paper py-24 text-ink sm:py-32">
          <figure className="container-bs max-w-5xl">
            <SectionLabel index="04" tone="dark">
              Client feedback
            </SectionLabel>
            <blockquote data-reveal="up" className="mt-10 font-serif text-[clamp(1.8rem,3.8vw,3.4rem)] italic leading-[1.18] text-ink">
              <span className="text-green-deep">“</span>
              {testimonial.quote}
              <span className="text-green-deep">”</span>
            </blockquote>
            <figcaption data-reveal="up" className="mt-10 flex items-center gap-4">
              <Avatar name={testimonial.name} photo={testimonial.photo} size={64} />
              <span>
                <span className="block font-display text-lg font-semibold">{testimonial.name}</span>
                <span className="block text-sm text-ink/55">
                  {testimonial.role}, {testimonial.company}
                </span>
              </span>
            </figcaption>
            <PlaceholderNote status={testimonial.status} tone="dark" className="mt-8">
              Sample testimonial for layout — to be replaced with approved client feedback.
            </PlaceholderNote>
          </figure>
        </section>
      )}

      {/* CTA + next project */}
      <section aria-label="Next steps" className="bg-ink text-paper">
        <div className="container-bs grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow text-paper/50">Like what you see?</p>
            <p className="font-display-tight mt-5 text-[clamp(2.4rem,5vw,4.6rem)] font-semibold">
              Let’s build yours <span className="font-serif font-normal italic text-green">next.</span>
            </p>
            <div className="mt-10">
              <WhatsAppButton
                size="lg"
                message={`Hi BrandSpace, I saw your work for ${p.name} and I’m interested in your services. I’d like to discuss my business/project.`}
              >
                Start Your Project
              </WhatsAppButton>
            </div>
          </div>
          <Link
            href={`/portfolio/${next.slug}`}
            className="group block border-t border-paper/10 pt-8 lg:col-span-5 lg:col-start-8"
            data-cursor="Next case"
          >
            <span className="eyebrow text-paper/45">Next project</span>
            <span className="mt-3 flex items-center justify-between gap-6">
              <span className="font-display-tight text-[clamp(2.2rem,4vw,3.6rem)] font-semibold transition-colors group-hover:text-green">
                {next.name}
              </span>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-paper/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-green group-hover:bg-green group-hover:text-ink">
                <ArrowUpRight size={22} />
              </span>
            </span>
            <span className="mt-2 block text-paper/50">{next.summary}</span>
          </Link>
        </div>
      </section>
    </>
  );
}
