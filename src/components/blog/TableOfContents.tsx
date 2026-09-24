"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/motion/SmoothScroll";

/** Briefly marks the heading a reader just jumped to (see .prose-bs [data-flash]). */
function flash(el: HTMLElement) {
  el.removeAttribute("data-flash");
  // Restart the animation even when the same heading is chosen twice.
  void el.offsetWidth;
  el.setAttribute("data-flash", "");
  window.setTimeout(() => el.removeAttribute("data-flash"), 1600);
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef<HTMLOListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((e) => io.observe(e));
    // Arriving with a #hash: highlight that section once it has been scrolled to.
    const fromHash = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (fromHash && els.includes(fromHash)) window.setTimeout(() => flash(fromHash), 400);
    return () => io.disconnect();
  }, [items]);

  // Slide the indicator to the active entry.
  useEffect(() => {
    const list = listRef.current;
    const marker = markerRef.current;
    const link = list?.querySelector<HTMLElement>(`a[href="#${CSS.escape(active ?? "")}"]`);
    if (!marker || !link) return;
    marker.style.transform = `translateY(${link.offsetTop}px)`;
    marker.style.height = `${link.offsetHeight}px`;
    marker.style.opacity = "1";
  }, [active]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 76) - 24;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis && !reduce) {
      lenis.scrollTo(target, { offset, duration: 1.1, onComplete: () => flash(target) });
    } else {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduce ? "auto" : "smooth" });
      flash(target);
    }
    history.replaceState(null, "", `#${id}`);
    setActive(id);
    // Keep keyboard focus with the content the reader chose.
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  if (!items.length) return null;
  return (
    <nav aria-label="On this page">
      <p className="eyebrow text-ink/65">On this page</p>
      <ol ref={listRef} className="relative mt-5 space-y-1 border-l border-ink/10">
        <span
          ref={markerRef}
          aria-hidden
          className="absolute -left-px top-0 w-[2px] rounded-full bg-green-deep opacity-0 transition-[transform,height,opacity] duration-500 ease-[var(--ease-out-expo)]"
        />
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => go(e, item.id)}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "block py-1.5 pl-4 text-[0.88rem] leading-snug transition-[color,translate] duration-500 ease-[var(--ease-out-expo)]",
                active === item.id ? "translate-x-1 font-medium text-ink" : "text-ink/65 hover:text-ink",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
