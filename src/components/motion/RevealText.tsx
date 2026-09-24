import { createElement, Fragment } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

/**
 * Word-by-word masked reveal. Wrap accent words in *asterisks* to set them
 * in the italic serif accent, e.g. "Build your *space*." Use "\n" to force
 * a line break. Server-rendered; animation is pure CSS.
 */
export function RevealText({
  text,
  as = "h2",
  className,
  accentClassName = "font-serif italic font-normal tracking-[-0.02em] text-green",
  delay = 0,
  id,
}: {
  text: string;
  as?: Tag;
  className?: string;
  accentClassName?: string;
  delay?: number;
  id?: string;
}) {
  let wordIndex = 0;
  const lines = text.split("\n");

  const content = lines.map((line, li) => {
    // Split into accent / normal segments.
    const segments = line.split(/(\*[^*]+\*)/g).filter(Boolean);
    const nodes = segments.flatMap((seg, si) => {
      const accent = seg.startsWith("*") && seg.endsWith("*");
      const clean = accent ? seg.slice(1, -1) : seg;
      const words = clean.split(/(\s+)/);
      return words.map((w, wi) => {
        if (/^\s+$/.test(w)) return <Fragment key={`${li}-${si}-${wi}`}> </Fragment>;
        if (!w) return null;
        const i = wordIndex++;
        return (
          <span key={`${li}-${si}-${wi}`} className="rw">
            <span style={{ ["--i" as string]: i }} className={accent ? accentClassName : undefined}>
              {w}
            </span>
          </span>
        );
      });
    });
    return (
      <Fragment key={li}>
        {nodes}
        {li < lines.length - 1 && <br />}
      </Fragment>
    );
  });

  return createElement(
    as,
    {
      id,
      className: cn(className),
      "data-reveal": "words",
      style: delay ? ({ ["--rv-delay" as string]: `${delay}ms` } as React.CSSProperties) : undefined,
    },
    content,
  );
}
