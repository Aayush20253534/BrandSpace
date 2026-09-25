import { z } from "zod";
import { serviceNames } from "@/data/services";

/** Shared (client + server) contact form schema. */

export const budgetOptions = [
  "Under ₹25,000",
  "₹25,000 – ₹75,000",
  "₹75,000 – ₹2,00,000",
  "₹2,00,000+",
  "Not sure yet",
] as const;

export const serviceOptions = [...serviceNames, "Multiple services / not sure yet"] as const;

const phoneRe = /^[+]?[\d\s()-]{7,20}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "That name is a little long."),
  company: z.string().trim().min(2, "Please tell us your business or company name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  phone: z
    .string()
    .trim()
    .regex(phoneRe, "Please enter a valid phone number (with country code if outside India)."),
  service: z.enum(serviceOptions, { message: "Please choose the service you need." }),
  budget: z.enum(budgetOptions, { message: "Please choose a budget range." }),
  details: z
    .string()
    .trim()
    .min(20, "A few more details help us prepare — at least 20 characters.")
    .max(4000, "Please keep project details under 4,000 characters."),
  consent: z.literal(true, { message: "Please agree so we can contact you about your enquiry." }),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Anti-spam fields sent alongside the form (never shown to people). */
export const spamSchema = z.object({
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().default(""),
  /** Timestamp when the form was rendered. */
  startedAt: z.number().int().positive(),
  /** Cloudflare Turnstile token, when enabled. */
  turnstileToken: z.string().max(2048).optional(),
});

export const MIN_FILL_MS = 3000;
