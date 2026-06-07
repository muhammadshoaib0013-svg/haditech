import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const version = process.env.META_WHATSAPP_API_VERSION || "v22.0";
    const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;
    const to = process.env.WHATSAPP_DEFAULT_TO;

    if (!phoneNumberId || !accessToken || !to) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing WhatsApp env variables. Check META_WHATSAPP_PHONE_NUMBER_ID, META_WHATSAPP_ACCESS_TOKEN, WHATSAPP_DEFAULT_TO",
        },
        { status: 500 }
      );
    }

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
          type: "template",
          template: {
            name: "hello_world",
            language: {
              code: "en_US",
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, metaError: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send WhatsApp test message." },
      { status: 500 }
    );
  }
}