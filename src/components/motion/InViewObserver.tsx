"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One site-wide IntersectionObserver for every `[data-reveal]` element.
 * It only toggles `data-inview`; the actual animation lives in CSS, so
 * reveals cost nothing on the main thread and respect reduced motion.
 *
 * A second observer watches `[data-center]` elements and toggles
 * `data-active` while they cross the middle band of the viewport — used
 * for rows that "light up" as they reach the centre of the screen.
 */
export function InViewObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-inview", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const center = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute("data-active", entry.isIntersecting);
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );

    const scan = (root: ParentNode) => {
      root.querySelectorAll("[data-reveal]:not([data-inview])").forEach((el) => io.observe(el));
      root.querySelectorAll("[data-center]").forEach((el) => center.observe(el));
    };
    scan(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.matches("[data-reveal]:not([data-inview])")) io.observe(n);
            if (n.matches("[data-center]")) center.observe(n);
            scan(n);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      center.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
