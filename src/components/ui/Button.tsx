import Link from "next/link";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { ArrowRight, ArrowUpRight, WhatsApp } from "./Icons";
import { Magnetic } from "@/components/motion/Magnetic";

type Variant = "primary" | "light" | "outline" | "outline-dark" | "dark";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-green text-ink hover:bg-green-bright",
  light: "bg-paper text-ink hover:bg-white",
  dark: "bg-ink text-paper hover:bg-ink-3",
  outline: "border border-paper/25 text-paper hover:border-paper/60 hover:bg-paper/[0.04]",
  "outline-dark": "border border-ink/20 text-ink hover:border-ink/60",
};

const sizes: Record<Size, string> = {
  md: "h-12 pl-5 pr-2 text-[0.8rem] gap-4",
  lg: "h-14 sm:h-16 pl-6 sm:pl-7 pr-2 text-[0.82rem] sm:text-[0.86rem] gap-5",
};

const iconWrap: Record<Variant, string> = {
  primary: "bg-ink text-green",
  light: "bg-ink text-paper",
  dark: "bg-green text-ink",
  outline: "bg-paper text-ink",
  "outline-dark": "bg-ink text-paper",
};

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: "arrow" | "external" | "whatsapp";
  magnetic?: boolean;
};

function Inner({ children, variant = "primary", icon = "arrow" }: CommonProps) {
  const Icon = icon === "whatsapp" ? WhatsApp : icon === "external" ? ArrowUpRight : ArrowRight;
  return (
    <>
      <span className="font-semibold uppercase tracking-[0.16em]">{children}</span>
      <span
        className={cn(
          "grid aspect-square h-[calc(100%-0.75rem)] place-items-center rounded-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[-45deg]",
          icon !== "arrow" && "group-hover:rotate-0 group-hover:scale-110",
          iconWrap[variant],
        )}
      >
        <Icon size={icon === "whatsapp" ? 18 : 17} />
      </span>
    </>
  );
}

const shell = (variant: Variant, size: Size, className?: string) =>
  cn(
    "group relative inline-flex select-none items-center justify-between rounded-full transition-colors duration-300",
    variants[variant],
    sizes[size],
    className,
  );

export function ButtonLink({
  href,
  magnetic = true,
  ...props
}: CommonProps & { href: string }) {
  const { variant = "primary", size = "md", className } = props;
  const el = (
    <Link href={href} className={shell(variant, size, className)}>
      <Inner {...props} />
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** Primary conversion action — opens WhatsApp chat in a new tab/app. */
export function WhatsAppButton({
  message,
  magnetic = true,
  label,
  ...props
}: Omit<CommonProps, "icon"> & { message?: string; label?: string }) {
  const { variant = "primary", size = "md", className } = props;
  const el = (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ?? `${typeof props.children === "string" ? props.children : "Chat"} — opens WhatsApp in a new tab`}
      className={shell(variant, size, className)}
    >
      <Inner {...props} icon="whatsapp" />
    </a>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** Understated underlined text link with arrow. */
export function TextLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = cn(
    "group inline-flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em]",
    className,
  );
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-0" />
        <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-green transition-transform delay-150 duration-500 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100" />
      </span>
      {external ? (
        <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      ) : (
        <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
      )}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
