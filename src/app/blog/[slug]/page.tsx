import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getCategory, getPost, relatedPosts } from "@/data/blog";
import { getTeamMember } from "@/data/team";
import { services } from "@/data/services";
import { readingTime, renderPost } from "@/lib/blog";
import { absoluteUrl, articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { PostCard, PostMeta } from "@/components/blog/PostCard";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareLinks } from "@/components/blog/ShareLinks";
import { Avatar } from "@/components/ui/Avatar";
import { WhatsAppButton, TextLink } from "@/components/ui/Button";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

/** Which service an article naturally leads to. */
const categoryService: Record<string, string> = {
  "web-development": "web-development-seo",
  seo: "web-development-seo",
  "meta-advertising": "meta-ads",
  "social-media": "social-media-management",
  branding: "digital-branding",
  "google-business-profile": "google-business-profile-optimization",
};

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const author = getTeamMember(post.author);
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    authors: author ? [author.name] : undefined,
    keywords: post.keywords,
    image: { url: post.cover.src, width: 1600, height: 900, alt: post.cover.alt },
  });
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { html, toc, words } = renderPost(post);
  const minutes = readingTime(post.slug);
  const category = getCategory(post.category)!;
  const author = getTeamMember(post.author);
  const related = relatedPosts(post.slug, 3);
  const service = services.find((s) => s.slug === categoryService[post.category]);
  const url = absoluteUrl(`/blog/${post.slug}`);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: category.name, path: `/blog/category/${category.slug}` },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.excerpt,
          path: `/blog/${post.slug}`,
          image: post.cover.src,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          authorName: author?.name ?? "BrandSpace",
          authorPath: "/about#founding-team",
          section: category.name,
          keywords: post.keywords,
          wordCount: words,
        })}
      />

      <article>
        <header className="grain relative bg-ink pb-40 pt-[calc(var(--header-h)+3.5rem)] text-paper sm:pb-56 sm:pt-[calc(var(--header-h)+5rem)]">
          <div className="container-bs relative z-[2]">
            <Breadcrumbs items={crumbs.slice(0, -1)} lastIsCurrent={false} />
            <div className="mt-10 max-w-5xl sm:mt-14">
              <Link href={`/blog/category/${category.slug}`} className="eyebrow text-green hover:text-green-bright">
                {category.name}
              </Link>
              <h1 className="font-display-tight mt-5 text-balance-safe text-[clamp(2.5rem,6vw,5.6rem)] font-semibold">{post.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-paper/65 sm:text-xl">{post.excerpt}</p>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                {author && (
                  <Link href="/about#founding-team" className="flex items-center gap-3">
                    <Avatar name={author.name} photo={author.photo} size={44} tone="light" />
                    <span>
                      <span className="block text-[0.95rem] font-medium text-paper">{author.name}</span>
                      <span className="block text-[0.78rem] text-paper/45">{author.role}</span>
                    </span>
                  </Link>
                )}
                <PostMeta post={post} minutes={minutes} className="text-paper/50" />
              </div>
            </div>
          </div>
        </header>

        <div className="bg-paper text-ink">
          <div className="container-bs">
            <div className="relative -mt-28 aspect-[16/9] overflow-hidden rounded-[10px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)] sm:-mt-40">
              <Image src={post.cover.src} alt={post.cover.alt} fill sizes="(min-width: 1536px) 1480px, 100vw" loading="eager" fetchPriority="high" className="object-cover" />
            </div>

            <div className="grid gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:gap-10">
              <aside className="hidden lg:col-span-3 lg:block">
                <div className="sticky top-[calc(var(--header-h)+2rem)] space-y-10">
                  <TableOfContents items={toc} />
                  <ShareLinks url={url} title={post.title} />
                </div>
              </aside>

              <div className="min-w-0 lg:col-span-7 lg:col-start-5">
                <div className="prose-bs" dangerouslySetInnerHTML={{ __html: html }} />

                <ShareLinks url={url} title={post.title} className="mt-14 border-t border-ink/10 pt-8 lg:hidden" />

                {author && (
                  <div className="mt-14 flex gap-5 rounded-[10px] bg-paper-2 p-6 sm:p-8">
                    <Avatar name={author.name} photo={author.photo} size={64} />
                    <div>
                      <p className="eyebrow text-ink/45">Written by</p>
                      <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em]">{author.name}</p>
                      <p className="text-sm text-ink/55">{author.role}</p>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{author.bio}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 rounded-[10px] bg-ink p-8 text-paper sm:p-10">
                  <p className="eyebrow text-green">{service ? service.name : "Work with BrandSpace"}</p>
                  <p className="font-display-tight mt-4 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold">
                    {service ? service.kicker : "Turn these ideas into growth."}
                  </p>
                  <p className="mt-3 max-w-lg text-paper/60">
                    Want help putting this into practice? Tell us about your business — we’ll suggest where to start.
                  </p>
                  <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <WhatsAppButton message={`Hi BrandSpace, I just read “${post.title}” and would like to discuss my business/project.`}>
                      Talk to BrandSpace
                    </WhatsAppButton>
                    <TextLink href={service ? `/#${service.slug}` : "/#services"}>Explore the service</TextLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-ink py-24 text-paper sm:py-32">
          <div className="container-bs">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="related-title" className="font-display-tight text-[clamp(2.2rem,4.4vw,4rem)] font-semibold">
                Keep reading
              </h2>
              <TextLink href="/blog">All articles</TextLink>
            </div>
            <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} minutes={readingTime(p.slug)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
