import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalPage } from "@/components/ui/LegalPage";

// Template policy — have it reviewed by a legal professional before relying on it.

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How BrandSpace collects, uses and protects personal information shared through this website, WhatsApp, phone and email.",
  path: "/privacy-policy",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy-policy" },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <LegalPage crumbs={crumbs} title="Privacy Policy" updated="24 September 2026">
        <p>
          This policy explains how {site.name} (“we”, “us”) handles personal information when you visit this website or
          contact us. We collect only what we need to respond to you and to provide our services, and we never sell your
          personal data.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Enquiry details</strong> you submit through our contact form: name, business or company name, email
            address, phone number, the service you’re interested in, budget range and project details.
          </li>
          <li>
            <strong>Messages</strong> you send us by WhatsApp, phone or email, along with the contact details attached to
            them.
          </li>
          <li>
            <strong>Technical information</strong> such as your browser type, device and pages visited, which may be
            processed by our hosting provider to keep the site secure and working.
          </li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To reply to your enquiry and discuss your project</li>
          <li>To prepare proposals and deliver services you’ve asked for</li>
          <li>To keep records of our communication with clients</li>
          <li>To protect this website from spam and abuse</li>
        </ul>
        <p>We do not use your enquiry details for unrelated marketing without your permission.</p>

        <h2>Sharing</h2>
        <p>
          We share information only with service providers that help us operate — for example website hosting, email
          delivery and messaging platforms such as WhatsApp — and only as needed for those purposes. We may disclose
          information if required by law.
        </p>

        <h2>Cookies and analytics</h2>
        <p>
          This website does not use advertising cookies. If we add analytics or advertising tools in future, we will update
          this policy to describe them and, where required, ask for your consent.
        </p>

        <h2>Retention and security</h2>
        <p>
          We keep enquiry information for as long as needed to respond to you and for reasonable business records, and we
          take sensible technical and organisational measures to protect it.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us to access, correct or delete the personal information we hold about you, or to stop contacting you,
          by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>Contact</h2>
        <p>
          {site.name}, {site.address.line1}, {site.address.locality}, {site.address.region}, {site.address.country}. Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> or call {site.phone.display}. See also our{" "}
          <Link href="/terms">Terms</Link>.
        </p>
      </LegalPage>
    </>
  );
}
