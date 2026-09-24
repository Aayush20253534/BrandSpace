"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { testimonials } from "@/data/testimonials";
import { cn, pad2 } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowRight } from "@/components/ui/Icons";

/**
 * Client feedback, navigated manually (no autoplay). The outgoing quote lifts
 * away with a soft blur, the next one settles in, and the person's details
 * follow a beat later. Reduced motion swaps instantly.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0); // selected (counter, progress, buttons)
  const [shown, setShown] = useState(0); // rendered quote
  const figRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const count = testimonials.length;
  const t = testimonials[shown]!;

  const parts = () => {
    const fig = figRef.current;
    return {
      quote: fig?.querySelector<HTMLElement>("[data-t-quote]") ?? null,
      meta: fig ? Array.from(fig.querySelectorAll<HTMLElement>("[data-t-meta]")) : [],
    };
  };

  const select = (next: number) => {
    const target = (next + count) % count;
    if (target === index) return;
    setIndex(target);
    const { quote, meta } = parts();
    if (!quote || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    gsap.killTweensOf([quote, ...meta]);
    gsap.to(meta, { opacity: 0, y: -8, duration: 0.28, ease: "power2.in" });
    gsap.to(quote, {
      opacity: 0,
      y: -16,
      filter: "blur(6px)",
      duration: 0.36,
      ease: "power2.in",
      onComplete: () => setShown(target),
    });
  };

  // Once the next testimonial is in the DOM, bring it in.
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const { quote, meta } = parts();
    if (!quote || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      quote,
      { opacity: 0, y: 20, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "expo.out", clearProps: "filter" },
    );
    gsap.fromTo(meta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.08, delay: 0.14 });
  }, [shown]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      select(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      select(index - 1);
    }
  };

  return (
    <section aria-labelledby="feedback-title" className="bg-paper py-24 text-ink sm:py-32">
      <div className="container-bs">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="07" tone="dark">
              Client Feedback
            </SectionLabel>
            <RevealText
              id="feedback-title"
              as="h2"
              text={"In their *words.*"}
              className="font-display-tight mt-6 text-[clamp(2.7rem,6.4vw,6rem)] font-semibold"
              accentClassName="font-serif italic font-normal tracking-[-0.02em] text-green-deep"
            />
          </div>
          <div className="flex items-center gap-3" data-reveal="up" onKeyDown={onKey}>
            <span className="mr-3 text-sm tabular-nums text-ink/65" aria-live="polite">
              {pad2(index + 1)} / {pad2(count)}
            </span>
            <button
              type="button"
              onClick={() => select(index - 1)}
              aria-label="Previous testimonial"
              className="group grid h-14 w-14 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <ArrowRight size={20} className="rotate-180 transition-transform duration-500 group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => select(index + 1)}
              aria-label="Next testimonial"
              className="group grid h-14 w-14 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <ArrowRight size={20} className="transition-transform duration-500 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <figure ref={figRef} className="mt-14 grid gap-10 border-t border-ink/15 pt-12 lg:mt-20 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 lg:flex-col lg:items-start">
              <div data-t-meta>
                <Avatar name={t.name} photo={t.photo} size={72} />
              </div>
              <figcaption data-t-meta>
                <span className="block font-display text-lg font-semibold tracking-[-0.02em]">{t.name}</span>
                <span className="block text-sm text-ink/65">
                  {t.role}, {t.company}
                </span>
                {t.project && (
                  <Link href={`/portfolio/${t.project}`} className="mt-3 inline-block text-sm font-medium text-green-deep underline-offset-4 hover:underline">
                    Read the case study
                  </Link>
                )}
              </figcaption>
            </div>
          </div>
          <blockquote className="lg:col-span-9">
            <p data-t-quote className="font-serif text-[clamp(1.75rem,3.6vw,3.3rem)] italic leading-[1.18] tracking-[-0.01em] text-ink">
              <span className="text-green-deep">“</span>
              {t.quote}
              <span className="text-green-deep">”</span>
            </p>
            <PlaceholderNote status={t.status} tone="dark" className="mt-8">
              Sample testimonial for layout — to be replaced with approved client feedback.
            </PlaceholderNote>
          </blockquote>
        </figure>

        <div className="mt-12 flex gap-2" role="group" aria-label="Choose testimonial" onKeyDown={onKey}>
          {testimonials.map((x, i) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={i === index}
              aria-label={`${x.company} testimonial`}
              onClick={() => select(i)}
              className="group relative h-8 flex-1"
            >
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/15 transition-colors group-hover:bg-ink/40" />
              <span
                className={cn(
                  "absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 origin-left bg-ink transition-transform duration-700 ease-[var(--ease-out-expo)]",
                  i === index ? "scale-x-100" : i < index ? "scale-x-100 opacity-30" : "scale-x-0",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
