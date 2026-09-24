import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/** Breadcrumb trail (visible) — pair with breadcrumbSchema() for JSON-LD. */
export function Breadcrumbs({
  items,
  tone = "light",
  className,
  lastIsCurrent = true,
}: {
  items: Crumb[];
  tone?: "light" | "dark";
  className?: string;
  /** Set false when the trail stops at a parent of the current page. */
  lastIsCurrent?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn("flex flex-wrap items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.18em]", tone === "light" ? "text-paper/45" : "text-ink/45")}>
        {items.map((c, i) => {
          const last = lastIsCurrent && i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={tone === "light" ? "text-paper/80" : "text-ink/80"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className={cn("transition-colors", tone === "light" ? "hover:text-paper" : "hover:text-ink")}>
                  {c.name}
                </Link>
              )}
              {i < items.length - 1 && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Editorial page header used on inner pages. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("grain relative overflow-hidden bg-ink pb-16 pt-[calc(var(--header-h)+3.5rem)] text-paper sm:pb-24 sm:pt-[calc(var(--header-h)+5rem)]", className)}>
      <div aria-hidden className="hairline-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-green/[0.07] blur-3xl" />
      <div className="container-bs relative z-[2]">
        <Breadcrumbs items={crumbs} />
        <p data-reveal="up" className="eyebrow mt-10 flex items-center gap-3 text-paper/60 sm:mt-14">
          <span className="h-[7px] w-[7px] rounded-full bg-green" aria-hidden />
          {eyebrow}
        </p>
        <RevealText
          as="h1"
          text={title}
          className="font-display-tight mt-6 max-w-[16ch] text-[clamp(3rem,8.4vw,8.4rem)] font-semibold"
        />
        {intro && (
          <p data-reveal="up" className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/65 sm:text-xl" style={{ ["--rv-delay" as string]: "200ms" }}>
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
