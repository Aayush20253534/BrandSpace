"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigation, site } from "@/data/site";
import { whatsappUrl, telUrl, mailUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { useLenis } from "@/components/motion/SmoothScroll";
import { ArrowUpRight, WhatsApp } from "@/components/ui/Icons";

export function Navbar() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Solid background after leaving the top; hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 480);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Close the menu on navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route change must dismiss the overlay
    setOpen(false);
  }, [pathname]);

  // Lock scroll + focus management + Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const menu = menuRef.current;
    const focusables = () =>
      Array.from(menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const els = [toggleRef.current!, ...focusables()];
        const first = els[0]!;
        const last = els[els.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [open, lenis]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled && !open
            ? "border-b border-paper/[0.07] bg-ink/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-bs flex h-[var(--header-h)] items-center justify-between gap-6">
          <Logo className="relative z-10" />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-paper/[0.08] bg-ink/30 p-1 backdrop-blur-md">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-full px-4 py-2 text-[0.82rem] font-medium transition-colors duration-300",
                        active ? "bg-paper/[0.09] text-paper" : "text-paper/60 hover:text-paper",
                      )}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-green" aria-hidden />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <Magnetic strength={0.2}>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Let’s Grow — chat with BrandSpace on WhatsApp (opens in a new tab)"
                className="group inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-green pl-3.5 pr-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-green-bright sm:gap-2.5 sm:pl-5 sm:text-[0.78rem] sm:tracking-[0.14em]"
              >
                <span>Let’s Grow</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-green transition-transform duration-500 group-hover:scale-110">
                  <WhatsApp size={16} />
                </span>
              </a>
            </Magnetic>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-paper/15 bg-ink/40 backdrop-blur-md transition-colors hover:border-paper/40 lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <span
                aria-hidden
                className={cn(
                  "absolute h-px w-[18px] bg-paper transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  open ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "absolute h-px bg-paper transition-all duration-500 ease-[var(--ease-out-expo)]",
                  open ? "w-[18px] -rotate-45" : "w-3 translate-x-[-3px] translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-ink transition-[clip-path] duration-700 ease-[var(--ease-in-out-quart)] lg:hidden",
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <div className="hairline-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <nav aria-label="Mobile" className="container-bs relative flex flex-1 flex-col justify-center pt-[var(--header-h)]">
          <ul className="space-y-1">
            {navigation.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="overflow-hidden">
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-baseline gap-4 py-1.5 font-display text-[clamp(2.6rem,11vw,4.5rem)] font-semibold leading-[1] tracking-[-0.045em] transition-[transform,color] duration-700 ease-[var(--ease-out-expo)]",
                      open ? "translate-y-0" : "translate-y-full",
                      active ? "text-green" : "text-paper",
                    )}
                    style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                  >
                    <span className="font-sans text-xs font-medium tracking-[0.2em] text-paper/35">0{i + 1}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div
          className={cn(
            "container-bs relative grid gap-6 border-t border-paper/10 py-8 transition-opacity duration-700 sm:grid-cols-2",
            open ? "opacity-100 delay-500" : "opacity-0",
          )}
        >
          <div className="space-y-2 text-sm text-paper/70">
            <a href={mailUrl} className="block hover:text-paper">{site.email}</a>
            <a href={telUrl} className="block hover:text-paper">{site.phone.display}</a>
          </div>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-between rounded-full bg-green pl-6 pr-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink sm:justify-self-end"
          >
            Start Your Project
            <span className="ml-5 grid h-10 w-10 place-items-center rounded-full bg-ink text-green">
              <ArrowUpRight size={18} />
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
