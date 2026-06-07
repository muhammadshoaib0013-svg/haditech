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

    // Rate Limiting
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS
    );

    if (validTimestamps.length >= RATE_LIMIT_MAX) {
      return {
        success: false,
        message: "Too many requests. Please try again in an hour.",
      };
    }

    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    // Validate Form Fields
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
      return {
        success: false,
        message: "Invalid submission.",
      };
    }

    const { name, email, phone, service, budget, message } = validatedData.data;

    let leadId: string | null = null;
    let leadSaveOk = false;

    // 1. Try to save lead in database (Supabase contact_leads table)
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
          console.error("❌ lead save fail:", insertError.message);
        } else if (insertData) {
          leadId = insertData.id;
          leadSaveOk = true;
          console.log("✅ lead save ok, id:", leadId);
        }
      } catch (err) {
        console.error("❌ lead save fail exception:", err);
      }
    } else {
      console.warn("⚠️ Supabase service client not configured - skipped saving lead");
    }

    // 2. Send Email Notification
    const emailResult = await sendEmailNotification({
      name,
      email,
      phone,
      service,
      budget,
      message,
    });
    console.log(`✉️ email status: ${emailResult.ok ? "ok" : "fail"} (${emailResult.reason || "success"})`);

    // 3. Send WhatsApp Notification
    const whatsappResult = await sendMetaWhatsAppNotification({
      name,
      email,
      phone,
      service,
      budget,
      message,
      source: "contact_form",
    });
    console.log(`💬 whatsapp status: ${whatsappResult.ok ? "ok" : "fail"} (${whatsappResult.reason || "success"})`);

    // 4. Update status in database if lead was saved
    if (leadSaveOk && leadId && supabase) {
      try {
        const { error: updateError } = await supabase
          .from("contact_leads")
          .update({
            email_status: emailResult.ok ? "ok" : "fail",
            whatsapp_status: whatsappResult.ok ? "ok" : "fail",
          })
          .eq("id", leadId);

        if (updateError) {
          console.error("❌ failed to update lead statuses:", updateError.message);
        }
      } catch (err) {
        console.error("❌ exception updating lead statuses:", err);
      }
    }

    // 5. Construct honest response to the frontend UI
    const eitherNotificationSucceeded = emailResult.ok || whatsappResult.ok;

    if (eitherNotificationSucceeded) {
      return {
        success: true,
        message: "Message received. Notification sent successfully.",
      };
    } else if (leadSaveOk) {
      return {
        success: true,
        warning: true,
        message: "Message received, but notification delivery needs admin attention.",
      };
    } else {
      return {
        success: false,
        message: "Message could not be delivered. Please contact us directly on WhatsApp or email.",
      };
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}