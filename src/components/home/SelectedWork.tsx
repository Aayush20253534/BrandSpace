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
    <section aria-labelledby="work-title" className="relative bg-ink py-24 text-paper sm:py-32 lg:motion-safe:py-0">
      <HorizontalScroll
        trackClassName="gap-20 px-[var(--gutter)] lg:motion-safe:items-center lg:motion-safe:gap-[6vw]"
        backdrop={
          <>
            {/* Ambient light tinted toward the project on screen (colour set by HorizontalScroll) */}
            <div className="absolute inset-0 opacity-[0.16] [background:radial-gradient(55%_60%_at_64%_46%,currentColor,transparent_72%)]" />
            <div className="absolute inset-0 opacity-[0.07] [background:radial-gradient(35%_40%_at_12%_85%,currentColor,transparent_70%)]" />
            {/* One oversized name at a time, drifting against the scroll */}
            <div className="absolute inset-x-0 bottom-[-3vw] [translate:calc(var(--hs-p,0)*-10vw)_0]">
              {featured.map((p, i) => (
                <p
                  key={p.slug}
                  data-hs-ghost={i}
                  className="absolute bottom-0 left-[4vw] select-none whitespace-nowrap font-display-tight text-[15vw] font-semibold text-paper/[0.04] opacity-0 transition-[opacity,translate] duration-[1200ms] ease-[var(--ease-out-expo)] [translate:0_12%] data-[on]:opacity-100 data-[on]:[translate:0_0]"
                >
                  {p.name}
                </p>
              ))}
            </div>
          </>
        }
      >
        {/* Intro panel */}
        <div className="flex shrink-0 flex-col justify-center lg:max-w-[34rem] lg:motion-safe:w-[34vw]">
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
          <article
            key={p.slug}
            data-hs-panel
            data-hs-accent={p.palette.mood ?? p.palette.accent}
            className="relative shrink-0 lg:motion-safe:w-[58vw] lg:motion-safe:max-w-[64rem]"
          >
            <Link href={`/portfolio/${p.slug}`} className="group relative block" data-cursor="View case" aria-label={`${p.name} — view case study`}>
              <div data-reveal="clip" className="overflow-hidden rounded-[10px]">
                <BrowserFrame project={p} sizes="(min-width: 1024px) 58vw, 100vw" mediaProps={{ "data-hs-scale": "" }} />
              </div>
              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <p className="sw-num eyebrow text-paper/60">
                    <span className="text-green">{pad2(i + 1)}</span> · {p.industry}
                  </p>
                  <h3 className="sw-title mt-2 font-display text-[clamp(1.7rem,2.6vw,2.6rem)] font-semibold tracking-[-0.03em] transition-colors duration-500 group-hover:text-green">
                    <span className="rw">
                      <span>{p.name}</span>
                    </span>
                  </h3>
                  <p className="sw-sub mt-1 text-paper/65">{p.summary}</p>
                </div>
                <span className="sw-cta mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-paper/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-green group-hover:bg-green group-hover:text-ink">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Services delivered">
                {p.services.map((s, si) => (
                  <li
                    key={s}
                    className="sw-pill rounded-full border border-paper/12 px-3 py-1 text-[0.72rem] text-paper/60"
                    style={{ ["--i" as string]: si }}
                  >
                    {serviceName(s)}
                  </li>
                ))}
              </ul>
            </Link>
          </article>
        ))}

        {/* Outro panel */}
        <div className="flex shrink-0 flex-col justify-center border-t border-paper/10 pt-12 lg:motion-safe:w-[26vw] lg:motion-safe:border-l lg:motion-safe:border-t-0 lg:motion-safe:pl-[4vw] lg:motion-safe:pt-0">
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
