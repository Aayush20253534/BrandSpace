"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { budgetOptions, contactSchema, serviceOptions } from "@/lib/contact";
import { whatsappUrl, mailUrl } from "@/lib/whatsapp";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, WhatsApp } from "@/components/ui/Icons";

type Status = "idle" | "submitting" | "success" | "error";
type Values = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  details: string;
  consent: boolean;
};

const initial: Values = { name: "", company: "", email: "", phone: "", service: "", budget: "", details: "", consent: false };
const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function validate(values: Values) {
  const res = contactSchema.safeParse(values);
  if (res.success) return {};
  const errs: Partial<Record<keyof Values, string>> = {};
  for (const issue of res.error.issues) {
    const k = issue.path[0] as keyof Values;
    errs[k] ??= issue.message;
  }
  return errs;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(initial);
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [startedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Bring the confirmation into view (the form collapses underneath the reader).
  useEffect(() => {
    if (status !== "success") return;
    successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    successRef.current?.focus({ preventScroll: true });
  }, [status]);

  const errors = { ...validate(values), ...serverErrors };
  const show = (k: keyof Values) => (touched[k] || status === "error") && errors[k];

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    setServerErrors((prev) => ({ ...prev, [k]: undefined }));
  };
  const blur = (k: keyof Values) => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clientErrors = validate(values);
    if (Object.keys(clientErrors).length) {
      setTouched(Object.fromEntries(Object.keys(initial).map((k) => [k, true])));
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      requestAnimationFrame(() => {
        const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
        first?.focus();
      });
      return;
    }
    setStatus("submitting");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: String(fd.get("website") ?? ""),
          startedAt,
          turnstileToken: fd.get("cf-turnstile-response") ?? undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      setServerErrors((data.fieldErrors as Partial<Record<keyof Values, string>>) ?? {});
      setStatus("error");
      setMessage(data.error ?? "Something went wrong. Please try again.");
      requestAnimationFrame(() => summaryRef.current?.focus());
    } catch {
      setStatus("error");
      setMessage("We couldn’t reach the server. Check your connection and try again, or message us on WhatsApp.");
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  };

  if (status === "success") {
    const followUp = `Hi BrandSpace, I’m ${values.name} from ${values.company}. I just sent an enquiry about ${values.service} through your website and would like to discuss my business/project.`;
    return (
      <div ref={successRef} tabIndex={-1} role="status" aria-live="polite" className="animate-[panelIn_0.7s_var(--ease-out-expo)_both] py-6 text-center outline-none sm:py-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green text-ink">
          <Check size={30} />
        </span>
        <h2 className="font-display-tight mt-8 text-[clamp(2rem,4vw,3rem)] font-semibold">Thank you, {values.name.split(" ")[0]}.</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink/65">
          Your project brief is with the BrandSpace team. We’ll review it and get back to you at{" "}
          <span className="font-medium text-ink">{values.email}</span>.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href={whatsappUrl(followUp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-3 rounded-full bg-ink pl-6 pr-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-ink-3"
          >
            Prefer WhatsApp? Continue there
            <span className="grid h-10 w-10 place-items-center rounded-full bg-green text-ink">
              <WhatsApp size={18} />
            </span>
          </a>
          <Link href="/portfolio" className="text-sm font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline">
            Browse our work while you wait
          </Link>
        </div>
      </div>
    );
  }

  const field = "peer w-full rounded-[6px] border bg-white/70 px-4 py-3.5 text-[1rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/35 focus:border-ink focus:bg-white focus:shadow-[0_0_0_3px_rgba(91,209,123,0.35)]";
  const border = (k: keyof Values) => (show(k) ? "border-[#c0392b]" : "border-ink/15 hover:border-ink/35");

  const err = (k: keyof Values) =>
    show(k) ? (
      <p id={`${k}-error`} className="mt-2 text-[0.82rem] text-[#b3261e]">
        {errors[k]}
      </p>
    ) : null;

  const describe = (k: keyof Values, hint?: string) => [show(k) ? `${k}-error` : "", hint ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="form-status" className="relative">
      {turnstileKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />}

      <div id="form-status" ref={summaryRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {status === "error" && message && (
          <div className="mb-8 rounded-[6px] border border-[#b3261e]/30 bg-[#b3261e]/[0.06] p-4 text-[0.92rem] text-[#8c1d18]">
            <p className="font-medium">{message}</p>
            <p className="mt-1 text-[#8c1d18]/80">
              You can also reach us directly on{" "}
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="underline">
                WhatsApp
              </a>{" "}
              or at{" "}
              <a href={mailUrl} className="underline">
                {site.email}
              </a>
              .
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-[0.82rem] font-medium text-ink/80">
            Name <span className="text-green-deep" aria-hidden>*</span>
          </label>
          <input id="name" name="name" autoComplete="name" required value={values.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} aria-invalid={!!show("name")} aria-describedby={describe("name")} className={cn(field, border("name"))} placeholder="Your full name" />
          {err("name")}
        </div>
        <div>
          <label htmlFor="company" className="mb-2 block text-[0.82rem] font-medium text-ink/80">
            Business / Company <span className="text-green-deep" aria-hidden>*</span>
          </label>
          <input id="company" name="company" autoComplete="organization" required value={values.company} onChange={(e) => set("company", e.target.value)} onBlur={() => blur("company")} aria-invalid={!!show("company")} aria-describedby={describe("company")} className={cn(field, border("company"))} placeholder="Business name" />
          {err("company")}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-[0.82rem] font-medium text-ink/80">
            Email <span className="text-green-deep" aria-hidden>*</span>
          </label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} aria-invalid={!!show("email")} aria-describedby={describe("email")} className={cn(field, border("email"))} placeholder="you@business.com" />
          {err("email")}
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-[0.82rem] font-medium text-ink/80">
            Phone <span className="text-green-deep" aria-hidden>*</span>
          </label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={values.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} aria-invalid={!!show("phone")} aria-describedby={describe("phone")} className={cn(field, border("phone"))} placeholder="+91 98765 43210" />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="service" className="mb-2 block text-[0.82rem] font-medium text-ink/80">
            Service required <span className="text-green-deep" aria-hidden>*</span>
          </label>
          <div className="relative">
            <select id="service" name="service" required value={values.service} onChange={(e) => set("service", e.target.value)} onBlur={() => blur("service")} aria-invalid={!!show("service")} aria-describedby={describe("service")} className={cn(field, border("service"), "appearance-none pr-10", !values.service && "text-ink/40")}>
              <option value="" disabled>
                Choose a service
              </option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ArrowRight size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-ink/40" />
          </div>
          {err("service")}
        </div>
        <div>
          <label htmlFor="budget" className="mb-2 block text-[0.82rem] font-medium text-ink/80">
            Budget range <span className="text-green-deep" aria-hidden>*</span>
          </label>
          <div className="relative">
            <select id="budget" name="budget" required value={values.budget} onChange={(e) => set("budget", e.target.value)} onBlur={() => blur("budget")} aria-invalid={!!show("budget")} aria-describedby={describe("budget")} className={cn(field, border("budget"), "appearance-none pr-10", !values.budget && "text-ink/40")}>
              <option value="" disabled>
                Choose a range
              </option>
              {budgetOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ArrowRight size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-ink/40" />
          </div>
          {err("budget")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="details" className="mb-2 block text-[0.82rem] font-medium text-ink/80">
            Project details <span className="text-green-deep" aria-hidden>*</span>
          </label>
          <textarea id="details" name="details" rows={5} required value={values.details} onChange={(e) => set("details", e.target.value)} onBlur={() => blur("details")} aria-invalid={!!show("details")} aria-describedby={describe("details", "details-hint")} className={cn(field, border("details"), "min-h-[9rem] resize-y")} placeholder="Tell us about your business, your goals and what you’d like help with." />
          <p id="details-hint" className="mt-2 text-[0.78rem] text-ink/45">
            What does success look like in six months? Any deadlines or links we should see?
          </p>
          {err("details")}
        </div>

        {/* Honeypot — invisible to people, tempting to bots */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-[0.88rem] leading-snug text-ink/70">
            <input
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(e) => set("consent", e.target.checked)}
              onBlur={() => blur("consent")}
              aria-invalid={!!show("consent")}
              aria-describedby={describe("consent")}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#1f8f47]"
            />
            <span>
              I agree to BrandSpace contacting me about this enquiry, as described in the{" "}
              <Link href="/privacy-policy" className="font-medium text-ink underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {err("consent")}
        </div>

        {turnstileKey && <div className="cf-turnstile sm:col-span-2" data-sitekey={turnstileKey} data-theme="light" />}
      </div>

      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex h-16 items-center justify-between gap-6 rounded-full bg-ink pl-7 pr-2 text-[0.84rem] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink-3 disabled:cursor-wait disabled:opacity-80"
        >
          {status === "submitting" ? "Sending…" : "Send project brief"}
          <span className="grid h-12 w-12 place-items-center rounded-full bg-green text-ink">
            {status === "submitting" ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/25 border-t-ink" aria-hidden />
            ) : (
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            )}
          </span>
        </button>
        <p className="text-[0.82rem] text-ink/50">
          Or{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="font-medium text-green-deep underline-offset-4 hover:underline">
            message us on WhatsApp
          </a>
        </p>
      </div>
    </form>
  );
}
