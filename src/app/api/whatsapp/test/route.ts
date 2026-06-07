import { NextRequest, NextResponse } from "next/server";
import { sendMetaWhatsAppNotification } from "@/lib/whatsapp";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";

export const runtime = "nodejs";

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME);
  return cookie?.value === ADMIN_COOKIE_VALUE;
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendMetaWhatsAppNotification({
      name: "TEST USER",
      email: "test@haditech.com",
      phone: "+1234567890",
      service: "Test Service",
      budget: "$5k - $10k",
      message: "This is a diagnostic test message from your HADITECH admin panel.",
      source: "admin_test",
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
        error: error instanceof Error ? error.message : "Failed to send WhatsApp test message.",
      },
      { status: 500 }
    );
  }
}