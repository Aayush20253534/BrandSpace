import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalPage } from "@/components/ui/LegalPage";

// Template terms — have them reviewed by a legal professional before relying on them.

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms governing the use of the BrandSpace website and its content.",
  path: "/terms",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms" },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <LegalPage crumbs={crumbs} title="Terms of Use" updated="24 September 2026">
        <p>
          These terms apply to your use of this website, operated by {site.name}. By using the site you agree to them. If
          you don’t agree, please don’t use the site.
        </p>

        <h2>Our services</h2>
        <p>
          Information on this website describes the services {site.name} offers. It is not an offer or a contract. Any
          engagement is governed by a separate written proposal or agreement setting out scope, timelines, fees and
          responsibilities.
        </p>

        <h2>Content and intellectual property</h2>
        <p>
          The design, text, graphics and code of this website belong to {site.name} unless stated otherwise. Client names,
          logos and website previews shown in our portfolio belong to their respective owners and are shown to illustrate
          our work. You may share links to our pages, but please don’t copy or reuse our content without permission.
        </p>

        <h2>Case studies and results</h2>
        <p>
          Case studies describe work we have done for clients. Results vary from business to business and depend on many
          factors outside our control; past results are not a guarantee of future outcomes. Where figures are marked as
          illustrative, they are provided for layout purposes and are not client results.
        </p>

        <h2>Articles and advice</h2>
        <p>
          Blog articles are general information, not professional advice for your specific situation. Please get advice
          tailored to your business before acting on it.
        </p>

        <h2>External links</h2>
        <p>
          This site links to other websites, including client websites and WhatsApp. We aren’t responsible for their content
          or practices.
        </p>

        <h2>Liability</h2>
        <p>
          We work to keep this website accurate and available, but it is provided “as is”. To the extent permitted by law,
          {` ${site.name}`} is not liable for losses arising from use of the website.
        </p>

        <h2>Governing law</h2>
        <p>These terms are governed by the laws of India.</p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Email <a href={`mailto:${site.email}`}>{site.email}</a>. Read our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
      </LegalPage>
    </>
  );
}
