import { NextResponse } from "next/server";
import { renderReservationEmail } from "@/lib/email/reservation-email";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resendEndpoint = "https://api.resend.com/emails";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return NextResponse.json({ error: "Email service is not configured." }, { status: 503 });

  const client = createSupabaseAdminClient();
  const { data: jobs, error: claimError } = await client.rpc("claim_reservation_email_jobs", { p_limit: 10 });
  if (claimError) {
    console.error("Email queue claim failed", claimError.message);
    return NextResponse.json({ error: "Email queue unavailable." }, { status: 503 });
  }

  let sent = 0;
  let failed = 0;
  for (const job of jobs ?? []) {
    try {
      const email = renderReservationEmail(job);
      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": job.idempotency_key,
        },
        body: JSON.stringify({
          from,
          to: [job.customer_email],
          subject: email.subject,
          html: email.html,
          text: email.text,
          ...(process.env.RESEND_REPLY_TO ? { reply_to: process.env.RESEND_REPLY_TO } : {}),
          tags: [{ name: "reservation-event", value: job.kind }],
        }),
        cache: "no-store",
      });
      const payload = await response.json().catch(() => ({})) as { id?: string; message?: string; error?: string };
      if (!response.ok) throw new Error(payload.message ?? payload.error ?? `Resend returned ${response.status}`);
      const { error: completeError } = await client.rpc("complete_reservation_email_job", { p_job_id: job.job_id, p_provider_message_id: payload.id ?? null });
      if (completeError) throw new Error(completeError.message);
      sent += 1;
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : "Email delivery failed.";
      await client.rpc("fail_reservation_email_job", { p_job_id: job.job_id, p_error: message });
      console.error("Reservation email delivery failed", { jobId: job.job_id, kind: job.kind, message });
    }
  }

  return NextResponse.json({ claimed: jobs?.length ?? 0, sent, failed });
}
