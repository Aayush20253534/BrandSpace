import Image from "next/image";
import type { TeamMember } from "@/data/team";
import { cn, initials } from "@/lib/utils";

/**
 * Founder portrait (4:5). Until real photography is added in
 * src/data/team.ts, renders an editorial monogram study: contour lines
 * suggesting a head-and-shoulders silhouette, set in the brand palette.
 */
export function Portrait({
  member,
  className,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  eager,
}: {
  member: TeamMember;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  if (member.photo) {
    return (
      <div className={cn("relative aspect-[4/5] overflow-hidden bg-ink-3", className)}>
        <Image src={member.photo.src} alt={member.photo.alt} fill sizes={sizes} loading={eager ? "eager" : undefined} className="object-cover grayscale-[15%]" />
      </div>
    );
  }
  const id = member.slug;
  const seed = member.name.length;
  return (
    <div
      className={cn("relative aspect-[4/5] overflow-hidden bg-ink-3", className)}
      role="img"
      aria-label={`Portrait placeholder for ${member.name}`}
    >
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id={`pg-${id}`} cx="50%" cy="38%" r="75%">
            <stop offset="0" stopColor="#1d3a28" />
            <stop offset="0.6" stopColor="#0f1712" />
            <stop offset="1" stopColor="#090c0a" />
          </radialGradient>
          <clipPath id={`pc-${id}`}>
            <path d="M200 92c50 0 84 38 84 92 0 36-15 66-38 83v21c62 12 112 46 132 110l12 102H10l12-102c20-64 70-98 132-110v-21c-23-17-38-47-38-83 0-54 34-92 84-92Z" />
          </clipPath>
        </defs>
        <rect width="400" height="500" fill={`url(#pg-${id})`} />
        {/* contour study */}
        <g clipPath={`url(#pc-${id})`} fill="none" stroke="#5bd17b">
          {Array.from({ length: 34 }, (_, i) => (
            <path
              key={i}
              d={`M-20 ${70 + i * 14} Q ${120 + ((i * seed) % 40)} ${40 + i * 14 + ((i % 3) - 1) * 18} 200 ${66 + i * 14} T 420 ${60 + i * 14}`}
              strokeOpacity={0.12 + (i % 5) * 0.05}
              strokeWidth={1}
            />
          ))}
        </g>
        <path
          d="M200 92c50 0 84 38 84 92 0 36-15 66-38 83v21c62 12 112 46 132 110l12 102H10l12-102c20-64 70-98 132-110v-21c-23-17-38-47-38-83 0-54 34-92 84-92Z"
          fill="none"
          stroke="#5bd17b"
          strokeOpacity="0.35"
        />
      </svg>
      <span className="absolute bottom-5 left-6 font-serif text-[clamp(3rem,6vw,5.5rem)] italic leading-none text-paper/90">
        {initials(member.name)}
      </span>
      <span className="absolute right-5 top-5 h-2 w-2 rounded-full bg-green" aria-hidden />
    </div>
  );
}
