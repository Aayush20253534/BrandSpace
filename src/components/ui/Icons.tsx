import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
});

export function ArrowRight({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowDown({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <path d="M12 4v15M6 13l6 6 6-6" />
    </svg>
  );
}

export function Plus({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Close({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Mail({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function Phone({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function MapPin({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function Clock({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function Check({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function WhatsApp({ size = 20, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden focusable={false} fill="currentColor" {...p}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.16-1.5A9.92 9.92 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.06.89.9-2.98-.2-.31a8.2 8.2 0 1 1 6.84 3.73Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.55.12-.16.25-.63.8-.78.96-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.07-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04c0 1.2.88 2.36 1 2.53.12.16 1.72 2.63 4.18 3.69.58.25 1.04.4 1.4.52.58.18 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.2-.57.2-1.07.15-1.17-.07-.11-.23-.17-.47-.29Z" />
    </svg>
  );
}

export function MenuIcon({ size, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...p}>
      <path d="M3 8h18M3 16h12" />
    </svg>
  );
}
