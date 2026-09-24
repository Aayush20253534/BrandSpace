"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { WhatsApp } from "@/components/ui/Icons";

export function ShareLinks({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className={className}>
      <p className="eyebrow text-ink/65">Share</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${l.label} (opens in a new tab)`}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-[0.78rem] text-ink/70 transition-colors hover:border-ink hover:text-ink"
            >
              {l.label === "WhatsApp" && <WhatsApp size={14} />}
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={copy}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[0.78rem] transition-colors",
              copied ? "border-green-deep bg-green-deep text-paper" : "border-ink/15 text-ink/70 hover:border-ink hover:text-ink",
            )}
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        </li>
      </ul>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
