import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-[var(--header-h)] text-paper">
      <div aria-hidden className="hairline-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-bs relative z-[2] py-24">
        <p className="eyebrow text-green">Error 404</p>
        <h1 className="font-display-tight mt-6 text-[clamp(3rem,9vw,8rem)] font-semibold">
          This road isn’t <span className="font-serif font-normal italic text-green">built yet.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-paper/60">
          The page you’re looking for doesn’t exist or has moved. Let’s get you back somewhere useful.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <ButtonLink href="/">Back to home</ButtonLink>
          <Link href="/portfolio" className="text-sm font-semibold uppercase tracking-[0.18em] text-paper/60 hover:text-paper">
            See our work
          </Link>
          <Link href="/blog" className="text-sm font-semibold uppercase tracking-[0.18em] text-paper/60 hover:text-paper">
            Read the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
