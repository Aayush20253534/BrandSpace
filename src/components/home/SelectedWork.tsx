import Link from "next/link";
import { projects } from "@/data/portfolio";
import { services } from "@/data/services";
import { pad2 } from "@/lib/utils";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BrowserFrame } from "@/components/portfolio/BrowserFrame";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icons";

const serviceName = (slug: string) => services.find((s) => s.slug === slug)?.shortName ?? slug;

export function SelectedWork() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section aria-labelledby="work-title" className="relative bg-ink py-24 text-paper sm:py-32 lg:py-0">
      <HorizontalScroll trackClassName="gap-20 px-[var(--gutter)] lg:items-center lg:gap-[6vw]">
        {/* Intro panel */}
        <div className="flex shrink-0 flex-col justify-center lg:w-[34vw] lg:max-w-[34rem]">
          <SectionLabel index="02">Selected Work</SectionLabel>
          <RevealText
            id="work-title"
            as="h2"
            text={"Websites that *work as hard* as the businesses behind them."}
            className="font-display-tight mt-6 text-[clamp(2.5rem,4.6vw,4.6rem)] font-semibold"
          />
          <p data-reveal="up" className="mt-8 max-w-sm text-base leading-relaxed text-paper/60">
            A few recent builds for hospitality, nightlife, automotive and workforce brands — each designed around how
            their customers actually decide.
          </p>
          <div data-reveal="up" className="mt-10">
            <ButtonLink href="/portfolio" variant="outline">
              View all projects
            </ButtonLink>
          </div>
        </div>

        {featured.map((p, i) => (
          <article key={p.slug} className="shrink-0 lg:w-[58vw] lg:max-w-[64rem]">
            <Link href={`/portfolio/${p.slug}`} className="group block" data-cursor="View case" aria-label={`${p.name} — view case study`}>
              <div data-reveal="clip" className="overflow-hidden rounded-[10px]">
                <BrowserFrame project={p} sizes="(min-width: 1024px) 58vw, 100vw" />
              </div>
              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow text-paper/60">
                    {pad2(i + 1)} · {p.industry}
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(1.7rem,2.6vw,2.6rem)] font-semibold tracking-[-0.03em]">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-paper/65">{p.summary}</p>
                </div>
                <span className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-paper/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-green group-hover:bg-green group-hover:text-ink">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Services delivered">
                {p.services.map((s) => (
                  <li key={s} className="rounded-full border border-paper/12 px-3 py-1 text-[0.72rem] text-paper/60">
                    {serviceName(s)}
                  </li>
                ))}
              </ul>
            </Link>
          </article>
        ))}

        {/* Outro panel */}
        <div className="flex shrink-0 flex-col justify-center border-t border-paper/10 pt-12 lg:w-[26vw] lg:border-l lg:border-t-0 lg:pl-[4vw] lg:pt-0">
          <p className="font-serif text-[clamp(2rem,3vw,3rem)] italic leading-tight text-paper/90">
            Six launches. Five industries. One approach.
          </p>
          <p className="mt-5 max-w-xs text-paper/65">Explore every case study — including our healthcare work.</p>
          <div className="mt-8">
            <ButtonLink href="/portfolio">Explore the portfolio</ButtonLink>
          </div>
        </div>
      </HorizontalScroll>
    </section>
  );
}
