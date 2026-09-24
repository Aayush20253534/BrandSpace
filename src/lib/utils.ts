export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string, style: "long" | "short" = "long") {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

export function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

/** First + last initial ("Ayush Kumar Jha" → "AJ"), ignoring titles like "Dr." */
export function initials(name: string) {
  const parts = name.split(/\s+/).filter((p) => p && !/^(dr|mr|mrs|ms)\.?$/i.test(p));
  if (!parts.length) return "";
  const first = parts[0]![0]!;
  const last = parts.length > 1 ? parts[parts.length - 1]![0]! : "";
  return (first + last).toUpperCase();
}

export function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}
