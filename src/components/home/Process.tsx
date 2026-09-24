"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/data/approach";
import { cn, pad2 } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current!;
    let raf = 0;
    let running = false;
    let lastActive = -1;

    const update = () => {
      const mid = window.innerHeight * 0.55;
      const r = list.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
      let idx = 0;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < mid) idx = i;
      });
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }
      if (running) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(update);
      } else if (!e?.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(list);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
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
            {/* Big stage counter */}
            <div className="mt-12 hidden items-end gap-4 lg:flex" aria-hidden>
              <span className="font-display-tight text-[9rem] font-semibold leading-[0.8] text-green tabular-nums">
                {pad2(active + 1)}
              </span>
              <span className="pb-2">
                <span className="block text-sm text-paper/60">/ {pad2(processSteps.length)}</span>
                <span key={active} className="block animate-[panelIn_0.6s_var(--ease-out-expo)_both] font-display text-2xl font-semibold uppercase tracking-[0.08em]">
                  {processSteps[active]!.title}
                </span>
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
            const reached = i <= active;
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
                    reached ? "border-green bg-green text-ink" : "border-paper/20 bg-ink text-paper/60",
                  )}
                  aria-hidden
                >
                  {pad2(i + 1)}
                </span>
                <h3
                  className={cn(
                    "font-display-tight text-[clamp(2.2rem,4.2vw,3.6rem)] font-semibold uppercase transition-colors duration-500",
                    reached ? "text-paper" : "text-paper/40",
                  )}
                >
                  {s.title}
                </h3>
                <p className={cn("mt-4 max-w-md text-[1.05rem] leading-relaxed transition-colors duration-500", reached ? "text-paper/65" : "text-paper/55")}>
                  {s.body}
                </p>
                <p className={cn("eyebrow mt-5 transition-colors duration-500", reached ? "text-green" : "text-paper/55")}>
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
