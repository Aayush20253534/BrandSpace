"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Converts vertical scroll into horizontal travel on large screens
 * (sticky viewport + transformed track). Below `lg`, or with reduced
 * motion, children simply stack vertically.
 */
export function HorizontalScroll({
  children,
  className,
  trackClassName,
}: {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const track = trackRef.current!;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let running = false;
    let distance = 0;
    let current = 0;
    let last = performance.now();

    const measure = () => {
      if (!mq.matches) {
        section.style.height = "";
        track.style.transform = "";
        distance = 0;
        return;
      }
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${distance + window.innerHeight}px`;
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
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <div ref={trackRef} className={cn("flex flex-col lg:flex-row lg:will-change-transform", trackClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
