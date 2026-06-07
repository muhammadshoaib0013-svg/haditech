import { Resend } from "resend";

export interface EmailResult {
  ok: boolean;
  channel: "email";
  adminEmailSent?: boolean;
  autoReplySent?: boolean;
  reason?: string;
  providerError?: any;
}

/**
 * Server-only helper to send an inquiry notification to admin and an optional auto-reply to the user.
 */
export async function sendEmailNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  budget?: string | null;
  message: string;
}): Promise<EmailResult> {
  const apiKey = typeof process !== "undefined" ? process.env.RESEND_API_KEY : "";

  // Validate API key structure and presence
  if (
    !apiKey ||
    apiKey.trim() === "" ||
    apiKey.includes("your_") ||
    apiKey.includes("placeholder") ||
    !apiKey.startsWith("re_")
  ) {
    return {
      ok: false,
      channel: "email",
      reason: "Missing, placeholder, or invalid RESEND_API_KEY.",
    };
  }

  const resend = new Resend(apiKey);

  const toEmail =
    (typeof process !== "undefined" &&
      (process.env.CONTACT_EMAIL || process.env.NEXT_PUBLIC_EMAIL)) ||
    "haditech313@gmail.com";

  // Use RESEND_FROM_EMAIL if set, fallback to a safe onboarding/default Resend address
  const fromEmail =
    (typeof process !== "undefined" && process.env.RESEND_FROM_EMAIL) ||
    "Contact Form <onboarding@resend.dev>";

  const siteUrl =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
    "https://haditech.com";

  try {
    // 1. Send admin notification email
    const adminEmailRes = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `New Project Inquiry: ${data.service} from ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "Not provided"}\nService: ${data.service}\nBudget: ${data.budget || "Not provided"}\nMessage:\n${data.message}`,
    });

    if (adminEmailRes.error) {
      return {
        ok: false,
        channel: "email",
        reason: adminEmailRes.error.message,
        providerError: adminEmailRes.error,
      };
    }

    // 2. Auto-reply to client (wrapped in try/catch to avoid failing the admin notification if only client reply fails)
    let autoReplySent = false;
    try {
      const clientEmailRes = await resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: "Got your message — I'll reply within 24 hours | HADITECH",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
            <h2 style="color:#000;">Thank you for reaching out, ${data.name}!</h2>
            <p>I have received your inquiry regarding <strong>${data.service}</strong> and am currently reviewing your requirements.</p>
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
      autoReplySent = !clientEmailRes.error;
    } catch (clientErr) {
      console.warn("⚠️ Client auto-reply email failed to send:", clientErr);
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
      reason: error instanceof Error ? error.message : "Unknown error occurred while sending email.",
    };
  }
}
