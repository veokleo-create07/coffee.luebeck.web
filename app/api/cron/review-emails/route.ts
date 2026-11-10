import { NextResponse } from "next/server";

import { sendReviewRequestEmail } from "@/lib/email/send-review-request";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = createSupabaseAdminClient();
  const { data: reservations, error } = await client
    .from("reservations")
    .select("id, customer_name, customer_email, language")
    .eq("status", "completed")
    .not("review_email_consent_at", "is", null)
    .is("review_email_sent_at", null)
    .lte("ends_at", new Date().toISOString())
    .order("ends_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Review email lookup failed", error.message);
    return NextResponse.json({ error: "Review email lookup failed" }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;
  for (const reservation of reservations ?? []) {
    try {
      await sendReviewRequestEmail({
        reservationId: reservation.id,
        customerName: reservation.customer_name,
        customerEmail: reservation.customer_email,
        language: reservation.language === "en" ? "en" : "de",
      });
      const { error: updateError } = await client
        .from("reservations")
        .update({ review_email_sent_at: new Date().toISOString() })
        .eq("id", reservation.id)
        .is("review_email_sent_at", null);
      if (updateError) throw updateError;
      sent += 1;
    } catch (sendError) {
      failed += 1;
      console.error("Review request email failed", {
        reservationId: reservation.id,
        message: sendError instanceof Error ? sendError.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({ eligible: reservations?.length ?? 0, sent, failed });
}
