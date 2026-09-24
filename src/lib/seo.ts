import type { Metadata } from "next";
import { site } from "@/data/site";
import { services } from "@/data/services";

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

const DEFAULT_OG = { url: "/og/brandspace-og.jpg", width: 1200, height: 630, alt: "BrandSpace — Future of Business Growth" };

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  /** Use the title as-is (skip the "| BrandSpace" template). */
  absoluteTitle?: boolean;
};

/** Page-specific metadata with canonical, Open Graph and Twitter cards. */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  keywords,
  absoluteTitle,
}: PageMetaInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [image],
      ...(type === "article" ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Structured data                                                     */
/* ------------------------------------------------------------------ */

const orgId = `${site.url}/#organization`;

export function organizationSchema() {
  const sameAs = site.socials.map((s) => s.href).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.name,
        slogan: site.tagline,
        url: site.url,
        logo: absoluteUrl("/brand/brandspace-logo.png"),
        email: site.email,
        telephone: site.phone.e164,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#localbusiness`,
        name: site.name,
        description: site.description,
        url: site.url,
        image: absoluteUrl("/og/brandspace-og.jpg"),
        logo: absoluteUrl("/brand/brandspace-logo.png"),
        email: site.email,
        telephone: site.phone.e164,
        parentOrganization: { "@id": orgId },
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.line1,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.countryCode,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.address.geo.lat, longitude: site.address.geo.lng },
        areaServed: [{ "@type": "City", name: "Prayagraj" }, { "@type": "Country", name: "India" }],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Digital growth services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.name, description: s.what },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": orgId },
        inLanguage: "en-IN",
      },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  authorPath: string;
  section: string;
  keywords: string[];
  wordCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    url: absoluteUrl(input.path),
    image: absoluteUrl(input.image),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: { "@type": "Person", name: input.authorName, url: absoluteUrl(input.authorPath) },
    publisher: { "@id": orgId },
    articleSection: input.section,
    keywords: input.keywords.join(", "),
    wordCount: input.wordCount,
    inLanguage: "en-IN",
  };
}

export function caseStudySchema(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
  clientUrl: string;
  year: number;
  services: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${input.name} — BrandSpace case study`,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    dateCreated: String(input.year),
    creator: { "@id": orgId },
    about: { "@type": "Organization", name: input.name, url: input.clientUrl },
    keywords: input.services.join(", "),
  };
}
