"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

/**
 * Converts vertical scroll into horizontal travel on large screens
 * (sticky viewport + transformed track). Below `lg`, or with reduced
 * motion, children simply stack vertically.
 *
 * Panels can opt into position-aware effects with data attributes:
 * - `data-hs-panel` (+ `data-hs-accent="#hex"`): tracked panel; the one nearest
 *   the centre gets `data-hs-active` (and `data-hs-seen` the first time), and
 *   the `backdrop` element's `color` moves to its accent.
 * - `data-hs-scale` inside a panel: scales 1.06 → 1 as the panel reaches centre.
 * - `data-hs-drift="120"` inside a panel: shifts up to ±120px against the scroll.
 * - `data-hs-ghost="i"` inside the backdrop: gets `data-on` while panel i is active.
 *   The backdrop also receives `--hs-p` (horizontal progress, 0 → 1).
 * Geometry is measured on resize only; frames never read layout.
 */
export function HorizontalScroll({
  children,
  className,
  trackClassName,
  backdrop,
}: {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  /** Rendered inside the sticky viewport, behind the track (e.g. an ambient glow). */
  backdrop?: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const track = trackRef.current!;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let running = false;
    let distance = 0;
    let current = 0;
    let last = performance.now();
    let lastHeight = "";
    let activeIndex = -1;

    type Panel = { el: HTMLElement; center: number; scale: HTMLElement[]; drift: { el: HTMLElement; amount: number }[] };
    let panels: Panel[] = [];

    const measure = () => {
      if (!mq.matches) {
        section.style.height = "";
        track.style.transform = "";
        section.removeAttribute("data-hs-ready");
        panels.forEach((p) => {
          p.el.removeAttribute("data-hs-active");
          p.scale.forEach((s) => (s.style.transform = ""));
          p.drift.forEach((d) => (d.el.style.transform = ""));
        });
        panels = [];
        distance = 0;
      } else {
        distance = Math.max(0, track.scrollWidth - window.innerWidth);
        section.style.height = `${distance + window.innerHeight}px`;
        section.setAttribute("data-hs-ready", "");
        panels = Array.from(track.querySelectorAll<HTMLElement>("[data-hs-panel]")).map((el) => ({
          el,
          // offsetLeft is relative to the track (its offsetParent), unaffected by the transform.
          center: el.offsetLeft + el.offsetWidth / 2,
          scale: Array.from(el.querySelectorAll<HTMLElement>("[data-hs-scale]")),
          drift: Array.from(el.querySelectorAll<HTMLElement>("[data-hs-drift]")).map((d) => ({
            el: d,
            amount: Number(d.dataset.hsDrift) || 80,
          })),
        }));
        paint();
      }
      // Later ScrollTriggers depend on this section's height.
      if (section.style.height !== lastHeight) {
        lastHeight = section.style.height;
        ScrollTrigger.refresh();
      }
    };

    const paint = () => {
      if (!panels.length) return;
      const vw = window.innerWidth;
      let best = -1;
      let bestD = Infinity;
      panels.forEach((p, i) => {
        const d = (p.center + current - vw / 2) / vw;
        const ad = Math.abs(d);
        if (ad < bestD) {
          bestD = ad;
          best = i;
        }
        const s = 1 + 0.06 * Math.min(1, ad * 1.6);
        p.scale.forEach((el) => (el.style.transform = `scale(${s.toFixed(4)})`));
        p.drift.forEach(({ el, amount }) => (el.style.transform = `translate3d(${(-d * amount).toFixed(1)}px,0,0)`));
      });
      // Only a panel that genuinely owns the viewport counts as active.
      const next = bestD < 0.32 ? best : -1;
      if (next !== activeIndex) {
        if (activeIndex >= 0) panels[activeIndex]?.el.removeAttribute("data-hs-active");
        activeIndex = next;
        const panel = panels[next];
        if (panel) {
          panel.el.setAttribute("data-hs-active", "");
          panel.el.setAttribute("data-hs-seen", "");
        }
        const accent = panel?.el.dataset.hsAccent;
        const bd = backdropRef.current;
        if (bd) {
          bd.style.color = accent ?? "";
          bd.style.opacity = accent ? "1" : "0";
          bd.querySelectorAll<HTMLElement>("[data-hs-ghost]").forEach((g) =>
            g.toggleAttribute("data-on", g.dataset.hsGhost === String(next)),
          );
        }
      }
      if (backdropRef.current && distance > 0) {
        backdropRef.current.style.setProperty("--hs-p", (-current / distance).toFixed(4));
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (distance > 0) {
        const r = section.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
        const target = -p * distance;
        current += (target - current) * (1 - Math.exp(-dt / 90));
        if (Math.abs(target - current) < 0.1) current = target;
        track.style.transform = `translate3d(${current}px,0,0)`;
        paint();
      }
      if (running) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!e?.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(section);

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={sectionRef} className={cn("relative", className)}>
      {/* Horizontal only on large screens without reduced motion (matches `mq` above) */}
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-screen lg:motion-safe:items-center lg:motion-safe:overflow-hidden">
        {backdrop && (
          <div
            ref={backdropRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden opacity-0 transition-[color,opacity] duration-[1400ms] ease-out lg:motion-safe:block"
          >
            {backdrop}
          </div>
        )}
        <div ref={trackRef} className={cn("relative flex flex-col lg:motion-safe:flex-row lg:motion-safe:will-change-transform", trackClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
