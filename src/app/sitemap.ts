import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/portfolio";
import { blogCategories, blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  const latestPost = blogPosts.map((p) => p.updatedAt ?? p.publishedAt).sort().at(-1);
  const now = new Date();

  return [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/portfolio"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({ url: url(`/portfolio/${p.slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.7 })),
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/blog"), lastModified: latestPost ? new Date(latestPost) : now, changeFrequency: "weekly", priority: 0.8 },
    ...blogCategories
      .filter((c) => blogPosts.some((p) => p.category === c.slug))
      .map((c) => ({ url: url(`/blog/category/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.5 })),
    ...blogPosts.map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: new Date(p.updatedAt ?? p.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: url("/privacy-policy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
