import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name || "Website Visitor";
    const email = body.email || "Not provided";
    const phone = body.phone || "Not provided";
    const service = body.service || "Not provided";
    const message = body.message || "No message";

    const version = process.env.META_WHATSAPP_API_VERSION || "v25.0";
    const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;
    const to = process.env.WHATSAPP_DEFAULT_TO;

    if (!phoneNumberId || !accessToken || !to) {
      return NextResponse.json(
        {
          success: false,
          error: "WhatsApp environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const whatsappText =
      `🚀 New Portfolio Lead\n\n` +
      `👤 Name: ${name}\n` +
      `📧 Email: ${email}\n` +
      `📞 Phone: ${phone}\n` +
      `🛠 Service: ${service}\n\n` +
      `💬 Message:\n${message}`;

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
            body: whatsappText,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          metaError: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send WhatsApp lead notification.",
      },
      { status: 500 }
    );
  }
}