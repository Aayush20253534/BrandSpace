"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Inertial smooth scrolling is a progressive enhancement for fine-pointer
 * desktop devices. Its runtime is loaded after first paint; touch devices and
 * reduced-motion users keep native scrolling.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const first = useRef(true);
  const refreshRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    if (reduce || !finePointer) return;

    let cancelled = false;
    let started = false;
    let instance: Lenis | null = null;
    let idleId: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let removeTicker: (() => void) | null = null;

    const start = async () => {
      if (started || cancelled) return;
      started = true;

      const [{ default: LenisCtor }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      instance = new LenisCtor({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
      });
      instance.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      removeTicker = () => gsap.ticker.remove(raf);
      refreshRef.current = () => ScrollTrigger.refresh();

      // eslint-disable-next-line react-hooks/set-state-in-effect -- publish the instance after deferred runtime setup
      setLenis(instance);
    };

    const startOnIntent = () => {
      void start();
    };

    window.addEventListener("wheel", startOnIntent, { passive: true, once: true });
    window.addEventListener("pointerdown", startOnIntent, { passive: true, once: true });

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(() => void start(), { timeout: 800 });
    } else {
      timer = setTimeout(() => void start(), 180);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("wheel", startOnIntent);
      window.removeEventListener("pointerdown", startOnIntent);
      if (idleId !== null && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timer !== null) clearTimeout(timer);
      removeTicker?.();
      instance?.destroy();
      refreshRef.current = null;
      setLenis(null);
    };
  }, []);

  // New page → start at the top (hash links are handled by the browser).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => refreshRef.current?.());
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
