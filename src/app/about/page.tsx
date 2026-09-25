import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { processSteps } from "@/data/approach";
import { aboutPageSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FoundingTeam } from "@/components/about/FoundingTeam";
import { AboutHeroVisual } from "@/components/ui/HeroVisuals";
import { FinalCta } from "@/components/home/FinalCta";
import { MapPin } from "@/components/ui/Icons";
import { TextLink } from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata({
  title: "About — Our Story, Mission & Founding Team",
  description:
    "Meet BrandSpace, a digital growth agency from Prayagraj. Our story, vision, mission and philosophy — and the founding team building websites, search, social and brands that grow businesses.",
  path: "/about",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const philosophy = [
  { title: "Clarity over noise", body: "If a customer can’t understand what you offer in five seconds, nothing else matters. We simplify before we decorate." },
  { title: "Craft over templates", body: "Your business isn’t generic, so your brand and website shouldn’t be either. Every project is designed from first principles." },
  { title: "Outcomes over output", body: "Posts, pages and campaigns are means, not ends. We measure success in enquiries, bookings and revenue." },
];

const difference = [
  ["Sell you a fixed package", "Start with your business model and goals"],
  ["Hand over a website and disappear", "Stay on to measure, learn and improve it"],
  ["Run each channel in its own silo", "Connect web, search, social and ads into one system"],
  ["Report likes, reach and impressions", "Report enquiries, bookings and revenue"],
  ["Recycle the same templates", "Design every brand and site from scratch"],
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={aboutPageSchema()} />

      <PageHero
        crumbs={crumbs}
        eyebrow="About BrandSpace"
        title={"We build the *space* businesses grow into."}
        intro="BrandSpace is a digital growth agency from Prayagraj. We help ambitious businesses look as good as they are, get found by the right people and turn attention into growth."
        visual={<AboutHeroVisual />}
      />

      {/* Story */}
      <section aria-labelledby="story-title" className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-bs grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="01" tone="dark">
              Our story
            </SectionLabel>
            <RevealText
              id="story-title"
              as="h2"
              text={"Great businesses deserve to be *found.*"}
              className="font-display-tight mt-6 text-[clamp(2.5rem,5vw,4.6rem)] font-semibold"
              accentClassName="font-serif italic font-normal tracking-[-0.02em] text-green-deep"
            />
          </div>
          <div className="space-y-6 text-[1.1rem] leading-relaxed text-ink/75 lg:col-span-6 lg:col-start-7">
            <p data-reveal="up" style={{ ["--rv-delay" as string]: "0ms" }}>
              BrandSpace began with a simple observation. Around us in Prayagraj were hotels, clinics, restaurants,
              garages and service companies doing genuinely excellent work — and yet, online, many of them were almost
              invisible. Outdated websites, neglected Google profiles and social feeds that didn’t reflect the quality of
              the business behind them.
            </p>
            <p data-reveal="up" style={{ ["--rv-delay" as string]: "110ms" }}>
              Based at IIHMF, MNNIT Allahabad, we set out to close that gap — not with one-off deliverables, but by
              treating a business’s digital presence as one connected system: a brand people recognise, a website that
              converts, search visibility that brings people in, and content and campaigns that keep them coming back.
            </p>
            <p data-reveal="up" style={{ ["--rv-delay" as string]: "220ms" }}>
              Today we partner with businesses across hospitality, nightlife, automotive, healthcare and workforce
              services — bringing strategy, design, engineering and performance marketing together under one roof.
            </p>
            <div data-reveal="up" style={{ ["--rv-delay" as string]: "330ms" }} className="pt-4">
              <TextLink href="/portfolio" className="text-ink">
                See the work
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section aria-label="Vision and mission" className="bg-ink text-paper">
        <div className="container-bs grid lg:grid-cols-2">
          <div className="border-b border-paper/10 py-20 sm:py-28 lg:border-b-0 lg:border-r lg:pr-16">
            <SectionLabel index="02">Vision</SectionLabel>
            <RevealText
              as="p"
              text="A future where every ambitious business — whatever its size or city — has a digital presence as strong as the work it does."
              className="mt-8 font-serif text-[clamp(1.9rem,3.4vw,3.2rem)] italic leading-[1.15]"
            />
          </div>
          <div className="py-20 sm:py-28 lg:pl-16">
            <SectionLabel index="03">Mission</SectionLabel>
            <RevealText
              as="p"
              text="To design, build and grow connected digital ecosystems — websites, search, social and advertising — that turn attention into *measurable growth* for the businesses we partner with."
              className="mt-8 font-display text-[clamp(1.5rem,2.4vw,2.2rem)] font-medium leading-[1.3] tracking-[-0.02em] text-paper/90"
              accentClassName="text-green"
              delay={150}
            />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="philosophy-title" className="grain relative bg-ink-2 py-24 text-paper sm:py-32">
        <div className="container-bs relative z-[2]">
          <SectionLabel index="04">Philosophy</SectionLabel>
          <RevealText
            id="philosophy-title"
            as="h2"
            text={"Three beliefs behind *every project.*"}
            className="font-display-tight mt-6 max-w-4xl text-[clamp(2.5rem,5.4vw,5rem)] font-semibold"
          />
          <ol className="mt-16 grid gap-12 sm:mt-20 md:grid-cols-3 md:gap-8">
            {philosophy.map((p, i) => (
              <li key={p.title} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 100}ms` }} className="border-t border-paper/15 pt-8">
                <span className="font-serif text-2xl italic text-green">{pad2(i + 1)}</span>
                <h3 className="mt-6 font-display text-[1.8rem] font-semibold tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-paper/60">{p.body}</p>
              </li>
            ))}
          </ol>

          {/* Approach */}
          <div className="mt-24 border-t border-paper/10 pt-12 sm:mt-32">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-paper/60">Our approach</p>
                <p className="mt-4 max-w-xl font-display text-[clamp(1.5rem,2.4vw,2.2rem)] font-medium leading-snug tracking-[-0.02em]">
                  Six stages, one rhythm — from understanding your business to scaling what works.
                </p>
              </div>
            </div>
            <ol className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] bg-paper/10 sm:grid-cols-3 lg:grid-cols-6">
              {processSteps.map((s, i) => (
                <li key={s.title} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 70}ms` }} className="bg-ink-2 p-6">
                  <span className="text-xs tabular-nums text-green">{pad2(i + 1)}</span>
                  <p className="mt-6 font-display text-lg font-semibold uppercase tracking-[0.04em]">{s.title}</p>
                  <p className="mt-2 text-sm leading-snug text-paper/60">{s.output}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Difference */}
      <section aria-labelledby="diff-title" className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-bs">
          <SectionLabel index="05" tone="dark">
            What makes us different
          </SectionLabel>
          <RevealText
            id="diff-title"
            as="h2"
            text={"Not another *agency.*"}
            className="font-display-tight mt-6 text-[clamp(2.5rem,5.4vw,5rem)] font-semibold"
            accentClassName="font-serif italic font-normal tracking-[-0.02em] text-green-deep"
          />
          <div className="mt-14 overflow-hidden rounded-[8px] border border-ink/10 sm:mt-20">
            <div className="grid grid-cols-2 bg-ink text-paper">
              <p className="eyebrow p-5 text-paper/60 sm:p-6">Typical agency</p>
              <p className="eyebrow border-l border-paper/10 p-5 text-green sm:p-6">BrandSpace</p>
            </div>
            <ul>
              {difference.map(([them, us], i) => (
                <li key={them} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 60}ms` }} className="grid grid-cols-2 border-t border-ink/10">
                  <p className="p-5 text-[0.98rem] leading-snug text-ink/65 line-through decoration-ink/25 sm:p-6 sm:text-lg">{them}</p>
                  <p className="border-l border-ink/10 p-5 font-display text-[1rem] font-semibold leading-snug tracking-[-0.01em] sm:p-6 sm:text-xl">
                    {us}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FoundingTeam />

      {/* Where */}
      <section aria-label="Where we work" className="border-t border-paper/10 bg-ink py-16 text-paper">
        <div className="container-bs flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-4">
            <MapPin size={26} className="mt-1 shrink-0 text-green" />
            <span>
              <span className="block font-display text-2xl font-semibold tracking-[-0.02em]">{site.address.line1}</span>
              <span className="block text-paper/65">
                {site.address.locality}, {site.address.region}, {site.address.country}
              </span>
            </span>
          </p>
          <div className="flex flex-wrap gap-6">
            <TextLink href={site.address.mapsUrl} external>
              Open in Maps
            </TextLink>
            <Link href="/contact" className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-paper/60 hover:text-paper">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
