import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** The supplied BrandSpace mark (transparent cut of the original artwork). */
export function LogoMark({ size = 40, className, eager }: { size?: number; className?: string; eager?: boolean }) {
  return (
    <Image
      src="/brand/brandspace-logo.png"
      alt=""
      width={size}
      height={size}
      loading={eager ? "eager" : undefined}
      className={cn("logo-on-dark shrink-0", className)}
      sizes={`${size}px`}
    />
  );
}

export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <Link
      href="/"
      aria-label="BrandSpace — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <LogoMark size={42} eager className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[-8deg] group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.28rem] font-semibold tracking-[-0.04em]",
            tone === "light" ? "text-paper" : "text-ink",
          )}
        >
          BrandSpace
        </span>
        <span
          className={cn(
            "mt-1 hidden text-[0.56rem] font-medium uppercase tracking-[0.28em] sm:block",
            tone === "light" ? "text-paper/45" : "text-ink/50",
          )}
        >
          Future of Business Growth
        </span>
      </span>
    </Link>
  );
}
