"use client";

import { ChevronDown, Check } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ReservationPageProps = { locale: Locale; dictionary: Dictionary };
type Details = { firstName: string; lastName: string; email: string; phone: string; requests: string; privacy: boolean };
type FormState = { date: string; guests: number; time: string; details: Details };

const initialDetails: Details = { firstName: "", lastName: "", email: "", phone: "", requests: "", privacy: false };

function dateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mockTimes(date: string) {
  if (!date) return [];
  const day = new Date(`${date}T12:00:00`).getDay();
  const weekdayTimes = ["09:00", "10:30", "12:00", "13:30", "15:00", "17:30", "19:00"];
  const saturdayTimes = ["09:30", "11:00", "12:30", "14:00", "16:00", "18:00"];
  const sundayTimes = ["10:00", "11:30", "13:00", "14:30"];
  return day === 6 ? saturdayTimes : day === 0 ? sundayTimes : weekdayTimes;
}

export function ReservationPage({ locale, dictionary }: ReservationPageProps) {
  const copy = dictionary.reservation.booking;
  const [confirmed, setConfirmed] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [form, setForm] = useState<FormState>({ date: "", guests: 2, time: "", details: initialDetails });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const availableTimes = useMemo(() => mockTimes(form.date), [form.date]);

  useEffect(() => {
    const today = dateInputValue(new Date());
    setMinDate(today);
    setForm((current) => ({ ...current, date: current.date || today }));
  }, []);

  function updateDetails(field: keyof Details, value: string | boolean) {
    setForm((current) => ({ ...current, details: { ...current.details, [field]: value } }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    const { firstName, lastName, email, privacy } = form.details;

    if (!form.date || (minDate && form.date < minDate)) nextErrors.date = copy.dateError;
    if (!form.time) nextErrors.time = copy.timeError;
    if (!firstName.trim()) nextErrors.firstName = copy.requiredError;
    if (!lastName.trim()) nextErrors.lastName = copy.requiredError;
    if (!email.trim()) nextErrors.email = copy.requiredError;
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = copy.emailError;
    if (!privacy) nextErrors.privacy = copy.requiredError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validateForm()) setConfirmed(true);
  }

  function resetBooking() {
    setConfirmed(false);
    setForm({ date: minDate, guests: 2, time: "", details: { ...initialDetails } });
    setErrors({});
  }

  const formattedDate = form.date
    ? new Intl.DateTimeFormat(copy.dateFormatLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${form.date}T12:00:00`))
    : "—";
  const inputClass = "mt-2 min-h-12 w-full min-w-0 rounded-none border-0 border-b border-espresso/25 bg-transparent px-0 py-3 text-base text-espresso outline-none transition-colors placeholder:text-espresso-soft/55 focus:border-espresso";
  const errorClass = "mt-2 text-xs text-[#8b3f32]";
  const buttonClass = "inline-flex min-h-12 items-center justify-center rounded-full bg-espresso px-6 text-sm font-medium text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft active:translate-y-0";

  return (
    <div className="min-h-screen overflow-hidden bg-ivory">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main className="page-gutter py-12 md:py-20">
        <div className="mx-auto max-w-[650px]">
          <header className="mb-10 text-center md:mb-12">
            <p className="eyebrow mb-4">{dictionary.reservation.eyebrow}</p>
            <h1 className="editorial-heading text-[clamp(2.35rem,6vw,4rem)] font-semibold leading-[0.95] text-espresso">{copy.title}</h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-[1.4] text-espresso-soft md:text-lg">{copy.intro}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.1em] text-olive-deep">{copy.demoNotice}</p>
          </header>

          {confirmed ? (
            <section aria-live="polite" className="border-y border-espresso/20 py-10 text-center md:py-12">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory">
                <Check size={20} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <p className="mt-6 text-2xl leading-[1.15] text-espresso md:text-3xl">{copy.confirmationTitle}</p>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-[1.5] text-espresso-soft">{copy.confirmationBody}</p>
              <button type="button" onClick={resetBooking} className={`${buttonClass} mt-7`}>{copy.startOver}</button>
            </section>
          ) : (
            <form onSubmit={submitReservation} noValidate className="border-y border-espresso/20 py-8 md:py-10">
              <section aria-labelledby="visit-details-title">
                <h2 id="visit-details-title" className="sr-only">{copy.stepLabels[0]}</h2>
                <div className="grid grid-cols-2 gap-4 sm:gap-8">
                  <div className="min-w-0">
                    <label htmlFor="visit-date" className="text-sm font-medium text-espresso">{copy.dateLabel}</label>
                    <input id="visit-date" type="date" min={minDate} value={form.date} onChange={(event) => { setForm((current) => ({ ...current, date: event.target.value, time: "" })); setErrors((current) => ({ ...current, date: "", time: "" })); }} className={inputClass} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : undefined} />
                    {errors.date && <p id="date-error" className={errorClass} role="alert">{errors.date}</p>}
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="guest-count" className="text-sm font-medium text-espresso">{copy.guestsLabel}</label>
                    <div className="relative">
                      <select id="guest-count" value={form.guests} onChange={(event) => setForm((current) => ({ ...current, guests: Number(event.target.value) }))} className={`${inputClass} appearance-none pr-6`} aria-label={copy.guestsLabel}>
                        {Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {copy.guestsSuffix}</option>)}
                      </select>
                      <ChevronDown size={16} strokeWidth={1.5} className="pointer-events-none absolute bottom-4 right-0 text-espresso-soft" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                <div className="mt-9">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <label className="text-sm font-medium text-espresso">{copy.timeLabel}</label>
                    <span className="text-[0.68rem] uppercase tracking-[0.08em] text-olive-deep">{copy.mockAvailability}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {availableTimes.map((time) => <button key={time} type="button" onClick={() => { setForm((current) => ({ ...current, time })); setErrors((current) => ({ ...current, time: "" })); }} className={`min-h-12 rounded-full border px-2 text-sm transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] ${form.time === time ? "border-espresso bg-espresso text-ivory" : "border-espresso/25 text-espresso hover:border-espresso hover:bg-espresso/5"}`} aria-pressed={form.time === time}>{time}</button>)}
                  </div>
                  {availableTimes.length === 0 && <p className="mt-3 text-sm text-espresso-soft">{copy.noTimes}</p>}
                  {errors.time && <p className={errorClass} role="alert">{errors.time}</p>}
                </div>
              </section>

              <section aria-labelledby="contact-details-title" className="mt-10 border-t border-espresso/15 pt-8">
                <h2 id="contact-details-title" className="mb-1 text-lg font-medium text-espresso">{copy.summaryDetails}</h2>
                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="text-sm font-medium text-espresso">{copy.firstName}</label>
                    <input id="first-name" value={form.details.firstName} onChange={(event) => updateDetails("firstName", event.target.value)} className={inputClass} autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "first-name-error" : undefined} />
                    {errors.firstName && <p id="first-name-error" className={errorClass} role="alert">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="last-name" className="text-sm font-medium text-espresso">{copy.lastName}</label>
                    <input id="last-name" value={form.details.lastName} onChange={(event) => updateDetails("lastName", event.target.value)} className={inputClass} autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "last-name-error" : undefined} />
                    {errors.lastName && <p id="last-name-error" className={errorClass} role="alert">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-espresso">{copy.email}</label>
                    <input id="email" type="email" value={form.details.email} onChange={(event) => updateDetails("email", event.target.value)} className={inputClass} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
                    {errors.email && <p id="email-error" className={errorClass} role="alert">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium text-espresso">{copy.phone} <span className="text-xs text-espresso-soft/60">({copy.optional})</span></label>
                    <input id="phone" type="tel" value={form.details.phone} onChange={(event) => updateDetails("phone", event.target.value)} className={inputClass} autoComplete="tel" />
                  </div>
                </div>
                <div className="mt-5">
                  <label htmlFor="requests" className="text-sm font-medium text-espresso">{copy.requests} <span className="text-xs text-espresso-soft/60">({copy.optional})</span></label>
                  <textarea id="requests" rows={2} value={form.details.requests} onChange={(event) => updateDetails("requests", event.target.value)} className={`${inputClass} resize-none`} />
                </div>
                <label className="mt-6 flex min-h-11 items-start gap-3 text-sm leading-[1.4] text-espresso-soft">
                  <input type="checkbox" checked={form.details.privacy} onChange={(event) => updateDetails("privacy", event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-espresso" aria-invalid={Boolean(errors.privacy)} />
                  <span>{copy.privacyText}<span className="sr-only"> {copy.privacy}</span></span>
                </label>
                {errors.privacy && <p className={errorClass} role="alert">{errors.privacy}</p>}
              </section>

              <aside aria-labelledby="summary-title" className="mt-9 border-t border-espresso/15 pt-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id="summary-title" className="eyebrow">{copy.review}</h2>
                  <span className="text-xs text-espresso-soft/70">{copy.demoNotice}</span>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-3 text-sm text-espresso">
                  <div><dt className="text-xs text-espresso-soft">{copy.summaryDate}</dt><dd className="mt-1 leading-[1.25]">{formattedDate}</dd></div>
                  <div><dt className="text-xs text-espresso-soft">{copy.summaryTime}</dt><dd className="mt-1">{form.time || "—"}</dd></div>
                  <div><dt className="text-xs text-espresso-soft">{copy.summaryGuests}</dt><dd className="mt-1">{form.guests} {copy.guestsSuffix}</dd></div>
                </dl>
              </aside>

              <button type="submit" className={`${buttonClass} mt-8 w-full`}>{copy.confirm}</button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
