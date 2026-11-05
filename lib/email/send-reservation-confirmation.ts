import "server-only";

import { renderReservationCancellationEmail, renderReservationConfirmationEmail, type ReservationEmailKind } from "@/lib/email/reservation-email";

const resendEndpoint = "https://api.resend.com/emails";

type ReservationConfirmation = {
  reservationId: string;
  customerName: string;
  customerEmail: string;
  guestCount: number;
  startsAt: string;
  endsAt: string;
  specialRequests: string | null;
  language: "de" | "en";
  managementUrl?: string | null;
};

async function sendReservationEmail(reservation: ReservationConfirmation, kind: ReservationEmailKind) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Resend is not configured.");

  const email = kind === "cancellation"
    ? renderReservationCancellationEmail(reservation)
    : renderReservationConfirmationEmail(reservation);
  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `reservation:${reservation.reservationId}:${kind}`,
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

export function sendReservationConfirmationEmail(reservation: ReservationConfirmation) {
  return sendReservationEmail(reservation, "confirmation");
}

export function sendReservationCancellationEmail(reservation: ReservationConfirmation) {
  return sendReservationEmail(reservation, "cancellation");
}
