import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { site } from "@/data/site";
import { contactSchema, spamSchema, MIN_FILL_MS, type ContactInput } from "@/lib/contact";

export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 16 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const WINDOW_SECONDS = WINDOW_MS / 1000;
const MAX_PER_WINDOW = 5;
const OUTBOUND_TIMEOUT_MS = 8_000;
const RATE_LIMIT_TIMEOUT_MS = 2_500;
const memoryHits = new Map<string, { count: number; expiresAt: number }>();

type BodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413 | 415; error: string };

type TurnstileResult =
  | { ok: true }
  | { ok: false; configurationError?: boolean };

function json(body: object, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      ...headers,
    },
  });
}

function productionOrigins() {
  const values = new Set<string>();
  const canonical = new URL(site.url);
  values.add(canonical.origin);

  if (!canonical.hostname.startsWith("www.")) {
    values.add(`${canonical.protocol}//www.${canonical.hostname}${canonical.port ? `:${canonical.port}` : ""}`);
  }

  for (const key of ["VERCEL_URL", "VERCEL_PROJECT_PRODUCTION_URL"] as const) {
    const host = process.env[key]?.trim();
    if (host) values.add(`https://${host.replace(/^https?:\/\//, "")}`);
  }

  return values;
}

function originAllowed(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  try {
    const normalized = new URL(origin).origin;
    if (process.env.NODE_ENV !== "production") {
      const requestOrigin = new URL(request.url).origin;
      if (normalized === requestOrigin) return true;
    }
    return productionOrigins().has(normalized);
  } catch {
    return false;
  }
}

function clientIp(request: Request) {
  const raw = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!raw) return "unknown";
  return raw.slice(0, 128);
}

function rateKey(ip: string) {
  const digest = createHash("sha256").update(ip).digest("hex").slice(0, 24);
  const bucket = Math.floor(Date.now() / WINDOW_MS);
  return `brandspace:contact:${bucket}:${digest}`;
}

async function upstashCount(key: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, WINDOW_SECONDS + 60],
    ]),
    signal: AbortSignal.timeout(RATE_LIMIT_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Rate-limit store responded ${res.status}`);
  const payload = (await res.json()) as Array<{ result?: unknown; error?: string }>;
  if (payload[0]?.error) throw new Error("Rate-limit store rejected INCR");

  const count = Number(payload[0]?.result);
  if (!Number.isFinite(count)) throw new Error("Rate-limit store returned an invalid counter");
  return count;
}

function memoryCount(key: string) {
  const now = Date.now();
  const current = memoryHits.get(key);
  const next =
    current && current.expiresAt > now
      ? { count: current.count + 1, expiresAt: current.expiresAt }
      : { count: 1, expiresAt: now + WINDOW_MS + 60_000 };

  memoryHits.set(key, next);

  if (memoryHits.size > 5_000) {
    for (const [entryKey, value] of memoryHits) {
      if (value.expiresAt <= now) memoryHits.delete(entryKey);
    }
    if (memoryHits.size > 5_000) memoryHits.clear();
  }

  return next.count;
}

async function rateLimited(ip: string) {
  const key = rateKey(ip);

  try {
    const distributed = await upstashCount(key);
    if (distributed !== null) return distributed > MAX_PER_WINDOW;
  } catch (error) {
    console.error("[contact] Distributed rate limiter unavailable:", error instanceof Error ? error.message : "unknown error");
  }

  return memoryCount(key) > MAX_PER_WINDOW;
}

async function readJsonBody(request: Request): Promise<BodyResult> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return { ok: false, status: 415, error: "Unsupported request format." };
  }

  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > BODY_LIMIT_BYTES) {
    return { ok: false, status: 413, error: "Request is too large." };
  }

  if (!request.body) return { ok: false, status: 400, error: "Invalid request." };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > BODY_LIMIT_BYTES) {
        await reader.cancel();
        return { ok: false, status: 413, error: "Request is too large." };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400, error: "Invalid request." };
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) as unknown };
  } catch {
    return { ok: false, status: 400, error: "Invalid request." };
  }
}

function allowedTurnstileHostnames() {
  return new Set([...productionOrigins()].map((origin) => new URL(origin).hostname.toLowerCase()));
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (!secret || !siteKey) {
    if (process.env.NODE_ENV === "production") return { ok: false, configurationError: true };
    return { ok: true };
  }

  if (!token || token.length > 2_048) return { ok: false };

  let res: Response;
  try {
    res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(OUTBOUND_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    return { ok: false };
  }

  if (!res.ok) return { ok: false };

  const data = (await res.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };

  if (data.success !== true) return { ok: false };

  if (process.env.NODE_ENV === "production") {
    const hostname = data.hostname?.toLowerCase();
    if (!hostname || !allowedTurnstileHostnames().has(hostname)) return { ok: false };
    if (data.action !== "contact") return { ok: false };
  }

  return { ok: true };
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();

function trustedWebhookUrl() {
  const raw = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const local = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    if (process.env.NODE_ENV === "production" && (url.protocol !== "https:" || local)) return null;
    if (!["https:", "http:"].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function deliver(data: ContactInput): Promise<"sent" | "not-configured"> {
  const subject = oneLine(`New project enquiry — ${data.company} (${data.service})`);
  const lines = [
    ["Name", data.name],
    ["Business / Company", data.company],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Service", data.service],
    ["Budget", data.budget],
    ["Project details", data.details],
  ] as const;

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const from = process.env.CONTACT_FROM_EMAIL?.trim();
    if (process.env.NODE_ENV === "production" && !from) return "not-configured";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: from || "BrandSpace Website <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL?.trim() || site.email],
        reply_to: data.email,
        subject,
        text: lines.map(([key, value]) => `${key}: ${value}`).join("\n\n"),
        html: `<h2>${escapeHtml(subject)}</h2>${lines
          .map(([key, value]) => `<p><strong>${escapeHtml(key)}</strong><br>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`)
          .join("")}`,
      }),
      signal: AbortSignal.timeout(OUTBOUND_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return "sent";
  }

  const webhook = trustedWebhookUrl();
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, ...data, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(OUTBOUND_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return "sent";
  }

  return "not-configured";
}

export async function POST(request: Request) {
  if (!originAllowed(request)) {
    return json({ ok: false, error: "Request origin is not allowed." }, 403);
  }

  const body = await readJsonBody(request);
  if (!body.ok) return json({ ok: false, error: body.error }, body.status);

  const spam = spamSchema.safeParse(body.value);
  // Bots: pretend success so simple form fillers do not learn which check failed.
  if (!spam.success || Date.now() - spam.data.startedAt < MIN_FILL_MS) {
    return json({ ok: true });
  }

  const ip = clientIp(request);
  if (await rateLimited(ip)) {
    return json(
      { ok: false, error: "Too many messages from this connection. Please try again later or reach us on WhatsApp." },
      429,
      { "Retry-After": String(WINDOW_SECONDS) },
    );
  }

  const parsed = contactSchema.safeParse(body.value);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, 422);
  }

  const turnstile = await verifyTurnstile(spam.data.turnstileToken, ip);
  if (!turnstile.ok) {
    if (turnstile.configurationError) {
      console.error("[contact] Turnstile is not fully configured in production.");
      return json(
        { ok: false, error: "Our form is temporarily unavailable. Please reach us on WhatsApp or email instead." },
        503,
      );
    }
    return json({ ok: false, error: "We couldn’t verify you’re human. Please try again." }, 400);
  }

  try {
    const result = await deliver(parsed.data);
    if (result === "not-configured") {
      if (process.env.NODE_ENV !== "production") {
        console.info("[contact] Delivery is not configured in development.");
        return json({ ok: true, dev: true });
      }
      console.error("[contact] No valid delivery method is configured.");
      return json(
        { ok: false, error: "Our form is temporarily unavailable. Please reach us on WhatsApp or email instead." },
        503,
      );
    }
    return json({ ok: true });
  } catch (error) {
    console.error("[contact] Delivery failed:", error instanceof Error ? error.message : "unknown error");
    return json(
      { ok: false, error: "Something went wrong sending your message. Please try again, or reach us on WhatsApp." },
      502,
    );
  }
}
