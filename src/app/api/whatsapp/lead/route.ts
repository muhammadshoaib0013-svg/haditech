import { NextResponse } from "next/server";
import { sendMetaWhatsAppNotification } from "@/lib/whatsapp";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name || "Website Visitor";
    const email = body.email || "Not provided";
    const phone = body.phone || "Not provided";
    const service = body.service || "Not provided";
    const message = body.message || "No message";
    const budget = body.budget || "Not provided";

    const result = await sendMetaWhatsAppNotification({
      name,
      email,
      phone,
      service,
      budget,
      message,
      source: "api_route_lead",
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result.reason,
          metaError: result.providerError || undefined,
        },
        { status: result.providerStatus || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.providerResponse,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send WhatsApp lead notification.",
      },
      { status: 500 }
    );
  }
}