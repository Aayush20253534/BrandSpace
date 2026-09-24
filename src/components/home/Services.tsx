"use client";

import { useEffect, useId, useState } from "react";
import { services, type Service } from "@/data/services";
import { cn, pad2 } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WhatsAppButton } from "@/components/ui/Button";
import { Check, Plus } from "@/components/ui/Icons";
import { ServiceVisual } from "./ServiceVisual";

const serviceMessage = (s: Service) =>
  `Hi BrandSpace, I’m interested in ${s.name} and would like to discuss my business/project.`;

function Detail({ s, compact, showVisual = true }: { s: Service; compact?: boolean; showVisual?: boolean }) {
  return (
    <div className={cn("grid gap-8", compact ? "pt-2" : "")}>
      <div className={cn("overflow-hidden rounded-[6px] bg-ink", compact ? "aspect-[16/10]" : "aspect-[40/26]")}>
        {showVisual && <ServiceVisual key={s.slug} kind={s.visual} className="h-full w-full" />}
      </div>
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-10">
        <div>
          <h4 className="eyebrow text-ink/45">What we do</h4>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/80">{s.what}</p>
        </div>
        <div>
          <h4 className="eyebrow text-ink/45">How we do it</h4>
          <ul className="mt-3 space-y-2.5">
            {s.how.map((h) => (
              <li key={h} className="flex gap-3 text-[0.95rem] leading-snug text-ink/80">
                <Check size={16} className="mt-0.5 shrink-0 text-green-deep" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-6 border-t border-ink/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md">
          <h4 className="eyebrow text-ink/45">Business outcome</h4>
          <p className="mt-2 font-serif text-[1.55rem] italic leading-snug text-ink">{s.outcome}</p>
        </div>
        <WhatsAppButton variant="dark" message={serviceMessage(s)} label={`Talk to BrandSpace about ${s.name} on WhatsApp`}>
          Talk to BrandSpace
        </WhatsAppButton>
      </div>
    </div>
  );
}

export function Services() {
  const [active, setActive] = useState(0);
  const baseId = useId();

  // Deep links such as /#meta-ads (used in the footer) open that service.
  useEffect(() => {
    const sync = () => {
      const i = services.findIndex((s) => `#${s.slug}` === window.location.hash);
      if (i >= 0) setActive(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const current = services[active]!;

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative z-10 -mt-[12svh] rounded-t-[28px] bg-paper py-24 text-ink sm:rounded-t-[40px] sm:py-32"
    >
      <div className="container-bs">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionLabel index="01" tone="dark">
              Services
            </SectionLabel>
            <RevealText
              id="services-title"
              as="h2"
              text={"Five disciplines.\n*One growth system.*"}
              className="font-display-tight mt-6 text-[clamp(2.7rem,6.4vw,6rem)] font-semibold"
              accentClassName="font-serif italic font-normal tracking-[-0.02em] text-green-deep"
            />
          </div>
          <p data-reveal="up" className="max-w-md self-end text-lg leading-relaxed text-ink/65 lg:col-span-5 lg:justify-self-end">
            Each service stands on its own, but they’re designed to work together — so your website, search, social
            and ads compound instead of competing for budget.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          {/* Index */}
          <ul className="border-t border-ink/10 lg:col-span-5" role="list">
            {services.map((s, i) => {
              const isActive = i === active;
              const panelId = `${baseId}-panel-${i}`;
              return (
                <li key={s.slug} id={s.slug} className="scroll-mt-28 border-b border-ink/10">
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => window.matchMedia("(min-width: 1024px)").matches && setActive(i)}
                    className="group flex w-full items-center gap-5 py-6 text-left sm:py-7"
                  >
                    <span className={cn("w-8 text-xs font-medium tabular-nums transition-colors", isActive ? "text-green-deep" : "text-ink/35")}>
                      {pad2(i + 1)}
                    </span>
                    <span className="flex-1">
                      <span
                        className={cn(
                          "block font-display text-[clamp(1.45rem,2.6vw,2.15rem)] font-semibold leading-[1.05] tracking-[-0.03em] transition-[color,transform] duration-500 ease-[var(--ease-out-expo)]",
                          isActive ? "translate-x-1 text-ink" : "text-ink/40 group-hover:text-ink/70",
                        )}
                      >
                        {s.name}
                      </span>
                      <span className={cn("mt-1.5 block text-sm transition-colors", isActive ? "text-ink/60" : "text-ink/35")}>{s.kicker}</span>
                    </span>
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500",
                        isActive ? "rotate-45 border-ink bg-ink text-green" : "border-ink/15 text-ink/50 group-hover:border-ink/40",
                      )}
                      aria-hidden
                    >
                      <Plus size={18} />
                    </span>
                  </button>
                  {/* Inline details on small screens */}
                  <div
                    id={panelId}
                    role="region"
                    aria-label={s.name}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)] lg:hidden",
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden" inert={!isActive}>
                      <div className="pb-10">
                        <Detail s={s} compact showVisual={isActive} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Sticky detail panel on large screens */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <div key={current.slug} className="animate-[panelIn_0.7s_var(--ease-out-expo)_both]">
                <p className="eyebrow mb-5 text-green-deep">
                  {pad2(active + 1)} — {current.name}
                </p>
                <Detail s={current} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
