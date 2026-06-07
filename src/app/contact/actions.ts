"use server";

import { z } from "zod";
import { contactSchema } from "@/lib/schemas/contact.schema";
import { Resend } from "resend";
import { headers } from "next/headers";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ─── Rate Limit ───────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export type FormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// ─── Twilio WhatsApp Notification ────────────────────────────────────────────
async function notifyViaWhatsApp(data: {
  name: string; email: string; phone?: string|null
  service: string; budget?: string|null; message: string
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const from       = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'
  const to         = process.env.TWILIO_WHATSAPP_TO   || 'whatsapp:+923012475707'

  if (!accountSid || !authToken) {
    console.warn('⚠️  TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set — WhatsApp notification skipped')
    return
  }

  const body = [
    '🔔 *NEW INQUIRY — HADITECH*',
    '',
    `👤 *Name:* ${data.name}`,
    `📧 *Email:* ${data.email}`,
    data.phone   ? `📞 *Phone:* ${data.phone}`   : null,
    `🛠️ *Service:* ${data.service}`,
    data.budget  ? `💰 *Budget:* ${data.budget}`  : null,
    '',
    `💬 *Message:*`,
    data.message,
    '',
    '─────────────────',
    'Reply here or email to follow up.',
  ].filter(line => line !== null).join('\n')

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method:  'POST',
      headers: {
        'Authorization':  `Basic ${credentials}`,
        'Content-Type':   'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    console.error('Twilio error:', errText)
    // DO NOT throw — form submission must succeed even if WhatsApp fails
  } else {
    const result = await res.json() as { sid: string }
    console.log('✅ WhatsApp notification sent:', result.sid)
  }
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
    const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (validTimestamps.length >= RATE_LIMIT_MAX) {
      return { success: false, message: "Too many requests. Please try again in an hour." };
    }
    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    // Validate
    const rawData = {
      name:     formData.get("name"),
      email:    formData.get("email"),
      phone:    formData.get("phone"),
      service:  formData.get("service"),
      budget:   formData.get("budget"),
      message:  formData.get("message"),
      honeypot: formData.get("honeypot"),
    };

    const validatedData = contactSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form.",
        errors:  validatedData.error.flatten().fieldErrors,
      };
    }
    if (validatedData.data.honeypot) {
      return { success: false, message: "Invalid submission." };
    }

    const { name, email, phone, service, budget, message } = validatedData.data;

    // ── WhatsApp instant notification ─────────────────────────────
    await notifyViaWhatsApp({ name, email, phone, service, budget, message })

    // ── 2. Resend emails ──────────────────────────────────────────────────────
    if (resend) {
      const toEmail = process.env.CONTACT_EMAIL || process.env.NEXT_PUBLIC_EMAIL || "haditech313@gmail.com";
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://haditech.com";

      // Admin notification email
      await resend.emails.send({
        from:    "Contact Form <onboarding@resend.dev>",
        to:      toEmail,
        replyTo: email,
        subject: `New Project Inquiry: ${service} from ${name}`,
        text:    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nBudget: ${budget}\nMessage:\n${message}`,
      });

      // Auto-reply to client
      await resend.emails.send({
        from:    "HADITECH Studio <onboarding@resend.dev>",
        to:      email,
        subject: "Got your message — I'll reply within 24 hours | HADITECH",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
            <h2 style="color:#000;">Thank you for reaching out, ${name}!</h2>
            <p>I have received your inquiry regarding <strong>${service}</strong> and am currently reviewing your requirements.</p>
            <p>You can expect a detailed response within the next <strong>24 hours</strong>.</p>
            <hr style="border:1px solid #eee;margin:20px 0;"/>
            <p>In the meantime:</p>
            <ul>
              <li>Chat instantly on <a href="https://wa.me/923012475707">WhatsApp (+92 301 2475707)</a></li>
              <li>Review our <a href="${siteUrl}/services">services &amp; pricing</a></li>
            </ul>
            <br/>
            <p>Best regards,<br/><strong>HADITECH Studio</strong><br/><a href="${siteUrl}">${siteUrl}</a></p>
          </div>
        `,
      });
    }

    return { success: true, message: "Message received! We will be in touch shortly." };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
