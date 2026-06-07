import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";
import { sendEmailNotification } from "@/lib/email";
import { sendMetaWhatsAppNotification } from "@/lib/whatsapp";

export const runtime = "nodejs";

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME);
  return cookie?.value === ADMIN_COOKIE_VALUE;
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check env states
  const envStatus = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "set" : "missing",
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL ? "set" : "missing",
    CONTACT_EMAIL: process.env.CONTACT_EMAIL ? "set" : "missing",
    META_WHATSAPP_PHONE_NUMBER_ID: process.env.META_WHATSAPP_PHONE_NUMBER_ID ? "set" : "missing",
    META_WHATSAPP_ACCESS_TOKEN: process.env.META_WHATSAPP_ACCESS_TOKEN ? "set" : "missing",
    WHATSAPP_DEFAULT_TO: process.env.WHATSAPP_DEFAULT_TO ? "set" : "missing",
  };

  const testData = {
    name: "HADITECH Test Admin",
    email: "test-admin@haditech.com",
    phone: "+920000000000",
    service: "Diagnostics Test",
    budget: "N/A",
    message: "This is a system diagnostics test of email & WhatsApp notification delivery channels.",
  };

  // Run both tests concurrently
  const [emailRes, whatsappRes] = await Promise.all([
    sendEmailNotification(testData),
    sendMetaWhatsAppNotification({ ...testData, source: "admin_diagnostic_test" }),
  ]);

  return NextResponse.json({
    email: {
      ok: emailRes.ok,
      reason: emailRes.reason || null,
      providerStatus: emailRes.providerError || null,
    },
    whatsapp: {
      ok: whatsappRes.ok,
      reason: whatsappRes.reason || null,
      providerStatus: whatsappRes.providerStatus || null,
      providerError: whatsappRes.providerError || null,
    },
    env: envStatus,
  });
}
