import { site } from "@/data/site";
import { mailUrl, telUrl } from "@/lib/whatsapp";
import { RevealText } from "@/components/motion/RevealText";
import { WhatsAppButton, TextLink } from "@/components/ui/Button";

export function FinalCta({
  title = "Ready to build\nyour *space?*",
  body = "Tell us where your business is today and where you want it to be. We’ll come back with honest, practical ideas for your next step.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="grain relative overflow-hidden bg-green text-ink">
      <div aria-hidden className="pointer-events-none absolute -right-[10vw] -top-[20vw] h-[60vw] w-[60vw] rounded-full border border-ink/10" />
      <div aria-hidden className="pointer-events-none absolute -right-[2vw] -top-[12vw] h-[44vw] w-[44vw] rounded-full border border-ink/10" />
      <div className="container-bs relative z-[2] py-24 sm:py-32 lg:py-40">
        <p className="eyebrow flex items-center gap-3 text-ink/80" data-reveal="up">
          <span className="h-[7px] w-[7px] rounded-full bg-ink" aria-hidden />
          Start your project
        </p>
        <RevealText
          id="cta-title"
          as="h2"
          text={title}
          className="font-display-tight mt-6 text-[clamp(3.2rem,9vw,9rem)] font-semibold"
          accentClassName="font-serif italic font-normal tracking-[-0.02em]"
        />
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-end">
          <p data-reveal="up" className="max-w-lg text-lg leading-relaxed text-ink/75 lg:col-span-5">
            {body}
          </p>
          <div data-reveal="up" className="flex flex-col gap-6 sm:flex-row sm:items-center lg:col-span-7 lg:justify-end">
            <WhatsAppButton variant="dark" size="lg">
              Start Your Project
            </WhatsAppButton>
            <TextLink href="/contact">Send a project brief</TextLink>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-3 border-t border-ink/15 pt-8 text-[0.95rem] text-ink/70">
          <a href={telUrl} className="hover:text-ink">
            {site.phone.display}
          </a>
          <a href={mailUrl} className="hover:text-ink">
            {site.email}
          </a>
          <span>
            {site.address.locality}, {site.address.region}
          </span>
        </div>
      </div>
    </section>
  );
}
