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

function CaseRow({ p, i }: { p: Project; i: number }) {
  const flip = i % 2 === 1;
  return (
    <article className="grid items-center gap-10 border-t border-paper/10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12">
      <Link
        href={`/portfolio/${p.slug}`}
        data-cursor="View case"
        aria-label={`${p.name} — view case study`}
        className={cn("group block lg:col-span-7", flip && "lg:order-2 lg:col-start-6")}
      >
        <div data-reveal="clip">
          <BrowserFrame project={p} sizes="(min-width: 1024px) 56vw, 100vw" priority={i === 0} />
        </div>
      </Link>

      <div className={cn("lg:col-span-5", flip ? "lg:order-1 lg:col-start-1 lg:row-start-1" : "lg:col-start-8")}>
        <p data-reveal="up" className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/60">
          <span className="text-green">{pad2(i + 1)}</span>
          <span>{p.industry}</span>
          <span aria-hidden>·</span>
          <span>{p.location}</span>
          <span aria-hidden>·</span>
          <span>{p.year}</span>
        </p>
        <h2 data-reveal="up" className="font-display-tight mt-4 text-[clamp(2.4rem,4.4vw,4rem)] font-semibold">
          <Link href={`/portfolio/${p.slug}`} className="transition-colors hover:text-green">
            {p.name}
          </Link>
        </h2>
        <p data-reveal="up" className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-paper/60">
          {p.overview}
        </p>
        <ul data-reveal="up" className="mt-6 flex flex-wrap gap-2" aria-label="Services delivered">
          {p.services.map((s) => (
            <li key={s} className="rounded-full border border-paper/12 px-3 py-1 text-[0.72rem] text-paper/65">
              {serviceName(s)}
            </li>
          ))}
        </ul>
        <div data-reveal="up" className="mt-8">
          <MetricsRow project={p} compact />
        </div>
        <div data-reveal="up" className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
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
        {list.map((p) => (
          <CaseRow key={p.slug} p={p} i={projects.indexOf(p)} />
        ))}
      </div>
    </div>
  );
}
