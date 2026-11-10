import "server-only";

import { renderReviewRequestEmail, type ReviewRequestEmailData } from "@/lib/email/review-request-email";

const resendEndpoint = "https://api.resend.com/emails";

export async function sendReviewRequestEmail(reservation: ReviewRequestEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Resend is not configured.");

  const email = renderReviewRequestEmail(reservation);
  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `reservation:${reservation.reservationId}:review-request`,
    },
    body: JSON.stringify({
      from,
      to: [reservation.customerEmail],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({})) as { message?: string; error?: string };
  if (!response.ok) throw new Error(payload.message ?? payload.error ?? `Resend returned ${response.status}`);
}
