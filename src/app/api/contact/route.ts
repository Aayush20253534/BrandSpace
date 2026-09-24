import { NextResponse } from "next/server";
import { site } from "@/data/site";
import { contactSchema, spamSchema, MIN_FILL_MS, type ContactInput } from "@/lib/contact";

/**
 * Contact form endpoint.
 *
 * Delivery (configure one in the deployment environment):
 *   RESEND_API_KEY (+ CONTACT_FROM_EMAIL, optional CONTACT_TO_EMAIL) → email via Resend
 *   CONTACT_WEBHOOK_URL → JSON POST (Slack/Make/Zapier/Sheets, etc.)
 * Spam protection: honeypot, minimum fill time, per-IP rate limit and,
 * when TURNSTILE_SECRET_KEY is set, Cloudflare Turnstile verification.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function deliver(data: ContactInput): Promise<"sent" | "not-configured"> {
  const subject = `New project enquiry — ${data.company} (${data.service})`;
  const lines = [
    ["Name", data.name],
    ["Business / Company", data.company],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Service", data.service],
    ["Budget", data.budget],
    ["Project details", data.details],
  ] as const;

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "BrandSpace Website <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL ?? site.email],
        reply_to: data.email,
        subject,
        text: lines.map(([k, v]) => `${k}: ${v}`).join("\n\n"),
        html: `<h2>${escape(subject)}</h2>${lines.map(([k, v]) => `<p><strong>${k}</strong><br>${escape(v).replace(/\n/g, "<br>")}</p>`).join("")}`,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return "sent";
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, ...data, receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return "sent";
  }

  return "not-configured";
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const spam = spamSchema.safeParse(body);
  // Bots: pretend success so they don't retry, but never deliver.
  if (!spam.success || Date.now() - spam.data.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages from this connection. Please try again later or reach us on WhatsApp." },
      { status: 429 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  if (!(await verifyTurnstile(spam.data.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "We couldn’t verify you’re human. Please try again." }, { status: 400 });
  }

  try {
    const result = await deliver(parsed.data);
    if (result === "not-configured") {
      if (process.env.NODE_ENV !== "production") {
        console.info("[contact] Delivery not configured — enquiry received in development:", parsed.data);
        return NextResponse.json({ ok: true, dev: true });
      }
      console.error("[contact] No delivery method configured (set RESEND_API_KEY or CONTACT_WEBHOOK_URL).");
      return NextResponse.json(
        { ok: false, error: "Our form is temporarily unavailable. Please reach us on WhatsApp or email instead." },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Delivery failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your message. Please try again, or reach us on WhatsApp." },
      { status: 502 },
    );
  }
}
