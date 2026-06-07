export const WHATSAPP_NUMBER = "923012475707";

/**
 * Normalizes a WhatsApp phone number by removing +, spaces, dashes, brackets, and non-digits.
 */
export function normalizeWhatsAppNumber(input: string): string {
  if (!input) return "";
  return input.replace(/[^0-9]/g, "");
}

/**
 * Generates a wa.me link.
 */
export function getWhatsAppLink(source: string, serviceName?: string, customMessage?: string): string {
  const defaultTo = typeof process !== "undefined" ? process.env.WHATSAPP_DEFAULT_TO : "";
  const baseNumber = defaultTo || WHATSAPP_NUMBER;
  const normalized = normalizeWhatsAppNumber(baseNumber) || WHATSAPP_NUMBER;
  
  let template = "";
  if (customMessage) {
    template = customMessage;
  } else {
    const serviceText = serviceName ? serviceName : "(SaaS / Dashboard / API / Extension / Automation)";
    template = `Hi HADITECH, I found your website and I'm interested in your services.

📌 Service Needed:
${serviceText}

📌 My Requirement:
(Write details)

📌 Budget Range:
(Your budget)

📌 Timeline:
(When needed)

Please guide me with the best solution.

[Source: ${source}]`;
  }

  return `https://wa.me/${normalized}?text=${encodeURIComponent(template)}`;
}

/**
 * Server-only helper to send a notification via Meta WhatsApp Cloud API.
 */
export async function sendMetaWhatsAppNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  budget?: string | null;
  message: string;
  source?: string;
}) {
  const version = (typeof process !== "undefined" && process.env.META_WHATSAPP_API_VERSION) || "v22.0";
  const phoneNumberId = typeof process !== "undefined" ? process.env.META_WHATSAPP_PHONE_NUMBER_ID : "";
  const accessToken = typeof process !== "undefined" ? process.env.META_WHATSAPP_ACCESS_TOKEN : "";
  const toRaw = typeof process !== "undefined" ? process.env.WHATSAPP_DEFAULT_TO : "";

  const missingEnv: string[] = [];
  if (!phoneNumberId) missingEnv.push("META_WHATSAPP_PHONE_NUMBER_ID");
  if (!accessToken) missingEnv.push("META_WHATSAPP_ACCESS_TOKEN");
  if (!toRaw) missingEnv.push("WHATSAPP_DEFAULT_TO");

  if (missingEnv.length > 0) {
    return {
      ok: false,
      channel: "whatsapp" as const,
      reason: `Missing environment variables: ${missingEnv.join(", ")}`,
      missing: missingEnv,
    };
  }

  const to = normalizeWhatsAppNumber(toRaw!);
  const clean = (val: string | null | undefined) => String(val || "").trim();

  const body = `🔔 NEW HADITECH CONTACT INQUIRY
Name: ${clean(data.name)}
Email: ${clean(data.email)}
Phone: ${clean(data.phone || "Not provided")}
Service: ${clean(data.service)}
Budget: ${clean(data.budget || "Not provided")}
Message: ${clean(data.message)}
Source: ${clean(data.source || "contact_form")}`;

  try {
    const response = await fetch(
      `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
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
    const providerResponse = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        channel: "whatsapp" as const,
        reason: `Meta API returned status ${response.status}`,
        providerStatus,
        providerError: providerResponse,
      };
    }

    return {
      ok: true,
      channel: "whatsapp" as const,
      providerStatus,
      providerResponse,
    };
  } catch (error) {
    return {
      ok: false,
      channel: "whatsapp" as const,
      reason: error instanceof Error ? error.message : "Unknown fetch error",
    };
  }
}
