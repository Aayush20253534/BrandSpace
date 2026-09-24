import Image from "next/image";
import { Photo } from "@/components/ui/Photo";
import type { ServiceVisual as Kind } from "@/data/services";
import { blogPosts } from "@/data/blog";
import { cn } from "@/lib/utils";

/**
 * Agency-style compositions for each service, built from real project
 * assets (client website captures, the BrandSpace identity, editorial
 * photography). Decorative — the service copy carries the meaning — and
 * sized in container units so they scale cleanly from phone to desktop.
 * No performance numbers are shown: nothing here claims a client result.
 *
 * Each positioned piece carries `data-sv-item` so <Services> can stagger it.
 */
export function ServiceVisual({ kind, className, eager }: { kind: Kind; className?: string; eager?: boolean }) {
  return (
    <div aria-hidden className={cn("@container relative isolate overflow-hidden bg-ink", className)}>
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-50 [background-size:6cqw_6cqw] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70cqw] w-[70cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green/[0.07] blur-3xl" />
      {kind === "web" && <Web eager={eager} />}
      {kind === "social" && <Social eager={eager} />}
      {kind === "ads" && <Ads eager={eager} />}
      {kind === "gbp" && <Gbp eager={eager} />}
      {kind === "brand" && <Brand />}
    </div>
  );
}

const shot = {
  casa: "/portfolio/casa-de-grande/hero.webp",
  bar: "/portfolio/bar-code/hero.webp",
  rov: "/portfolio/rovauto/hero.webp",
  zob: "/portfolio/zobhunger/hero.webp",
};

const photo = (slug: string) => blogPosts.find((p) => p.slug === slug)!.cover;

type ImgProps = { src: string; sizes: string; pos?: string; zoom?: number; eager?: boolean; className?: string };

/** Scales every `vw` in a sizes list, so magnified crops still request a sharp source. */
const scaleSizes = (sizes: string, zoom: number) =>
  zoom === 1 ? sizes : sizes.replace(/(\d+(?:\.\d+)?)vw/g, (_, n: string) => `${Math.min(100, Math.round(Number(n) * zoom))}vw`);

/** A cropped view into a capture: `pos` picks the focal point, `zoom` magnifies around it. */
function Crop({ src, sizes, pos = "50% 50%", zoom = 1, eager, className }: ImgProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Photo
        src={src}
        alt=""
        fill
        sizes={scaleSizes(sizes, zoom)}
        loading={eager ? "eager" : undefined}
        className="object-cover"
        style={{ objectPosition: pos, transformOrigin: pos, scale: zoom === 1 ? undefined : String(zoom) }}
      />
    </div>
  );
}

function Chrome({ url, light }: { url: string; light?: boolean }) {
  return (
    <div className={cn("flex h-[3.4cqw] items-center gap-[0.8cqw] px-[1.4cqw]", light ? "bg-paper-2" : "bg-ink-3")}>
      <span className="h-[0.9cqw] w-[0.9cqw] rounded-full bg-[#ff5f57]/80" />
      <span className="h-[0.9cqw] w-[0.9cqw] rounded-full bg-[#febc2e]/80" />
      <span className="h-[0.9cqw] w-[0.9cqw] rounded-full bg-[#28c840]/80" />
      <span
        className={cn(
          "mx-auto rounded-full px-[1.6cqw] text-[1.15cqw] leading-[1.9cqw]",
          light ? "bg-white text-ink/60" : "bg-ink-4 text-paper/60",
        )}
      >
        {url}
      </span>
    </div>
  );
}

const card = "rounded-[1.2cqw] shadow-[0_3cqw_6cqw_-2cqw_rgba(0,0,0,0.75)] ring-1 ring-paper/10";

/* ------------------------------------------------------------------ */
/* Web Development + SEO — responsive builds, code and search basics   */
/* ------------------------------------------------------------------ */
function Web({ eager }: { eager?: boolean }) {
  return (
    <>
      <div data-sv-item className={cn("absolute left-[34%] top-[6%] w-[58%] overflow-hidden bg-ink-3 opacity-60", card)}>
        <Chrome url="zobhungr.com" />
        <Crop src={shot.zob} sizes="(min-width: 1024px) 24vw, 50vw" className="aspect-[16/9]" pos="50% 0%" />
      </div>
      <div data-sv-item className={cn("absolute left-[5%] top-[15%] w-[64%] overflow-hidden bg-ink-3", card)}>
        <Chrome url="casa-mauve-three.vercel.app" />
        <Crop src={shot.casa} sizes="(min-width: 1024px) 28vw, 60vw" className="aspect-[16/9]" pos="50% 0%" eager={eager} />
      </div>
      {/* Responsive: the same product on a phone */}
      <div data-sv-item className="absolute right-[7%] top-[20%] w-[19%] rounded-[2.4cqw] bg-ink-4 p-[0.7cqw] shadow-[0_3cqw_6cqw_-2cqw_rgba(0,0,0,0.8)] ring-1 ring-paper/15">
        <div className="overflow-hidden rounded-[1.8cqw] bg-[#0b0906]">
          <div className="flex items-center justify-between px-[1.4cqw] py-[1.2cqw]">
            <span className="h-[1cqw] w-[5cqw] rounded-full bg-paper/70" />
            <span className="flex flex-col gap-[0.4cqw]">
              <span className="h-[0.25cqw] w-[2cqw] bg-paper/60" />
              <span className="h-[0.25cqw] w-[2cqw] bg-paper/60" />
            </span>
          </div>
          <Crop src={shot.bar} sizes="(min-width: 1024px) 9vw, 20vw" className="aspect-[4/5]" pos="88% 45%" zoom={1.15} />
          <div className="space-y-[0.8cqw] p-[1.4cqw]">
            <span className="block h-[1.1cqw] w-[90%] rounded-full bg-paper/85" />
            <span className="block h-[1.1cqw] w-[65%] rounded-full bg-paper/85" />
            <span className="mt-[1.2cqw] block h-[2.4cqw] w-[55%] rounded-full bg-[#c9a45c]" />
          </div>
        </div>
      </div>
      {/* Code & search foundations */}
      <div data-sv-item className={cn("absolute bottom-[7%] left-[44%] w-[36%] bg-ink-2/95 p-[1.8cqw] font-mono text-[1.25cqw] leading-[1.75] backdrop-blur", card)}>
        <p><span className="text-green">export const</span> <span className="text-paper/85">metadata</span> <span className="text-paper/50">=</span> <span className="text-paper/50">{"{"}</span></p>
        <p className="pl-[2cqw]"><span className="text-[#7cc6ff]">title</span><span className="text-paper/50">:</span> <span className="text-[#e8c07d]">&quot;Boutique hotel…&quot;</span></p>
        <p className="pl-[2cqw]"><span className="text-[#7cc6ff]">@type</span><span className="text-paper/50">:</span> <span className="text-[#e8c07d]">&quot;LocalBusiness&quot;</span></p>
        <p><span className="text-paper/50">{"}"}</span></p>
      </div>
      <div data-sv-item className="absolute bottom-[8%] left-[5%] flex gap-[1cqw]">
        {["LCP", "CLS", "INP"].map((m) => (
          <span key={m} className="flex items-center gap-[0.6cqw] rounded-full bg-ink-3 px-[1.4cqw] py-[0.8cqw] text-[1.2cqw] font-semibold tracking-[0.12em] text-paper/80 ring-1 ring-paper/10">
            <span className="h-[1cqw] w-[1cqw] rounded-full bg-green" />
            {m}
          </span>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Social Media — a feed, a calendar and a reel in production          */
/* ------------------------------------------------------------------ */
function Social({ eager }: { eager?: boolean }) {
  const tiles: ImgProps[] = [
    { src: shot.bar, pos: "88% 45%", zoom: 1.3, sizes: "8vw" },
    { src: shot.casa, pos: "50% 5%", zoom: 2.2, sizes: "8vw" },
    { src: photo("social-media-content-system").src, pos: "60% 40%", sizes: "8vw" },
    { src: shot.rov, pos: "80% 75%", zoom: 2.2, sizes: "8vw" },
    { src: shot.bar, pos: "97% 15%", zoom: 2.2, sizes: "8vw" },
    { src: photo("what-a-brand-identity-really-includes").src, pos: "50% 50%", sizes: "8vw" },
    { src: shot.casa, pos: "85% 80%", zoom: 1.6, sizes: "8vw" },
    { src: photo("meta-ads-for-local-businesses").src, pos: "45% 50%", sizes: "8vw" },
    { src: photo("local-seo-guide-for-small-businesses").src, pos: "50% 55%", sizes: "8vw" },
  ];
  const week = [
    ["Mon", "Reel", "bg-green/80"],
    ["Tue", "", "bg-paper/5"],
    ["Wed", "Carousel", "bg-[#7cc6ff]/80"],
    ["Thu", "Story", "bg-[#f2a65a]/80"],
    ["Fri", "Reel", "bg-green/80"],
    ["Sat", "", "bg-paper/5"],
    ["Sun", "Story", "bg-[#f2a65a]/80"],
  ] as const;
  return (
    <>
      <div data-sv-item className="absolute left-[7%] top-[6%] w-[29%] rounded-[2.6cqw] bg-ink-4 p-[0.7cqw] shadow-[0_3cqw_6cqw_-2cqw_rgba(0,0,0,0.8)] ring-1 ring-paper/15">
        <div className="overflow-hidden rounded-[2cqw] bg-ink-2 pb-[1.2cqw]">
          <div className="flex items-center gap-[1.2cqw] px-[1.6cqw] pb-[1.2cqw] pt-[1.8cqw]">
            <span className="grid h-[5cqw] w-[5cqw] place-items-center rounded-full bg-gradient-to-tr from-green to-[#f2a65a] p-[0.35cqw]">
              <span className="h-full w-full rounded-full bg-ink-3" />
            </span>
            <span className="flex-1 space-y-[0.7cqw]">
              <span className="block h-[1cqw] w-[60%] rounded-full bg-paper/80" />
              <span className="block h-[0.8cqw] w-[85%] rounded-full bg-paper/25" />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-[0.3cqw]">
            {tiles.map((t, i) => (
              <Crop key={i} {...t} className="aspect-square" eager={eager && i < 3} />
            ))}
          </div>
        </div>
      </div>
      <div data-sv-item className={cn("absolute left-[41%] top-[8%] w-[52%] bg-ink-2 p-[2cqw]", card)}>
        <div className="flex items-center justify-between">
          <span className="text-[1.3cqw] font-semibold uppercase tracking-[0.18em] text-paper/70">Content calendar</span>
          <span className="h-[1cqw] w-[6cqw] rounded-full bg-paper/15" />
        </div>
        <div className="mt-[1.6cqw] grid grid-cols-7 gap-[0.7cqw]">
          {week.map(([d, label, color]) => (
            <div key={d} className="rounded-[0.8cqw] bg-ink-3 p-[0.8cqw]">
              <span className="block text-[1.05cqw] text-paper/45">{d}</span>
              <span className={cn("mt-[1cqw] block h-[4.5cqw] rounded-[0.5cqw]", color)} />
              <span className="mt-[0.6cqw] block truncate text-[0.95cqw] text-paper/60">{label || "—"}</span>
            </div>
          ))}
        </div>
      </div>
      <div data-sv-item className={cn("absolute left-[41%] top-[47%] w-[20%] overflow-hidden bg-ink-3", card)}>
        <Crop src={shot.bar} sizes="(min-width: 1024px) 10vw, 20vw" className="aspect-[9/14]" pos="86% 50%" zoom={1.35} />
        <span className="absolute left-1/2 top-[40%] grid h-[5cqw] w-[5cqw] -translate-x-1/2 place-items-center rounded-full bg-paper/85">
          <span className="ml-[0.4cqw] h-0 w-0 border-y-[1cqw] border-l-[1.6cqw] border-y-transparent border-l-ink" />
        </span>
        <span className="absolute inset-x-[1.2cqw] bottom-[1.2cqw] space-y-[0.6cqw]">
          <span className="block h-[0.9cqw] w-[80%] rounded-full bg-paper/85" />
          <span className="block h-[0.8cqw] w-[55%] rounded-full bg-paper/45" />
        </span>
      </div>
      <div data-sv-item className={cn("absolute left-[64%] top-[52%] w-[29%] bg-ink-2 p-[1.8cqw]", card)}>
        <span className="text-[1.2cqw] font-semibold uppercase tracking-[0.16em] text-paper/65">Weekly reach</span>
        <svg viewBox="0 0 120 44" className="mt-[1.2cqw] h-auto w-full" fill="none">
          <path d="M0 38 C14 36 18 30 30 31 S48 22 60 24 S80 12 92 14 S110 5 120 4" stroke="#5bd17b" strokeWidth="2" strokeLinecap="round" />
          <path d="M0 38 C14 36 18 30 30 31 S48 22 60 24 S80 12 92 14 S110 5 120 4 V44 H0Z" fill="#5bd17b" fillOpacity="0.12" />
        </svg>
        <span className="mt-[1cqw] flex gap-[0.8cqw]">
          <span className="h-[0.8cqw] w-[30%] rounded-full bg-paper/20" />
          <span className="h-[0.8cqw] w-[18%] rounded-full bg-paper/10" />
        </span>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Meta Ads — creative, funnel structure and creative testing          */
/* ------------------------------------------------------------------ */
function Ads({ eager }: { eager?: boolean }) {
  const stages = [
    { label: "Awareness", w: "100%", tone: "bg-green/35" },
    { label: "Consideration", w: "74%", tone: "bg-green/60" },
    { label: "Conversion", w: "46%", tone: "bg-green" },
  ];
  return (
    <>
      <div data-sv-item className={cn("absolute left-[6%] top-[7%] w-[38%] overflow-hidden bg-ink-2", card)}>
        <div className="flex items-center gap-[1.2cqw] p-[1.6cqw]">
          <span className="h-[4cqw] w-[4cqw] rounded-full bg-[#d8c29a]" />
          <span className="flex-1 space-y-[0.6cqw]">
            <span className="block h-[1cqw] w-[45%] rounded-full bg-paper/80" />
            <span className="block text-[1.05cqw] leading-none text-paper/45">Sponsored</span>
          </span>
          <span className="text-[1.8cqw] leading-none text-paper/40">···</span>
        </div>
        <div className="space-y-[0.6cqw] px-[1.6cqw] pb-[1.4cqw]">
          <span className="block h-[0.9cqw] w-[92%] rounded-full bg-paper/30" />
          <span className="block h-[0.9cqw] w-[70%] rounded-full bg-paper/30" />
        </div>
        <Crop src={shot.casa} sizes="(min-width: 1024px) 18vw, 40vw" className="aspect-[16/11]" pos="50% 5%" zoom={2.4} eager={eager} />
        <div className="flex items-center justify-between gap-[1cqw] bg-ink-3 p-[1.6cqw]">
          <span className="space-y-[0.6cqw]">
            <span className="block text-[1.05cqw] uppercase tracking-[0.14em] text-paper/45">Boutique stay</span>
            <span className="block h-[1cqw] w-[14cqw] rounded-full bg-paper/80" />
          </span>
          <span className="rounded-[0.8cqw] bg-paper px-[1.6cqw] py-[1cqw] text-[1.2cqw] font-semibold text-ink">Book now</span>
        </div>
      </div>
      <div data-sv-item className={cn("absolute left-[50%] top-[9%] w-[44%] bg-ink-2 p-[2.2cqw]", card)}>
        <span className="text-[1.3cqw] font-semibold uppercase tracking-[0.18em] text-paper/70">Campaign structure</span>
        <div className="mt-[2cqw] space-y-[1.6cqw]">
          {stages.map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between text-[1.2cqw] text-paper/60">
                <span>{s.label}</span>
                <span className="h-[0.8cqw] w-[4cqw] rounded-full bg-paper/15" />
              </div>
              <div className="mt-[0.7cqw] h-[2.6cqw] rounded-[0.6cqw] bg-paper/[0.06]">
                <div className={cn("h-full rounded-[0.6cqw]", s.tone)} style={{ width: s.w }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div data-sv-item className={cn("absolute left-[50%] top-[60%] w-[44%] bg-ink-2 p-[2cqw]", card)}>
        <div className="flex items-center justify-between">
          <span className="text-[1.3cqw] font-semibold uppercase tracking-[0.18em] text-paper/70">Creative testing</span>
          <span className="rounded-full bg-green/15 px-[1.2cqw] py-[0.4cqw] text-[1.05cqw] text-green">Live</span>
        </div>
        <div className="mt-[1.6cqw] grid grid-cols-3 gap-[1cqw]">
          {[
            { src: shot.bar, pos: "88% 45%", zoom: 1.3, tag: "Hook A" },
            { src: shot.rov, pos: "92% 85%", zoom: 1.6, tag: "Hook B" },
            { src: photo("social-media-content-system").src, pos: "60% 40%", zoom: 1, tag: "Hook C" },
          ].map((c) => (
            <div key={c.tag}>
              <Crop src={c.src} sizes="(min-width: 1024px) 7vw, 14vw" className="aspect-[4/5] rounded-[0.8cqw]" pos={c.pos} zoom={c.zoom} />
              <span className="mt-[0.7cqw] block text-[1.1cqw] text-paper/55">{c.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Google Business Profile — local search, the listing and reviews     */
/* ------------------------------------------------------------------ */
function Gbp({ eager }: { eager?: boolean }) {
  return (
    <>
      {/* Night map */}
      <svg data-sv-item viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none">
        <g fill="#f3f4ef" fillOpacity="0.035">
          {Array.from({ length: 36 }, (_, i) => (
            <rect key={i} x={(i % 9) * 46 + 4 + ((i * 7) % 11)} y={Math.floor(i / 9) * 66 + 8} width={26 + (i % 3) * 6} height={40 - (i % 4) * 5} rx="2" />
          ))}
        </g>
        <g stroke="#f3f4ef" strokeOpacity="0.11" strokeLinecap="round">
          <path d="M-10 182 C70 160 150 196 230 168 S350 128 410 146" strokeWidth="9" />
          <path d="M160 -10 C170 70 130 150 180 270" strokeWidth="9" />
          <path d="M300 -10 L280 270" strokeWidth="6" />
          <path d="M-10 70 L410 92" strokeWidth="5" />
        </g>
        <path d="M86 214 C150 196 200 180 250 150 S290 120 272 118" stroke="#5bd17b" strokeWidth="2.5" strokeDasharray="4 5" strokeLinecap="round" />
        {[[96, 60], [340, 210], [60, 150]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#f3f4ef" fillOpacity="0.35" />
        ))}
      </svg>
      <div data-sv-item className="absolute left-[64%] top-[30%] -translate-x-1/2">
        <span className="absolute left-1/2 top-[88%] h-[3cqw] w-[9cqw] -translate-x-1/2 rounded-[50%] border border-green/60 sv-pulse" />
        <svg viewBox="0 0 40 52" className="relative w-[6cqw]" fill="none">
          <path d="M20 51C18 45 3 34 3 19a17 17 0 0 1 34 0C37 34 22 45 20 51Z" fill="#5bd17b" />
          <circle cx="20" cy="19" r="6.5" fill="#070908" />
        </svg>
      </div>
      <div data-sv-item className="absolute left-[5%] top-[7%] flex w-[46%] items-center gap-[1.2cqw] rounded-full bg-paper px-[2cqw] py-[1.3cqw] shadow-[0_2cqw_4cqw_-1.5cqw_rgba(0,0,0,0.7)]">
        <svg viewBox="0 0 20 20" className="w-[1.8cqw] shrink-0" fill="none" stroke="#070908" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="8.5" cy="8.5" r="6" />
          <path d="m13 13 5 5" />
        </svg>
        <span className="truncate text-[1.5cqw] text-ink/80">car service near me</span>
      </div>
      <div data-sv-item className={cn("absolute left-[5%] top-[23%] w-[46%] overflow-hidden bg-ink-2", card)}>
        <div className="grid grid-cols-3 gap-[0.3cqw]">
          <Crop src={shot.rov} sizes="(min-width: 1024px) 8vw, 16vw" className="aspect-[4/3]" pos="80% 75%" zoom={2.2} eager={eager} />
          <Crop src={shot.rov} sizes="(min-width: 1024px) 8vw, 16vw" className="aspect-[4/3]" pos="95% 40%" zoom={1.8} />
          <Crop src={shot.rov} sizes="(min-width: 1024px) 8vw, 16vw" className="aspect-[4/3]" pos="75% 92%" zoom={2.4} />
        </div>
        <div className="p-[2cqw]">
          <span className="block h-[1.4cqw] w-[62%] rounded-full bg-paper/85" />
          <div className="mt-[1.2cqw] flex items-center gap-[1cqw]">
            <span className="flex gap-[0.3cqw] text-[1.5cqw] leading-none text-[#f5c451]">★★★★★</span>
            <span className="h-[0.9cqw] w-[6cqw] rounded-full bg-paper/20" />
          </div>
          <div className="mt-[1.2cqw] flex items-center gap-[1cqw] text-[1.2cqw]">
            <span className="font-semibold text-green">Open now</span>
            <span className="h-[0.9cqw] w-[9cqw] rounded-full bg-paper/15" />
          </div>
          <div className="mt-[1.8cqw] grid grid-cols-4 gap-[0.8cqw]">
            {["Call", "Directions", "Website", "Book"].map((a, i) => (
              <span
                key={a}
                className={cn(
                  "truncate rounded-full py-[0.9cqw] text-center text-[1.05cqw] font-medium",
                  i === 1 ? "bg-green text-ink" : "bg-paper/[0.07] text-paper/70",
                )}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div data-sv-item className={cn("absolute bottom-[8%] right-[5%] w-[34%] bg-ink-2 p-[1.8cqw]", card)}>
        <div className="flex items-center gap-[1cqw]">
          <span className="h-[3.4cqw] w-[3.4cqw] rounded-full bg-paper/20" />
          <span className="flex-1 space-y-[0.6cqw]">
            <span className="block h-[0.9cqw] w-[50%] rounded-full bg-paper/70" />
            <span className="block text-[1.3cqw] leading-none text-[#f5c451]">★★★★★</span>
          </span>
        </div>
        <div className="mt-[1.2cqw] space-y-[0.6cqw]">
          <span className="block h-[0.8cqw] w-full rounded-full bg-paper/20" />
          <span className="block h-[0.8cqw] w-[82%] rounded-full bg-paper/20" />
        </div>
        <span className="mt-[1.2cqw] block text-[1.1cqw] text-green">Owner replied</span>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Digital Branding — the BrandSpace identity system as a brand board   */
/* ------------------------------------------------------------------ */
function Brand() {
  const swatches = [
    ["#5BD17B", "bg-green", "text-ink"],
    ["#070908", "bg-ink ring-1 ring-paper/15", "text-paper/70"],
    ["#F3F4EF", "bg-paper", "text-ink"],
    ["#16793A", "bg-green-deep", "text-paper/80"],
  ] as const;
  return (
    <>
      <div data-sv-item className={cn("absolute bottom-[7%] left-[5%] top-[7%] flex w-[35%] flex-col justify-between bg-ink-2 p-[2.4cqw]", card)}>
        <span className="text-[1.2cqw] font-semibold uppercase tracking-[0.18em] text-paper/55">Typography</span>
        <span className="font-serif text-[15cqw] italic leading-[0.8] text-green">Aa</span>
        <span className="space-y-[0.5cqw] text-[1.3cqw] text-paper/70">
          <span className="block font-display font-semibold">Bricolage Grotesque</span>
          <span className="block font-serif italic">Instrument Serif</span>
          <span className="block">Geist</span>
        </span>
      </div>
      <div data-sv-item className={cn("absolute left-[43%] top-[7%] aspect-square w-[27%] overflow-hidden bg-ink-2", card)}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none" stroke="#5bd17b" strokeOpacity="0.28" strokeWidth="0.4">
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="24" />
          <path d="M0 50H100M50 0V100" strokeDasharray="1.5 2" />
          <path d="M12 12 88 88" strokeDasharray="1.5 2" />
        </svg>
        <Image src="/brand/brandspace-logo.png" alt="" fill sizes="(min-width: 1024px) 12vw, 26vw" className="logo-on-dark object-contain p-[3.5cqw]" />
      </div>
      <div data-sv-item className="absolute right-[5%] top-[7%] grid w-[21%] grid-cols-2 gap-[0.8cqw]">
        {swatches.map(([hex, bg, fg]) => (
          <span key={hex} className={cn("flex aspect-[3/4] items-end rounded-[0.9cqw] p-[0.9cqw] text-[1cqw] font-medium tracking-[0.06em]", bg, fg)}>
            {hex}
          </span>
        ))}
      </div>
      {/* Applications: business cards */}
      <div data-sv-item className="absolute bottom-[9%] left-[43%] w-[26%] -rotate-[4deg] rounded-[1cqw] bg-green p-[2cqw] shadow-[0_3cqw_6cqw_-2cqw_rgba(0,0,0,0.8)]">
        <span className="block max-w-[80%] font-serif text-[2.2cqw] italic leading-tight text-ink">Future of Business Growth.</span>
        <span className="mt-[3.6cqw] block h-[0.8cqw] w-[40%] rounded-full bg-ink/30" />
      </div>
      <div data-sv-item className="absolute bottom-[14%] right-[5%] flex w-[31%] rotate-[3deg] flex-col justify-between rounded-[1cqw] bg-ink-3 p-[2cqw] shadow-[0_3cqw_6cqw_-2cqw_rgba(0,0,0,0.85)] ring-1 ring-paper/15">
        <span className="flex items-center gap-[1cqw]">
          <span className="relative h-[4.2cqw] w-[4.2cqw]">
            <Image src="/brand/brandspace-logo.png" alt="" fill sizes="48px" className="logo-on-dark object-contain" />
          </span>
          <span className="font-display text-[2cqw] font-semibold tracking-[-0.03em] text-paper">BrandSpace</span>
        </span>
        <span className="mt-[3cqw] space-y-[0.6cqw]">
          <span className="block h-[0.7cqw] w-[60%] rounded-full bg-paper/30" />
          <span className="block h-[0.7cqw] w-[40%] rounded-full bg-paper/20" />
        </span>
      </div>
    </>
  );
}
