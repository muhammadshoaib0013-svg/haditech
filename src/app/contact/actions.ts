"use server";

import { contactSchema } from "@/lib/schemas/contact.schema";
import { Resend } from "resend";
import { headers } from "next/headers";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// ─── Rate Limit ───────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export type FormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// ─── Meta WhatsApp Cloud API Notification ─────────────────────────────────────
async function notifyViaWhatsApp(data: {
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  budget?: string | null;
  message: string;
}) {
  const version = process.env.META_WHATSAPP_API_VERSION || "v25.0";
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;
  const to = process.env.WHATSAPP_DEFAULT_TO;

  if (!phoneNumberId || !accessToken || !to) {
    console.warn(
      "⚠️ Meta WhatsApp env missing — WhatsApp notification skipped."
    );
    return;
  }

  const clean = (value: string | null | undefined) =>
    String(value || "").trim();

  const body = [
    "🔔 NEW INQUIRY — HADITECH",
    "",
    `👤 Name: ${clean(data.name)}`,
    `📧 Email: ${clean(data.email)}`,
    data.phone ? `📞 Phone: ${clean(data.phone)}` : null,
    `🛠️ Service: ${clean(data.service)}`,
    data.budget ? `💰 Budget: ${clean(data.budget)}` : null,
    "",
    "💬 Message:",
    clean(data.message),
    "",
    "─────────────────",
    "Reply here or email to follow up.",
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n")
    .slice(0, 3900);

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

  const result = await response.json();

  if (!response.ok) {
    console.error("Meta WhatsApp error:", JSON.stringify(result, null, 2));
    // Form submit fail نہیں ہوگا، صرف WhatsApp notification skip/fail ہوگی
    return;
  }

  console.log("✅ Meta WhatsApp notification sent:", result);
}

// ─── Main form action ─────────────────────────────────────────────────────────
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

    // Validate
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

    const { name, email, phone, service, budget, message } =
      validatedData.data;

    // ── 1. WhatsApp instant notification via Meta Cloud API ───────────────────
    await notifyViaWhatsApp({
      name,
      email,
      phone,
      service,
      budget,
      message,
    });

    // ── 2. Resend emails ──────────────────────────────────────────────────────
    if (resend) {
      const toEmail =
        process.env.CONTACT_EMAIL ||
        process.env.NEXT_PUBLIC_EMAIL ||
        "haditech313@gmail.com";

      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://haditech.com";

      // Admin notification email
      await resend.emails.send({
        from: "Contact Form <onboarding@resend.dev>",
        to: toEmail,
        replyTo: email,
        subject: `New Project Inquiry: ${service} from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nService: ${service}\nBudget: ${budget || "Not provided"}\nMessage:\n${message}`,
      });

      // Auto-reply to client
      await resend.emails.send({
        from: "HADITECH Studio <onboarding@resend.dev>",
        to: email,
        subject: "Got your message — I'll reply within 24 hours | HADITECH",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
            <h2 style="color:#000;">Thank you for reaching out, ${name}!</h2>
            <p>I have received your inquiry regarding <strong>${service}</strong> and am currently reviewing your requirements.</p>
            <p>You can expect a detailed response within the next <strong>24 hours</strong>.</p>
            <hr style="border:1px solid #eee;margin:20px 0;"/>
            <p>In the meantime:</p>
            <ul>
              <li>Chat instantly on <a href="https://wa.me/923012475707">WhatsApp (+923012475707)</a></li>
              <li>Review our <a href="${siteUrl}/services">services &amp; pricing</a></li>
            </ul>
            <br/>
            <p>Best regards,<br/><strong>HADITECH Studio</strong><br/><a href="${siteUrl}">${siteUrl}</a></p>
          </div>
        `,
      });
    }

    return {
      success: true,
      message: "Message received! We will be in touch shortly.",
    };
  } catch (error) {
    console.error("Contact form error:", error);

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}