import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogCategories, blogPosts, getCategory, postsByDate } from "@/data/blog";
import { readingTime } from "@/lib/blog";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryNav } from "@/components/blog/CategoryNav";
import { FinalCta } from "@/components/home/FinalCta";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogCategories.filter((c) => blogPosts.some((p) => p.category === c.slug)).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return pageMetadata({
    title: `${cat.name} Articles`,
    description: `${cat.description} Guides and insights from the BrandSpace team.`,
    path: `/blog/category/${cat.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps<"/blog/category/[category]">) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const posts = postsByDate().filter((p) => p.category === cat.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: cat.name, path: `/blog/category/${cat.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Category" title={cat.name} intro={cat.description}>
        <div className="mt-12">
          <CategoryNav active={cat.slug} />
        </div>
      </PageHero>
      <section aria-label={`${cat.name} articles`} className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-bs">
          <h2 className="eyebrow text-ink/50">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </h2>
          <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <PostCard key={p.slug} post={p} minutes={readingTime(p.slug)} tone="light" eager={i === 0} />
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
