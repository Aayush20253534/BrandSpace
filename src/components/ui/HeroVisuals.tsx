import Image from "next/image";
import { projects, displayUrl } from "@/data/portfolio";
import { postsByDate, getCategory } from "@/data/blog";
import { team } from "@/data/team";
import { cn } from "@/lib/utils";
import { Cover } from "@/components/blog/Cover";
import { Portrait } from "@/components/about/Portrait";

/**
 * Page-specific compositions for <PageHero visual={…}>. Decorative (the
 * hero wraps them in aria-hidden), lightweight (a few small images, CSS
 * float, GSAP parallax via data-fx) and hidden below `md`.
 */

function Layer({
  className,
  depth,
  delay = 0,
  children,
}: {
  className?: string;
  /** Parallax travel, % of the layer's own height. */
  depth: number;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("absolute", className)} data-fx="parallax" data-fx-amount={depth} data-fx-media="md">
      <div className="hv-float" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  );
}

/** Portfolio — floating browser previews of real launches. */
export function PortfolioHeroVisual() {
  const pick = ["casa-de-grande", "rovauto", "lotus-family-dental"]
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p) => p?.preview);
  const places = [
    { cls: "right-0 top-0 w-[70%]", depth: 8, delay: 0 },
    { cls: "left-0 top-[38%] w-[50%]", depth: 18, delay: 900 },
    { cls: "right-[5%] top-[62%] w-[40%]", depth: 28, delay: 1800 },
  ];
  return (
    <div className="relative h-[22rem] lg:h-[27rem]">
      <div aria-hidden className="absolute left-[30%] top-[20%] h-56 w-56 rounded-full bg-green/10 blur-3xl" />
      {pick.map((p, i) => (
        <Layer key={p!.slug} className={places[i]!.cls} depth={places[i]!.depth} delay={places[i]!.delay}>
          <div className="overflow-hidden rounded-[8px] bg-ink-3 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)] ring-1 ring-paper/10">
            <div className="flex h-5 items-center gap-1 px-2.5 lg:h-6">
              <span className="h-1.5 w-1.5 rounded-full bg-paper/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-paper/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-paper/25" />
              <span className="mx-auto truncate rounded-full bg-ink-4 px-2 text-[0.5rem] leading-[1.6] text-paper/55">{displayUrl(p!.url)}</span>
            </div>
            <div className="relative aspect-[16/10]">
              <Image src={p!.preview!.src} alt="" fill sizes="(min-width: 1024px) 32vw, 60vw" className="object-cover object-top" />
            </div>
          </div>
        </Layer>
      ))}
    </div>
  );
}

/** Blog — an editorial collage of the latest article photography. */
export function BlogHeroVisual() {
  const latest = postsByDate().slice(0, 3);
  const places = [
    { cls: "right-[3%] top-0 w-[44%] rotate-[1.5deg]", aspect: "aspect-[4/5]", depth: 8, delay: 0 },
    { cls: "left-0 top-[16%] w-[46%] -rotate-2", aspect: "aspect-[4/3]", depth: 18, delay: 1100 },
    { cls: "left-[34%] top-[54%] w-[28%] -rotate-[0.5deg]", aspect: "aspect-square", depth: 24, delay: 2000 },
  ];
  return (
    <div className="relative h-[22rem] lg:h-[27rem]">
      {latest.map((post, i) => (
        <Layer key={post.slug} className={places[i]!.cls} depth={places[i]!.depth} delay={places[i]!.delay}>
          <div className="rounded-[6px] bg-paper p-1.5 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)]">
            <Cover
              photo={{ ...post.cover, alt: "" }}
              sizes="(min-width: 1024px) 22vw, 40vw"
              reveal={false}
              label={getCategory(post.category)?.name}
              className={cn("rounded-[4px]", places[i]!.aspect)}
            />
          </div>
        </Layer>
      ))}
    </div>
  );
}

/** About — the founding team, set at staggered heights. */
export function AboutHeroVisual() {
  const offsets = ["mt-0", "mt-14", "mt-5", "mt-20"];
  const depths = [4, 10, 6, 12];
  return (
    <div className="grid grid-cols-4 gap-3 lg:gap-4">
      {team.map((m, i) => (
        <div key={m.slug} className={offsets[i]} data-fx="parallax" data-fx-amount={depths[i]} data-fx-media="md">
          <Portrait member={m} sizes="(min-width: 1024px) 12vw, 22vw" className="rounded-[6px] ring-1 ring-paper/10" />
          <p className="mt-3 truncate font-display text-sm font-semibold tracking-[-0.02em] text-paper/85">{m.name}</p>
        </div>
      ))}
    </div>
  );
}
