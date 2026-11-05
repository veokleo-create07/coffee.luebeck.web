import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendReservationConfirmationEmail } from "@/lib/email/send-reservation-confirmation";
import { createReservationManagementToken, reservationManagementUrl } from "@/lib/reservations/management-token";
import { localDateTimeToUtc, validateReservationInput, type ReservationInput } from "@/lib/supabase/reservation-engine";

export async function POST(request: Request) {
  let body: Partial<ReservationInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input: ReservationInput = {
    customerName: String(body.customerName ?? ""),
    customerEmail: String(body.customerEmail ?? ""),
    guestCount: Number(body.guestCount),
    date: String(body.date ?? ""),
    time: String(body.time ?? ""),
    specialRequests: body.specialRequests ? String(body.specialRequests) : null,
    language: body.language === "en" ? "en" : "de",
  };
  const validationError = validateReservationInput(input);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  try {
    const client = createSupabaseAdminClient();
    const { data, error } = await client.rpc("create_reservation_atomic", {
      p_customer_name: input.customerName.trim(),
      p_customer_email: input.customerEmail.trim().toLowerCase(),
      p_guest_count: input.guestCount,
      p_starts_at: localDateTimeToUtc(input.date, input.time).toISOString(),
      p_special_requests: input.specialRequests?.trim() || null,
      p_language: input.language,
    });

    if (error) {
      if (error.message.includes("RESERVATION_FULL:")) {
        const availability = await import("@/lib/supabase/reservation-engine").then(({ getAvailability }) => getAvailability(input.date, input.guestCount));
        return NextResponse.json({ error: "fully_booked", alternativeTimes: availability.times.slice(0, 3) }, { status: 409 });
      }
      const conflict = /unavailable|closed|booking|past|advance|guest|time|capacity/i.test(error.message);
      return NextResponse.json({ error: conflict ? "unavailable" : "server" }, { status: conflict ? 409 : 500 });
    }

    const reservation = Array.isArray(data) ? data[0] : data;
    if (!reservation?.reservation_reference) return NextResponse.json({ error: "server" }, { status: 500 });
    const { data: storedReservation } = await client
      .from("reservations")
      .select("id, customer_name, customer_email, guest_count, starts_at, ends_at, special_requests, language, status")
      .eq("reservation_reference", reservation.reservation_reference)
      .maybeSingle();
    const status = storedReservation?.status === "confirmed" ? "confirmed" : "pending";
    if (storedReservation) {
      const managementToken = createReservationManagementToken(storedReservation.id);
      const managementUrl = reservationManagementUrl(managementToken, storedReservation.language);

      try {
        await sendReservationConfirmationEmail({
          reservationId: storedReservation.id,
          customerName: storedReservation.customer_name,
          customerEmail: storedReservation.customer_email,
          guestCount: storedReservation.guest_count,
          startsAt: storedReservation.starts_at,
          endsAt: storedReservation.ends_at,
          specialRequests: storedReservation.special_requests,
          language: storedReservation.language,
          managementUrl,
        });
      } catch (error) {
        console.error("Reservation confirmation email skipped", error instanceof Error ? error.message : "Unknown error");
      }
    }
    return NextResponse.json({ reservationReference: reservation.reservation_reference, status });
  } catch (error) {
    console.error("Reservation creation failed", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
