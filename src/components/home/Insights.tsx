import Link from "next/link";
import { postsByDate } from "@/data/blog";
import { readingTime } from "@/lib/blog";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { Cover } from "@/components/blog/Cover";
import { CategoryTag, PostCard, PostMeta, ReadCue } from "@/components/blog/PostCard";

/** Homepage "Latest thinking": the featured article plus the two most recent. */
export function Insights() {
  const posts = postsByDate();
  const featured = posts.find((p) => p.featured) ?? posts[0]!;
  const supporting = posts.filter((p) => p.slug !== featured.slug).slice(0, 2);

  return (
    <section
      aria-labelledby="insights-title"
      className="relative z-[1] rounded-t-[28px] bg-paper-2 py-24 text-ink sm:rounded-t-[40px] sm:py-32"
    >
      <div className="container-bs">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionLabel index="06" tone="dark">
              Insights
            </SectionLabel>
            <RevealText
              id="insights-title"
              as="h2"
              text={"Latest *thinking.*"}
              className="font-display-tight mt-6 text-[clamp(2.7rem,6.4vw,6rem)] font-semibold"
              accentClassName="font-serif italic font-normal tracking-[-0.02em] text-green-deep"
            />
          </div>
          <div className="flex flex-col justify-end gap-8 lg:col-span-5 lg:items-end lg:text-right">
            <p data-reveal="up" className="max-w-md text-lg leading-relaxed text-ink/65">
              Ideas on websites, search, social, advertising, branding and business growth — written for business
              owners, not marketers.
            </p>
            <div data-reveal="up" className="hidden lg:block">
              <ButtonLink href="/blog" variant="outline-dark">
                Explore all insights
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Featured article */}
        <article className="group relative mt-16 lg:mt-24">
          <div data-reveal="clip">
            <Cover
              photo={featured.cover}
              sizes="(min-width: 1536px) 1480px, 100vw"
              reveal="scroll"
              className="aspect-[4/3] rounded-[10px] sm:aspect-[16/9] lg:aspect-[21/9]"
            />
          </div>
          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-4">
                <span aria-hidden data-reveal="line" className="h-px w-12 bg-green-deep" />
                <CategoryTag slug={featured.category} light />
              </p>
              <h3 className="mt-5 font-display text-[clamp(2rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink transition-colors duration-500 group-hover:text-green-deep">
                <Link href={`/blog/${featured.slug}`} className="after:absolute after:inset-0 after:z-[1] after:content-['']">
                  <RevealText as="span" text={featured.title} className="text-balance-safe" accentClassName="" />
                </Link>
              </h3>
            </div>
            <div data-reveal="up" className="lg:col-span-5 lg:pt-12" style={{ ["--rv-delay" as string]: "160ms" }}>
              <p className="text-lg leading-relaxed text-ink/65">{featured.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <PostMeta post={featured} minutes={readingTime(featured.slug)} className="text-ink/65" />
                <ReadCue light />
              </div>
            </div>
          </div>
        </article>

        {/* Two supporting articles */}
        <div className="mt-20 grid gap-16 border-t border-ink/10 pt-16 md:grid-cols-2 md:gap-10 lg:mt-28 lg:pt-20">
          {supporting.map((p, i) => (
            <div key={p.slug} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 140}ms` }}>
              <PostCard post={p} minutes={readingTime(p.slug)} tone="light" variant="wide" />
            </div>
          ))}
        </div>

        <div data-reveal="up" className="mt-16 lg:hidden">
          <ButtonLink href="/blog" variant="outline-dark">
            Explore all insights
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
