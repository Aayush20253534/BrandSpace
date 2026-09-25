import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/portfolio";
import { services } from "@/data/services";
import { blogCategories, blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  const latestPost = blogPosts.map((p) => p.updatedAt ?? p.publishedAt).sort().at(-1);

  const blogEntries: MetadataRoute.Sitemap = site.blogIndexingEnabled
    ? [
        {
          url: url("/blog"),
          ...(latestPost ? { lastModified: new Date(latestPost) } : {}),
          changeFrequency: "weekly",
          priority: 0.8,
        },
        ...blogCategories
          .filter((c) => blogPosts.some((p) => p.category === c.slug))
          .map((c) => ({
            url: url(`/blog/category/${c.slug}`),
            changeFrequency: "weekly" as const,
            priority: 0.5,
          })),
        ...blogPosts.map((p) => ({
          url: url(`/blog/${p.slug}`),
          lastModified: new Date(p.updatedAt ?? p.publishedAt),
          changeFrequency: "yearly" as const,
          priority: 0.6,
        })),
      ]
    : [];

  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/services"), changeFrequency: "monthly", priority: 0.9 },
    ...services.map((service) => ({
      url: url(`/services/${service.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: url("/portfolio"), changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({
      url: url(`/portfolio/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    { url: url("/about"), changeFrequency: "yearly", priority: 0.7 },
    ...blogEntries,
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/privacy-policy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
