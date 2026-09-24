"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Contextual cursor label for precise pointers: hovering any element with
 * `data-cursor="View case"` shows a small green disc with that label.
 * The native cursor is never hidden.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let shown = false;

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      const text = target?.getAttribute("data-cursor") ?? "";
      if (text && !shown) {
        shown = true;
        setLabel(text);
        gsap.to(el, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" });
      } else if (!text && shown) {
        shown = false;
        gsap.to(el, { scale: 0.3, opacity: 0, duration: 0.3, ease: "power2.in" });
      } else if (text && shown) {
        setLabel(text);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] -ml-12 -mt-12 grid h-24 w-24 place-items-center rounded-full bg-green text-center text-[0.68rem] font-semibold uppercase leading-tight tracking-[0.14em] text-ink opacity-0"
      style={{ transform: "scale(0.3)" }}
    >
      <span className="px-3">{label}</span>
    </div>
  );
}
