import type { Metadata } from "next";
import { site } from "@/data/site";
import { breadcrumbSchema, contactPageSchema, pageMetadata } from "@/lib/seo";
import { mailUrl, telUrl, whatsappUrl } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { RevealText } from "@/components/motion/RevealText";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMotif } from "@/components/contact/ContactMotif";
import { WhatsAppButton } from "@/components/ui/Button";
import { ArrowUpRight, Mail, MapPin, Phone, WhatsApp } from "@/components/ui/Icons";

export const metadata: Metadata = pageMetadata({
  title: "Contact — Start Your Project",
  description:
    "Talk to BrandSpace about your website, SEO, social media, Meta ads, Google Business Profile or branding. WhatsApp +91 9454509113 or send a project brief. Based at IIHMF, MNNIT Allahabad, Prayagraj.",
  path: "/contact",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact Us", path: "/contact" },
];

const steps = [
  { title: "We review your brief", body: "We look at your business, your current presence and what you want to achieve." },
  { title: "A short discovery call", body: "A focused conversation to understand your goals, audience and constraints." },
  { title: "A clear proposal", body: "Recommended scope, timeline and investment — no jargon, no obligation." },
];

export default function ContactPage() {
  const details = [
    { icon: WhatsApp, label: "WhatsApp", value: site.phone.display, href: whatsappUrl(), external: true },
    { icon: Phone, label: "Phone", value: site.phone.display, href: telUrl },
    { icon: Mail, label: "Email", value: site.email, href: mailUrl },
    { icon: MapPin, label: "Location", value: `${site.address.line1}, ${site.address.locality}, ${site.address.region}, ${site.address.country}`, href: site.address.mapsUrl, external: true },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={contactPageSchema()} />

      <section className="grain relative overflow-hidden bg-ink pb-20 pt-[calc(var(--header-h)+3.5rem)] text-paper sm:pt-[calc(var(--header-h)+5rem)] lg:pb-32">
        <div aria-hidden className="hairline-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        {/* Understated ambient light and a quiet network motif */}
        <div aria-hidden className="cm-glow pointer-events-none absolute -left-48 top-[30%] h-[38rem] w-[38rem] rounded-full bg-green/[0.07] blur-3xl" />
        <ContactMotif className="pointer-events-none absolute right-[-4rem] top-[calc(var(--header-h)+1rem)] hidden w-[34rem] opacity-70 md:block lg:right-[4%] lg:top-[calc(var(--header-h)+0.5rem)] lg:w-[27rem]" />
        <div className="container-bs relative z-[2]">
          <Breadcrumbs items={crumbs} />
          <div className="mt-10 grid gap-14 sm:mt-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p data-reveal="up" className="eyebrow flex items-center gap-3 text-paper/60">
                <span className="h-[7px] w-[7px] rounded-full bg-green" aria-hidden />
                Start your project
              </p>
              <RevealText as="h1" text={"Let’s grow\n*your business.*"} className="font-display-tight mt-6 text-[clamp(3rem,7vw,6.6rem)] font-semibold" />
              <p data-reveal="up" className="mt-8 max-w-md text-lg leading-relaxed text-paper/65">
                Whether you need a new website, more enquiries from search and social, or a brand that finally reflects
                your quality — tell us where you are and where you want to be.
              </p>

              <div data-reveal="up" className="mt-10">
                <WhatsAppButton size="lg">Talk to BrandSpace</WhatsAppButton>
                <p className="mt-4 text-sm text-paper/60">The fastest way to reach us — opens WhatsApp chat.</p>
              </div>

              <ul className="mt-14 divide-y divide-paper/10 border-y border-paper/10">
                {details.map((d, i) => (
                  <li key={d.label} data-reveal="up" style={{ ["--rv-delay" as string]: `${120 + i * 90}ms` }}>
                    <a
                      href={d.href}
                      {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-5 py-5 transition-colors hover:text-green"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/15 text-green transition-colors group-hover:border-green">
                        <d.icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="eyebrow block text-[0.64rem] text-paper/60">{d.label}</span>
                        <span className="mt-1 block break-words text-[0.98rem] text-paper/85 group-hover:text-green">{d.value}</span>
                      </span>
                      <ArrowUpRight size={18} className="shrink-0 text-paper/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 lg:pt-28">
              <div data-reveal="up" style={{ ["--rv-delay" as string]: "160ms" }} className="rounded-[14px] bg-paper p-6 text-ink shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] sm:p-10 lg:p-12">
                <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">Send us a project brief</h2>
                <p className="mt-2 text-ink/60">It takes about two minutes. All fields are required.</p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="next-title" className="bg-paper py-20 text-ink sm:py-28">
        <div className="container-bs">
          <h2 id="next-title" className="font-display-tight text-[clamp(2.2rem,4.4vw,4rem)] font-semibold">
            What happens <span className="font-serif font-normal italic text-green-deep">next</span>
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[8px] bg-ink/10 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 90}ms` }} className="bg-paper p-8 sm:p-10">
                <span className="font-display-tight text-5xl font-semibold text-green-deep">0{i + 1}</span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
