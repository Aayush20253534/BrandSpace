import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = site.blogIndexingEnabled
  ? {}
  : {
      robots: {
        index: false,
        follow: true,
        noarchive: true,
        googleBot: {
          index: false,
          follow: true,
          noarchive: true,
        },
      },
    };

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
