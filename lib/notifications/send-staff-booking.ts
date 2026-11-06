import * as webpush from "web-push";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type BookingNotification = {
  reservationReference: string;
  customerName: string;
  customerLanguage: "de" | "en";
  startsAt: string;
  guestCount: number;
};

type SubscriptionRow = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

class StaffNotificationError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "StaffNotificationError";
    this.code = code;
  }
}

function formatBooking(booking: BookingNotification) {
  const locale = booking.customerLanguage === "en" ? "en-GB" : "de-DE";
  const date = new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Berlin",
    dateStyle: "medium",
  }).format(new Date(booking.startsAt));
  const time = new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(booking.startsAt));

  return booking.customerLanguage === "en"
    ? {
        title: "New reservation",
        body: `${booking.customerName} · ${date} at ${time} · ${booking.guestCount} guests`,
      }
    : {
        title: "Neue Reservierung",
        body: `${booking.customerName} · ${date} um ${time} · ${booking.guestCount} Gäste`,
      };
}

export async function sendStaffBookingNotification(booking: BookingNotification) {
  const publicKey = process.env.WEB_PUSH_VAPID_PUBLIC_KEY;
  const privateKey = process.env.WEB_PUSH_VAPID_PRIVATE_KEY;
  const subject = process.env.WEB_PUSH_SUBJECT;
  if (!publicKey || !privateKey || !subject) {
    throw new StaffNotificationError("missing_configuration", "Web Push server variables are not configured");
  }

  try {
    webpush.setVapidDetails(subject, publicKey.trim(), privateKey.trim());
  } catch {
    throw new StaffNotificationError("invalid_configuration", "Web Push VAPID credentials are invalid");
  }
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("staff_push_subscriptions")
    .select("id,endpoint,p256dh,auth")
    .limit(1000);
  if (error) {
    const databaseCode = typeof error.code === "string" && /^[A-Z0-9_]+$/.test(error.code) ? error.code : "unknown";
    throw new StaffNotificationError(`subscription_lookup_${databaseCode}`, "Could not load staff push subscriptions");
  }
  if (!data?.length) return { sent: 0 };

  const message = formatBooking(booking);
  const payload = JSON.stringify({
    ...message,
    url: `/dashboard/reservations?reservation=${encodeURIComponent(booking.reservationReference)}`,
    tag: `altstadtliebe-reservation-${booking.reservationReference}`,
  });

  const results = await Promise.allSettled(data.map(async (subscription: SubscriptionRow) => {
    try {
      await webpush.sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, payload);
    } catch (error) {
      const statusCode = typeof error === "object" && error !== null && "statusCode" in error ? Number(error.statusCode) : 0;
      if (statusCode === 404 || statusCode === 410) {
        await supabase.from("staff_push_subscriptions").delete().eq("id", subscription.id);
      }
      throw error;
    }
  }));
  const rejected = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
  if (rejected.length === results.length) {
    const first = rejected[0]?.reason;
    const statusCode = typeof first === "object" && first !== null && "statusCode" in first ? Number(first.statusCode) : 0;
    throw new StaffNotificationError(statusCode ? `delivery_${statusCode}` : "delivery_failed", "Push delivery failed for all staff devices");
  }
  return { sent: results.length - rejected.length, failed: rejected.length };
}
