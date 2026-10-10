"use client";

import gsap from "gsap";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ReservationPageProps = { locale: Locale; dictionary: Dictionary };
type Step = 1 | 2 | 3;
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
  const pageRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const direction = useRef(1);
  const [step, setStep] = useState<Step>(1);
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

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(panel, { autoAlpha: 1, clearProps: "transform" });
      return;
    }
    gsap.fromTo(panel, { autoAlpha: 0, x: direction.current * 18 }, { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out" });
  }, [step, confirmed]);

  function updateDetails(field: keyof Details, value: string | boolean) {
    setForm((current) => ({ ...current, details: { ...current.details, [field]: value } }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validateVisit() {
    const nextErrors: Record<string, string> = {};
    if (!form.date || (minDate && form.date < minDate)) nextErrors.date = copy.dateError;
    if (!form.time) nextErrors.time = copy.timeError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateDetails() {
    const nextErrors: Record<string, string> = {};
    const { firstName, lastName, email, privacy } = form.details;
    if (!firstName.trim()) nextErrors.firstName = copy.requiredError;
    if (!lastName.trim()) nextErrors.lastName = copy.requiredError;
    if (!email.trim()) nextErrors.email = copy.requiredError;
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = copy.emailError;
    if (!privacy) nextErrors.privacy = copy.requiredError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goTo(nextStep: Step) {
    direction.current = nextStep > step ? 1 : -1;
    setErrors({});
    setStep(nextStep);
  }

  function submitStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1 && validateVisit()) goTo(2);
    if (step === 2 && validateDetails()) goTo(3);
  }

  function confirmReservation() {
    setConfirmed(true);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function resetBooking() {
    setConfirmed(false);
    setStep(1);
    setForm({ date: minDate, guests: 2, time: "", details: initialDetails });
    setErrors({});
  }

  const formattedDate = form.date ? new Intl.DateTimeFormat(copy.dateFormatLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${form.date}T12:00:00`)) : "—";
  const inputClass = "mt-3 w-full rounded-none border-0 border-b border-espresso/25 bg-transparent px-0 py-3 text-base text-espresso outline-none transition-colors placeholder:text-espresso-soft/55 focus:border-espresso";
  const errorClass = "mt-2 text-xs text-[#8b3f32]";

  return <div className="min-h-screen overflow-hidden bg-ivory"><SiteHeader locale={locale} dictionary={dictionary} /><main ref={pageRef} className="page-gutter py-16 md:py-24"><div className="mx-auto max-w-6xl"><header className="max-w-3xl"><p className="eyebrow mb-7">{dictionary.reservation.eyebrow}</p><h1 className="editorial-heading max-w-[10ch] text-[clamp(3.75rem,8vw,8rem)] font-medium leading-[0.84] text-espresso">{copy.title}</h1><p className="mt-8 max-w-md text-lg leading-[1.35] text-espresso-soft md:text-xl">{copy.intro}</p></header><div className="mt-16 grid gap-14 border-t border-espresso/20 pt-8 md:mt-24 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-20"><aside aria-label="Booking progress"><ol className="flex gap-7 md:block md:space-y-7">{copy.stepLabels.map((label, index) => { const itemStep = (index + 1) as Step; const active = !confirmed && step === itemStep; const complete = confirmed || step > itemStep; return <li key={label} className={`relative flex items-center gap-3 text-xs uppercase tracking-[0.12em] transition-colors ${active ? "text-espresso" : "text-espresso-soft/55"}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.65rem] ${active ? "border-espresso bg-espresso text-ivory" : complete ? "border-olive bg-olive text-ivory" : "border-espresso/25"}`}>{complete ? <Check size={13} strokeWidth={2} aria-hidden="true" /> : `0${itemStep}`}</span><span className="hidden md:inline">{label}</span>{index < copy.stepLabels.length - 1 && <span className="hidden md:block absolute left-3.5 top-8 h-7 w-px bg-espresso/15" aria-hidden="true" />}</li>; })}</ol></aside><div ref={panelRef} className="min-w-0"><div className="mb-7 flex items-start justify-between gap-6"><div><p className="eyebrow text-olive-deep">{confirmed ? copy.confirmationTitle : copy.stepLabels[step - 1]}</p><p className="mt-3 max-w-xl text-sm uppercase tracking-[0.1em] text-espresso-soft/65">{copy.demoNotice}</p></div>{!confirmed && <span className="text-xs tabular-nums text-espresso-soft/60">0{step} / 03</span>}</div>{confirmed ? <section aria-live="polite" className="max-w-2xl border-t border-espresso/20 pt-8"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-olive text-ivory"><Check size={21} strokeWidth={1.5} aria-hidden="true" /></div><p className="mt-8 max-w-xl text-2xl leading-[1.15] text-espresso md:text-4xl">{copy.confirmationBody}</p><button type="button" onClick={resetBooking} className="group mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-espresso px-6 text-sm font-medium text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft active:translate-y-0"><span>{copy.startOver}</span><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" /></button></section> : <form onSubmit={submitStep} noValidate>{step === 1 && <section aria-labelledby="visit-step-title"><h2 id="visit-step-title" className="sr-only">{copy.stepLabels[0]}</h2><div className="grid gap-10 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-end"><div><label htmlFor="visit-date" className="text-sm font-medium text-espresso">{copy.dateLabel}</label><input id="visit-date" type="date" min={minDate} value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value, time: "" }))} className={inputClass} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : undefined} />{errors.date && <p id="date-error" className={errorClass} role="alert">{errors.date}</p>}</div><div><label htmlFor="guest-count" className="text-sm font-medium text-espresso">{copy.guestsLabel}</label><div className="relative"><select id="guest-count" value={form.guests} onChange={(event) => setForm((current) => ({ ...current, guests: Number(event.target.value) }))} className={`${inputClass} appearance-none pr-8`} aria-label={copy.guestsLabel}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {copy.guestsSuffix}</option>)}</select><ChevronDown size={16} strokeWidth={1.5} className="pointer-events-none absolute bottom-4 right-0 text-espresso-soft" aria-hidden="true" /></div></div></div><div className="mt-12"><div className="flex flex-wrap items-baseline justify-between gap-3"><label className="text-sm font-medium text-espresso">{copy.timeLabel}</label><span className="text-xs uppercase tracking-[0.1em] text-espresso-soft/60">{copy.mockAvailability}</span></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{availableTimes.map((time) => <button key={time} type="button" onClick={() => { setForm((current) => ({ ...current, time })); setErrors((current) => ({ ...current, time: "" })); }} className={`min-h-12 border px-4 text-sm transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] ${form.time === time ? "border-espresso bg-espresso text-ivory" : "border-espresso/25 text-espresso hover:border-espresso hover:bg-espresso/5"}`} aria-pressed={form.time === time}>{time}</button>)}</div>{availableTimes.length === 0 && <p className="mt-4 text-sm text-espresso-soft">{copy.noTimes}</p>}{errors.time && <p className={errorClass} role="alert">{errors.time}</p>}</div><div className="mt-12 flex justify-end"><button type="submit" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-espresso px-6 text-sm font-medium text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft active:translate-y-0"><span>{copy.continue}</span><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" /></button></div></section>}{step === 2 && <section aria-labelledby="details-step-title"><h2 id="details-step-title" className="sr-only">{copy.stepLabels[1]}</h2><div className="grid gap-8 sm:grid-cols-2"><div><label htmlFor="first-name" className="text-sm font-medium text-espresso">{copy.firstName}</label><input id="first-name" value={form.details.firstName} onChange={(event) => updateDetails("firstName", event.target.value)} className={inputClass} autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} />{errors.firstName && <p className={errorClass} role="alert">{errors.firstName}</p>}</div><div><label htmlFor="last-name" className="text-sm font-medium text-espresso">{copy.lastName}</label><input id="last-name" value={form.details.lastName} onChange={(event) => updateDetails("lastName", event.target.value)} className={inputClass} autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} />{errors.lastName && <p className={errorClass} role="alert">{errors.lastName}</p>}</div><div><label htmlFor="email" className="text-sm font-medium text-espresso">{copy.email}</label><input id="email" type="email" value={form.details.email} onChange={(event) => updateDetails("email", event.target.value)} className={inputClass} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <p className={errorClass} role="alert">{errors.email}</p>}</div><div><label htmlFor="phone" className="text-sm font-medium text-espresso">{copy.phone} <span className="text-xs text-espresso-soft/60">({copy.optional})</span></label><input id="phone" type="tel" value={form.details.phone} onChange={(event) => updateDetails("phone", event.target.value)} className={inputClass} autoComplete="tel" /></div></div><div className="mt-9"><label htmlFor="requests" className="text-sm font-medium text-espresso">{copy.requests} <span className="text-xs text-espresso-soft/60">({copy.optional})</span></label><textarea id="requests" rows={3} value={form.details.requests} onChange={(event) => updateDetails("requests", event.target.value)} className={`${inputClass} resize-none`} /></div><label className="mt-9 flex items-start gap-3 text-sm leading-[1.35] text-espresso-soft"><input type="checkbox" checked={form.details.privacy} onChange={(event) => updateDetails("privacy", event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-espresso" aria-invalid={Boolean(errors.privacy)} /> <span>{copy.privacyText}<span className="sr-only"> {copy.privacy}</span></span></label>{errors.privacy && <p className={errorClass} role="alert">{errors.privacy}</p>}<div className="mt-12 flex flex-wrap items-center justify-between gap-4"><button type="button" onClick={() => goTo(1)} className="inline-flex min-h-12 items-center gap-2 text-sm font-medium text-espresso-soft transition-colors hover:text-espresso"><ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />{copy.back}</button><button type="submit" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-espresso px-6 text-sm font-medium text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft active:translate-y-0"><span>{copy.review}</span><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" /></button></div></section>}{step === 3 && <section aria-labelledby="review-step-title"><h2 id="review-step-title" className="sr-only">{copy.stepLabels[2]}</h2><div className="grid gap-8 border-t border-espresso/20 pt-7 sm:grid-cols-3"><div><p className="eyebrow mb-3">{copy.summaryDate}</p><p className="text-lg text-espresso">{formattedDate}</p><button type="button" onClick={() => goTo(1)} className="mt-2 text-xs uppercase tracking-[0.1em] text-espresso-soft underline decoration-brass underline-offset-4 transition-colors hover:text-espresso">{copy.edit}</button></div><div><p className="eyebrow mb-3">{copy.summaryTime}</p><p className="text-lg text-espresso">{form.time}</p><button type="button" onClick={() => goTo(1)} className="mt-2 text-xs uppercase tracking-[0.1em] text-espresso-soft underline decoration-brass underline-offset-4 transition-colors hover:text-espresso">{copy.edit}</button></div><div><p className="eyebrow mb-3">{copy.summaryGuests}</p><p className="text-lg text-espresso">{form.guests} {copy.guestsSuffix}</p><button type="button" onClick={() => goTo(1)} className="mt-2 text-xs uppercase tracking-[0.1em] text-espresso-soft underline decoration-brass underline-offset-4 transition-colors hover:text-espresso">{copy.edit}</button></div></div><div className="mt-12 border-t border-espresso/20 pt-7"><div className="flex items-center justify-between"><p className="eyebrow">{copy.summaryDetails}</p><button type="button" onClick={() => goTo(2)} className="text-xs uppercase tracking-[0.1em] text-espresso-soft underline decoration-brass underline-offset-4 transition-colors hover:text-espresso">{copy.edit}</button></div><dl className="mt-5 grid gap-3 text-base text-espresso sm:grid-cols-2"><div><dt className="sr-only">{copy.firstName}</dt><dd>{form.details.firstName} {form.details.lastName}</dd></div><div><dt className="sr-only">{copy.email}</dt><dd>{form.details.email}</dd></div>{form.details.phone && <div><dt className="sr-only">{copy.phone}</dt><dd>{form.details.phone}</dd></div>}{form.details.requests && <div className="sm:col-span-2"><dt className="sr-only">{copy.requests}</dt><dd>{form.details.requests}</dd></div>}</dl></div><div className="mt-12 flex flex-wrap items-center justify-between gap-4"><button type="button" onClick={() => goTo(2)} className="inline-flex min-h-12 items-center gap-2 text-sm font-medium text-espresso-soft transition-colors hover:text-espresso"><ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />{copy.back}</button><button type="button" onClick={confirmReservation} className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-espresso px-6 text-sm font-medium text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft active:translate-y-0"><span>{copy.confirm}</span><Check size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:scale-110" /></button></div></section>}</form>}</div></div></div></main><SiteFooter locale={locale} dictionary={dictionary} /></div>;
}
