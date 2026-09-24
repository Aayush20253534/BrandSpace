"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Declarative scroll-linked effects, driven by GSAP ScrollTrigger.
 * Server components opt in with data attributes — no client wrapper needed:
 *
 *   data-fx="parallax"  translateY across the viewport  (data-fx-amount: % of own height, default 8)
 *   data-fx="zoom"      scale down to 1 while entering  (data-fx-amount: start scale, default 1.08)
 *   data-fx="drift"     translateX across the viewport  (data-fx-amount: % of own width, default 4)
 *   data-fx="progress"  writes --fx-p (0 → 1) while the element crosses the viewport, for CSS to use
 *
 * data-fx-media="md" | "lg" limits an effect to that breakpoint and up.
 * data-fx-trigger="parent" measures the parent instead of the element
 * (use it when the element itself moves, e.g. an image inside a mask).
 *
 * Nothing runs for reduced-motion users, and effects are cleaned up when
 * their elements leave the DOM or the route changes.
 */

const MEDIA: Record<string, string> = {
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
};

type Fx = { kill: () => void };

/** Kills a scrubbed tween together with its ScrollTrigger. */
const handle = (tween: gsap.core.Tween): Fx => ({
  kill: () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  },
});

function create(el: HTMLElement): Fx | null {
  const kind = el.dataset.fx;
  const media = el.dataset.fxMedia;
  if (media && MEDIA[media] && !window.matchMedia(MEDIA[media]).matches) return null;
  const amountAttr = el.dataset.fxAmount;
  const trigger = el.dataset.fxTrigger === "parent" && el.parentElement ? el.parentElement : el;

  switch (kind) {
    case "parallax": {
      const a = amountAttr ? Number(amountAttr) : 8;
      return handle(
        gsap.fromTo(
          el,
          { yPercent: -a },
          { yPercent: a, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true } },
        ),
      );
    }
    case "zoom": {
      const from = amountAttr ? Number(amountAttr) : 1.08;
      return handle(
        gsap.fromTo(
          el,
          { scale: from },
          { scale: 1, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "center 55%", scrub: true } },
        ),
      );
    }
    case "drift": {
      const a = amountAttr ? Number(amountAttr) : 4;
      return handle(
        gsap.fromTo(
          el,
          { xPercent: -a },
          { xPercent: a, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true } },
        ),
      );
    }
    case "progress": {
      const set = (p: number) => el.style.setProperty("--fx-p", p.toFixed(4));
      const st = ScrollTrigger.create({
        trigger,
        start: el.dataset.fxStart ?? "top bottom",
        end: el.dataset.fxEnd ?? "bottom top",
        onUpdate: (self) => set(self.progress),
        onRefresh: (self) => set(self.progress),
      });
      return {
        kill: () => {
          st.kill();
          el.style.removeProperty("--fx-p");
        },
      };
    }
    default:
      return null;
  }
}

export function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const active = new Map<HTMLElement, Fx>();
    let raf = 0;

    const release = (el: HTMLElement) => {
      const fx = active.get(el);
      if (!fx) return;
      fx.kill();
      gsap.set(el, { clearProps: "transform" });
      active.delete(el);
    };

    const scan = () => {
      if (reduce.matches) return;
      let added = false;
      document.querySelectorAll<HTMLElement>("[data-fx]").forEach((el) => {
        if (active.has(el)) return;
        const fx = create(el);
        if (fx) {
          active.set(el, fx);
          added = true;
        }
      });
      if (added) ScrollTrigger.refresh();
    };

    const sweep = () => {
      for (const el of [...active.keys()]) if (!el.isConnected) release(el);
    };

    const reset = () => {
      for (const el of [...active.keys()]) release(el);
      scan();
    };

    scan();
    // Layout settles after fonts and late images; re-measure once they land.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        sweep();
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const queries = [reduce, ...Object.values(MEDIA).map((q) => window.matchMedia(q))];
    queries.forEach((q) => q.addEventListener("change", reset));

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      queries.forEach((q) => q.removeEventListener("change", reset));
      for (const el of [...active.keys()]) release(el);
    };
  }, [pathname]);

  return null;
}
