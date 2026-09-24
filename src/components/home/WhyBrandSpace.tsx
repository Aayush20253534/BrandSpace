"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pillars } from "@/data/approach";
import { cn, pad2 } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  { x: 20, y: 250 },
  { x: 95, y: 214 },
  { x: 165, y: 196 },
  { x: 232, y: 128 },
  { x: 300, y: 40 },
];
const PATH = "M20 250 C60 240 70 218 95 214 S140 200 165 196 S210 150 232 128 S280 70 300 40";

/**
 * Ascending path with five nodes. On desktop the line is drawn by scroll
 * progress through the principles (not per step), nodes light as the line
 * reaches them, and the active node pulses once when it takes over.
 */
function GrowthPath({ active, pathRef }: { active: number; pathRef: React.RefObject<SVGPathElement | null> }) {
  return (
    <svg viewBox="0 0 320 280" className="h-auto w-full overflow-visible" aria-hidden>
      <path d={PATH} fill="none" stroke="#f3f4ef" strokeOpacity="0.1" strokeWidth="2" />
      <path
        ref={pathRef}
        d={PATH}
        fill="none"
        stroke="#5bd17b"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        className="gp-line"
        style={{ ["--gp-step" as string]: 1 - (active + 1) / NODES.length }}
      />
      {NODES.map((n, i) => (
        <g key={i} data-gp-node={i} data-step-reached={i <= active ? "" : undefined} className="gp-node">
          <circle cx={n.x} cy={n.y} r={i === active ? 11 : 7} className="gp-dot" />
          {i === active && (
            <circle key={`pulse-${active}`} cx={n.x} cy={n.y} r="11" className="gp-pulse" fill="none" stroke="#5bd17b" strokeWidth="1.5" />
          )}
        </g>
      ))}
    </svg>
  );
}

export function WhyBrandSpace() {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  // Which principle owns the middle of the screen.
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

  // Desktop: draw the path continuously with scroll progress through the list.
  useEffect(() => {
    const list = listRef.current;
    const path = pathRef.current;
    const wrap = svgWrapRef.current;
    if (!list || !path || !wrap) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // Where each node sits along the path (0 → 1), measured once.
      const total = path.getTotalLength();
      const fractions = NODES.map((n) => {
        let best = 0;
        let bestD = Infinity;
        for (let s = 0; s <= 200; s++) {
          const pt = path.getPointAtLength((s / 200) * total);
          const d = Math.hypot(pt.x - n.x, pt.y - n.y);
          if (d < bestD) {
            bestD = d;
            best = s / 200;
          }
        }
        return best;
      });
      const nodes = Array.from(wrap.querySelectorAll<SVGGElement>("[data-gp-node]"));
      wrap.setAttribute("data-scrubbed", "");
      const st = ScrollTrigger.create({
        trigger: list,
        start: "top 55%",
        end: "bottom 60%",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          path.style.setProperty("--gp-p", String(1 - p));
          nodes.forEach((g, i) => g.toggleAttribute("data-reached", p >= fractions[i]! - 0.004));
        },
      });
      return () => {
        st.kill();
        wrap.removeAttribute("data-scrubbed");
        path.style.removeProperty("--gp-p");
        nodes.forEach((g) => g.removeAttribute("data-reached"));
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section aria-labelledby="why-title" className="grain relative overflow-clip bg-ink-2 py-24 text-paper sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]">
        <div className="hairline-grid absolute inset-x-0 -inset-y-[10%] opacity-50" data-fx="parallax" data-fx-amount="5" data-fx-trigger="parent" />
      </div>
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
                      "flex items-center gap-4 font-display-tight text-[clamp(2.4rem,4.4vw,4.4rem)] font-semibold transition-[color,translate,opacity] duration-[900ms] ease-[var(--ease-out-expo)]",
                      i === active ? "translate-x-3 text-green" : i < active ? "text-paper/60" : "text-paper/25",
                    )}
                  >
                    <span
                      className={cn(
                        "h-[3px] w-10 origin-left rounded-full bg-green transition-transform duration-[900ms] ease-[var(--ease-out-expo)]",
                        i === active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                    <span className={cn("transition-[translate] duration-[900ms] ease-[var(--ease-out-expo)]", i !== active && "-translate-x-14")}>
                      {p.title}
                    </span>
                  </li>
                ))}
              </ol>
              <div ref={svgWrapRef} className="gp mt-10 w-[min(22rem,70%)]">
                <GrowthPath active={active} pathRef={pathRef} />
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div ref={listRef} className="lg:col-span-6">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                data-index={i}
                className="flex min-h-0 flex-col justify-center border-t border-paper/10 py-12 lg:min-h-[62vh] lg:border-t-0 lg:py-0"
              >
                <p data-reveal="up" className="eyebrow flex items-center gap-3 text-paper/60">
                  <span className="text-green">{pad2(i + 1)}</span>
                  <span className="h-px w-8 bg-paper/20" aria-hidden />
                  Principle
                </p>
                <h3
                  data-reveal="up"
                  style={{ ["--rv-delay" as string]: "70ms" }}
                  className="font-display-tight mt-5 text-[clamp(2.3rem,8vw,3.2rem)] font-semibold lg:sr-only"
                >
                  {p.title}
                </h3>
                <p
                  data-reveal="up"
                  style={{ ["--rv-delay" as string]: "140ms" }}
                  className="mt-4 font-serif text-[clamp(1.7rem,2.8vw,2.6rem)] italic leading-[1.15] text-paper lg:mt-6"
                >
                  {p.line}
                </p>
                <p
                  data-reveal="up"
                  style={{ ["--rv-delay" as string]: "220ms" }}
                  className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-paper/60"
                >
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
