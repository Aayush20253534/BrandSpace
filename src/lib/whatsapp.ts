import { site } from "@/data/site";

/** Official WhatsApp click-to-chat URL with a pre-filled message. */
export function whatsappUrl(message: string = site.whatsapp.defaultMessage) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const telUrl = `tel:${site.phone.e164}`;
export const mailUrl = `mailto:${site.email}`;
