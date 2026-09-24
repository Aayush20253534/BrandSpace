import type { Metadata } from "next";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { GrowthCity } from "@/components/home/growth-city/GrowthCity";
import { Services } from "@/components/home/Services";
import { SelectedWork } from "@/components/home/SelectedWork";
import { WhyBrandSpace } from "@/components/home/WhyBrandSpace";
import { Results } from "@/components/home/Results";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${site.tagline} | Digital Growth Agency in Prayagraj`,
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <GrowthCity />
      <Services />
      <SelectedWork />
      <WhyBrandSpace />
      <Results />
      <Process />
      <Testimonials />
      <FinalCta />
    </>
  );
}
