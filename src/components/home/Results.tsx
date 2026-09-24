import Image from "next/image";
import Link from "next/link";
import { projects, type Metric } from "@/data/portfolio";
import { CountUp } from "@/components/motion/CountUp";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { ArrowUpRight } from "@/components/ui/Icons";

/** One headline result per featured project, shown as an editorial ledger. */
const rows: { slug: string; pick: "revenue" | "roas" | "leads" }[] = [
  { slug: "rovauto", pick: "leads" },
  { slug: "casa-de-grande", pick: "roas" },
  { slug: "zobhunger", pick: "leads" },
  { slug: "bar-code", pick: "revenue" },
];

export function Results() {
  const items = rows
    .map(({ slug, pick }) => {
      const project = projects.find((p) => p.slug === slug);
      if (!project) return null;
      return { project, metric: project.metrics[pick] as Metric };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <section aria-labelledby="results-title" className="bg-paper py-24 text-ink sm:py-32">
      <div className="container-bs">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="04" tone="dark">
              Results
            </SectionLabel>
            <RevealText
              id="results-title"
              as="h2"
              text={"Growth you can *measure.*"}
              className="font-display-tight mt-6 text-[clamp(2.7rem,6.4vw,6rem)] font-semibold"
              accentClassName="font-serif italic font-normal tracking-[-0.02em] text-green-deep"
            />
          </div>
          <p data-reveal="up" className="max-w-md self-end text-lg leading-relaxed text-ink/65 lg:col-span-5 lg:justify-self-end">
            We agree on the numbers that matter before we start — then report on them plainly. Here’s what that looks
            like across recent work.
          </p>
        </div>

        <ol className="mt-16 border-t border-ink/15 lg:mt-24">
          {items.map(({ project, metric }, i) => (
            <li key={project.slug} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 80}ms` }}>
              <Link
                href={`/portfolio/${project.slug}`}
                className="group grid grid-cols-12 items-center gap-x-4 gap-y-3 border-b border-ink/15 py-8 transition-colors hover:bg-ink/[0.025] sm:py-10"
              >
                <div className="col-span-12 flex items-center gap-4 sm:col-span-4">
                  <span className="relative hidden h-14 w-24 shrink-0 overflow-hidden rounded-[4px] bg-ink sm:block">
                    {project.preview && (
                      <Image
                        src={project.preview.src}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-semibold tracking-[-0.02em]">{project.name}</span>
                    <span className="block text-sm text-ink/65">{project.industry}</span>
                  </span>
                </div>
                <div className="col-span-7 sm:col-span-4">
                  <CountUp
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    decimals={metric.decimals}
                    className="font-display-tight block text-[clamp(3rem,7vw,6rem)] font-semibold tabular-nums text-ink"
                  />
                </div>
                <div className="col-span-5 flex items-center justify-between gap-4 sm:col-span-4">
                  <span>
                    <span className="block text-sm font-semibold uppercase tracking-[0.12em] text-green-deep">{metric.label}</span>
                    <span className="mt-1 block text-sm leading-snug text-ink/65">{metric.context}</span>
                  </span>
                  <ArrowUpRight size={22} className="hidden shrink-0 text-ink/30 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink sm:block" />
                </div>
              </Link>
            </li>
          ))}
        </ol>
        <PlaceholderNote status={items.map((x) => x.project.metrics.status)} tone="dark" className="mt-6" />
      </div>
    </section>
  );
}
