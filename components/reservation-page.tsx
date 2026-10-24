"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Phone, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { BOOKING_CONFIG } from "@/lib/booking-config";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ReservationPageProps = { locale: Locale; dictionary: Dictionary };
type Step = 1 | 2;
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

export function ReservationPage({ locale, dictionary }: ReservationPageProps) {
  const copy = dictionary.reservation.booking;
  const homeHref = locale === "de" ? "/" : "/en";
  const [step, setStep] = useState<Step>(1);
  const [reservationStatus, setReservationStatus] = useState<ReservationStatus | null>(null);
  const [reservationReference, setReservationReference] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
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
  const [submitting, setSubmitting] = useState(false);
  const availableTimes = useMemo(() => availability?.times ?? [], [availability]);

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
    setForm((current) => ({ ...current, date: current.date || today }));
  }, []);

  useEffect(() => {
    if (!form.date || !minDate) return;
    let active = true;
    setAvailabilityLoading(true);
    setAvailabilityError(false);
    fetch(`/api/reservations/availability?date=${encodeURIComponent(form.date)}&guests=${form.guests}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "availability");
        return payload as AvailabilityResponse;
      })
      .then((payload) => { if (active) setAvailability(payload); })
      .catch(() => { if (active) { setAvailability(null); setAvailabilityError(true); } })
      .finally(() => { if (active) setAvailabilityLoading(false); });
    return () => { active = false; };
  }, [form.date, form.guests, minDate]);

  function updateDetails(field: keyof Details, value: string) {
    setForm((current) => ({ ...current, details: { ...current.details, [field]: value } }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validateVisit() {
    const nextErrors: Record<string, string> = {};
    if (!form.date || (minDate && form.date < minDate) || (maxDate && form.date > maxDate)) nextErrors.date = copy.dateRangeError;
    else if (weekday(form.date) === BOOKING_CONFIG.closedWeekday) nextErrors.date = copy.closedDayError;
    if (!form.time || !availableTimes.includes(form.time)) nextErrors.time = copy.timeError;
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
    if (step === 1 && validateVisit()) {
      setErrors({});
      setFullyBookedTime("");
      setStep(2);
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
        setReservationReference(payload.reservationReference);
        setReservationStatus(payload.status === "confirmed" ? "confirmed" : "pending");
      } catch {
        setErrors({ submit: copy.availabilityError });
      } finally {
        setSubmitting(false);
      }
    }
  }

  const inputClass = "mt-2 min-h-[2.85rem] w-full min-w-0 rounded-[0.75rem] border border-espresso/15 bg-[#eee9e1]/75 px-3.5 py-2.5 text-[0.9375rem] font-medium text-espresso outline-none transition-[border-color,background-color,box-shadow] placeholder:text-espresso-soft/55 hover:border-espresso/25 hover:bg-[#eee9e1] focus:border-espresso/40 focus:bg-[#f1ece4] focus:ring-2 focus:ring-espresso/8 md:min-h-12 md:text-base";
  const labelClass = "text-xs font-medium uppercase tracking-[0.08em] text-espresso-soft";
  const errorClass = "mt-2 text-xs text-[#8b3f32]";
  const buttonClass = "site-button site-button-primary";
  const isConfirmed = reservationStatus === "confirmed";
  const durationMinutes = availability?.durationMinutes ?? BOOKING_CONFIG.durationMinutes;

  return (
    <div className="min-h-screen overflow-hidden bg-ivory">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main className="page-gutter py-8 md:py-12 lg:py-16">
        <div className="mx-auto grid max-w-5xl gap-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)] lg:items-start lg:gap-10 xl:gap-14">
          <aside className="hidden lg:block lg:sticky lg:top-8" aria-label={dictionary.reservation.imageAlt}>
            <div className="relative h-[min(76vh,46rem)] min-h-[34rem] overflow-hidden rounded-[2rem] bg-espresso/10">
              <Image src="/booking-cups.jpeg" alt={dictionary.reservation.imageAlt} fill sizes="45vw" className="object-cover object-center" priority />
              <div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" />
            </div>
          </aside>

          <section className="min-w-0">
            {reservationStatus ? (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[1.15rem] bg-espresso/10 lg:hidden">
                <Image src="/booking-cups.jpeg" alt="" fill sizes="calc(100vw - 2.5rem)" className="object-cover object-[62%_center]" />
              </div>
            ) : (
              <header className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-start gap-5 sm:grid-cols-[minmax(0,1fr)_8rem] lg:block">
                <div>
                  <h1 className="editorial-heading max-w-[13ch] text-[clamp(2.35rem,4.8vw,3.85rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-espresso">{copy.title}</h1>
                  <p className="mt-4 max-w-[25rem] text-sm leading-[1.6] text-espresso-soft md:mt-5 md:text-base md:leading-[1.55]">{dictionary.reservation.description}</p>
                </div>
                <div className="relative mt-1 aspect-[0.8] overflow-hidden rounded-[1.1rem] bg-espresso/10 lg:hidden">
                  <Image src="/booking-cups.jpeg" alt="" fill sizes="128px" className="object-cover object-[62%_center]" />
                </div>
              </header>
            )}

            {reservationStatus ? (
              <section aria-live="polite" className="reservation-panel lg:pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-espresso/15 bg-[#eee9e1]/75 text-espresso">
                  <Check size={21} strokeWidth={1.7} aria-hidden="true" />
                </div>
                <h1 className="editorial-heading mt-6 max-w-[13ch] text-[clamp(2.25rem,5vw,3.65rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-espresso">
                  {isConfirmed ? copy.confirmationTitle : copy.pendingTitle}
                </h1>
                <p className="mt-4 max-w-[28rem] text-sm leading-[1.6] text-espresso-soft md:text-base">
                  {isConfirmed ? copy.confirmationBody : copy.pendingBody}
                </p>

                <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-5 rounded-[1.15rem] border border-espresso/10 bg-[#eee9e1]/70 p-4 sm:p-5">
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-[0.68rem] font-medium uppercase tracking-[0.09em] text-espresso-soft/70">{copy.summaryDate}</dt>
                    <dd className="mt-1.5 text-sm font-medium leading-[1.4] text-espresso">{displayDate(form.date, copy.dateFormatLocale)}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-medium uppercase tracking-[0.09em] text-espresso-soft/70">{copy.summaryTime}</dt>
                    <dd className="mt-1.5 text-sm font-medium text-espresso">{form.time}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-medium uppercase tracking-[0.09em] text-espresso-soft/70">{copy.summaryGuests}</dt>
                    <dd className="mt-1.5 text-sm font-medium text-espresso">{form.guests} {copy.guestsSuffix}</dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-[0.68rem] font-medium uppercase tracking-[0.09em] text-espresso-soft/70">{copy.summaryDuration}</dt>
                    <dd className="mt-1.5 text-sm font-medium text-espresso">{durationMinutes} {locale === "de" ? "Minuten" : "minutes"}</dd>
                  </div>
                </dl>

                <p className="mt-4 text-xs leading-5 text-espresso-soft">
                  {copy.confirmationReference}: <span className="font-semibold tracking-[0.04em] text-espresso">{reservationReference}</span>
                </p>
                <Link href={homeHref} className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-espresso px-6 text-sm font-medium text-ivory shadow-[0_12px_24px_-18px_rgba(44,33,28,0.75)] transition-[background-color,box-shadow,transform] hover:-translate-y-px hover:bg-[#3a2922] hover:shadow-[0_16px_28px_-18px_rgba(44,33,28,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
                  {copy.startOver}
                </Link>
              </section>
            ) : (
              <form key={step} onSubmit={submitStep} noValidate className="reservation-panel mt-8 md:mt-10">
                {step === 1 ? (
                  <section aria-labelledby="visit-details-title">
                    <h2 id="visit-details-title" className="sr-only">{copy.stepLabels[0]}</h2>
                    <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
                      <div className="min-w-0">
                        <label htmlFor="visit-date" className={labelClass}>{copy.dateLabel}</label>
                        <input id="visit-date" type="date" min={minDate} max={maxDate} value={form.date} onChange={(event) => { const nextDate = event.target.value; setAvailability(null); setForm((current) => ({ ...current, date: nextDate, time: "" })); setErrors((current) => ({ ...current, date: weekday(nextDate) === BOOKING_CONFIG.closedWeekday ? copy.closedDayError : "", time: "" })); }} className={inputClass} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : undefined} />
                        {errors.date && <p id="date-error" className={errorClass} role="alert">{errors.date}</p>}
                      </div>
                      <div className="min-w-0">
                        <label htmlFor="guest-count" className={labelClass}>{copy.guestsLabel}</label>
                        <div className="relative">
                          <select id="guest-count" value={form.guests} onChange={(event) => { setAvailability(null); setForm((current) => ({ ...current, guests: Number(event.target.value), time: "" })); }} className={`${inputClass} appearance-none pr-6`} aria-label={copy.guestsLabel}>
                            {Array.from({ length: BOOKING_CONFIG.maxGuests }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {copy.guestsSuffix}</option>)}
                          </select>
                          <ChevronDown size={16} strokeWidth={1.5} className="pointer-events-none absolute bottom-4 right-3 text-espresso-soft" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="col-span-2 mt-1">
                        <button type="button" onClick={() => setShowLargePartyInfo((current) => !current)} className="text-sm text-espresso underline decoration-espresso/30 underline-offset-4 transition-colors hover:decoration-espresso">{copy.moreThanSix}</button>
                        {showLargePartyInfo && <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-espresso-soft"><span>{copy.moreThanSixMessage}</span><a href={dictionary.location.phoneHref} className="site-button site-button-secondary min-h-11 gap-2 px-4" aria-label={`${copy.callCafe}: ${dictionary.location.phoneLabel}`}><Phone size={15} strokeWidth={1.5} aria-hidden="true" />{copy.callCafe}</a></div>}
                      </div>
                    </div>

                    <div className="mt-6 md:mt-7">
                      <h3 className={labelClass}>{copy.timeLabel}</h3>
                      <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-espresso-soft">
                        <Clock3 size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" />
                        <span>{copy.durationNotice}</span>
                      </div>
                      <div className="mt-3.5 grid grid-cols-3 gap-2 sm:grid-cols-4" aria-busy={availabilityLoading}>
                        {reservationTimes.map((time) => {
                          const isAvailable = availableTimes.includes(time);
                          const isFull = availability?.fullyBookedTimes.includes(time) ?? false;
                          const isInvalid = !isAvailable && !isFull;
                          const isDisabled = availabilityLoading || isInvalid;
                          return <button key={time} type="button" disabled={isDisabled} onClick={(event) => { setErrors((current) => ({ ...current, time: "" })); if (isFull) { modalOpenerRef.current = event.currentTarget; setForm((current) => ({ ...current, time: "" })); setFullyBookedTime(time); } else { setFullyBookedTime(""); setForm((current) => ({ ...current, time })); } }} className={`min-h-10 w-full rounded-[0.7rem] border px-2 text-xs font-medium tabular-nums outline-none transition-[border-color,background-color,color,transform] focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:min-h-11 sm:text-sm ${form.time === time ? "border-espresso bg-espresso text-ivory" : isFull ? "border-espresso/15 bg-[#eee9e1]/35 text-espresso-soft hover:border-espresso/30 hover:bg-[#eee9e1]/70" : "border-espresso/15 bg-[#eee9e1]/70 text-espresso hover:-translate-y-px hover:border-espresso/35 hover:bg-[#eee9e1]"} disabled:cursor-not-allowed disabled:border-espresso/[0.07] disabled:bg-espresso/[0.025] disabled:text-espresso-soft/25`} aria-pressed={form.time === time} aria-label={isFull ? `${time} — ${copy.fullyBooked}` : time}>{time}{isFull && <span className="ml-1 text-[9px] opacity-70">·</span>}</button>;
                        })}
                      </div>
                      {!fullyBookedTime && <>
                        {availabilityLoading && <p className="mt-3 text-sm text-espresso-soft" role="status">{copy.loadingAvailability}</p>}
                        {!availabilityLoading && availabilityError && <p className="mt-3 text-sm text-[#8b3f32]" role="alert">{copy.availabilityError}</p>}
                        {!availabilityLoading && !availabilityError && availableTimes.length === 0 && <p className="mt-3 text-sm text-espresso-soft">{copy.noTimes}</p>}
                      </>}
                      {errors.time && <p className={errorClass} role="alert">{errors.time}</p>}
                    </div>

                    <button type="submit" disabled={availabilityLoading || !form.time || !availableTimes.includes(form.time)} className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-espresso px-6 text-sm font-medium text-ivory shadow-[0_12px_24px_-18px_rgba(44,33,28,0.8)] outline-none transition-[background-color,box-shadow,transform,opacity] hover:-translate-y-px hover:bg-[#3a2922] hover:shadow-[0_16px_28px_-18px_rgba(44,33,28,0.85)] focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ivory active:translate-y-0 sm:w-auto sm:min-w-40 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none disabled:hover:translate-y-0"><span>{copy.continue}</span><ArrowRight size={15} strokeWidth={1.5} className="ml-2.5" aria-hidden="true" /></button>
                  </section>
                ) : (
                  <section aria-labelledby="contact-details-title">
                    <h2 id="contact-details-title" className="sr-only">{copy.stepLabels[1]}</h2>
                    <dl className="mb-5 grid grid-cols-3 gap-3 border-b border-espresso/15 pb-5 text-sm">
                      <div><dt className="text-xs text-espresso-soft">{copy.summaryDate}</dt><dd className="mt-1 text-espresso">{displayDate(form.date, copy.dateFormatLocale)}</dd></div>
                      <div><dt className="text-xs text-espresso-soft">{copy.summaryTime}</dt><dd className="mt-1 text-espresso">{form.time}</dd></div>
                      <div><dt className="text-xs text-espresso-soft">{copy.summaryGuests}</dt><dd className="mt-1 text-espresso">{form.guests} {copy.guestsSuffix}</dd></div>
                      <div className="col-span-3 flex items-center gap-2 text-xs text-espresso-soft"><Clock3 size={14} strokeWidth={1.5} className="text-olive" aria-hidden="true" /><dt>{copy.summaryDuration}:</dt><dd>{copy.durationNotice}</dd></div>
                    </dl>
                    <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="full-name" className={labelClass}>{copy.fullName}</label>
                        <input id="full-name" value={form.details.fullName} onChange={(event) => updateDetails("fullName", event.target.value)} className={inputClass} autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "full-name-error" : undefined} />
                        {errors.fullName && <p id="full-name-error" className={errorClass} role="alert">{errors.fullName}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className={labelClass}>{copy.email}</label>
                        <input id="email" type="email" value={form.details.email} onChange={(event) => updateDetails("email", event.target.value)} className={inputClass} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
                        {errors.email && <p id="email-error" className={errorClass} role="alert">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="mt-3">
                      <label htmlFor="requests" className={labelClass}>{copy.requests} <span className="normal-case tracking-normal text-espresso-soft/60">({copy.optional})</span></label>
                      <textarea id="requests" rows={2} value={form.details.requests} onChange={(event) => updateDetails("requests", event.target.value)} className={`${inputClass} resize-none`} />
                    </div>
                    {errors.submit && <p className="mt-5 text-sm text-[#8b3f32]" role="alert">{errors.submit}</p>}
                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button type="button" onClick={() => { setErrors({}); setStep(1); }} className="site-button site-button-secondary gap-2"><ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />{copy.back}</button>
                      <button type="submit" disabled={submitting} className={`${buttonClass} w-full sm:w-auto disabled:cursor-wait disabled:opacity-60`}><span>{submitting ? copy.loadingAvailability : copy.confirm}</span><Check size={16} strokeWidth={1.5} className="ml-3" aria-hidden="true" /></button>
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
          <a href={dictionary.location.phoneHref} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-espresso px-5 text-sm font-medium text-ivory shadow-[0_8px_18px_-14px_rgba(44,33,28,0.7)] transition-colors hover:bg-[#3a2922] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"><Phone size={15} strokeWidth={1.6} aria-hidden="true" /><span>{copy.callCafe}</span></a>
          <div className="my-4 flex items-center gap-3 text-xs text-espresso-soft/70"><span className="h-px flex-1 bg-espresso/10" /><span>{copy.fullyBookedOr}</span><span className="h-px flex-1 bg-espresso/10" /></div>
          <h3 className="text-sm font-medium text-espresso">{copy.alternativeTimes}</h3>
          {availability?.alternativeTimes.length ? <div className="mt-2.5 flex flex-wrap gap-2">{availability.alternativeTimes.slice(0, 3).map((time) => <button key={time} type="button" onClick={() => { setForm((current) => ({ ...current, time })); setErrors((current) => ({ ...current, time: "" })); setFullyBookedTime(""); }} className="min-h-10 min-w-[4.5rem] rounded-lg border border-espresso/15 bg-[#eee9e1]/70 px-4 text-sm font-medium tabular-nums text-espresso outline-none transition-colors hover:border-espresso/35 hover:bg-[#eee9e1] focus-visible:ring-2 focus-visible:ring-brass">{time}</button>)}</div> : <p className="mt-1.5 text-sm leading-6 text-espresso-soft">{copy.noTimes}</p>}
        </div>
      </div>}
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
