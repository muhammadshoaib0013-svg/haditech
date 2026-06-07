import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendNewsletterAdminNotification } from "@/lib/email";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(request: NextRequest) {
  // ── Parse body ─────────────────────────────────────────────────────────────
  let email = "";
  try {
    const body = await request.json();
    email = (body?.email || "").trim().toLowerCase();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body — expected JSON with an email field." },
      { status: 400 }
    );
  }

  // ── Validate ───────────────────────────────────────────────────────────────
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  // ── Supabase insert ────────────────────────────────────────────────────────
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Database not configured. Please contact the administrator.",
      },
      { status: 503 }
    );
  }

  const { error: insertError } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source: "footer_newsletter", status: "active" });

  // Duplicate email — treat as soft success
  if (insertError) {
    const isDuplicate =
      insertError.code === "23505" ||
      insertError.message?.toLowerCase().includes("duplicate") ||
      insertError.message?.toLowerCase().includes("unique");

    if (isDuplicate) {
      return NextResponse.json({
        ok: true,
        message: "You're already subscribed — we'll keep you updated!",
        alreadySubscribed: true,
      });
    }

    console.error("newsletter_subscribers insert: FAIL", {
      code: insertError.code,
      message: insertError.message,
    });

    return NextResponse.json(
      { ok: false, error: "Could not save your subscription. Please try again." },
      { status: 500 }
    );
  }

  console.log("newsletter_subscribers insert: OK, email=" + email.replace(/@.*/, "@***"));

  // ── Optional admin notification (non-fatal) ────────────────────────────────
  try {
    await sendNewsletterAdminNotification(email);
  } catch (err) {
    console.warn("newsletter admin notify: FAIL", err);
  }

  return NextResponse.json({
    ok: true,
    message: "You're subscribed! We'll keep you updated.",
  });
}
