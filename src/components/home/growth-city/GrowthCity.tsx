"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { growthScenes, growthCityFrames, logoGeometry } from "@/data/growthCity";
import { site } from "@/data/site";
import { WhatsAppButton, TextLink } from "@/components/ui/Button";
import { ArrowDown } from "@/components/ui/Icons";
import { useLenis } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/utils";
import { CityRenderer, type Quality } from "./cityRenderer";
import { FramePlayer } from "./framePlayer";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/** Reveal timing (progress units). */
const T = {
  logoIn: [0.885, 0.915],
  logoMove: [0.915, 0.95],
  text: [0.925, 0.96],
} as const;

const storyScenes = growthScenes.slice(0, 7);

export function GrowthCity() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLLIElement | null)[]>([]);
  const railFillRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [reduced, setReduced] = useState(false);
  const [loading, setLoading] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability detection on mount
    setReduced(reduce);

    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowPower =
      (nav.hardwareConcurrency ?? 8) <= 4 ||
      (nav.deviceMemory ?? 8) <= 4 ||
      nav.connection?.saveData === true ||
      window.innerWidth < 768;
    const quality: Quality = lowPower ? "low" : "high";

    const portraitNow = () => window.innerHeight > window.innerWidth * 1.1;
    let player: FramePlayer | null = null;
    let city: CityRenderer | null = null;
    if (growthCityFrames && !reduce) {
      player = new FramePlayer(canvas, portraitNow() ? growthCityFrames.mobile : growthCityFrames.desktop);
      setLoading(0);
      void player.load((n, total) => setLoading(n >= Math.min(total, 24) ? null : n / Math.min(total, 24)));
    } else {
      city = new CityRenderer(canvas, quality);
    }

    let W = 0, H = 0;
    let logoFinal = { x: 0, y: 0, size: 0 };
    const sizeUp = () => {
      const box = canvas.parentElement!.getBoundingClientRect();
      W = box.width;
      H = box.height;
      const dpr = Math.min(window.devicePixelRatio || 1, quality === "low" ? 1.25 : 1.75);
      (player ?? city)!.resize(W, H, dpr);
      const portrait = portraitNow();
      const size = portrait ? Math.min(W * 0.52, H * 0.26) : Math.min(H * 0.3, 280);
      const cy = portrait ? H * 0.3 : H * 0.33;
      logoFinal = { x: W / 2 - size / 2, y: cy - size / 2, size };
      section.style.setProperty("--gc-reveal-top", `${cy + size / 2 + (portrait ? 20 : 28)}px`);
    };
    sizeUp();
    const ro = new ResizeObserver(() => {
      sizeUp();
      draw(current, performance.now());
    });
    ro.observe(canvas.parentElement!);

    let target = 0;
    let current = 0;
    let raf = 0;
    let running = false;
    let last = performance.now();
    let lastActive = -1;
    let revealInteractive = false;
    let frameSkip = 0;

    const computeTarget = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      target = total > 0 ? clamp01(-r.top / total) : 0;
    };

    const draw = (p: number, now: number) => {
      if (player) player.render(p);
      else city!.render(reduce ? 0.97 : p, now);
      updateOverlays(reduce ? 1 : p);
    };

    const updateOverlays = (p: number) => {
      // Scene copy
      storyScenes.forEach((s, i) => {
        const el = overlayRefs.current[i];
        if (!el) return;
        const [a, b] = s.range;
        const fin = i === 0 ? 1 : ramp(p, a + 0.004, a + 0.034);
        const fout = 1 - ramp(p, b - 0.03, b - 0.004);
        const o = Math.min(fin, fout);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - fin) * 36 - (1 - fout) * 24}px, 0)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });

      // Rail, counter & progress
      let active = growthScenes.findIndex((s) => p >= s.range[0] && p < s.range[1]);
      if (active < 0) active = growthScenes.length - 1;
      if (active !== lastActive) {
        railRefs.current.forEach((li, i) => li?.setAttribute("data-state", i < active ? "past" : i === active ? "active" : "next"));
        if (counterRef.current) counterRef.current.textContent = String(active + 1).padStart(2, "0");
        lastActive = active;
      }
      if (railFillRef.current) railFillRef.current.style.transform = `scaleY(${p})`;
      if (railRef.current) railRef.current.style.opacity = String(1 - ramp(p, 0.86, 0.9));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (hintRef.current) hintRef.current.style.opacity = String(1 - ramp(p, 0.004, 0.03));
      if (skipRef.current) {
        const s = 1 - ramp(p, 0.84, 0.87);
        skipRef.current.style.opacity = String(s);
        skipRef.current.style.pointerEvents = s < 0.5 ? "none" : "auto";
      }

      // Logo: align with the aerial layout, then glide to its hero position.
      const logo = logoRef.current;
      if (logo) {
        const inA = easeInOut(ramp(p, T.logoIn[0], T.logoIn[1]));
        const move = easeInOut(ramp(p, T.logoMove[0], T.logoMove[1]));
        let from = logoFinal;
        if (city) {
          const place = city.logoPlacement(logoGeometry);
          from = { x: place.x, y: place.y, size: place.size };
        } else {
          const s = logoFinal.size * 0.82;
          from = { x: W / 2 - s / 2, y: logoFinal.y + (logoFinal.size - s) / 2, size: s };
        }
        const x = lerp(from.x, logoFinal.x, move);
        const y = lerp(from.y, logoFinal.y, move);
        const size = lerp(from.size, logoFinal.size, move);
        logo.style.opacity = String(inA);
        logo.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${size / logoGeometry.size})`;
        logo.style.visibility = inA < 0.01 ? "hidden" : "visible";
      }

      // Footage mode: darken the last frames so the logo and wordmark read clearly
      // (the code-rendered city handles its own finale dimming).
      if (player && dimRef.current) dimRef.current.style.opacity = String(0.72 * ramp(p, 0.88, 0.96));

      // Wordmark, tagline & CTA
      const reveal = revealRef.current;
      if (reveal) {
        const t = easeInOut(ramp(p, T.text[0], T.text[1]));
        reveal.style.opacity = String(t);
        reveal.style.transform = `translate3d(0, ${(1 - t) * 28}px, 0)`;
        reveal.style.visibility = t < 0.01 ? "hidden" : "visible";
        if (wordmarkRef.current) wordmarkRef.current.style.letterSpacing = `${lerp(0.62, 0.2, t)}em`;
        const interactive = t > 0.6;
        if (interactive !== revealInteractive) {
          revealInteractive = interactive;
          reveal.inert = !interactive;
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      computeTarget();
      // Critically damped follow: smooth on trackpads, catches up fast on flings.
      const diff = target - current;
      current += diff * (1 - Math.exp(-dt / 110));
      if (Math.abs(target - current) < 0.00002) current = target;
      // Low-power devices: drop to ~30fps while settled.
      const settled = Math.abs(diff) < 0.0005;
      if (!(quality === "low" && settled && (frameSkip++ & 1))) draw(current, now);
      if (running) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      // Leaving the viewport mid-transition (e.g. a fast fling): settle on the final state.
      computeTarget();
      current = target;
      draw(current, performance.now());
    };

    computeTarget();
    current = target;
    draw(current, performance.now());
    setVisible(true);

    let io: IntersectionObserver | null = null;
    if (!reduce) {
      io = new IntersectionObserver(([e]) => (e?.isIntersecting ? start() : stop()), { rootMargin: "100px" });
      io.observe(section);
    }
    const onVis = () => (document.hidden ? stop() : io && computeTarget());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io?.disconnect();
      ro.disconnect();
      player?.destroy();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const skip = () => {
    const section = sectionRef.current;
    if (!section) return;
    const end = section.offsetTop + section.offsetHeight - window.innerHeight;
    if (lenis) lenis.scrollTo(end, { duration: 2.4 });
    else window.scrollTo({ top: end, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="growth-city"
      aria-labelledby="gc-title"
      className={cn("relative bg-ink", reduced ? "h-[100svh]" : "gc-scroll h-[540svh] md:h-[760svh]")}
    >
      <p className="sr-only">
        {site.name} is a digital growth agency in Prayagraj, India. This animated story shows how a single business grows
        into a connected digital ecosystem through branding, a website, search visibility, social media and advertising.
      </p>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-[1600ms] ease-out",
            visible ? "opacity-100" : "opacity-0",
          )}
        />

        <div ref={dimRef} aria-hidden className="pointer-events-none absolute inset-0 bg-ink opacity-0" />

        {/* Legibility gradients */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/70 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />

        {/* Scene copy */}
        {!reduced && (
          <div className="container-bs pointer-events-none absolute inset-x-0 bottom-[max(5.5rem,11svh)] md:bottom-[13svh]">
            <div className="relative min-h-[11rem] md:min-h-[14rem]">
              {storyScenes.map((s, i) => (
                <div
                  key={s.id}
                  ref={(el) => {
                    overlayRefs.current[i] = el;
                  }}
                  className="gc-overlay absolute bottom-0 left-0 w-full max-w-[min(100%,58rem)] will-change-transform"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <p className="eyebrow mb-4 flex items-center gap-3 text-green md:mb-5">
                    <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="h-px w-8 bg-green/60" aria-hidden />
                    <span>{s.label}</span>
                  </p>
                  <p className="font-display-tight text-balance-safe max-w-[10.5em] text-[clamp(2.6rem,6vw,6.2rem)] font-semibold text-paper">
                    {s.overlay}
                  </p>
                  <p className="mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-paper/60 md:mt-6 md:text-base">
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scene rail (desktop) */}
        {!reduced && (
          <div ref={railRef} className="absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden>
            <div className="relative flex gap-5">
              <ol className="flex flex-col gap-[1.15rem] text-right">
                {growthScenes.map((s, i) => (
                  <li
                    key={s.id}
                    ref={(el) => {
                      railRefs.current[i] = el;
                    }}
                    data-state={i === 0 ? "active" : "next"}
                    className="gc-rail eyebrow flex items-center justify-end gap-3 text-[0.62rem] transition-colors duration-500"
                  >
                    <span>{s.label}</span>
                    <span className="w-6 font-serif text-[0.9rem] italic normal-case tracking-normal">{ROMAN[i]}</span>
                  </li>
                ))}
              </ol>
              <div className="relative w-px bg-paper/15">
                <div ref={railFillRef} className="absolute inset-0 origin-top bg-green" style={{ transform: "scaleY(0)" }} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile counter */}
        {!reduced && (
          <div className="absolute left-[var(--gutter)] top-[calc(var(--header-h)+0.75rem)] lg:hidden" aria-hidden>
            <p className="eyebrow text-[0.62rem] text-paper/60">
              <span ref={counterRef} className="text-paper">01</span> / 08 · Growth City
            </p>
          </div>
        )}

        {/* Progress */}
        {!reduced && (
          <div className="absolute inset-x-0 bottom-0 h-px bg-paper/10" aria-hidden>
            <div ref={barRef} className="h-full origin-left bg-green" style={{ transform: "scaleX(0)" }} />
          </div>
        )}

        {/* Scroll hint */}
        {!reduced && (
          <div
            ref={hintRef}
            aria-hidden
            className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          >
            <span className="eyebrow text-[0.62rem] text-paper/65">Scroll to explore</span>
            <span className="relative h-10 w-px overflow-hidden bg-paper/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-green" />
            </span>
          </div>
        )}

        {/* Skip */}
        {!reduced && (
          <button
            ref={skipRef}
            type="button"
            onClick={skip}
            className="group absolute bottom-5 right-[var(--gutter)] inline-flex items-center gap-2 rounded-full border border-paper/15 bg-ink/40 px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-paper/70 backdrop-blur-md transition-colors hover:border-paper/40 hover:text-paper md:bottom-6"
          >
            Skip intro
            <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
          </button>
        )}

        {/* Loading state (only when streaming pre-rendered footage) */}
        {loading !== null && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-ink" role="status" aria-live="polite">
            <div className="w-48 text-center">
              <p className="eyebrow text-[0.62rem] text-paper/60">Loading the city</p>
              <div className="mt-4 h-px w-full bg-paper/10">
                <div className="h-full origin-left bg-green transition-transform" style={{ transform: `scaleX(${loading})` }} />
              </div>
            </div>
          </div>
        )}

        {/* Real logo — aligned to the aerial layout, then settles above the wordmark */}
        <div
          ref={logoRef}
          className={cn("pointer-events-none absolute left-0 top-0 origin-top-left", reduced && "hidden")}
          style={{ width: logoGeometry.size, height: logoGeometry.size, opacity: 0, visibility: "hidden" }}
        >
          <Image
            src="/brand/brandspace-logo.png"
            alt="BrandSpace logo"
            width={logoGeometry.size}
            height={logoGeometry.size}
            fetchPriority="low"
            className="logo-on-dark h-full w-full"
          />
        </div>

        <div
          ref={revealRef}
          className={cn(
            "container-bs absolute inset-x-0 text-center",
            reduced ? "top-1/2 -translate-y-1/2" : "top-[var(--gc-reveal-top,60svh)]",
          )}
          style={reduced ? undefined : { opacity: 0, visibility: "hidden" }}
        >
          {reduced && (
            <Image
              src="/brand/brandspace-logo.png"
              alt="BrandSpace logo"
              width={200}
              height={200}
              loading="eager"
              className="logo-on-dark mx-auto mb-8 h-40 w-40"
            />
          )}
          <h1 id="gc-title" className="flex flex-col items-center">
            <span
              ref={wordmarkRef}
              className="font-display pl-[0.2em] text-[clamp(2.2rem,6.4vw,5.6rem)] font-semibold uppercase leading-none tracking-[0.2em] text-paper"
            >
              BrandSpace
            </span>
            <span className="sr-only"> — </span>
            <span className="mt-4 font-serif text-[clamp(1.35rem,2.6vw,2.2rem)] italic leading-tight text-green md:mt-5">
              Future of Business Growth.
            </span>
          </h1>
          <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8 md:mt-10">
            <WhatsAppButton size="lg">Start Growing</WhatsAppButton>
            <TextLink href="#services">Explore what we do</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
