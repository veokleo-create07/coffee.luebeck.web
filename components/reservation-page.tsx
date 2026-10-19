"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock3, Phone } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { BOOKING_CONFIG } from "@/lib/booking-config";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ReservationPageProps = { locale: Locale; dictionary: Dictionary };
type Step = 1 | 2;
type Details = { fullName: string; email: string; requests: string };
type FormState = { date: string; guests: number; time: string; details: Details };

const initialDetails: Details = { fullName: "", email: "", requests: "" };

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

function mockTimes(date: string) {
  if (!date || weekday(date) === BOOKING_CONFIG.closedWeekday) return [];
  const start = 9 * 60;
  const end = 17 * 60;
  return Array.from({ length: (end - start) / BOOKING_CONFIG.intervalMinutes + 1 }, (_, index) => {
    const minutes = start + index * BOOKING_CONFIG.intervalMinutes;
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  });
}

function berlinTimeInMinutes() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: BOOKING_CONFIG.timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  return Number(parts.find((part) => part.type === "hour")?.value ?? 0) * 60 + Number(parts.find((part) => part.type === "minute")?.value ?? 0);
}

function isPastTime(date: string, time: string, today: string) {
  if (date !== today) return false;
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute <= berlinTimeInMinutes();
}

function displayDate(date: string, locale: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Europe/Berlin" }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function ReservationPage({ locale, dictionary }: ReservationPageProps) {
  const copy = dictionary.reservation.booking;
  const [step, setStep] = useState<Step>(1);
  const [confirmed, setConfirmed] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [showLargePartyInfo, setShowLargePartyInfo] = useState(false);
  const [form, setForm] = useState<FormState>({ date: "", guests: 2, time: "", details: initialDetails });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const availableTimes = useMemo(() => mockTimes(form.date), [form.date]);

  useEffect(() => {
    const today = dateInputValue(new Date());
    setMinDate(today);
    setMaxDate(addMonths(today, BOOKING_CONFIG.maxMonthsAhead));
    setForm((current) => ({ ...current, date: current.date || today }));
  }, []);

  function updateDetails(field: keyof Details, value: string) {
    setForm((current) => ({ ...current, details: { ...current.details, [field]: value } }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validateVisit() {
    const nextErrors: Record<string, string> = {};
    if (!form.date || (minDate && form.date < minDate) || (maxDate && form.date > maxDate)) nextErrors.date = copy.dateRangeError;
    else if (weekday(form.date) === BOOKING_CONFIG.closedWeekday) nextErrors.date = copy.closedDayError;
    if (!form.time || !availableTimes.includes(form.time) || isPastTime(form.date, form.time, minDate)) nextErrors.time = copy.timeError;
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

  function submitStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1 && validateVisit()) {
      setErrors({});
      setStep(2);
    }
    if (step === 2 && validateDetails()) setConfirmed(true);
  }

  function resetBooking() {
    setConfirmed(false);
    setStep(1);
    setForm({ date: minDate, guests: 2, time: "", details: { ...initialDetails } });
    setShowLargePartyInfo(false);
    setErrors({});
  }

  const inputClass = "mt-2 min-h-11 w-full min-w-0 rounded-none border-0 border-b border-espresso/25 bg-transparent px-0 py-2.5 text-base text-espresso outline-none transition-colors placeholder:text-espresso-soft/55 focus:border-espresso";
  const errorClass = "mt-2 text-xs text-[#8b3f32]";
  const buttonClass = "site-button site-button-primary";

  return (
    <div className="min-h-screen overflow-hidden bg-ivory">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main className="page-gutter py-8 md:py-12 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(32rem,1.08fr)] lg:items-start lg:gap-14 xl:gap-20">
          <aside className="hidden lg:block lg:sticky lg:top-8" aria-label={dictionary.reservation.imageAlt}>
            <div className="relative h-[min(76vh,46rem)] min-h-[34rem] overflow-hidden rounded-[2rem] bg-espresso/10">
              <Image src="/altstadtliebe-interior.png" alt={dictionary.reservation.imageAlt} fill sizes="45vw" className="object-cover object-center" priority />
              <div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" />
            </div>
            <p className="eyebrow mt-4">Altstadtliebe · Lübeck</p>
          </aside>

          <section className="min-w-0">
            <header className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-start gap-5 sm:grid-cols-[minmax(0,1fr)_8rem] lg:block">
              <div>
                <h1 className="editorial-heading max-w-[12ch] text-[clamp(2.5rem,6vw,4.8rem)] font-semibold leading-[0.9] text-espresso">{copy.title}</h1>
              </div>
              <div className="relative mt-1 aspect-[0.8] overflow-hidden rounded-[1.1rem] bg-espresso/10 lg:hidden">
                <Image src="/altstadtliebe-interior.png" alt="" fill sizes="128px" className="object-cover object-[62%_center]" />
              </div>
            </header>

            {confirmed ? (
              <section aria-live="polite" className="reservation-panel mt-10 border-y border-espresso/20 py-10 text-center md:mt-12 md:py-12">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory">
                  <Check size={20} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className="mt-6 text-2xl leading-[1.15] text-espresso md:text-3xl">{copy.confirmationTitle}</p>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-[1.5] text-espresso-soft">{copy.confirmationBody}</p>
                <button type="button" onClick={resetBooking} className={`${buttonClass} mt-7`}>{copy.startOver}</button>
              </section>
            ) : (
              <form key={step} onSubmit={submitStep} noValidate className="reservation-panel mt-6 border-y border-espresso/20 py-6 md:mt-8 md:py-8">
                {step === 1 ? (
                  <section aria-labelledby="visit-details-title">
                    <h2 id="visit-details-title" className="sr-only">{copy.stepLabels[0]}</h2>
                    <div className="grid grid-cols-2 gap-4 sm:gap-8">
                      <div className="min-w-0">
                        <label htmlFor="visit-date" className="text-sm font-medium text-espresso">{copy.dateLabel}</label>
                        <input id="visit-date" type="date" min={minDate} max={maxDate} value={form.date} onChange={(event) => { const nextDate = event.target.value; setForm((current) => ({ ...current, date: nextDate, time: "" })); setErrors((current) => ({ ...current, date: weekday(nextDate) === BOOKING_CONFIG.closedWeekday ? copy.closedDayError : "", time: "" })); }} className={inputClass} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : undefined} />
                        {errors.date && <p id="date-error" className={errorClass} role="alert">{errors.date}</p>}
                      </div>
                      <div className="min-w-0">
                        <label htmlFor="guest-count" className="text-sm font-medium text-espresso">{copy.guestsLabel}</label>
                        <div className="relative">
                          <select id="guest-count" value={form.guests} onChange={(event) => setForm((current) => ({ ...current, guests: Number(event.target.value) }))} className={`${inputClass} appearance-none pr-6`} aria-label={copy.guestsLabel}>
                            {Array.from({ length: BOOKING_CONFIG.maxGuests }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {copy.guestsSuffix}</option>)}
                          </select>
                          <ChevronDown size={16} strokeWidth={1.5} className="pointer-events-none absolute bottom-4 right-0 text-espresso-soft" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="col-span-2 mt-1">
                        <button type="button" onClick={() => setShowLargePartyInfo((current) => !current)} className="text-sm text-espresso underline decoration-espresso/30 underline-offset-4 transition-colors hover:decoration-espresso">{copy.moreThanSix}</button>
                        {showLargePartyInfo && <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-espresso-soft"><span>{copy.moreThanSixMessage}</span><a href={dictionary.location.phoneHref} className="site-button site-button-secondary min-h-11 gap-2 px-4" aria-label={`${copy.callCafe}: ${dictionary.location.phoneLabel}`}><Phone size={15} strokeWidth={1.5} aria-hidden="true" />{copy.callCafe}</a></div>}
                      </div>
                    </div>

                    <div className="mt-9">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <label className="text-sm font-medium text-espresso">{copy.timeLabel}</label>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {availableTimes.map((time) => { const disabled = isPastTime(form.date, time, minDate); return <button key={time} type="button" disabled={disabled} onClick={() => { setForm((current) => ({ ...current, time })); setErrors((current) => ({ ...current, time: "" })); }} className={`site-button min-h-12 w-full border px-2 text-sm ${form.time === time ? "site-button-primary border-espresso" : "site-button-secondary border-espresso/25 hover:border-espresso"} disabled:cursor-not-allowed disabled:opacity-35`} aria-pressed={form.time === time}>{time}</button>; })}
                      </div>
                      {availableTimes.length === 0 && <p className="mt-3 text-sm text-espresso-soft">{copy.noTimes}</p>}
                      {errors.time && <p className={errorClass} role="alert">{errors.time}</p>}
                      {availableTimes.length > 0 && <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-espresso-soft"><Clock3 size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" /><span>{copy.durationNotice}</span></div>}
                    </div>

                    <button type="submit" className={`${buttonClass} mt-9 w-full sm:w-auto sm:min-w-44`}><span>{copy.continue}</span><ArrowRight size={16} strokeWidth={1.5} className="ml-3" aria-hidden="true" /></button>
                  </section>
                ) : (
                  <section aria-labelledby="contact-details-title">
                    <h2 id="contact-details-title" className="sr-only">{copy.stepLabels[1]}</h2>
                    <dl className="mb-7 grid grid-cols-3 gap-3 border-b border-espresso/15 pb-6 text-sm">
                      <div><dt className="text-xs text-espresso-soft">{copy.summaryDate}</dt><dd className="mt-1 text-espresso">{displayDate(form.date, copy.dateFormatLocale)}</dd></div>
                      <div><dt className="text-xs text-espresso-soft">{copy.summaryTime}</dt><dd className="mt-1 text-espresso">{form.time}</dd></div>
                      <div><dt className="text-xs text-espresso-soft">{copy.summaryGuests}</dt><dd className="mt-1 text-espresso">{form.guests} {copy.guestsSuffix}</dd></div>
                      <div className="col-span-3 flex items-center gap-2 text-xs text-espresso-soft"><Clock3 size={14} strokeWidth={1.5} className="text-olive" aria-hidden="true" /><dt>{copy.summaryDuration}:</dt><dd>{copy.durationNotice}</dd></div>
                    </dl>
                    <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="full-name" className="text-sm font-medium text-espresso">{copy.fullName}</label>
                        <input id="full-name" value={form.details.fullName} onChange={(event) => updateDetails("fullName", event.target.value)} className={inputClass} autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "full-name-error" : undefined} />
                        {errors.fullName && <p id="full-name-error" className={errorClass} role="alert">{errors.fullName}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="text-sm font-medium text-espresso">{copy.email}</label>
                        <input id="email" type="email" value={form.details.email} onChange={(event) => updateDetails("email", event.target.value)} className={inputClass} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
                        {errors.email && <p id="email-error" className={errorClass} role="alert">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="requests" className="text-sm font-medium text-espresso">{copy.requests} <span className="text-xs text-espresso-soft/60">({copy.optional})</span></label>
                      <textarea id="requests" rows={2} value={form.details.requests} onChange={(event) => updateDetails("requests", event.target.value)} className={`${inputClass} resize-none`} />
                    </div>
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button type="button" onClick={() => { setErrors({}); setStep(1); }} className="site-button site-button-secondary gap-2"><ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />{copy.back}</button>
                      <button type="submit" className={`${buttonClass} w-full sm:w-auto`}><span>{copy.confirm}</span><Check size={16} strokeWidth={1.5} className="ml-3" aria-hidden="true" /></button>
                    </div>
                  </section>
                )}
              </form>
            )}
          </section>
        </div>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
