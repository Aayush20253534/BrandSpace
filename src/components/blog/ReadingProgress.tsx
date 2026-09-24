"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Thin reading-progress bar pinned to the top of the viewport, tracking the
 * element with `targetId` (the article body). Decorative: position within the
 * article is already conveyed by the table of contents.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const target = document.getElementById(targetId);
    if (!bar || !target) return;
    const st = ScrollTrigger.create({
      trigger: target,
      start: "top 20%",
      end: "bottom 85%",
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      },
      onRefresh: (self) => {
        bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      },
    });
    return () => st.kill();
  }, [targetId]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
      <div ref={barRef} className="h-full origin-left bg-green" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
