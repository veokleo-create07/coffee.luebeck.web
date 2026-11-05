import { NextResponse } from "next/server";
import { sendReservationCancellationEmail } from "@/lib/email/send-reservation-confirmation";
import { reservationIdFromManagementToken } from "@/lib/reservations/management-token";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const publicReservationFields = "id, customer_name, customer_email, guest_count, starts_at, ends_at, status, language, special_requests";

function canCancel(status: string, startsAt: string) {
  return (status === "pending" || status === "confirmed") && Date.parse(startsAt) > Date.now();
}

async function findReservation(token: string) {
  const reservationId = reservationIdFromManagementToken(token);
  if (!reservationId) return { client: createSupabaseAdminClient(), reservation: null };
  const client = createSupabaseAdminClient();
  const { data, error } = await client
    .from("reservations")
    .select(publicReservationFields)
    .eq("id", reservationId)
    .maybeSingle();

  if (error) throw error;
  return { client, reservation: data };
}

function publicReservation(reservation: NonNullable<Awaited<ReturnType<typeof findReservation>>["reservation"]>) {
  return {
    customerName: reservation.customer_name,
    customerEmail: reservation.customer_email,
    guestCount: reservation.guest_count,
    startsAt: reservation.starts_at,
    endsAt: reservation.ends_at,
    status: reservation.status,
    language: reservation.language,
    canCancel: canCancel(reservation.status, reservation.starts_at),
  };
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token || !reservationIdFromManagementToken(token)) {
    return NextResponse.json({ error: "invalid_link" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const { reservation } = await findReservation(token);
    if (!reservation) return NextResponse.json({ error: "not_found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    return NextResponse.json({ reservation: publicReservation(reservation) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Reservation management lookup failed", error);
    return NextResponse.json({ error: "server" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(request: Request) {
  let body: { token?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token : "";
  if (body.action !== "cancel" || !reservationIdFromManagementToken(token)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const { client, reservation } = await findReservation(token);
    if (!reservation) return NextResponse.json({ error: "not_found" }, { status: 404 });

    if (reservation.status === "cancelled") {
      return NextResponse.json({ reservation: publicReservation(reservation) });
    }
    if (!canCancel(reservation.status, reservation.starts_at)) {
      return NextResponse.json({ error: "cannot_cancel" }, { status: 409 });
    }

    const { data: cancelledReservation, error } = await client
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", reservation.id)
      .in("status", ["pending", "confirmed"])
      .select(publicReservationFields)
      .maybeSingle();

    if (error) throw error;
    if (!cancelledReservation) return NextResponse.json({ error: "cannot_cancel" }, { status: 409 });

    try {
      await sendReservationCancellationEmail({
        reservationId: cancelledReservation.id,
        customerName: cancelledReservation.customer_name,
        customerEmail: cancelledReservation.customer_email,
        guestCount: cancelledReservation.guest_count,
        startsAt: cancelledReservation.starts_at,
        endsAt: cancelledReservation.ends_at,
        specialRequests: cancelledReservation.special_requests,
        language: cancelledReservation.language,
      });
    } catch (emailError) {
      console.error("Reservation cancellation email skipped", emailError instanceof Error ? emailError.message : "Unknown error");
    }

    return NextResponse.json({ reservation: publicReservation(cancelledReservation) });
  } catch (error) {
    console.error("Reservation cancellation failed", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
