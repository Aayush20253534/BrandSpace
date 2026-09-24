import Link from "next/link";
import { getCategory, type BlogPost } from "@/data/blog";
import { cn, formatDate } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/Icons";
import { Cover } from "./Cover";

export function PostMeta({ post, minutes, className }: { post: BlogPost; minutes: number; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem]", className)}>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{minutes} min read</span>
    </p>
  );
}

/**
 * Card shapes for an editorial rhythm. Below `lg` every variant falls back
 * to the same simple 4:3 card so small screens stay easy to scan.
 */
export type CardVariant = "standard" | "portrait" | "landscape" | "wide" | "compact" | "feature";

const media: Record<CardVariant, string> = {
  standard: "aspect-[4/3]",
  portrait: "aspect-[4/3] lg:aspect-[4/5]",
  landscape: "aspect-[4/3] lg:aspect-[16/11]",
  wide: "aspect-[4/3] lg:aspect-[3/2]",
  compact: "aspect-[4/3] lg:aspect-square",
  feature: "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]",
};

const sizes: Record<CardVariant, string> = {
  standard: "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw",
  portrait: "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw",
  landscape: "(min-width: 1024px) 56vw, (min-width: 640px) 50vw, 100vw",
  wide: "(min-width: 1024px) 56vw, (min-width: 640px) 50vw, 100vw",
  compact: "(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw",
  feature: "(min-width: 1536px) 1480px, 100vw",
};

const titleSize: Record<CardVariant, string> = {
  standard: "text-[1.45rem] leading-[1.15]",
  compact: "text-[1.45rem] leading-[1.15]",
  portrait: "text-[1.45rem] leading-[1.15] lg:text-[clamp(1.6rem,2.3vw,2.2rem)] lg:leading-[1.08]",
  landscape: "text-[1.45rem] leading-[1.15] lg:text-[clamp(1.6rem,2.3vw,2.2rem)] lg:leading-[1.08]",
  wide: "text-[1.45rem] leading-[1.15] lg:text-[clamp(1.6rem,2.3vw,2.2rem)] lg:leading-[1.08]",
  feature: "text-[clamp(2rem,4.2vw,4rem)] leading-[1.02]",
};

/** Animated "Read article" cue — decorative; the title is the link. */
export function ReadCue({ light, className }: { light?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
        light ? "text-green-deep" : "text-green",
        className,
      )}
    >
      <span className="h-px w-6 bg-current transition-[width] duration-500 ease-[var(--ease-out-expo)] group-hover:w-12" />
      Read article
      <ArrowRight size={15} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
    </span>
  );
}

export function CategoryTag({ slug, light }: { slug: string; light?: boolean }) {
  const cat = getCategory(slug);
  if (!cat) return null;
  return (
    <Link
      href={`/blog/category/${cat.slug}`}
      className={cn(
        "eyebrow relative z-[2] inline-flex items-center gap-2 text-[0.68rem] transition-colors",
        light ? "text-green-deep hover:text-ink" : "text-green hover:text-paper",
      )}
    >
      <span
        aria-hidden
        className="h-[5px] w-[5px] rounded-full bg-current transition-[width,border-radius] duration-500 ease-[var(--ease-out-expo)] group-hover:w-4 group-hover:rounded-[1px]"
      />
      {cat.name}
    </Link>
  );
}

export function PostCard({
  post,
  minutes,
  tone = "dark",
  variant = "standard",
  eager,
  className,
  headingLevel = 3,
}: {
  post: BlogPost;
  minutes: number;
  tone?: "dark" | "light";
  variant?: CardVariant;
  eager?: boolean;
  className?: string;
  headingLevel?: 2 | 3;
}) {
  const light = tone === "light";
  const feature = variant === "feature";
  const Heading = headingLevel === 2 ? "h2" : "h3";

  const title = (
    <Heading
      className={cn(
        "font-display font-semibold tracking-[-0.03em] transition-colors duration-500",
        titleSize[variant],
        feature ? "mt-4 text-balance-safe" : "mt-3",
        light ? "text-ink group-hover:text-green-deep" : "text-paper group-hover:text-green",
      )}
    >
      {/* The ::after stretches the link over the whole card; the nudge lives on
          an inner span so it never becomes the overlay's containing block. */}
      <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:z-[1] after:content-['']">
        <span className="inline-block transition-[translate] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
          {post.title}
        </span>
      </Link>
    </Heading>
  );

  return (
    <article className={cn("group relative", className)}>
      <div data-reveal="clip">
        <Cover photo={post.cover} sizes={sizes[variant]} eager={eager} priority={eager && feature} className={cn("rounded-[8px]", media[variant])} />
      </div>
      {feature ? (
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <CategoryTag slug={post.category} light={light} />
            {title}
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <p className={cn("text-lg leading-relaxed", light ? "text-ink/65" : "text-paper/65")}>{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <PostMeta post={post} minutes={minutes} className={light ? "text-ink/65" : "text-paper/60"} />
              <ReadCue light={light} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <CategoryTag slug={post.category} light={light} />
          {title}
          <p className={cn("mt-3 text-[0.98rem] leading-relaxed", light ? "text-ink/65" : "text-paper/65", variant === "compact" && "lg:line-clamp-3")}>
            {post.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <PostMeta post={post} minutes={minutes} className={light ? "text-ink/65" : "text-paper/60"} />
            <ReadCue light={light} />
          </div>
        </div>
      )}
    </article>
  );
}

/** Editorial placement per position: portrait + landscape, wide + compact, then an even grid. */
const rhythm: { variant: CardVariant; cls: string }[] = [
  { variant: "portrait", cls: "lg:col-span-5" },
  { variant: "landscape", cls: "lg:col-span-7 lg:mt-28" },
  { variant: "wide", cls: "lg:col-span-7" },
  { variant: "compact", cls: "lg:col-span-4 lg:col-start-9 lg:self-end" },
];

export function PostGrid({
  posts,
  tone = "light",
  eagerFirst,
}: {
  posts: (BlogPost & { minutes: number })[];
  tone?: "dark" | "light";
  /** Load the first cover eagerly when the grid sits near the top of the page. */
  eagerFirst?: boolean;
}) {
  return (
    <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-24">
      {posts.map((p, i) => {
        const slot = rhythm[i] ?? { variant: "standard" as const, cls: "lg:col-span-4" };
        return (
          <PostCard
            key={p.slug}
            post={p}
            minutes={p.minutes}
            tone={tone}
            variant={slot.variant}
            className={slot.cls}
            eager={eagerFirst && i === 0}
          />
        );
      })}
    </div>
  );
}
