import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { organizationSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InViewObserver } from "@/components/motion/InViewObserver";
import { CursorLabel } from "@/components/motion/CursorLabel";
import { ScrollFx } from "@/components/motion/ScrollFx";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  variable: "--font-instrument",
  display: "swap",
});

const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline} | Digital Growth Agency in Prayagraj`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/og/brandspace-og.jpg", width: 1200, height: 630, alt: "BrandSpace — Future of Business Growth" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og/brandspace-og.jpg"],
  },
  robots: isPreviewDeployment
    ? {
        index: false,
        follow: false,
        noarchive: true,
        googleBot: { index: false, follow: false, noarchive: true },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: "#070908",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${geist.variable} ${bricolage.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available so reveal animations can start hidden without hiding content for no-JS visitors. */}
        <script>{"document.documentElement.classList.add('js')"}</script>
        <JsonLd data={organizationSchema()} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-green focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
        <InViewObserver />
        <ScrollFx />
        <CursorLabel />
      </body>
    </html>
  );
}
