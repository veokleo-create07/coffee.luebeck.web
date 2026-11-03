import "server-only";

import type { Database } from "@/lib/supabase/database.types";

type EmailJob = Database["public"]["Functions"]["claim_reservation_email_jobs"]["Returns"][number];

const copy = {
  de: {
    confirmationSubject: "Deine Reservierung bei Altstadtliebe",
    cancellationSubject: "Deine Reservierung wurde storniert",
    reminderSubject: "Deine Reservierung morgen bei Altstadtliebe",
    confirmationTitle: "Deine Reservierung ist bestätigt.",
    cancellationTitle: "Deine Reservierung wurde storniert.",
    reminderTitle: "Wir freuen uns morgen auf dich.",
    confirmationBody: "Wir freuen uns auf deinen Besuch in der Altstadtliebe.",
    cancellationBody: "Deine Reservierung wurde storniert. Wenn du Fragen hast, melde dich gerne bei uns.",
    reminderBody: "Nur noch einmal schlafen: Dein Tisch ist morgen für dich reserviert.",
    date: "Datum",
    time: "Uhrzeit",
    guests: "Gäste",
    address: "Mühlenstraße 51, 23552 Lübeck",
    requests: "Hinweis",
    signoff: "Bis bald bei Altstadtliebe",
  },
  en: {
    confirmationSubject: "Your Altstadtliebe reservation",
    cancellationSubject: "Your reservation has been cancelled",
    reminderSubject: "Your Altstadtliebe reservation is tomorrow",
    confirmationTitle: "Your reservation is confirmed.",
    cancellationTitle: "Your reservation has been cancelled.",
    reminderTitle: "We look forward to seeing you tomorrow.",
    confirmationBody: "We look forward to welcoming you at Altstadtliebe in the Old Town.",
    cancellationBody: "Your reservation has been cancelled. Please contact us if you have any questions.",
    reminderBody: "Just a little reminder: your table is reserved for tomorrow.",
    date: "Date",
    time: "Time",
    guests: "Guests",
    address: "Mühlenstraße 51, 23552 Lübeck",
    requests: "Note",
    signoff: "See you soon at Altstadtliebe",
  },
} as const;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[character] ?? character);
}

function formatDate(value: string, language: EmailJob["language"]) {
  return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-GB", {
    dateStyle: "full",
    timeZone: "Europe/Berlin",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" }).format(new Date(value));
}

function contentFor(job: EmailJob) {
  const language = job.language === "en" ? "en" : "de";
  const text = copy[language];
  const title = job.kind === "cancellation" ? text.cancellationTitle : job.kind === "reminder" ? text.reminderTitle : text.confirmationTitle;
  const body = job.kind === "cancellation" ? text.cancellationBody : job.kind === "reminder" ? text.reminderBody : text.confirmationBody;
  const subject = job.kind === "cancellation" ? text.cancellationSubject : job.kind === "reminder" ? text.reminderSubject : text.confirmationSubject;
  const lines = [
    `${text.date}: ${formatDate(job.starts_at, language)}`,
    `${text.time}: ${formatTime(job.starts_at)}`,
    `${text.guests}: ${job.guest_count}`,
    text.address,
    ...(job.special_requests ? [`${text.requests}: ${job.special_requests}`] : []),
  ];
  return { language, text, title, body, subject, lines };
}

export function renderReservationEmail(job: EmailJob) {
  const content = contentFor(job);
  const detailRows = content.lines.map((line, index) => `<tr><td style="padding:${index === 0 ? "0" : "10px 0 0"};font-size:15px;line-height:1.5;color:#5c4b43;">${escapeHtml(line)}</td></tr>`).join("");
  const html = `<!doctype html><html lang="${content.language}"><body style="margin:0;background:#f5f0e8;color:#2c211c;font-family:Arial,Helvetica,sans-serif;"><div style="padding:32px 16px;background:#f5f0e8;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#fffdf9;border:1px solid #e6ded4;"><tr><td style="padding:34px 32px 22px;background:#2c211c;text-align:center;"><div style="font-size:24px;line-height:1;color:#f5f0e8;">♥</div><div style="margin-top:12px;color:#f5f0e8;font-size:22px;letter-spacing:5px;">ALTSTADTLIEBE</div><div style="margin-top:7px;color:#d9cdbd;font-family:Georgia,serif;font-size:14px;font-style:italic;letter-spacing:2px;">breakfast &amp; lunch</div></td></tr><tr><td style="padding:38px 32px 42px;"><h1 style="margin:0;font-size:32px;line-height:1.08;letter-spacing:-1px;font-weight:600;color:#2c211c;">${escapeHtml(content.title)}</h1><p style="margin:18px 0 28px;font-size:16px;line-height:1.6;color:#6d5b51;">${escapeHtml(content.body)}</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:20px;border:1px solid #e6ded4;background:#f8f5ef;">${detailRows}</table><p style="margin:30px 0 0;font-size:15px;line-height:1.5;color:#5c4b43;">${escapeHtml(content.text.signoff)}</p></td></tr><tr><td style="padding:20px 32px 28px;border-top:1px solid #e6ded4;color:#8a786c;font-size:12px;line-height:1.5;">Altstadtliebe · Mühlenstraße 51 · 23552 Lübeck</td></tr></table></div></body></html>`;
  const text = [content.title, "", content.body, "", ...content.lines, "", content.text.signoff, "Altstadtliebe · Mühlenstraße 51 · 23552 Lübeck"].join("\n");
  return { subject: content.subject, html, text };
}
