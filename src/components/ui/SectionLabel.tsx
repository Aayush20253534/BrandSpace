import { cn } from "@/lib/utils";

/** Editorial section marker, e.g. "(02) Selected Work". */
export function SectionLabel({
  index,
  children,
  className,
  tone = "light",
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <p
      data-reveal="up"
      className={cn(
        "eyebrow flex items-center gap-3",
        tone === "light" ? "text-paper/60" : "text-ink/55",
        className,
      )}
    >
      <span className="inline-block h-[7px] w-[7px] rounded-full bg-green" aria-hidden />
      {index && <span className={tone === "light" ? "text-paper/35" : "text-ink/35"}>({index})</span>}
      <span>{children}</span>
    </p>
  );
}
