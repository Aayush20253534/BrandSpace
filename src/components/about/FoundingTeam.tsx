"use client";

import { useState } from "react";
import { team } from "@/data/team";
import { cn, pad2 } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { Plus } from "@/components/ui/Icons";
import { Portrait } from "./Portrait";

export function FoundingTeam() {
  const [active, setActive] = useState(0);

  return (
    <section id="founding-team" aria-labelledby="team-title" className="grain relative overflow-clip bg-ink py-24 text-paper sm:py-32 lg:py-40">
      <div className="container-bs relative z-[2]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index="06">The people</SectionLabel>
            <RevealText
              id="team-title"
              as="h2"
              text={"Meet the\n*founding team.*"}
              className="font-display-tight mt-6 text-[clamp(3rem,8vw,8rem)] font-semibold uppercase"
              accentClassName="font-serif italic font-normal normal-case tracking-[-0.02em] text-green"
            />
          </div>
          <p data-reveal="up" className="max-w-sm text-lg leading-relaxed text-paper/60 lg:col-span-4 lg:justify-self-end">
            Four founders, one studio. Strategy, design, engineering and performance marketing — under one roof, on every
            project.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* Portrait stage (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <div className="relative overflow-hidden rounded-[6px]" data-fx="parallax" data-fx-amount="2" data-fx-media="lg">
                {team.map((m, i) => (
                  <div
                    key={m.slug}
                    aria-hidden={i !== active}
                    className={cn(
                      "transition-[opacity,transform,clip-path] duration-[900ms] ease-[var(--ease-out-expo)]",
                      i === 0 ? "relative" : "absolute inset-0",
                      i === active ? "z-[1] scale-100 opacity-100 [clip-path:inset(0_0_0_0)]" : "scale-[1.04] opacity-0 [clip-path:inset(0_0_100%_0)]",
                    )}
                  >
                    <Portrait member={m} sizes="(min-width: 1024px) 38vw, 1px" eager={i === 0} />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-display font-semibold">{team[active]!.name}</span>
                <span className="text-paper/60">{team[active]!.status === "verified" ? team[active]!.role : "Co-Founder"}</span>
              </div>
            </div>
          </div>

          {/* Names */}
          <ol className="border-t border-paper/10 lg:col-span-7">
            {team.map((m, i) => {
              const on = i === active;
              return (
                <li key={m.slug} data-reveal="words" style={{ ["--rv-delay" as string]: `${i * 110}ms` }} className="border-b border-paper/10">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => window.matchMedia("(min-width: 1024px)").matches && setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={on}
                    aria-controls={`bio-${m.slug}`}
                    className="group flex w-full items-start gap-5 py-7 text-left sm:py-9"
                  >
                    <span className={cn("mt-3 w-8 shrink-0 text-xs tabular-nums transition-colors", on ? "text-green" : "text-paper/65")}>{pad2(i + 1)}</span>
                    <span className="flex-1">
                      <span
                        className={cn(
                          "block font-display-tight text-[clamp(2.4rem,5.4vw,5rem)] font-semibold transition-[color,transform] duration-700 ease-[var(--ease-out-expo)]",
                          on ? "translate-x-2 text-paper" : "text-paper/42 group-hover:text-paper/70",
                        )}
                      >
                        {/* Names rise from behind a mask as the list enters */}
                        <span className="rw">
                          <span>{m.name}</span>
                        </span>
                      </span>
                      <span className={cn("mt-3 block text-sm font-medium uppercase tracking-[0.16em] transition-colors", on ? "text-green" : "text-paper/60")}>
                        {m.status === "verified" ? m.role : "Co-Founder"}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-3 grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-500",
                        on ? "rotate-45 border-green bg-green text-ink" : "border-paper/15 text-paper/60",
                      )}
                      aria-hidden
                    >
                      <Plus size={18} />
                    </span>
                  </button>
                  <div
                    id={`bio-${m.slug}`}
                    className={cn("grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                  >
                    <div className="overflow-hidden" inert={!on}>
                      <div className="grid gap-6 pb-10 pl-[3.25rem] sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-8 lg:block">
                        <Portrait member={m} className="w-40 rounded-[4px] sm:w-full lg:hidden" sizes="(min-width: 640px) 12rem, 10rem" />
                        <div>
                          <p className="max-w-xl text-[1.05rem] leading-relaxed text-paper/70">
                            {m.status === "verified" ? m.bio : "Co-founder at BrandSpace."}
                          </p>
                          {m.status === "verified" && (
                            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Focus areas">
                              {m.focus.map((f) => (
                                <li key={f} className="rounded-full border border-paper/12 px-3 py-1 text-[0.75rem] text-paper/65">
                                  {f}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <PlaceholderNote status={team.map((m) => m.status)} className="mt-10">
          Founder photography and detailed profiles will be added after final approval.
        </PlaceholderNote>
      </div>
    </section>
  );
}
