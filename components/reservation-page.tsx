"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronDown, Clock3, Mail, MessageSquare, Phone, UserRound, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SEO_ROUTES } from "@/lib/seo";
import { BOOKING_CONFIG, isHolidayClosureDate } from "@/lib/booking-config";
import { SiteHeader } from "./site-header";

type ReservationPageProps = { locale: Locale; dictionary: Dictionary };
type Step = 1 | 2;
type VisitStep = 1 | 2 | 3;
type ReservationStatus = "pending" | "confirmed";
type Details = { fullName: string; email: string; requests: string };
type FormState = { date: string; guests: number; time: string; details: Details };
type AvailabilityResponse = { date: string; times: string[]; fullyBookedTimes: string[]; alternativeTimes: string[]; durationMinutes: number; available: boolean; reason?: "closed" | "outside_window" | "fully_booked" };

const initialDetails: Details = { fullName: "", email: "", requests: "" };

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

const reservationTimes = Array.from(
  {
    length: Math.floor((timeToMinutes(BOOKING_CONFIG.lastTime) - timeToMinutes(BOOKING_CONFIG.firstTime)) / BOOKING_CONFIG.intervalMinutes) + 1,
  },
  (_, index) => {
    const minutes = timeToMinutes(BOOKING_CONFIG.firstTime) + index * BOOKING_CONFIG.intervalMinutes;
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  },
);

function dateInputValue(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_CONFIG.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  return `${parts.find((part) => part.type === "year")?.value}-${parts.find((part) => part.type === "month")?.value}-${parts.find((part) => part.type === "day")?.value}`;
}

function addMonths(date: string, months: number) {
  const [year, month, day] = date.split("-").map(Number);
  const targetMonth = month - 1 + months;
  const targetYear = year + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
  const next = new Date(Date.UTC(targetYear, normalizedMonth, Math.min(day, lastDay)));
  return next.toISOString().slice(0, 10);
}

function weekday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function displayDate(date: string, locale: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Europe/Berlin" }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function displayFieldDate(date: string, locale: string) {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function monthValue(date: string) {
  return date.slice(0, 7);
}

function monthLabel(date: string, locale: string) {
  const [year, month] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1, 12)));
}

function calendarDays(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const firstDayMondayIndex = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7;
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    return year + "-" + String(monthNumber).padStart(2, "0") + "-" + String(index + 1).padStart(2, "0");
  });
  return [...Array(firstDayMondayIndex).fill(null), ...days];
}

export function ReservationPage({ locale, dictionary }: ReservationPageProps) {
  const copy = dictionary.reservation.booking;
  const homeHref = locale === "de" ? "/" : "/en";
  const [step, setStep] = useState<Step>(1);
  const [visitStep, setVisitStep] = useState<VisitStep>(1);
  const [isCompactFlow, setIsCompactFlow] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<ReservationStatus | null>(null);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [calendarMonth, setCalendarMonth] = useState("");
  const [showLargePartyInfo, setShowLargePartyInfo] = useState(false);
  const [form, setForm] = useState<FormState>({ date: "", guests: 2, time: "", details: initialDetails });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [fullyBookedTime, setFullyBookedTime] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeModalRef = useRef<HTMLButtonElement>(null);
  const modalOpenerRef = useRef<HTMLButtonElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const availableTimes = useMemo(() => availability?.times ?? [], [availability]);
  const isHolidayClosure = Boolean(form.date && isHolidayClosureDate(form.date));
  const isClosedDay = Boolean(form.date && (weekday(form.date) === BOOKING_CONFIG.closedWeekday || isHolidayClosure));
  const closedDayMessage = isHolidayClosure ? copy.holidayClosedMessage : copy.closedDayMessage;

  function openDatePicker() {
    const input = dateInputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (!input) return;
    try {
      if (typeof input.showPicker === "function") input.showPicker();
      else input.click();
    } catch {
      input.focus();
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateLayout = () => setIsCompactFlow(mediaQuery.matches);
    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    if (!fullyBookedTime) return;
    closeModalRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setFullyBookedTime(""); return; }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); modalOpenerRef.current?.focus(); };
  }, [fullyBookedTime]);

  useEffect(() => {
    const today = dateInputValue(new Date());
    setMinDate(today);
    setMaxDate(addMonths(today, BOOKING_CONFIG.maxMonthsAhead));
    setCalendarMonth(monthValue(today));
    setForm((current) => ({ ...current, date: current.date || today }));
  }, []);

  function selectDate(nextDate: string) {
    const nextIsClosed = weekday(nextDate) === BOOKING_CONFIG.closedWeekday || isHolidayClosureDate(nextDate);
    setAvailability(null);
    setVisitStep(1);
    setCalendarMonth(monthValue(nextDate));
    setForm((current) => ({ ...current, date: nextDate, time: "" }));
    setShowLargePartyInfo(false);
    setErrors((current) => ({ ...current, date: "", time: "" }));
    if (nextIsClosed) setFullyBookedTime("");
  }

  useEffect(() => {
    if (!form.date || !minDate || isClosedDay) {
      setAvailability(null);
      setAvailabilityLoading(false);
      return;
    }
    let active = true;
    const controller = new AbortController();
    setAvailabilityLoading(true);
    setAvailabilityError(false);
    fetch(`/api/reservations/availability?date=${encodeURIComponent(form.date)}&guests=${form.guests}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "availability");
        return payload as AvailabilityResponse;
      })
      .then((payload) => { if (active) setAvailability(payload); })
      .catch((error: unknown) => {
        if (active && !(error instanceof Error && error.name === "AbortError")) {
          setAvailability(null);
          setAvailabilityError(true);
        }
      })
      .finally(() => { if (active) setAvailabilityLoading(false); });
    return () => {
      active = false;
      controller.abort();
    };
  }, [form.date, form.guests, minDate, isClosedDay]);

  function updateDetails(field: keyof Details, value: string) {
    setForm((current) => ({ ...current, details: { ...current.details, [field]: value } }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validateVisit() {
    const nextErrors: Record<string, string> = {};
    if (!form.date || (minDate && form.date < minDate) || (maxDate && form.date > maxDate)) nextErrors.date = copy.dateRangeError;
    if (!form.time || !availableTimes.includes(form.time)) nextErrors.time = copy.timeError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateDateAndGuests() {
    const nextErrors: Record<string, string> = {};
    if (!form.date || (minDate && form.date < minDate) || (maxDate && form.date > maxDate)) nextErrors.date = copy.dateRangeError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateDetails() {
    const nextErrors: Record<string, string> = {};
    const { fullName, email } = form.details;
    if (!fullName.trim()) nextErrors.fullName = copy.requiredError;
    if (!email.trim()) nextErrors.email = copy.requiredError;
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = copy.emailError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      if (isCompactFlow && visitStep === 1) {
        if (validateDateAndGuests()) {
          setErrors({});
          setVisitStep(2);
        }
        return;
      }
      if (isCompactFlow && visitStep === 2) {
        setErrors({});
        setVisitStep(3);
        return;
      }
      if (validateVisit()) {
        setErrors({});
        setFullyBookedTime("");
        setStep(2);
      }
    }
    if (step === 2 && validateDetails()) {
      setSubmitting(true);
      setErrors({});
      try {
        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: form.details.fullName,
            customerEmail: form.details.email,
            guestCount: form.guests,
            date: form.date,
            time: form.time,
            specialRequests: form.details.requests,
            language: locale,
          }),
        });
        const payload = await response.json() as { reservationReference?: string; status?: ReservationStatus; error?: string; alternativeTimes?: string[] };
        if (!response.ok) {
          if (response.status === 409 && payload.error === "fully_booked") {
            setAvailability((current) => current ? { ...current, fullyBookedTimes: [...new Set([...current.fullyBookedTimes, form.time])], alternativeTimes: payload.alternativeTimes ?? [], available: Boolean(payload.alternativeTimes?.length) } : current);
            setFullyBookedTime(form.time);
            setStep(1);
            setForm((current) => ({ ...current, time: "" }));
            return;
          }
          setErrors({ submit: copy.availabilityError });
          return;
        }
        if (!payload.reservationReference) {
          setErrors({ submit: copy.availabilityError });
          return;
        }
        setReservationStatus(payload.status === "confirmed" ? "confirmed" : "pending");
      } catch {
        setErrors({ submit: copy.availabilityError });
      } finally {
        setSubmitting(false);
      }
    }
  }

  const errorClass = "mt-2 text-xs text-[#8b3f32]";
  const buttonClass = "site-button site-button-primary";
  const isConfirmed = reservationStatus === "confirmed";

  return (
    <div className="min-h-screen overflow-hidden bg-ivory">
      <SiteHeader locale={locale} dictionary={dictionary} languageHref={SEO_ROUTES.reservation[locale === "de" ? "en" : "de"]} />
      <main className={`page-gutter py-8 md:py-12 lg:py-16 ${reservationStatus ? "flex min-h-[calc(100svh-7rem)] items-center" : ""}`}>
        <div className="mx-auto grid w-full max-w-7xl gap-7 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
          <aside className="hidden lg:sticky lg:top-8 lg:block" aria-label={dictionary.reservation.imageAlt}>
            <div className="relative aspect-[0.78] w-full overflow-hidden rounded-[2rem] bg-espresso/10">
              <Image src="/booking-cups.jpeg" alt={dictionary.reservation.imageAlt} fill sizes="45vw" className="object-cover object-center" priority />
              <div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" />
            </div>
          </aside>

          <section className="min-w-0">
            {reservationStatus ? (
              null
            ) : (
              <>
                <header>
                  <h1 className="editorial-heading text-[clamp(2.25rem,5.1vw,3.65rem)] font-medium leading-[1.02] tracking-[-0.045em] text-espresso">{copy.title}</h1>
                </header>
              </>
            )}

            {reservationStatus ? (
              <section aria-live="polite" className="reservation-panel flex flex-col items-center text-center lg:pt-5">
                <h1 className="editorial-heading max-w-[13ch] text-[clamp(2.25rem,5vw,3.65rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-espresso">
                  {isConfirmed ? copy.confirmationTitle : copy.pendingTitle}
                </h1>
                <p className="mt-4 max-w-[28rem] text-sm leading-[1.6] text-espresso-soft md:text-base">
                  {isConfirmed ? copy.confirmationBody : copy.pendingBody}
                </p>
                <Link href={homeHref} className="mt-7 inline-flex min-h-11 w-full max-w-[18rem] self-center items-center justify-center rounded-full bg-espresso px-6 text-[0.82rem] font-medium !text-ivory shadow-[0_12px_24px_-18px_rgba(44,33,28,0.75)] transition-[background-color,box-shadow,transform] hover:-translate-y-px hover:bg-[#3a2922] hover:shadow-[0_16px_28px_-18px_rgba(44,33,28,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
                  {copy.startOver}
                </Link>
              </section>
            ) : (
              <form key={step} onSubmit={submitStep} noValidate className="reservation-panel mt-7 md:mt-9">
                {step === 1 ? (
                  <section aria-labelledby="visit-details-title">
                    <h2 id="visit-details-title" className="sr-only">{copy.stepLabels[0]}</h2>
                    <div className="mb-7 flex items-center justify-between gap-4 rounded-[1rem] border border-espresso/10 bg-[#fbf9f5] px-4 py-3 text-sm text-espresso lg:hidden">
                      <span>{form.date ? displayFieldDate(form.date, copy.dateFormatLocale) : "—"} · {form.guests} {copy.guestsSuffix}</span>
                      {visitStep > 1 && <button type="button" onClick={() => setVisitStep(visitStep === 3 ? 2 : 1)} className="shrink-0 font-medium text-espresso underline underline-offset-4">{copy.back}</button>}
                    </div>
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                      <div className={`min-w-0 ${isCompactFlow ? "hidden lg:block" : ""}`}>
                        <div className="relative flex min-h-[4.5rem] w-full min-w-0 max-w-full items-center rounded-[1rem] border border-espresso/15 bg-[#fbf9f5] px-3 transition-[border-color,background-color,box-shadow] hover:border-espresso/25 focus-within:border-espresso/40 focus-within:ring-2 focus-within:ring-espresso/8">
                          <CalendarDays size={20} strokeWidth={1.6} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-espresso" aria-hidden="true" />
                          <div className="pointer-events-none absolute left-12 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-0.5">
                            <label htmlFor="visit-date" className="text-[0.68rem] font-medium leading-tight text-espresso-soft">{copy.dateLabel}</label>
                            <span aria-hidden="true" className="text-[0.94rem] font-medium leading-tight text-espresso">{displayFieldDate(form.date, copy.dateFormatLocale)}</span>
                          </div>
                          <input ref={dateInputRef} id="visit-date" type="date" min={minDate} max={maxDate} value={form.date} onChange={(event) => selectDate(event.target.value)} className="absolute inset-0 z-20 hidden h-full w-full cursor-pointer rounded-[1rem] opacity-0 lg:block lg:pointer-events-none" aria-label={`${copy.dateLabel}: ${displayFieldDate(form.date, copy.dateFormatLocale)}`} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : undefined} />
                          <button type="button" onClick={openDatePicker} aria-label={`${copy.dateLabel}: ${displayFieldDate(form.date, copy.dateFormatLocale)}`} className="absolute inset-0 z-30 hidden rounded-[1rem] outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ivory lg:block" />
                        </div>
                        {errors.date && <p id="date-error" className={errorClass} role="alert">{errors.date}</p>}
                      </div>
                      {isCompactFlow && visitStep === 1 && calendarMonth && <div className="rounded-[1rem] border border-espresso/10 bg-[#fbf9f5] p-4 lg:hidden sm:col-span-2">
                        <div className="flex items-center justify-between gap-3">
                          <button type="button" onClick={() => setCalendarMonth(addMonths(calendarMonth + "-01", -1).slice(0, 7))} disabled={calendarMonth <= monthValue(minDate)} aria-label={locale === "de" ? "Vorheriger Monat" : "Previous month"} className="flex h-10 w-10 items-center justify-center rounded-full text-espresso transition-colors hover:bg-espresso/5 disabled:cursor-not-allowed disabled:opacity-25"><ArrowLeft size={18} strokeWidth={1.6} aria-hidden="true" /></button>
                          <h3 className="text-base font-semibold capitalize text-espresso">{monthLabel(calendarMonth + "-01", copy.dateFormatLocale)}</h3>
                          <button type="button" onClick={() => setCalendarMonth(addMonths(calendarMonth + "-01", 1).slice(0, 7))} disabled={calendarMonth >= monthValue(maxDate)} aria-label={locale === "de" ? "Nächster Monat" : "Next month"} className="flex h-10 w-10 items-center justify-center rounded-full text-espresso transition-colors hover:bg-espresso/5 disabled:cursor-not-allowed disabled:opacity-25"><ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" /></button>
                        </div>
                        <div className="mt-4 grid grid-cols-7 text-center text-[0.68rem] font-medium uppercase tracking-[0.05em] text-espresso-soft" aria-hidden="true">
                          {(locale === "de" ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]).map((day) => <span key={day}>{day}</span>)}
                        </div>
                        <div className="mt-2 grid grid-cols-7 gap-1.5" role="grid" aria-label={monthLabel(calendarMonth + "-01", copy.dateFormatLocale)}>
                          {calendarDays(calendarMonth).map((day, index) => day ? <button key={day} type="button" role="gridcell" aria-selected={form.date === day} onClick={() => selectDate(day)} disabled={day < minDate || day > maxDate} className={`flex aspect-square items-center justify-center rounded-full text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${form.date === day ? "bg-espresso font-semibold text-ivory" : weekday(day) === BOOKING_CONFIG.closedWeekday || isHolidayClosureDate(day) ? "text-espresso-soft/45" : "text-espresso hover:bg-espresso/8"} disabled:cursor-not-allowed disabled:text-espresso/15`}>{Number(day.slice(-2))}</button> : <span key={"empty-" + index} aria-hidden="true" />)}
                        </div>
                      </div>}
                      <div className={`min-w-0 ${isCompactFlow && visitStep !== 2 ? "hidden lg:block" : ""}`}>
                        <div className="relative">
                          <UserRound size={21} strokeWidth={1.6} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-espresso" aria-hidden="true" />
                          <label htmlFor="guest-count" className="pointer-events-none absolute left-12 top-2.5 z-10 text-[0.68rem] font-medium text-espresso-soft">{copy.guestsLabel}</label>
                          <select id="guest-count" value={form.guests} onChange={(event) => { setAvailability(null); if (!isCompactFlow) setVisitStep(1); setForm((current) => ({ ...current, guests: Number(event.target.value), time: "" })); }} className="min-h-[4.5rem] w-full appearance-none rounded-[1rem] border border-espresso/15 bg-[#fbf9f5] pb-1 pl-12 pr-10 pt-5 text-base font-medium text-espresso outline-none transition-[border-color,background-color,box-shadow] hover:border-espresso/25 focus:border-espresso/40 focus:ring-2 focus:ring-espresso/8 lg:text-[0.94rem]">
                            {Array.from({ length: BOOKING_CONFIG.maxGuests }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {copy.guestsSuffix}</option>)}
                          </select>
                          <ChevronDown size={18} strokeWidth={1.6} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-espresso" aria-hidden="true" />
                        </div>
                      </div>
                      {!isClosedDay && (!isCompactFlow || visitStep === 2) && <div className="mt-1 sm:col-span-2">
                        <button type="button" onClick={() => setShowLargePartyInfo((current) => !current)} className="text-sm text-espresso underline decoration-espresso/30 underline-offset-4 transition-colors hover:decoration-espresso">{copy.moreThanSix}</button>
                        {showLargePartyInfo && <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-espresso-soft"><span>{copy.moreThanSixMessage}</span><a href={dictionary.location.phoneHref} className="site-button site-button-secondary min-h-11 gap-2 px-4" aria-label={`${copy.callCafe}: ${dictionary.location.phoneLabel}`}><Phone size={15} strokeWidth={1.5} aria-hidden="true" />{copy.callCafe}</a></div>}
                      </div>}
                    </div>

                    {isCompactFlow && visitStep < 3 && <div className="mt-7 lg:hidden">
                      {isClosedDay ? (
                        <p className="rounded-[1rem] border border-espresso/10 bg-[#fbf9f5] px-4 py-4 text-sm leading-6 text-espresso-soft" role="status">{closedDayMessage}</p>
                      ) : (
                        <button type="submit" disabled={availabilityLoading} className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-espresso px-6 text-[0.82rem] font-medium text-ivory shadow-[0_12px_24px_-18px_rgba(44,33,28,0.8)] outline-none transition-[background-color,box-shadow,transform,opacity] hover:-translate-y-px hover:bg-[#3a2922] focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-not-allowed disabled:opacity-35"><span>{visitStep === 1 ? copy.continue : copy.chooseTime}</span></button>
                      )}
                    </div>}

                    <div className={`${isCompactFlow && visitStep !== 3 ? "hidden " : ""}mt-7 md:mt-8 lg:block`}>
                      {isClosedDay ? (
                        <p className="rounded-[1rem] border border-espresso/10 bg-[#fbf9f5] px-4 py-4 text-sm leading-6 text-espresso-soft" role="status">{closedDayMessage}</p>
                      ) : <>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                        <h3 className="editorial-heading text-[1.3rem] font-medium leading-tight tracking-[-0.035em] text-espresso">{copy.timeLabel}</h3>
                        <div className="flex items-start gap-2 text-xs leading-5 text-espresso-soft sm:max-w-[62%] sm:justify-end">
                          <Clock3 size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-espresso-soft" aria-hidden="true" />
                        <span>{copy.durationNotice}</span>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-2.5" aria-busy={availabilityLoading}>
                        {reservationTimes.map((time) => {
                          const isAvailable = availableTimes.includes(time);
                          const isFull = availability?.fullyBookedTimes.includes(time) ?? false;
                          const isInvalid = !isAvailable && !isFull;
                          const isDisabled = availabilityLoading || isInvalid;
                          return <button key={time} type="button" disabled={isDisabled} onClick={(event) => { setErrors((current) => ({ ...current, time: "" })); if (isFull) { modalOpenerRef.current = event.currentTarget; setForm((current) => ({ ...current, time: "" })); setFullyBookedTime(time); } else { setFullyBookedTime(""); setForm((current) => ({ ...current, time })); } }} className={`min-h-12 w-full rounded-[1rem] border px-2 text-[0.82rem] font-medium tabular-nums outline-none transition-[border-color,background-color,color,transform] focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:min-h-[3.35rem] sm:text-sm ${form.time === time ? "border-espresso bg-espresso text-ivory" : isFull ? "border-espresso/15 bg-[#fbf9f5] text-espresso-soft hover:border-espresso/30 hover:bg-[#eee9e1]/70" : "border-espresso/15 bg-[#fbf9f5] text-espresso hover:-translate-y-px hover:border-espresso/35 hover:bg-[#eee9e1]/50"} disabled:cursor-not-allowed disabled:border-espresso/[0.07] disabled:bg-espresso/[0.025] disabled:text-espresso-soft/25`} aria-pressed={form.time === time} aria-label={isFull ? `${time} — ${copy.fullyBooked}` : time}>{time}{isFull && <span className="ml-1 text-[9px] opacity-70">·</span>}</button>;
                        })}
                      </div>
                      {!fullyBookedTime && <>
                        {availabilityLoading && <p className="mt-3 text-sm text-espresso-soft" role="status">{copy.loadingAvailability}</p>}
                        {!availabilityLoading && availabilityError && <p className="mt-3 text-sm text-[#8b3f32]" role="alert">{copy.availabilityError}</p>}
                      </>}
                      {errors.time && <p className={errorClass} role="alert">{errors.time}</p>}
                      </>}
                    </div>

                    <div className="mt-7 hidden justify-end lg:flex">
                      <button type="submit" disabled={availabilityLoading || !form.time || !availableTimes.includes(form.time)} className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-espresso px-6 text-[0.82rem] font-medium text-ivory shadow-[0_12px_24px_-18px_rgba(44,33,28,0.8)] outline-none transition-[background-color,box-shadow,transform,opacity] hover:-translate-y-px hover:bg-[#3a2922] hover:shadow-[0_16px_28px_-18px_rgba(44,33,28,0.85)] focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ivory active:translate-y-0 sm:w-auto sm:min-w-56 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none disabled:hover:translate-y-0"><span>{copy.continue}</span></button>
                    </div>
                    {visitStep === 3 && <div className="mt-7 flex gap-3 lg:hidden"><button type="button" onClick={() => setVisitStep(2)} className="site-button site-button-secondary min-h-11 flex-1 px-6 text-[0.82rem]">{copy.back}</button><button type="submit" disabled={availabilityLoading || !form.time || !availableTimes.includes(form.time)} className="site-button site-button-primary min-h-11 flex-1 px-6 text-[0.82rem] disabled:cursor-not-allowed disabled:opacity-35"><span>{copy.continue}</span></button></div>}
                  </section>
                ) : (
                  <section aria-labelledby="contact-details-title">
                    <h2 id="contact-details-title" className="sr-only">{copy.stepLabels[1]}</h2>
                    <dl className="mb-6 grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-3 text-sm">
                      <div className="min-w-0"><dt className="text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-espresso-soft">{copy.summaryDate}</dt><dd className="mt-1.5 whitespace-nowrap text-[0.9rem] font-semibold text-espresso">{displayDate(form.date, copy.dateFormatLocale)}</dd></div>
                      <div><dt className="text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-espresso-soft">{copy.summaryTime}</dt><dd className="mt-1.5 text-[0.94rem] font-semibold text-espresso">{form.time}</dd></div>
                      <div><dt className="text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-espresso-soft">{copy.summaryGuests}</dt><dd className="mt-1.5 text-[0.94rem] font-semibold text-espresso">{form.guests} {copy.guestsSuffix}</dd></div>
                      <div className="col-span-3 flex items-start gap-2 text-xs leading-5 text-espresso-soft"><Clock3 size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" /><dt className="shrink-0 font-semibold text-espresso-soft">{copy.summaryDuration}:</dt><dd className="font-medium text-espresso-soft">{copy.durationNotice}</dd></div>
                    </dl>
                    <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div className="min-w-0">
                        <div className="relative">
                          <UserRound size={20} strokeWidth={1.6} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-espresso" aria-hidden="true" />
                          <label htmlFor="full-name" className="pointer-events-none absolute left-12 top-2.5 z-10 text-[0.68rem] font-medium text-espresso-soft">{copy.fullName}</label>
                          <input id="full-name" value={form.details.fullName} onChange={(event) => updateDetails("fullName", event.target.value)} className="min-h-[4.5rem] w-full rounded-[1rem] border border-espresso/15 bg-[#fbf9f5] pb-1 pl-12 pr-4 pt-5 text-base font-medium text-espresso outline-none transition-[border-color,background-color,box-shadow] placeholder:text-espresso-soft/55 hover:border-espresso/25 focus:border-espresso/40 focus:ring-2 focus:ring-espresso/8 lg:text-[0.94rem]" autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "full-name-error" : undefined} />
                        </div>
                        {errors.fullName && <p id="full-name-error" className={errorClass} role="alert">{errors.fullName}</p>}
                      </div>
                      <div className="min-w-0">
                        <div className="relative">
                          <Mail size={20} strokeWidth={1.6} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-espresso" aria-hidden="true" />
                          <label htmlFor="email" className="pointer-events-none absolute left-12 top-2.5 z-10 text-[0.68rem] font-medium text-espresso-soft">{copy.email}</label>
                          <input id="email" type="email" value={form.details.email} onChange={(event) => updateDetails("email", event.target.value)} className="min-h-[4.5rem] w-full rounded-[1rem] border border-espresso/15 bg-[#fbf9f5] pb-1 pl-12 pr-4 pt-5 text-base font-medium text-espresso outline-none transition-[border-color,background-color,box-shadow] placeholder:text-espresso-soft/55 hover:border-espresso/25 focus:border-espresso/40 focus:ring-2 focus:ring-espresso/8 lg:text-[0.94rem]" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
                        </div>
                        {errors.email && <p id="email-error" className={errorClass} role="alert">{errors.email}</p>}
                      </div>
                      <div className="min-w-0 sm:col-span-2">
                        <div className="relative">
                          <MessageSquare size={20} strokeWidth={1.6} className="pointer-events-none absolute left-4 top-4 z-10 text-espresso" aria-hidden="true" />
                          <label htmlFor="requests" className="pointer-events-none absolute left-12 top-3 z-10 text-[0.68rem] font-medium text-espresso-soft">{copy.requests} <span className="normal-case tracking-normal text-espresso-soft/60">({copy.optional})</span></label>
                          <textarea id="requests" rows={3} value={form.details.requests} onChange={(event) => updateDetails("requests", event.target.value)} className="min-h-28 w-full rounded-[1rem] border border-espresso/15 bg-[#fbf9f5] py-9 pl-12 pr-4 text-base font-medium leading-6 text-espresso outline-none transition-[border-color,background-color,box-shadow] placeholder:text-espresso-soft/55 hover:border-espresso/25 focus:border-espresso/40 focus:ring-2 focus:ring-espresso/8 lg:text-[0.94rem]" />
                        </div>
                      </div>
                    </div>
                    {errors.submit && <p className="mt-5 text-sm text-[#8b3f32]" role="alert">{errors.submit}</p>}
                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button type="button" onClick={() => { setErrors({}); setVisitStep(2); setStep(1); }} className="site-button site-button-secondary min-h-11 w-full max-w-[18rem] self-center px-6 text-[0.82rem]">{copy.back}</button>
                      <button type="submit" disabled={submitting} className={`${buttonClass} min-h-11 w-full max-w-[18rem] self-center px-6 text-[0.82rem] disabled:cursor-wait disabled:opacity-60`}><span>{submitting ? copy.loadingAvailability : copy.confirm}</span></button>
                    </div>
                  </section>
                )}
              </form>
            )}
          </section>
        </div>
      </main>
      {fullyBookedTime && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-espresso/35 px-3 pb-3 pt-8 backdrop-blur-[2px] sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setFullyBookedTime(""); }}>
        <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="fully-booked-title" aria-describedby="fully-booked-description" className="relative max-h-[min(90dvh,34rem)] w-full max-w-md overflow-y-auto rounded-[1.35rem] border border-espresso/10 bg-ivory p-5 shadow-[0_24px_70px_-28px_rgba(44,33,28,0.45)] sm:p-7">
          <button ref={closeModalRef} type="button" onClick={() => setFullyBookedTime("")} aria-label={copy.closeDialog} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-espresso-soft transition-colors hover:bg-espresso/5 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"><X size={17} aria-hidden="true" /></button>
          <CalendarDays size={19} strokeWidth={1.5} className="text-espresso-soft" aria-hidden="true" />
          <h2 id="fully-booked-title" className="mt-3 pr-9 text-xl font-semibold tracking-[-0.03em] text-espresso">{copy.fullyBooked}</h2>
          <p id="fully-booked-description" className="mt-2 max-w-sm text-sm leading-6 text-espresso-soft">{copy.fullyBookedCall}</p>
          <a href={dictionary.location.phoneHref} className="site-button site-button-primary mt-4 !min-h-11 w-full gap-2 !bg-[#2c211c] !px-5 !text-white shadow-[0_8px_18px_-14px_rgba(44,33,28,0.7)] hover:!bg-[#3a2922] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"><Phone size={15} strokeWidth={1.8} className="shrink-0 !text-white" aria-hidden="true" /><span className="!text-white">{copy.callCafe}</span></a>
          <div className="my-4 flex items-center gap-3 text-xs text-espresso-soft/70"><span className="h-px flex-1 bg-espresso/10" /><span>{copy.fullyBookedOr}</span><span className="h-px flex-1 bg-espresso/10" /></div>
          <h3 className="text-sm font-medium text-espresso">{copy.alternativeTimes}</h3>
          {availability?.alternativeTimes.length ? <div className="mt-2.5 flex flex-wrap gap-2">{availability.alternativeTimes.slice(0, 3).map((time) => <button key={time} type="button" onClick={() => { setForm((current) => ({ ...current, time })); setErrors((current) => ({ ...current, time: "" })); setFullyBookedTime(""); }} className="min-h-10 min-w-[4.5rem] rounded-lg border border-espresso/15 bg-[#eee9e1]/70 px-4 text-sm font-medium tabular-nums text-espresso outline-none transition-colors hover:border-espresso/35 hover:bg-[#eee9e1] focus-visible:ring-2 focus-visible:ring-brass">{time}</button>)}</div> : null}
        </div>
      </div>}
    </div>
  );
}
