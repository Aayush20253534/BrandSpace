import Link from "next/link";
import { blogCategories, blogPosts } from "@/data/blog";
import { cn } from "@/lib/utils";

/** Category links (real URLs, crawlable) for the blog index and category pages. */
export function CategoryNav({ active }: { active?: string }) {
  const cats = blogCategories.filter((c) => blogPosts.some((p) => p.category === c.slug));
  return (
    <nav aria-label="Blog categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/blog"
            aria-current={!active ? "page" : undefined}
            className={cn(
              "inline-block rounded-full border px-4 py-2 text-[0.8rem] font-medium transition-colors",
              !active ? "border-green bg-green text-ink" : "border-paper/15 text-paper/65 hover:border-paper/40 hover:text-paper",
            )}
          >
            All articles
          </Link>
        </li>
        {cats.map((c) => {
          const on = active === c.slug;
          return (
            <li key={c.slug}>
              <Link
                href={`/blog/category/${c.slug}`}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "inline-block rounded-full border px-4 py-2 text-[0.8rem] font-medium transition-colors",
                  on ? "border-green bg-green text-ink" : "border-paper/15 text-paper/65 hover:border-paper/40 hover:text-paper",
                )}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
