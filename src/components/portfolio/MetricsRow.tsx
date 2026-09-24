import type { Project } from "@/data/portfolio";
import { CountUp } from "@/components/motion/CountUp";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { cn } from "@/lib/utils";

/** Revenue growth · ROAS · lead/conversion growth for a project. */
export function MetricsRow({
  project,
  compact,
  tone = "light",
}: {
  project: Project;
  compact?: boolean;
  tone?: "light" | "dark";
}) {
  const { revenue, roas, leads, status } = project.metrics;
  const items = [revenue, roas, leads];
  return (
    <div>
      <dl className={cn("grid grid-cols-3", compact ? "gap-4" : "gap-6 sm:gap-10")}>
        {items.map((m) => (
          <div key={m.label} className={cn("flex flex-col border-t pt-4", tone === "light" ? "border-paper/15" : "border-ink/15")}>
            <dt className={cn("order-2 mt-2 text-[0.7rem] font-semibold uppercase leading-tight tracking-[0.14em]", tone === "light" ? "text-paper/50" : "text-ink/55")}>
              {m.label}
            </dt>
            <dd className="order-1">
              <CountUp
                value={m.value}
                prefix={m.prefix}
                suffix={m.suffix}
                decimals={m.decimals}
                className={cn(
                  "font-display-tight block font-semibold tabular-nums",
                  compact ? "text-[clamp(1.8rem,3vw,2.6rem)]" : "text-[clamp(2.6rem,6vw,5.4rem)]",
                  tone === "light" ? "text-green" : "text-ink",
                )}
              />
            </dd>
            {!compact && (
              <dd className={cn("order-3 mt-2 text-sm leading-snug", tone === "light" ? "text-paper/50" : "text-ink/55")}>{m.context}</dd>
            )}
          </div>
        ))}
      </dl>
      <PlaceholderNote status={status} tone={tone} className="mt-4" />
    </div>
  );
}
