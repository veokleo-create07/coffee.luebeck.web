"use client";

import Link from "next/link";
import { CalendarDays, Clock3, Mail, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteHeader } from "./site-header";

type ManagedReservation = {
  customerName: string;
  customerEmail: string;
  guestCount: number;
  startsAt: string;
  endsAt: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  language: Locale;
  canCancel: boolean;
};

const pageCopy = {
  de: {
    eyebrow: "Deine Reservierung",
    title: "Reservierung verwalten.",
    loading: "Reservierung wird geladen …",
    invalidTitle: "Dieser Link ist nicht gültig.",
    invalidBody: "Bitte öffne den Link direkt aus deiner Bestätigungs-E-Mail oder ruf uns an.",
    errorTitle: "Das hat leider nicht funktioniert.",
    errorBody: "Bitte versuche es später erneut oder ruf uns an.",
    name: "Name",
    date: "Datum",
    time: "Uhrzeit",
    guests: "Gäste",
    email: "E-Mail",
    status: "Status",
    confirmed: "Bestätigt",
    pending: "Ausstehend",
    cancelled: "Storniert",
    completed: "Abgeschlossen",
    cancel: "Reservierung stornieren",
    confirmTitle: "Möchtest du wirklich stornieren?",
    confirmBody: "Dein Tisch wird sofort freigegeben. Diese Aktion kann nicht rückgängig gemacht werden.",
    keep: "Reservierung behalten",
    confirmCancel: "Ja, Reservierung stornieren",
    cancelling: "Wird storniert …",
    cancelledTitle: "Deine Reservierung wurde storniert.",
    cancelledBody: "Dein Tisch wurde wieder freigegeben.",
    unavailable: "Diese Reservierung kann online nicht mehr storniert werden. Bitte ruf uns an, wenn du Hilfe brauchst.",
    home: "Zur Startseite",
  },
  en: {
    eyebrow: "Your reservation",
    title: "Manage your reservation.",
    loading: "Loading your reservation …",
    invalidTitle: "This link is not valid.",
    invalidBody: "Please open the link directly from your confirmation email or call us.",
    errorTitle: "Something went wrong.",
    errorBody: "Please try again later or call us.",
    name: "Name",
    date: "Date",
    time: "Time",
    guests: "Guests",
    email: "Email",
    status: "Status",
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
    completed: "Completed",
    cancel: "Cancel reservation",
    confirmTitle: "Are you sure you want to cancel?",
    confirmBody: "Your table will be released immediately. This action cannot be undone.",
    keep: "Keep reservation",
    confirmCancel: "Yes, cancel reservation",
    cancelling: "Cancelling …",
    cancelledTitle: "Your reservation was cancelled.",
    cancelledBody: "Your table has been released.",
    unavailable: "This reservation can no longer be cancelled online. Please call us if you need help.",
    home: "Back to homepage",
  },
} as const;

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" }).format(new Date(value));
}

export function ManageReservationPage({ locale, dictionary, token }: { locale: Locale; dictionary: Dictionary; token: string }) {
  const copy = pageCopy[locale];
  const [reservation, setReservation] = useState<ManagedReservation | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "invalid" | "error">("loading");
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const homeHref = locale === "de" ? "/" : "/en";
  const otherPath = locale === "de" ? "/en/manage-reservation" : "/manage-reservation";
  const languageHref = `${otherPath}?token=${encodeURIComponent(token)}`;

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }

    const controller = new AbortController();
    fetch(`/api/reservations/manage?token=${encodeURIComponent(token)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as { reservation?: ManagedReservation };
        if (!response.ok || !payload.reservation) throw new Error(response.status === 400 || response.status === 404 ? "invalid" : "server");
        setReservation(payload.reservation);
        setState("ready");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState(error instanceof Error && error.message === "invalid" ? "invalid" : "error");
      });
    return () => controller.abort();
  }, [token]);

  const statusLabel = useMemo(() => reservation ? copy[reservation.status] : "", [copy, reservation]);

  async function cancelReservation() {
    if (cancelling) return;
    setCancelling(true);
    try {
      const response = await fetch("/api/reservations/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action: "cancel" }),
      });
      const payload = await response.json() as { reservation?: ManagedReservation };
      if (!response.ok || !payload.reservation) throw new Error("cancel_failed");
      setReservation(payload.reservation);
      setConfirming(false);
    } catch {
      setState("error");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-ivory text-espresso">
      <SiteHeader locale={locale} dictionary={dictionary} languageHref={languageHref} />
      <main className="page-gutter mx-auto flex w-full max-w-4xl flex-col pb-20 pt-16 md:pb-28 md:pt-24">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="editorial-heading mt-5 max-w-3xl text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.06em]">{copy.title}</h1>

        {state === "loading" && <p className="mt-12 text-lg text-espresso-soft" aria-live="polite">{copy.loading}</p>}

        {(state === "invalid" || state === "error") && (
          <section className="mt-12 rounded-[1.5rem] bg-[#eee9e1] p-7 md:p-10" aria-live="polite">
            <h2 className="text-2xl font-semibold">{state === "invalid" ? copy.invalidTitle : copy.errorTitle}</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-espresso-soft">{state === "invalid" ? copy.invalidBody : copy.errorBody}</p>
            <a href="tel:+4945161917800" className="site-button site-button-primary mt-7">0451 61917800</a>
          </section>
        )}

        {state === "ready" && reservation && (
          <div className="mt-12">
            {reservation.status === "cancelled" && (
              <section className="mb-6 rounded-[1.5rem] bg-[#eee9e1] p-7 md:p-9" aria-live="polite">
                <h2 className="text-2xl font-semibold">{copy.cancelledTitle}</h2>
                <p className="mt-3 text-espresso-soft">{copy.cancelledBody}</p>
              </section>
            )}

            <section className="overflow-hidden rounded-[1.5rem] border border-espresso/10 bg-white/70 p-6 md:p-9">
              <dl className="grid gap-0">
                {[
                  { icon: CalendarDays, label: copy.date, value: formatDate(reservation.startsAt, locale) },
                  { icon: Clock3, label: copy.time, value: formatTime(reservation.startsAt) },
                  { icon: Users, label: copy.guests, value: String(reservation.guestCount) },
                  { icon: Mail, label: copy.email, value: reservation.customerEmail },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="grid grid-cols-[1.5rem_1fr] gap-x-4 border-b border-espresso/10 py-5 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[1.5rem_9rem_1fr] md:items-center">
                    <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                    <dt className="text-sm font-semibold uppercase tracking-[0.08em] text-espresso-soft">{label}</dt>
                    <dd className="col-start-2 mt-1 break-words text-lg font-medium md:col-start-3 md:mt-0">{value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[1.5rem_1fr] gap-x-4 pt-5 md:grid-cols-[1.5rem_9rem_1fr] md:items-center">
                  <span aria-hidden="true" className="h-3 w-3 self-center rounded-full bg-olive" />
                  <dt className="text-sm font-semibold uppercase tracking-[0.08em] text-espresso-soft">{copy.status}</dt>
                  <dd className="col-start-2 mt-1 text-lg font-semibold md:col-start-3 md:mt-0">{statusLabel}</dd>
                </div>
              </dl>
            </section>

            {reservation.canCancel && !confirming && (
              <button type="button" onClick={() => setConfirming(true)} className="site-button site-button-primary mt-7 w-full md:w-auto">{copy.cancel}</button>
            )}

            {reservation.canCancel && confirming && (
              <section className="mt-7 rounded-[1.5rem] bg-espresso p-7 text-ivory md:p-9" aria-live="polite">
                <h2 className="text-2xl font-semibold">{copy.confirmTitle}</h2>
                <p className="mt-3 max-w-xl leading-relaxed text-ivory/75">{copy.confirmBody}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => setConfirming(false)} disabled={cancelling} className="site-button bg-ivory text-espresso disabled:opacity-50">{copy.keep}</button>
                  <button type="button" onClick={cancelReservation} disabled={cancelling} className="site-button border border-ivory/35 text-ivory disabled:opacity-50">{cancelling ? copy.cancelling : copy.confirmCancel}</button>
                </div>
              </section>
            )}

            {!reservation.canCancel && reservation.status !== "cancelled" && <p className="mt-7 max-w-2xl leading-relaxed text-espresso-soft">{copy.unavailable}</p>}
          </div>
        )}

        <Link href={homeHref} className="mt-10 self-start text-sm font-semibold underline decoration-espresso/30 underline-offset-4 hover:decoration-espresso">{copy.home}</Link>
      </main>
    </div>
  );
}
