// ─── Public constant & helpers ───────────────────────────────────────────────

export const WHATSAPP_NUMBER = "923012475707";

/**
 * Strips everything that is not a digit (removes +, spaces, dashes, brackets).
 * e.g. "+92 301 2475707" → "923012475707"
 */
export function normalizeWhatsAppNumber(input: string): string {
  if (!input) return "";
  return input.replace(/[^0-9]/g, "");
}

/**
 * Generates a wa.me deep-link with an optional pre-filled message.
 * Safe to call from both server and client.
 */
export function getWhatsAppLink(
  source: string,
  serviceName?: string,
  customMessage?: string
): string {
  const defaultTo =
    (typeof process !== "undefined" &&
      (process.env.WHATSAPP_NOTIFY_TO || process.env.WHATSAPP_DEFAULT_TO)) ||
    "";
  const baseNumber = defaultTo || WHATSAPP_NUMBER;
  const normalized = normalizeWhatsAppNumber(baseNumber) || WHATSAPP_NUMBER;

  const serviceText = serviceName
    ? serviceName
    : "(SaaS / Dashboard / API / Extension / Automation)";

  const template =
    customMessage ||
    `Hi HADITECH, I found your website and I'm interested in your services.\n\n📌 Service Needed:\n${serviceText}\n\n📌 My Requirement:\n(Write details)\n\n📌 Budget Range:\n(Your budget)\n\n📌 Timeline:\n(When needed)\n\nPlease guide me with the best solution.\n\n[Source: ${source}]`;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(template)}`;
}

// ─── Meta WhatsApp Cloud API ──────────────────────────────────────────────────

export interface WhatsAppResult {
  ok: boolean;
  channel: "whatsapp";
  reason?: string;
  missing?: string[];
  providerStatus?: number;
  providerResponse?: unknown;
  providerError?: unknown;
}

/**
 * SERVER-ONLY — Sends a notification via Meta WhatsApp Cloud API.
 * Supports both old and new env var names.
 *
 * New names (preferred):   META_WHATSAPP_TOKEN, META_WHATSAPP_PHONE_ID, WHATSAPP_NOTIFY_TO
 * Old names (fallback):    META_WHATSAPP_ACCESS_TOKEN, META_WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_DEFAULT_TO
 */
export async function sendMetaWhatsAppNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  budget?: string | null;
  message: string;
  source?: string;
}): Promise<WhatsAppResult> {
  // ── Env resolution (new names first, old names as fallback) ───────────────
  const accessToken =
    process.env.META_WHATSAPP_TOKEN ||
    process.env.META_WHATSAPP_ACCESS_TOKEN ||
    "";

  const phoneNumberId =
    process.env.META_WHATSAPP_PHONE_ID ||
    process.env.META_WHATSAPP_PHONE_NUMBER_ID ||
    "";

  const toRaw =
    process.env.WHATSAPP_NOTIFY_TO ||
    process.env.WHATSAPP_DEFAULT_TO ||
    "";

  const apiVersion =
    process.env.META_WHATSAPP_API_VERSION || "v22.0";

  // ── Validate required env ─────────────────────────────────────────────────
  const missingEnv: string[] = [];
  if (!accessToken)   missingEnv.push("META_WHATSAPP_TOKEN (or META_WHATSAPP_ACCESS_TOKEN)");
  if (!phoneNumberId) missingEnv.push("META_WHATSAPP_PHONE_ID (or META_WHATSAPP_PHONE_NUMBER_ID)");
  if (!toRaw)         missingEnv.push("WHATSAPP_NOTIFY_TO (or WHATSAPP_DEFAULT_TO)");

  if (missingEnv.length > 0) {
    return {
      ok: false,
      channel: "whatsapp",
      reason: `Missing environment variables: ${missingEnv.join(", ")}`,
      missing: missingEnv,
    };
  }

  // ── Normalize recipient number — Meta API rejects "+" prefix ──────────────
  const to = normalizeWhatsAppNumber(toRaw);
  if (!to) {
    return {
      ok: false,
      channel: "whatsapp",
      reason: `WHATSAPP_NOTIFY_TO resolved to an empty string after normalization. Raw value was set but contained no digits.`,
    };
  }

  const clean = (val: string | null | undefined) => String(val || "").trim();

  const body = `🔔 NEW HADITECH CONTACT INQUIRY
━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${clean(data.name)}
📧 Email: ${clean(data.email)}
📱 Phone: ${clean(data.phone || "Not provided")}
🛠️ Service: ${clean(data.service)}
💰 Budget: ${clean(data.budget || "Not provided")}
💬 Message: ${clean(data.message)}
📍 Source: ${clean(data.source || "contact_form")}
━━━━━━━━━━━━━━━━━━━━━━━━`;

  // ── Fire the API call ─────────────────────────────────────────────────────
  try {
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: {
            preview_url: false,
            body,
          },
        }),
      }
    );

    const providerStatus = response.status;
    let providerResponse: unknown;
    try {
      providerResponse = await response.json();
    } catch {
      providerResponse = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        channel: "whatsapp",
        reason: `Meta API returned HTTP ${response.status}`,
        providerStatus,
        providerError: providerResponse,
      };
    }

    return {
      ok: true,
      channel: "whatsapp",
      providerStatus,
      providerResponse,
    };
  } catch (error) {
    return {
      ok: false,
      channel: "whatsapp",
      reason: error instanceof Error ? error.message : "Unknown fetch error calling Meta API",
    };
  }
}
