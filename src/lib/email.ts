import { Resend } from "resend";

export interface EmailResult {
  ok: boolean;
  channel: "email";
  adminEmailSent?: boolean;
  autoReplySent?: boolean;
  reason?: string;
  providerStatus?: string;
  providerError?: unknown;
}

/**
 * SERVER-ONLY — Sends contact inquiry notification via Resend.
 * Never throws. Returns structured result.
 */
export async function sendEmailNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  budget?: string | null;
  message: string;
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY || "";

  // ── Validate API key ──────────────────────────────────────────────────────
  if (
    !apiKey ||
    apiKey.trim() === "" ||
    apiKey.toLowerCase().includes("your_") ||
    apiKey.toLowerCase().includes("placeholder") ||
    !apiKey.startsWith("re_")
  ) {
    return {
      ok: false,
      channel: "email",
      reason: !apiKey
        ? "RESEND_API_KEY is not set in environment variables."
        : !apiKey.startsWith("re_")
        ? "RESEND_API_KEY appears to be a placeholder (must start with 're_')."
        : "RESEND_API_KEY is not configured.",
    };
  }

  // ── Resolve email addresses ───────────────────────────────────────────────
  const toEmail =
    process.env.CONTACT_EMAIL ||
    process.env.NEXT_PUBLIC_EMAIL ||
    "haditech313@gmail.com";

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "HADITECH <onboarding@resend.dev>";

  if (!process.env.RESEND_FROM_EMAIL) {
    console.warn(
      "⚠️ RESEND_FROM_EMAIL is not set — using Resend sandbox sender. " +
      "Emails will only deliver to addresses verified in your Resend account. " +
      "Set RESEND_FROM_EMAIL to a verified domain sender for production use."
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://haditech.com";

  const resend = new Resend(apiKey);

  try {
    // 1. Admin notification
    const adminEmailRes = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `New Inquiry: ${data.service} from ${data.name}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "Not provided"}`,
        `Service: ${data.service}`,
        `Budget: ${data.budget || "Not provided"}`,
        `Message:\n${data.message}`,
      ].join("\n"),
    });

    if (adminEmailRes.error) {
      return {
        ok: false,
        channel: "email",
        reason: adminEmailRes.error.message,
        providerError: adminEmailRes.error,
      };
    }

    // 2. Client auto-reply (non-fatal if it fails)
    let autoReplySent = false;
    try {
      const clientRes = await resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: "Got your message — I'll reply within 24 hours | HADITECH",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
            <h2 style="color:#000;">Thank you for reaching out, ${data.name}!</h2>
            <p>I have received your inquiry regarding <strong>${data.service}</strong> and am reviewing your requirements.</p>
            <p>You can expect a detailed response within <strong>24 hours</strong>.</p>
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
      autoReplySent = !clientRes.error;
    } catch (clientErr) {
      console.warn("⚠️ Client auto-reply failed:", clientErr);
    }

    return {
      ok: true,
      channel: "email",
      adminEmailSent: true,
      autoReplySent,
    };
  } catch (error) {
    return {
      ok: false,
      channel: "email",
      reason:
        error instanceof Error
          ? error.message
          : "Unknown error sending email via Resend.",
    };
  }
}

/**
 * SERVER-ONLY — Sends a newsletter admin notification via Resend.
 * Non-throwing. Returns ok/fail.
 */
export async function sendNewsletterAdminNotification(email: string): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY || "";
  if (!apiKey || !apiKey.startsWith("re_")) {
    return { ok: false, channel: "email", reason: "RESEND_API_KEY not configured." };
  }

  const toEmail =
    process.env.CONTACT_EMAIL ||
    process.env.NEXT_PUBLIC_EMAIL ||
    "haditech313@gmail.com";

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "HADITECH <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  try {
    const res = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Newsletter Subscriber: ${email}`,
      text: `A new subscriber joined the HADITECH newsletter:\n\nEmail: ${email}\nTime: ${new Date().toISOString()}`,
    });

    if (res.error) {
      return { ok: false, channel: "email", reason: res.error.message, providerError: res.error };
    }

    return { ok: true, channel: "email" };
  } catch (err) {
    return {
      ok: false,
      channel: "email",
      reason: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
