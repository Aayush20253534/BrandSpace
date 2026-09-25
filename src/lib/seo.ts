import type { Metadata } from "next";
import { site } from "@/data/site";
import { services, type Service } from "@/data/services";
import { team } from "@/data/team";

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

export const organizationId = `${site.url}/#organization`;
export const websiteId = `${site.url}/#website`;
const personId = (slug: string) => `${site.url}/#person-${slug}`;
export const serviceId = (slug: string) => `${site.url}/#service-${slug}`;

const areaServed = [
  { "@type": "City", name: "Prayagraj" },
  { "@type": "Country", name: "India" },
];

export function organizationSchema() {
  const sameAs = site.socials.map((social) => social.href).filter(Boolean);
  const founders = team.map((member) => ({ "@id": personId(member.slug) }));

  const people = team.map((member) => {
    const memberSameAs = member.links?.map((link) => link.href).filter(Boolean) ?? [];

    return {
      "@type": "Person",
      "@id": personId(member.slug),
      name: member.name,
      affiliation: { "@id": organizationId },
      ...(member.status === "verified"
        ? {
            jobTitle: member.role,
            description: member.bio,
            ...(member.photo ? { image: absoluteUrl(member.photo.src) } : {}),
            ...(memberSameAs.length ? { sameAs: memberSameAs } : {}),
          }
        : {}),
    };
  });

  const serviceNodes = services.map((service) => ({
    "@type": "Service",
    "@id": serviceId(service.slug),
    name: service.name,
    serviceType: service.shortName,
    description: service.what,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": organizationId },
    areaServed,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": organizationId,
        name: site.name,
        description: site.description,
        slogan: site.tagline,
        url: site.url,
        image: absoluteUrl("/og/brandspace-og.jpg"),
        logo: absoluteUrl("/brand/brandspace-logo.png"),
        email: site.email,
        telephone: site.phone.e164,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phone.e164,
          email: site.email,
          contactType: "sales",
          areaServed: "IN",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.line1,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.countryCode,
        },
        areaServed,
        founder: founders,
        ...(sameAs.length ? { sameAs } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "BrandSpace digital growth services",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@id": serviceId(service.slug) },
          })),
        },
      },
      ...serviceNodes,
      ...people,
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        publisher: { "@id": organizationId },
        inLanguage: "en-IN",
      },
    ],
  };
}

export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${absoluteUrl("/about")}#webpage`,
    url: absoluteUrl("/about"),
    name: "About BrandSpace",
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    mainEntity: { "@id": organizationId },
    mentions: team.map((member) => ({ "@id": personId(member.slug) })),
    inLanguage: "en-IN",
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl("/contact")}#webpage`,
    url: absoluteUrl("/contact"),
    name: "Contact BrandSpace",
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    mainEntity: { "@id": organizationId },
    inLanguage: "en-IN",
  };
}

export function servicePageSchema(service: Service) {
  const pageUrl = absoluteUrl(`/services/${service.slug}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: service.seoTitle,
        description: service.seoDescription,
        isPartOf: { "@id": websiteId },
        about: { "@id": serviceId(service.slug) },
        mainEntity: { "@id": serviceId(service.slug) },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": serviceId(service.slug),
        name: service.name,
        serviceType: service.shortName,
        description: service.what,
        url: pageUrl,
        provider: { "@id": organizationId },
        areaServed,
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
    publisher: { "@id": organizationId },
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
    creator: { "@id": organizationId },
    about: { "@type": "Organization", name: input.name, url: input.clientUrl },
    keywords: input.services.join(", "),
  };
}
