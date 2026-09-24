import Image from "next/image";
import Link from "next/link";
import { getCategory, type BlogPost } from "@/data/blog";
import { cn, formatDate } from "@/lib/utils";

export function PostMeta({ post, minutes, className }: { post: BlogPost; minutes: number; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem]", className)}>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{minutes} min read</span>
    </p>
  );
}

export function PostCard({
  post,
  minutes,
  tone = "dark",
  size = "md",
  eager,
}: {
  post: BlogPost;
  minutes: number;
  tone?: "dark" | "light";
  size?: "md" | "lg";
  eager?: boolean;
}) {
  const cat = getCategory(post.category);
  const light = tone === "light";
  return (
    <article className={cn("group relative", size === "lg" && "grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12")}>
      <div data-reveal="clip" className={cn(size === "lg" && "lg:col-span-7")}>
        <div className="relative aspect-[16/9] overflow-hidden rounded-[8px] bg-ink-3">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes={size === "lg" ? "(min-width: 1024px) 56vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
            loading={eager ? "eager" : undefined}
            fetchPriority={eager ? "high" : undefined}
            className="rv-zoom object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
        </div>
      </div>
      <div className={cn(size === "lg" ? "lg:col-span-5" : "mt-6")}>
        {cat && (
          <Link
            href={`/blog/category/${cat.slug}`}
            className={cn("relative z-[2] eyebrow text-[0.68rem] transition-colors", light ? "text-green-deep hover:text-ink" : "text-green hover:text-paper")}
          >
            {cat.name}
          </Link>
        )}
        <h3
          className={cn(
            "mt-3 font-display font-semibold tracking-[-0.03em] transition-colors",
            size === "lg" ? "text-[clamp(2rem,3.6vw,3.3rem)] leading-[1.04]" : "text-[1.45rem] leading-[1.15]",
            light ? "text-ink group-hover:text-green-deep" : "text-paper group-hover:text-green",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className={cn("mt-3 leading-relaxed", size === "lg" ? "text-lg" : "text-[0.98rem]", light ? "text-ink/65" : "text-paper/55")}>
          {post.excerpt}
        </p>
        <PostMeta post={post} minutes={minutes} className={cn("mt-5", light ? "text-ink/45" : "text-paper/40")} />
      </div>
    </article>
  );
}
