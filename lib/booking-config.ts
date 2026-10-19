export const BOOKING_CONFIG = {
  timeZone: "Europe/Berlin",
  maxMonthsAhead: 6,
  closedWeekday: 1,
  minGuests: 1,
  maxGuests: 6,
  firstTime: "09:00",
  lastTime: "17:00",
  intervalMinutes: 30,
  durationMinutes: 90,
} as const;
