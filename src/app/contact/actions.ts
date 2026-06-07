"use server";

import { contactSchema } from "@/lib/schemas/contact.schema";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendEmailNotification } from "@/lib/email";
import { sendMetaWhatsAppNotification } from "@/lib/whatsapp";

// ─── Rate Limit ───────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export type FormState = {
  success?: boolean;
  warning?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitContactForm(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  try {
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

    // ── Rate limiting ────────────────────────────────────────────────────────
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (validTimestamps.length >= RATE_LIMIT_MAX) {
      return { success: false, message: "Too many requests. Please try again in an hour." };
    }
    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    // ── Validate form fields ─────────────────────────────────────────────────
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      budget: formData.get("budget"),
      message: formData.get("message"),
      honeypot: formData.get("honeypot"),
    };

    const validatedData = contactSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form.",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }
    if (validatedData.data.honeypot) {
      return { success: false, message: "Invalid submission." };
    }

    const { name, email, phone, service, budget, message } = validatedData.data;

    // ── 1. Save lead to Supabase ─────────────────────────────────────────────
    let leadId: string | null = null;
    let leadSaveOk = false;
    let leadSaveReason = "supabase client not configured";

    const supabase = createServerSupabaseClient();
    if (supabase) {
      try {
        const { data: insertData, error: insertError } = await supabase
          .from("contact_leads")
          .insert({
            name,
            email,
            phone: phone || null,
            service,
            budget: budget || null,
            message,
            source: "contact_form",
            email_status: "pending",
            whatsapp_status: "pending",
          })
          .select("id")
          .single();

        if (insertError) {
          leadSaveReason = `code=${insertError.code}, msg=${insertError.message}`;
          console.error("❌ contact_leads insert: FAIL,", leadSaveReason);
        } else if (insertData) {
          leadId = insertData.id;
          leadSaveOk = true;
          leadSaveReason = "ok";
          console.log("✅ contact_leads insert: OK, id=" + leadId);
        }
      } catch (err) {
        leadSaveReason = err instanceof Error ? err.message : String(err);
        console.error("❌ contact_leads insert: FAIL (exception),", leadSaveReason);
      }
    } else {
      console.warn("⚠️ contact_leads insert: SKIP — Supabase service client not configured");
    }

    // ── 2. Send email notification ───────────────────────────────────────────
    const emailResult = await sendEmailNotification({ name, email, phone, service, budget, message });

    // ── 3. Send WhatsApp notification ────────────────────────────────────────
    const whatsappResult = await sendMetaWhatsAppNotification({
      name, email, phone, service, budget, message, source: "contact_form",
    });

    // ── 4. Update notification statuses in DB ────────────────────────────────
    if (leadSaveOk && leadId && supabase) {
      try {
        await supabase
          .from("contact_leads")
          .update({
            email_status: emailResult.ok ? "ok" : "fail",
            whatsapp_status: whatsappResult.ok ? "ok" : "fail",
          })
          .eq("id", leadId);
      } catch (err) {
        console.error("❌ lead status update failed:", err);
      }
    }

    // ── 5. Structured pipeline log (no secrets) ──────────────────────────────
    console.log(
      [
        "CONTACT_PIPELINE_RESULT:",
        `  leadStorage: ${leadSaveOk ? "ok" : "fail"} | ${leadSaveReason}`,
        `  email:       ${emailResult.ok ? "ok" : "fail"} | ${emailResult.reason || "sent"}`,
        `  whatsapp:    ${whatsappResult.ok ? "ok" : "fail"} | ${whatsappResult.reason || "sent"} | providerStatus=${whatsappResult.providerStatus ?? "n/a"}`,
        `  envStatus:   RESEND_API_KEY=${process.env.RESEND_API_KEY ? "set" : "missing"} | META_WHATSAPP_TOKEN=${(process.env.META_WHATSAPP_TOKEN || process.env.META_WHATSAPP_ACCESS_TOKEN) ? "set" : "missing"} | META_WHATSAPP_PHONE_ID=${(process.env.META_WHATSAPP_PHONE_ID || process.env.META_WHATSAPP_PHONE_NUMBER_ID) ? "set" : "missing"} | WHATSAPP_NOTIFY_TO=${(process.env.WHATSAPP_NOTIFY_TO || process.env.WHATSAPP_DEFAULT_TO) ? "set" : "missing"}`,
      ].join("\n")
    );

    // ── 6. Honest response ───────────────────────────────────────────────────
    const notified = emailResult.ok || whatsappResult.ok;

    if (notified) {
      return { success: true, message: "Message received. Notification sent successfully." };
    } else if (leadSaveOk) {
      return {
        success: true,
        warning: true,
        message: "Message received, but notification delivery needs admin attention.",
      };
    } else {
      return {
        success: false,
        message:
          "Message could not be delivered. Please contact us directly on WhatsApp or email.",
      };
    }
  } catch (error) {
    console.error("Contact form unhandled error:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}