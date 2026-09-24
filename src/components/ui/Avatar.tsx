import Image from "next/image";
import { cn, initials } from "@/lib/utils";

/** Circular client photo, or an initials monogram until a photo is added. */
export function Avatar({
  name,
  photo,
  size = 56,
  className,
  tone = "dark",
}: {
  name: string;
  photo: { src: string; alt: string } | null;
  size?: number;
  className?: string;
  tone?: "dark" | "light";
}) {
  if (photo) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-display font-semibold tracking-[-0.02em]",
        tone === "dark" ? "bg-ink text-green" : "bg-green text-ink",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials(name)}
    </span>
  );
}
