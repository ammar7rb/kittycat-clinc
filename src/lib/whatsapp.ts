/**
 * Build a WhatsApp click-to-chat URL.
 * Number can be in any format; we strip non-digits.
 */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
