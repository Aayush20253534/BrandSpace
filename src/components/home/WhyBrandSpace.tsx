"use client";

import { useEffect, useRef, useState } from "react";
import { pillars } from "@/data/approach";
import { cn, pad2 } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Ascending path with five nodes — lights up as each pillar is reached. */
function GrowthPath({ active }: { active: number }) {
  const nodes = [
    { x: 20, y: 250 },
    { x: 95, y: 214 },
    { x: 165, y: 196 },
    { x: 232, y: 128 },
    { x: 300, y: 40 },
  ];
  const d = "M20 250 C60 240 70 218 95 214 S140 200 165 196 S210 150 232 128 S280 70 300 40";
  const progress = (active + 1) / nodes.length;
  return (
    <svg viewBox="0 0 320 280" className="h-auto w-full" aria-hidden>
      <path d={d} fill="none" stroke="#f3f4ef" strokeOpacity="0.1" strokeWidth="2" />
      <path
        d={d}
        fill="none"
        stroke="#5bd17b"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        style={{ strokeDashoffset: 1 - progress, transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
      />
      {nodes.map((n, i) => (
        <g key={i} style={{ transition: "opacity .6s", opacity: i <= active ? 1 : 0.35 }}>
          <circle cx={n.x} cy={n.y} r={i === active ? 12 : 7} fill={i <= active ? "#5bd17b" : "#1c221e"} style={{ transition: "r .6s" }} />
          {i === active && <circle cx={n.x} cy={n.y} r="20" fill="none" stroke="#5bd17b" strokeOpacity="0.35" />}
        </g>
      ))}
    </svg>
  );
}

export function WhyBrandSpace() {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blockRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="why-title" className="grain relative overflow-clip bg-ink-2 py-24 text-paper sm:py-32">
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="container-bs relative z-[2]">
        <div className="max-w-4xl">
          <SectionLabel index="03">Why BrandSpace</SectionLabel>
          <RevealText
            id="why-title"
            as="h2"
            text={"Growth isn’t luck.\nIt’s *engineered.*"}
            className="font-display-tight mt-6 text-[clamp(2.7rem,6.4vw,6rem)] font-semibold"
          />
          <p data-reveal="up" className="mt-8 max-w-xl text-lg leading-relaxed text-paper/60">
            Five principles shape every project we take on — whether it’s a single landing page or a complete digital
            presence.
          </p>
        </div>

        <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          {/* Sticky index (desktop) */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[calc(50vh-15rem)]">
              <ol className="space-y-1" aria-hidden>
                {pillars.map((p, i) => (
                  <li
                    key={p.title}
                    className={cn(
                      "font-display-tight text-[clamp(2.4rem,4.4vw,4.4rem)] font-semibold transition-[color,transform] duration-700 ease-[var(--ease-out-expo)]",
                      i === active ? "translate-x-3 text-green" : i < active ? "text-paper/45" : "text-paper/15",
                    )}
                  >
                    {p.title}
                  </li>
                ))}
              </ol>
              <div className="mt-10 w-[min(22rem,70%)]">
                <GrowthPath active={active} />
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="lg:col-span-6">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                data-index={i}
                className="flex min-h-0 flex-col justify-center border-t border-paper/10 py-12 lg:min-h-[62vh] lg:border-t-0 lg:py-0"
              >
                <p data-reveal="up" className="eyebrow flex items-center gap-3 text-paper/45">
                  <span className="text-green">{pad2(i + 1)}</span>
                  <span className="h-px w-8 bg-paper/20" aria-hidden />
                  Principle
                </p>
                <h3
                  data-reveal="up"
                  className="font-display-tight mt-5 text-[clamp(2.3rem,8vw,3.2rem)] font-semibold lg:sr-only"
                >
                  {p.title}
                </h3>
                <p data-reveal="up" className="mt-4 font-serif text-[clamp(1.7rem,2.8vw,2.6rem)] italic leading-[1.15] text-paper lg:mt-6">
                  {p.line}
                </p>
                <p data-reveal="up" className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-paper/60">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
