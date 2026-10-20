import "server-only";

import { createSupabaseAdminClient } from "./server";

export type AvailabilityResult = {
  date: string;
  times: string[];
  durationMinutes: number;
  available: boolean;
  reason?: "closed" | "outside_window";
};

function partsToRecord(parts: Intl.DateTimeFormatPart[]) {
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
}

export function berlinDateNow() {
  const parts = partsToRecord(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date()));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function addCalendarMonths(date: string, months: number) {
  const [year, month, day] = date.split("-").map(Number);
  const targetMonth = month - 1 + months;
  const targetYear = year + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
  return new Date(Date.UTC(targetYear, normalizedMonth, Math.min(day, lastDay))).toISOString().slice(0, 10);
}

export function dateIsValid(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  return value.getUTCFullYear() === year && value.getUTCMonth() === month - 1 && value.getUTCDate() === day;
}

export function weekday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function timeToMinutes(value: string) {
  const [hours, minutes] = value.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function localDateTimeToUtc(date: string, time: string, timeZone = "Europe/Berlin") {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
  const guess = Date.UTC(year, month - 1, day, hours, minutes);
  const localParts = partsToRecord(new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(guess)));
  const interpretedAsUtc = Date.UTC(Number(localParts.year), Number(localParts.month) - 1, Number(localParts.day), Number(localParts.hour), Number(localParts.minute));
  return new Date(guess - (interpretedAsUtc - guess));
}

async function loadContext(date: string, guests: number) {
  const client = createSupabaseAdminClient();
  const { data: settings, error: settingsError } = await client.from("booking_settings").select("*").eq("id", "default").single();
  if (settingsError) throw new Error(settingsError.message);

  const today = berlinDateNow();
  const maxDate = addCalendarMonths(today, settings.advance_booking_months);
  if (!dateIsValid(date) || date < today || date > maxDate) return { client, settings, unavailable: "outside_window" as const };

  const [hoursResult, exceptionResult] = await Promise.all([
    client.from("opening_hours").select("*").eq("weekday", weekday(date) === 0 ? 7 : weekday(date)).single(),
    client.from("opening_exceptions").select("*").eq("exception_date", date).maybeSingle(),
  ]);
  if (hoursResult.error) throw new Error(hoursResult.error.message);
  if (exceptionResult.error) throw new Error(exceptionResult.error.message);
  if (hoursResult.data.is_closed || exceptionResult.data?.is_closed) return { client, settings, unavailable: "closed" as const };
  if (guests < 1 || guests > settings.max_online_guests) return { client, settings, unavailable: "outside_window" as const };
  return { client, settings, hours: hoursResult.data, exception: exceptionResult.data };
}

export async function getAvailability(date: string, guests: number): Promise<AvailabilityResult> {
  const context = await loadContext(date, guests);
  if ("unavailable" in context) return { date, times: [], durationMinutes: context.settings.reservation_duration_minutes, available: false, reason: context.unavailable };

  const { settings, hours, exception } = context;
  const first = timeToMinutes(settings.first_reservation_time);
  const last = timeToMinutes(settings.last_reservation_time);
  const openingTime = timeToMinutes(exception?.opens_at ?? hours.opens_at ?? settings.first_reservation_time);
  const closingTime = timeToMinutes(exception?.closes_at ?? hours.closes_at ?? settings.last_reservation_time);
  const slotTimes = Array.from({ length: Math.floor((last - first) / settings.booking_interval_minutes) + 1 }, (_, index) => formatTime(first + index * settings.booking_interval_minutes))
    .filter((time) => timeToMinutes(time) >= openingTime && timeToMinutes(time) <= closingTime);
  const now = Date.now();
  const times = slotTimes.filter((time) => {
    const start = localDateTimeToUtc(date, time, settings.time_zone);
    return start.getTime() > now;
  });

  return { date, times, durationMinutes: settings.reservation_duration_minutes, available: times.length > 0, ...(hours ? {} : {}) };
}

export type ReservationInput = {
  customerName: string;
  customerEmail: string;
  guestCount: number;
  date: string;
  time: string;
  specialRequests: string | null;
  language: "de" | "en";
};

export function validateReservationInput(input: ReservationInput) {
  if (!input.customerName.trim() || input.customerName.trim().length > 160) return "customer_name";
  if (!/^\S+@\S+\.\S+$/.test(input.customerEmail.trim()) || input.customerEmail.trim().length > 320) return "customer_email";
  if (!Number.isInteger(input.guestCount) || input.guestCount < 1 || input.guestCount > 6) return "guest_count";
  if (!dateIsValid(input.date) || !/^\d{2}:\d{2}$/.test(input.time)) return "date_or_time";
  if (input.specialRequests && input.specialRequests.length > 2000) return "special_requests";
  return null;
}
