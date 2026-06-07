import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";
import { sendEmailNotification } from "@/lib/email";
import { sendMetaWhatsAppNotification } from "@/lib/whatsapp";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME);
  return cookie?.value === ADMIN_COOKIE_VALUE;
}

function envStatus(
  ...keys: string[]
): "set" | "missing" | "placeholder" {
  for (const key of keys) {
    const val = process.env[key];
    if (!val) continue;
    if (
      val.toLowerCase().includes("your_") ||
      val.toLowerCase().includes("placeholder") ||
      val === "undefined"
    ) {
      return "placeholder";
    }
    return "set";
  }
  return "missing";
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 1. Check contact_leads table availability ─────────────────────────────
  let leadStorage = { ok: false, reason: "Supabase client not configured" };
  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("contact_leads")
        .select("id")
        .limit(1);
      if (error) {
        leadStorage = { ok: false, reason: `code=${error.code}, msg=${error.message}` };
      } else {
        leadStorage = { ok: true, reason: "contact_leads table accessible" };
      }
    } catch (err) {
      leadStorage = {
        ok: false,
        reason: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  // ── 2. Check newsletter_subscribers table ─────────────────────────────────
  let newsletterStorage = { ok: false, reason: "Supabase client not configured" };
  if (supabase) {
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .select("id")
        .limit(1);
      if (error) {
        newsletterStorage = { ok: false, reason: `code=${error.code}, msg=${error.message}` };
      } else {
        newsletterStorage = { ok: true, reason: "newsletter_subscribers table accessible" };
      }
    } catch (err) {
      newsletterStorage = {
        ok: false,
        reason: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  // ── 3. Test email + WhatsApp in parallel ──────────────────────────────────
  const testData = {
    name: "HADITECH Admin Test",
    email: "test-admin@haditech.com",
    phone: "+920000000000",
    service: "Diagnostics Test",
    budget: "N/A",
    message: "System diagnostics test of notification channels.",
  };

  const [emailRes, whatsappRes] = await Promise.all([
    sendEmailNotification(testData),
    sendMetaWhatsAppNotification({ ...testData, source: "admin_diagnostic_test" }),
  ]);

  // ── 4. Env status (set/missing/placeholder — no values ever returned) ─────
  const env = {
    RESEND_API_KEY: envStatus("RESEND_API_KEY"),
    RESEND_FROM_EMAIL: envStatus("RESEND_FROM_EMAIL"),
    CONTACT_EMAIL: envStatus("CONTACT_EMAIL"),
    META_WHATSAPP_TOKEN: envStatus("META_WHATSAPP_TOKEN", "META_WHATSAPP_ACCESS_TOKEN"),
    META_WHATSAPP_PHONE_ID: envStatus("META_WHATSAPP_PHONE_ID", "META_WHATSAPP_PHONE_NUMBER_ID"),
    WHATSAPP_NOTIFY_TO: envStatus("WHATSAPP_NOTIFY_TO", "WHATSAPP_DEFAULT_TO"),
    SUPABASE_SERVICE_ROLE_KEY: envStatus("SUPABASE_SERVICE_ROLE_KEY"),
  };

  return NextResponse.json({
    leadStorage,
    newsletterStorage,
    email: {
      ok: emailRes.ok,
      reason: emailRes.reason || null,
      providerError: emailRes.providerError || null,
    },
    whatsapp: {
      ok: whatsappRes.ok,
      reason: whatsappRes.reason || null,
      providerStatus: whatsappRes.providerStatus || null,
      providerError: whatsappRes.providerError || null,
    },
    env,
  });
}
