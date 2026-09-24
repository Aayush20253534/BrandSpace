"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/data/approach";
import { cn, pad2 } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

/** Stacked values that slide through a mask as `active` changes (both directions). */
function Ticker({ values, active, className }: { values: readonly string[]; active: number; className?: string }) {
  return (
    <span className={cn("relative block overflow-clip", className)}>
      {/* Sizer keeps the box as tall/wide as the current value */}
      <span className="invisible block">{values[active]}</span>
      {values.map((v, i) => (
        <span
          key={v + i}
          aria-hidden={i !== active}
          className={cn(
            "absolute inset-x-0 top-0 block transition-[translate,opacity] duration-700 ease-[var(--ease-out-expo)]",
            i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-full opacity-0" : "translate-y-full opacity-0",
          )}
        >
          {v}
        </span>
      ))}
    </span>
  );
}

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // One ScrollTrigger maps scroll to the progress line and the active step.
  // Step positions are cached on refresh, so scrolling never reads layout.
  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;
    let stops: number[] = [];
    let last = -1;
    const measure = () => {
      const h = list.offsetHeight || 1;
      stops = stepRefs.current.map((el) => (el ? el.offsetTop / h : 1));
    };
    const st = ScrollTrigger.create({
      trigger: list,
      start: "top 55%",
      end: "bottom 55%",
      onRefresh: measure,
      onUpdate: (self) => {
        const p = self.progress;
        fill.style.transform = `scaleY(${p})`;
        let idx = 0;
        for (let i = 0; i < stops.length; i++) if (stops[i]! <= p + 0.001) idx = i;
        if (idx !== last) {
          last = idx;
          setActive(idx);
        }
      },
    });
    measure();
    return () => st.kill();
  }, []);

  return (
    <section aria-labelledby="process-title" className="relative bg-ink py-24 text-paper sm:py-32">
      <div className="container-bs grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <SectionLabel index="05">Our Process</SectionLabel>
            <RevealText
              id="process-title"
              as="h2"
              text={"From first call\nto *compounding growth.*"}
              className="font-display-tight mt-6 text-[clamp(2.6rem,5vw,4.8rem)] font-semibold"
            />
            <p data-reveal="up" className="mt-8 max-w-sm text-lg leading-relaxed text-paper/60">
              A clear, collaborative rhythm — so you always know what’s happening, what’s next and why.
            </p>
            {/* Stage: number, title and output slide through their masks */}
            <div className="mt-12 hidden items-end gap-5 lg:flex" aria-hidden>
              <Ticker
                values={processSteps.map((_, i) => pad2(i + 1))}
                active={active}
                className="font-display-tight text-[9rem] font-semibold leading-[0.8] text-green tabular-nums"
              />
              <span className="min-w-0 flex-1 pb-2">
                <span className="block text-sm text-paper/60">/ {pad2(processSteps.length)}</span>
                <Ticker
                  values={processSteps.map((s) => s.title)}
                  active={active}
                  className="font-display text-2xl font-semibold uppercase tracking-[0.08em]"
                />
                <Ticker values={processSteps.map((s) => `→ ${s.output}`)} active={active} className="eyebrow mt-2 text-green" />
              </span>
            </div>
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-6 lg:col-start-7">
          {/* Track */}
          <div className="absolute bottom-3 left-[15px] top-3 w-px bg-paper/12" aria-hidden>
            <div ref={fillRef} className="absolute inset-0 origin-top bg-green" style={{ transform: "scaleY(0)" }} />
          </div>
          {processSteps.map((s, i) => {
            const state = i === active ? "active" : i < active ? "past" : "next";
            return (
              <li
                key={s.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="relative pb-16 pl-16 last:pb-0 sm:pb-20"
              >
                <span
                  className={cn(
                    "absolute left-0 top-1 grid h-[31px] w-[31px] place-items-center rounded-full border text-[0.62rem] font-semibold tabular-nums transition-all duration-500",
                    state === "next" ? "border-paper/20 bg-ink text-paper/60" : "border-green bg-green text-ink",
                    state === "active" && "shadow-[0_0_0_6px_rgba(91,209,123,0.14)]",
                  )}
                  aria-hidden
                >
                  {pad2(i + 1)}
                </span>
                <h3
                  className={cn(
                    "font-display-tight text-[clamp(2.2rem,4.2vw,3.6rem)] font-semibold uppercase transition-[color,translate] duration-700 ease-[var(--ease-out-expo)]",
                    state === "active" ? "translate-x-1 text-paper" : state === "past" ? "text-paper/60" : "text-paper/40",
                  )}
                >
                  {s.title}
                </h3>
                <p
                  className={cn(
                    "mt-4 max-w-md text-[1.05rem] leading-relaxed transition-colors duration-700",
                    state === "active" ? "text-paper/75" : "text-paper/55",
                  )}
                >
                  {s.body}
                </p>
                <p className={cn("eyebrow mt-5 transition-colors duration-700", state === "active" ? "text-green" : "text-paper/55")}>
                  → {s.output}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
