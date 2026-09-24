import Link from "next/link";
import { activeSocials, legalLinks, navigation, site } from "@/data/site";
import { services } from "@/data/services";
import { mailUrl, telUrl, whatsappUrl } from "@/lib/whatsapp";
import { LogoMark } from "@/components/ui/Logo";
import { ArrowUpRight } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { label: "WhatsApp", href: whatsappUrl() },
    ...activeSocials,
  ];

  return (
    <footer className="grain relative overflow-hidden border-t border-paper/[0.07] bg-ink text-paper">
      <div className="container-bs relative z-[2] pt-20 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" aria-label="BrandSpace — home" className="inline-flex items-center gap-3">
              <LogoMark size={56} />
              <span className="font-display text-2xl font-semibold tracking-[-0.04em]">BrandSpace</span>
            </Link>
            <p className="mt-6 max-w-sm font-serif text-[1.9rem] italic leading-[1.15] text-paper/85">
              Future of Business Growth.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/50">
              A digital growth agency from Prayagraj, building websites, search visibility, social presence and brands that grow.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="eyebrow text-paper/40">Navigation</h2>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {navigation.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="text-paper/75 transition-colors hover:text-green">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-paper/40">Services</h2>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/#${s.slug}`} className="text-paper/75 transition-colors hover:text-green">
                      {s.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="eyebrow text-paper/40">Contact</h2>
              <address className="mt-5 space-y-3 text-[0.95rem] not-italic text-paper/75">
                <a href={mailUrl} className="block break-all transition-colors hover:text-green">
                  {site.email}
                </a>
                <a href={telUrl} className="block transition-colors hover:text-green">
                  {site.phone.display}
                </a>
                <p className="leading-relaxed text-paper/55">
                  {site.address.line1}
                  <br />
                  {site.address.locality}, {site.address.region}
                  <br />
                  {site.address.country}
                </p>
              </address>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-8 border-t border-paper/[0.08] py-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Social links">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-paper/70 transition-colors hover:text-green"
                >
                  {s.label}
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
            <li>
              <a
                href={mailUrl}
                className="group inline-flex items-center gap-1.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-paper/70 transition-colors hover:text-green"
              >
                Email
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.78rem] text-paper/45">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-paper">
                {l.label}
              </Link>
            ))}
            <span>© {year} BrandSpace. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden className="pointer-events-none relative z-[1] -mb-[3.2vw] select-none overflow-hidden">
        <p className="font-display-tight whitespace-nowrap text-center text-[21.5vw] font-semibold text-paper/[0.045]">
          BrandSpace
        </p>
      </div>
    </footer>
  );
}
