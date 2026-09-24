import Image from "next/image";
import { displayUrl, type Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/** Minimal browser chrome around a website preview. */
export function BrowserFrame({
  project,
  className,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  priority,
  zoom = true,
  tone = "dark",
  mediaProps,
}: {
  project: Project;
  className?: string;
  sizes?: string;
  /** Above-the-fold LCP image: load eagerly with high fetch priority. */
  priority?: boolean;
  /** Slow zoom on reveal / hover. */
  zoom?: boolean;
  tone?: "dark" | "light";
  /** Attributes for the wrapper around the screenshot (e.g. scroll-driven effects). */
  mediaProps?: React.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string>;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1",
        tone === "dark" ? "bg-ink-3 ring-paper/10" : "bg-white ring-ink/10",
        className,
      )}
    >
      <div className={cn("flex h-8 items-center gap-3 px-3.5 sm:h-9", tone === "dark" ? "bg-ink-3" : "bg-paper-2")}>
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        <span
          className={cn(
            "mx-auto flex h-5 max-w-[60%] flex-1 items-center justify-center truncate rounded-full px-3 text-[0.65rem] tracking-wide sm:h-6 sm:text-[0.7rem]",
            tone === "dark" ? "bg-ink-4 text-paper/65" : "bg-white text-ink/65",
          )}
        >
          {displayUrl(project.url)}
        </span>
        <span className="w-10" aria-hidden />
      </div>
      <div className="relative aspect-[16/9] overflow-hidden">
        <div {...mediaProps} className={cn("absolute inset-0", mediaProps?.className)}>
          {project.preview ? (
            <Image
              src={project.preview.src}
              alt={project.preview.alt}
              fill
              sizes={sizes}
              loading={priority ? "eager" : undefined}
              fetchPriority={priority ? "high" : undefined}
              className={cn(
                "object-cover object-top",
                zoom && "rv-zoom transition-[scale,translate] duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:translate-y-[-0.6%] group-hover:scale-[1.035]",
              )}
            />
          ) : (
            <PreviewPlaceholder project={project} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Designed stand-in for projects whose screenshot hasn't been added yet
 * (drop a 1600×900 image into /public/portfolio/<slug>/hero.webp and set
 * `preview` in src/data/portfolio.ts).
 */
/** Black or white, whichever reads better on `hex`. */
function readableOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return L > 0.18 ? "#111" : "#fff";
}

function PreviewPlaceholder({ project }: { project: Project }) {
  const { bg, fg, accent } = project.palette;
  const onAccent = readableOn(accent);
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: bg, color: fg }} role="img" aria-label={`${project.name} website preview`}>
      <div className="flex items-center justify-between px-[5%] py-[3%] text-[clamp(0.45rem,0.9vw,0.75rem)] font-medium uppercase tracking-[0.18em]">
        <span>{project.name}</span>
        <span className="hidden gap-[1.5em] sm:flex" aria-hidden>
          <span>Treatments</span>
          <span>About</span>
          <span>Contact</span>
        </span>
        <span className="rounded-full px-[1.2em] py-[0.6em]" style={{ background: accent, color: onAccent }}>
          Book
        </span>
      </div>
      <div className="grid flex-1 grid-cols-12 items-center gap-[4%] px-[5%]">
        <div className="col-span-7">
          <p className="flex items-center gap-[0.6em] text-[clamp(0.45rem,0.8vw,0.7rem)] font-semibold uppercase tracking-[0.2em]">
            <span className="inline-block h-[0.6em] w-[0.6em] rounded-full" style={{ background: accent }} aria-hidden />
            {project.industry}
          </p>
          <p className="font-display-tight mt-[0.4em] text-[clamp(1.2rem,3.4vw,3rem)] font-semibold">{project.summary}</p>
          <span
            className="mt-[1.2em] inline-block rounded-full px-[1.4em] py-[0.7em] text-[clamp(0.45rem,0.8vw,0.7rem)] font-semibold uppercase tracking-[0.14em]"
            style={{ background: accent, color: onAccent }}
          >
            Book an appointment
          </span>
        </div>
        <div className="col-span-5 aspect-[4/5] w-full overflow-hidden rounded-[6%]" style={{ background: `linear-gradient(150deg, ${accent}55, ${accent}15 60%, ${fg}10)` }}>
          <svg viewBox="0 0 100 125" className="h-full w-full" aria-hidden>
            <circle cx="50" cy="48" r="20" fill={accent} fillOpacity="0.35" />
            <path d="M18 125c0-24 14-40 32-40s32 16 32 40Z" fill={accent} fillOpacity="0.28" />
          </svg>
        </div>
      </div>
      <div className="pb-[3%]" />
    </div>
  );
}
