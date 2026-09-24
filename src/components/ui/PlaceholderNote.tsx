import { site, type ContentStatus } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Discreet disclosure shown next to content that is still a design
 * placeholder (mock metrics, sample testimonials, temporary bios).
 * Disappears automatically once a record is marked "verified".
 */
export function PlaceholderNote({
  status,
  children = "Illustrative figures — to be replaced with verified client results.",
  className,
  tone = "light",
}: {
  status: ContentStatus | ContentStatus[];
  children?: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  const list = Array.isArray(status) ? status : [status];
  if (!site.flagPlaceholderContent || !list.includes("placeholder")) return null;
  return (
    <p
      className={cn(
        "text-[0.68rem] leading-relaxed tracking-[0.02em]",
        tone === "light" ? "text-paper/60" : "text-ink/65",
        className,
      )}
    >
      <span aria-hidden>* </span>
      {children}
    </p>
  );
}
