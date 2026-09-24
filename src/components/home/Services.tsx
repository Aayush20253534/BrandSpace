"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { services, type Service } from "@/data/services";
import { cn, pad2 } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WhatsAppButton } from "@/components/ui/Button";
import { Check, Plus } from "@/components/ui/Icons";
import { ServiceVisual } from "./ServiceVisual";

const serviceMessage = (s: Service) =>
  `Hi BrandSpace, I’m interested in ${s.name} and would like to discuss my business/project.`;

/** What / how / outcome for one service. `data-sv-text` marks the pieces that stagger in. */
function Copy({ s }: { s: Service }) {
  return (
    <>
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-10">
        <div data-sv-text>
          <h4 className="eyebrow text-ink/65">What we do</h4>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/80">{s.what}</p>
        </div>
        <div data-sv-text>
          <h4 className="eyebrow text-ink/65">How we do it</h4>
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
      <div data-sv-text className="flex flex-col gap-6 border-t border-ink/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md">
          <h4 className="eyebrow text-ink/65">Business outcome</h4>
          <p className="mt-2 font-serif text-[1.55rem] italic leading-snug text-ink">{s.outcome}</p>
        </div>
        <WhatsAppButton variant="dark" message={serviceMessage(s)} label={`Talk to BrandSpace about ${s.name} on WhatsApp`}>
          Talk to BrandSpace
        </WhatsAppButton>
      </div>
    </>
  );
}

export function Services() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const shownRef = useRef(0);

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

  // Desktop panel transition: the outgoing visual scales up and clips away, the
  // incoming one wipes in from slightly larger and settles, then its pieces and
  // the copy stagger in. Direction follows the list order.
  useEffect(() => {
    const stage = stageRef.current;
    const from = shownRef.current;
    if (!stage || from === active) return;
    shownRef.current = active;
    const layers = Array.from(stage.querySelectorAll<HTMLElement>("[data-sv-layer]"));
    const out = layers[from];
    const inn = layers[active];
    if (!inn) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const text = textRef.current?.querySelectorAll<HTMLElement>("[data-sv-text]") ?? [];
    const items = inn.querySelectorAll<HTMLElement>("[data-sv-item]");

    gsap.killTweensOf([...layers, ...text, ...items]);
    layers.forEach((l) => {
      if (l !== out && l !== inn) gsap.set(l, { autoAlpha: 0, zIndex: 0 });
    });
    if (reduce) {
      if (out) gsap.set(out, { autoAlpha: 0, zIndex: 0 });
      gsap.set(inn, { autoAlpha: 1, zIndex: 2, scale: 1, clipPath: "none" });
      return;
    }

    const down = active > from;
    const hidden = down ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)";
    const start = down ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";
    if (out) {
      gsap.set(out, { zIndex: 1 });
      gsap.to(out, { scale: 1.04, clipPath: hidden, duration: 0.6, ease: "power3.inOut" });
      gsap.to(out, { autoAlpha: 0, duration: 0.3, delay: 0.3, ease: "power1.in" });
    }
    gsap.set(inn, { zIndex: 2 });
    gsap.fromTo(
      inn,
      { autoAlpha: 0, scale: 1.07, clipPath: start },
      { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "expo.out" },
    );
    gsap.fromTo(items, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.05, delay: 0.12 });
    gsap.fromTo(text, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.06, delay: 0.05 });
  }, [active]);

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
                    className="group relative flex w-full items-center gap-5 py-6 text-left sm:py-7"
                  >
                    {/* Active marker grows along the rule */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-px left-0 h-px origin-left bg-green-deep transition-transform duration-700 ease-[var(--ease-out-expo)]",
                        isActive ? "w-full scale-x-100" : "w-full scale-x-0",
                      )}
                    />
                    <span className={cn("w-8 text-xs font-medium tabular-nums transition-colors", isActive ? "text-green-deep" : "text-ink/60")}>
                      {pad2(i + 1)}
                    </span>
                    <span className="flex-1">
                      <span
                        className={cn(
                          "block font-display text-[clamp(1.45rem,2.6vw,2.15rem)] font-semibold leading-[1.05] tracking-[-0.03em] transition-[color,translate] duration-500 ease-[var(--ease-out-expo)]",
                          isActive ? "translate-x-1 text-ink" : "text-ink/60 group-hover:text-ink/75 lg:text-ink/50",
                        )}
                      >
                        {s.name}
                      </span>
                      <span className="mt-1.5 block text-sm text-ink/60">{s.kicker}</span>
                    </span>
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500",
                        isActive ? "rotate-45 border-ink bg-ink text-green" : "border-ink/15 text-ink/65 group-hover:border-ink/40",
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
                      <div className="grid gap-8 pb-10 pt-2">
                        <div className="aspect-[16/10] overflow-hidden rounded-[6px] bg-ink">
                          {isActive && <ServiceVisual key={s.slug} kind={s.visual} className="h-full w-full animate-[panelIn_0.7s_var(--ease-out-expo)_both]" />}
                        </div>
                        <Copy s={s} />
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
              <p className="eyebrow mb-5 flex items-center gap-3 text-green-deep">
                <span key={`n-${active}`} className="inline-block animate-[panelIn_0.5s_var(--ease-out-expo)_both] tabular-nums">
                  {pad2(active + 1)}
                </span>
                <span aria-hidden className="h-px w-8 bg-green-deep/50" />
                <span key={`l-${active}`} className="inline-block animate-[panelIn_0.6s_var(--ease-out-expo)_0.06s_both]">
                  {current.name}
                </span>
              </p>
              <div ref={stageRef} className="relative aspect-[40/26] overflow-hidden rounded-[6px] bg-ink">
                {services.map((s, i) => (
                  <div
                    key={s.slug}
                    data-sv-layer
                    className="absolute inset-0"
                    style={i === 0 ? { zIndex: 2 } : { opacity: 0, visibility: "hidden" }}
                  >
                    <ServiceVisual kind={s.visual} className="h-full w-full" />
                  </div>
                ))}
              </div>
              <div ref={textRef} className="mt-8 grid gap-8">
                <Copy s={current} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
