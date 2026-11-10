import { after, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendReservationConfirmationEmail } from "@/lib/email/send-reservation-confirmation";
import { createReservationManagementToken, reservationManagementUrl } from "@/lib/reservations/management-token";
import { sendStaffBookingNotification } from "@/lib/notifications/send-staff-booking";
import { localDateTimeToUtc, validateReservationInput, type ReservationInput } from "@/lib/supabase/reservation-engine";
import { isHolidayClosureDate } from "@/lib/booking-config";

export async function POST(request: Request) {
  let body: Partial<ReservationInput> & { reviewEmailConsent?: unknown };
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
  const reviewEmailConsent = body.reviewEmailConsent === true;
  const validationError = validateReservationInput(input);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
  if (isHolidayClosureDate(input.date)) return NextResponse.json({ error: "unavailable" }, { status: 409 });

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
      if (reviewEmailConsent) {
        const { error: consentError } = await client
          .from("reservations")
          .update({ review_email_consent_at: new Date().toISOString() })
          .eq("id", storedReservation.id);
        if (consentError) {
          console.error("Review email consent could not be stored", consentError.message);
        }
      }

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

      after(async () => {
        try {
          await sendStaffBookingNotification({
            reservationReference: reservation.reservation_reference,
            customerName: storedReservation.customer_name,
            customerLanguage: storedReservation.language === "en" ? "en" : "de",
            startsAt: storedReservation.starts_at,
            guestCount: storedReservation.guest_count,
          });
        } catch (notificationError) {
          console.error("Staff booking notification failed", {
            code: notificationError instanceof Error && "code" in notificationError
              ? String(notificationError.code)
              : notificationError instanceof Error
                ? notificationError.name
                : "unknown",
            message: notificationError instanceof Error ? notificationError.message : "Unknown notification error",
          });
        }
      });
    }
    return NextResponse.json({ reservationReference: reservation.reservation_reference, status });
  } catch (error) {
    console.error("Reservation creation failed", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
