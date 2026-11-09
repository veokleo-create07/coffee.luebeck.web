export const BOOKING_CONFIG = {
  timeZone: "Europe/Berlin",
  maxMonthsAhead: 6,
  closedWeekday: 1,
  holidayClosures: [
    "2026-12-22",
    "2026-12-23",
    "2026-12-24",
    "2026-12-25",
    "2026-12-26",
    "2026-12-27",
    "2027-01-01",
  ],
  minGuests: 1,
  maxGuests: 6,
  firstTime: "09:00",
  lastTime: "16:30",
  intervalMinutes: 30,
  durationMinutes: 90,
} as const;

export function isHolidayClosureDate(date: string) {
  return (BOOKING_CONFIG.holidayClosures as readonly string[]).includes(date);
}
