"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { projects, type Project } from "@/data/portfolio";
import { services } from "@/data/services";
import { cn, pad2 } from "@/lib/utils";
import { BrowserFrame } from "./BrowserFrame";
import { MetricsRow } from "./MetricsRow";
import { ArrowUpRight } from "@/components/ui/Icons";
import { TextLink } from "@/components/ui/Button";

const serviceName = (slug: string) => services.find((s) => s.slug === slug)?.shortName ?? slug;

/** Staggered entrance for the copy column. */
const delay = (i: number) => ({ ["--rv-delay" as string]: `${i * 80}ms` }) as React.CSSProperties;

function Frame({ p, i, sizes }: { p: Project; i: number; sizes: string }) {
  return (
    <Link href={`/portfolio/${p.slug}`} data-cursor="View case" aria-label={`${p.name} — view case study`} className="group block">
      {/* Frame drifts gently; the screenshot inside settles from 1.06 → 1 as it enters */}
      <div data-fx="parallax" data-fx-amount="3" data-fx-media="md">
        <div data-reveal="clip">
          <BrowserFrame
            project={p}
            sizes={sizes}
            priority={i === 0}
            mediaProps={{ "data-fx": "zoom", "data-fx-amount": "1.06", "data-fx-trigger": "parent" }}
          />
        </div>
      </div>
    </Link>
  );
}

function Meta({ p, i }: { p: Project; i: number }) {
  return (
    <>
      <span
        aria-hidden
        data-reveal="line"
        className="block h-[2px] w-16 rounded-full"
        style={{ background: p.palette.mood ?? p.palette.accent }}
      />
      <p data-reveal="up" style={delay(0)} className="eyebrow mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/60">
        <span className="text-green">{pad2(i + 1)}</span>
        <span>{p.industry}</span>
        <span aria-hidden>·</span>
        <span>{p.location}</span>
        <span aria-hidden>·</span>
        <span>{p.year}</span>
      </p>
    </>
  );
}

function Links({ p, index }: { p: Project; index: number }) {
  return (
    <div data-reveal="up" style={delay(index)} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
      <TextLink href={`/portfolio/${p.slug}`}>Read case study</TextLink>
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-paper/65 transition-colors hover:text-paper"
      >
        Visit live site
        <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function Pills({ p, index }: { p: Project; index: number }) {
  return (
    <ul data-reveal="up" style={delay(index)} className="mt-6 flex flex-wrap gap-2" aria-label="Services delivered">
      {p.services.map((s) => (
        <li key={s} className="rounded-full border border-paper/12 px-3 py-1 text-[0.72rem] text-paper/65">
          {serviceName(s)}
        </li>
      ))}
    </ul>
  );
}

function Title({ p, index, large }: { p: Project; index: number; large?: boolean }) {
  return (
    <h2
      data-reveal="up"
      style={delay(index)}
      className={cn(
        "font-display-tight mt-4 font-semibold",
        large ? "text-[clamp(2.6rem,5.6vw,5.4rem)]" : "text-[clamp(2.4rem,4.4vw,4rem)]",
      )}
    >
      <Link href={`/portfolio/${p.slug}`} className="transition-colors hover:text-green">
        {p.name}
      </Link>
    </h2>
  );
}

/** Full-width feature: the screenshot spans the grid, the story runs in three columns beneath. */
function WideRow({ p, i }: { p: Project; i: number }) {
  return (
    <article className="border-t border-paper/10 py-16 sm:py-24">
      <Frame p={p} i={i} sizes="(min-width: 1536px) 1480px, 100vw" />
      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Meta p={p} i={i} />
          <Title p={p} index={1} large />
        </div>
        <div className="lg:col-span-4 lg:pt-10">
          <p data-reveal="up" style={delay(2)} className="text-[1.05rem] leading-relaxed text-paper/60">
            {p.overview}
          </p>
          <Pills p={p} index={3} />
        </div>
        <div className="lg:col-span-3 lg:pt-10">
          <div data-reveal="up" style={delay(3)}>
            <MetricsRow project={p} compact />
          </div>
          <Links p={p} index={4} />
        </div>
      </div>
    </article>
  );
}

/** Split row: screenshot and story side by side, alternating sides. */
function SplitRow({ p, i, flip }: { p: Project; i: number; flip: boolean }) {
  return (
    <article className="grid items-center gap-10 border-t border-paper/10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12">
      <div className={cn("lg:col-span-7", flip && "lg:order-2 lg:col-start-6")}>
        <Frame p={p} i={i} sizes="(min-width: 1024px) 56vw, 100vw" />
      </div>
      <div className={cn("lg:col-span-5", flip ? "lg:order-1 lg:col-start-1 lg:row-start-1" : "lg:col-start-8")}>
        <Meta p={p} i={i} />
        <Title p={p} index={1} />
        <p data-reveal="up" style={delay(2)} className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-paper/60">
          {p.overview}
        </p>
        <Pills p={p} index={3} />
        <div data-reveal="up" style={delay(4)} className="mt-8">
          <MetricsRow project={p} compact />
        </div>
        <Links p={p} index={5} />
      </div>
    </article>
  );
}

export function PortfolioList() {
  const [filter, setFilter] = useState<string>("all");
  const usedServices = useMemo(() => services.filter((s) => projects.some((p) => p.services.includes(s.slug))), []);
  const list = filter === "all" ? projects : projects.filter((p) => p.services.includes(filter));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by service">
        {[{ slug: "all", shortName: "All work" }, ...usedServices].map((s) => {
          const on = filter === s.slug;
          const count = s.slug === "all" ? projects.length : projects.filter((p) => p.services.includes(s.slug)).length;
          return (
            <button
              key={s.slug}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(s.slug)}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.8rem] font-medium transition-colors",
                on ? "border-green bg-green text-ink" : "border-paper/15 text-paper/65 hover:border-paper/40 hover:text-paper",
              )}
            >
              {s.shortName}
              <span className={cn("ml-2 tabular-nums", on ? "text-ink/60" : "text-paper/65")}>{count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {list.length} projects
      </p>
      <div className="mt-8">
        {/* Rhythm by position (so it holds when filtered): feature, split, split flipped, … */}
        {list.map((p, pos) => {
          const i = projects.indexOf(p);
          const beat = pos % 3;
          return beat === 0 ? <WideRow key={p.slug} p={p} i={i} /> : <SplitRow key={p.slug} p={p} i={i} flip={beat === 2} />;
        })}
      </div>
    </div>
  );
}
