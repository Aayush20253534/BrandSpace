"use client";

import Link from "next/link";
import { useState } from "react";
import { testimonials } from "@/data/testimonials";
import { cn, pad2 } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowRight } from "@/components/ui/Icons";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const t = testimonials[index]!;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  return (
    <section aria-labelledby="feedback-title" className="bg-paper py-24 text-ink sm:py-32">
      <div className="container-bs">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="06" tone="dark">
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
          <div className="flex items-center gap-3" data-reveal="up">
            <span className="mr-3 text-sm tabular-nums text-ink/65" aria-live="polite">
              {pad2(index + 1)} / {pad2(count)}
            </span>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid h-14 w-14 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid h-14 w-14 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <figure key={t.id} className="mt-14 grid gap-10 border-t border-ink/15 pt-12 lg:mt-20 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 lg:flex-col lg:items-start">
              <Avatar name={t.name} photo={t.photo} size={72} className="animate-[panelIn_0.7s_var(--ease-out-expo)_both]" />
              <figcaption className="animate-[panelIn_0.7s_var(--ease-out-expo)_0.1s_both]">
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
            <p className="animate-[quoteIn_0.9s_var(--ease-out-expo)_both] font-serif text-[clamp(1.75rem,3.6vw,3.3rem)] italic leading-[1.18] tracking-[-0.01em] text-ink">
              <span className="text-green-deep">“</span>
              {t.quote}
              <span className="text-green-deep">”</span>
            </p>
            <PlaceholderNote status={t.status} tone="dark" className="mt-8">
              Sample testimonial for layout — to be replaced with approved client feedback.
            </PlaceholderNote>
          </blockquote>
        </figure>

        <div className="mt-12 flex gap-2" role="group" aria-label="Choose testimonial">
          {testimonials.map((x, i) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={i === index}
              aria-label={`${x.company} testimonial`}
              onClick={() => setIndex(i)}
              className="group relative h-8 flex-1"
            >
              <span className={cn("absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-colors", i === index ? "bg-ink" : "bg-ink/15 group-hover:bg-ink/40")} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
