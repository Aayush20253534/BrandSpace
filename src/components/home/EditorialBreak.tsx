import { Photo } from "@/components/ui/Photo";
import { editorialPhotos } from "@/lib/images";
import { pillars } from "@/data/approach";
import { RevealText } from "@/components/motion/RevealText";

/**
 * One photographic pause between the work and the principles: a full-bleed
 * studio scene, a smaller craft detail on a faster parallax layer, and a
 * single statement. Not pinned — it simply scrolls past with depth.
 */
export function EditorialBreak() {
  const { studio, sketch } = editorialPhotos;

  return (
    <section aria-labelledby="belief-title" className="relative overflow-hidden bg-ink text-paper">
      <div className="relative flex min-h-[40rem] items-end md:min-h-[46rem] lg:h-[118svh]">
        {/* Full-bleed photograph (oversized so the parallax never shows an edge) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 -inset-y-[14%]" data-fx="parallax" data-fx-amount="9" data-fx-trigger="parent">
            <Photo
              src={studio.src}
              alt={studio.alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: studio.position }}
            />
          </div>
        </div>
        {/* Grade: blend into the neighbouring sections and keep the type legible */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink)_0%,rgb(7_9_8/0.35)_22%,rgb(7_9_8/0.15)_50%,rgb(7_9_8/0.85)_86%,var(--color-ink)_100%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-green-ink/25 mix-blend-multiply" />

        {/* Craft detail on its own, faster layer */}
        <div
          className="absolute right-[var(--gutter)] top-[18%] hidden w-[min(26vw,22rem)] md:block"
          data-fx="parallax"
          data-fx-amount="22"
          data-fx-media="md"
        >
          <figure data-reveal="clip">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-paper/10">
              <Photo
                src={sketch.src}
                alt={sketch.alt}
                fill
                sizes="(min-width: 768px) 26vw, 1px"
                className="rv-zoom object-cover"
                style={{ objectPosition: sketch.position }}
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-paper/60">
              <span aria-hidden className="h-px w-6 bg-green" />
              Strategy before decoration
            </figcaption>
          </figure>
        </div>

        <div className="container-bs relative z-[2] pb-16 pt-40 sm:pb-24 lg:pb-[12svh]">
          <p data-reveal="up" className="eyebrow flex items-center gap-3 text-paper/65">
            <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-green" />
            What we believe
          </p>
          <RevealText
            id="belief-title"
            as="h2"
            text={"Growth is built,\n*not guessed.*"}
            className="font-display-tight mt-6 max-w-[12ch] text-[clamp(3.2rem,9.6vw,10rem)] font-semibold"
          />
          <div className="mt-10 flex flex-col gap-6 border-t border-paper/15 pt-8 sm:flex-row sm:items-end sm:justify-between md:mt-14">
            <p data-reveal="up" className="max-w-md font-serif text-[clamp(1.35rem,2.2vw,1.9rem)] italic leading-snug text-paper/85">
              {pillars[0].line}
            </p>
            <ul data-reveal="up" className="flex flex-wrap gap-x-5 gap-y-2 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-paper/60" aria-label="Our principles">
              {pillars.map((p) => (
                <li key={p.title}>{p.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
