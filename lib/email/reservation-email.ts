import "server-only";

export type ReservationEmailKind = "confirmation" | "cancellation";

export type ReservationEmailData = {
  reservationId: string;
  customerName: string;
  customerEmail: string;
  guestCount: number;
  startsAt: string;
  endsAt: string;
  specialRequests: string | null;
  language: "de" | "en";
};

const address = "Mühlenstraße 51, 23552 Lübeck";
const directionsUrl = "https://www.google.com/maps/search/?api=1&query=M%C3%BChlenstra%C3%9Fe%2051%2C%2023552%20L%C3%BCbeck";

const copy = {
  de: {
    confirmationSubject: "Deine Reservierung bei Altstadtliebe",
    cancellationSubject: "Deine Reservierung wurde storniert",
    confirmationTitle: "Deine Reservierung ist bestätigt.",
    cancellationTitle: "Deine Reservierung wurde storniert.",
    confirmationBody: "Hallo {name}, wir freuen uns auf deinen Besuch bei Altstadtliebe.",
    cancellationBody: "Hallo {name}, deine Reservierung bei Altstadtliebe wurde storniert.",
    date: "Datum",
    time: "Uhrzeit",
    guests: "Gäste",
    address: "Adresse",
    note: "Hinweis",
    directions: "Route planen",
    confirmationSignoff: "Bis bald bei Altstadtliebe.",
    cancellationSignoff: "Wir hoffen, dich bald wieder bei uns begrüßen zu dürfen.",
  },
  en: {
    confirmationSubject: "Your Altstadtliebe reservation",
    cancellationSubject: "Your Altstadtliebe reservation was cancelled",
    confirmationTitle: "Your reservation is confirmed.",
    cancellationTitle: "Your reservation was cancelled.",
    confirmationBody: "Hello {name}, we look forward to seeing you at Altstadtliebe.",
    cancellationBody: "Hello {name}, your reservation at Altstadtliebe was cancelled.",
    date: "Date",
    time: "Time",
    guests: "Guests",
    address: "Address",
    note: "Note",
    directions: "Get directions",
    confirmationSignoff: "See you soon at Altstadtliebe.",
    cancellationSignoff: "We hope to welcome you again soon.",
  },
} as const;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[character] ?? character);
}

function formatDate(value: string, language: ReservationEmailData["language"]) {
  return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-GB", { dateStyle: "full", timeZone: "Europe/Berlin" }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" }).format(new Date(value));
}

export function renderReservationEmail(reservation: ReservationEmailData, kind: ReservationEmailKind) {
  const language = reservation.language === "en" ? "en" : "de";
  const text = copy[language];
  const isCancellation = kind === "cancellation";
  const body = (isCancellation ? text.cancellationBody : text.confirmationBody).replace("{name}", escapeHtml(reservation.customerName));
  const date = formatDate(reservation.startsAt, language);
  const time = formatTime(reservation.startsAt);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://altstadtliebe.com";
  const logoUrl = `${siteUrl}/altstadtliebe-logo.png`;
  const noteRow = reservation.specialRequests
    ? `<tr><td style="padding:16px 0 0;font-size:14px;line-height:1.5;color:#66574f;"><strong style="color:#2c211c;">${text.note}:</strong> ${escapeHtml(reservation.specialRequests)}</td></tr>`
    : "";
  const html = `<!doctype html><html lang="${language}"><head><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;background:#f5f0e8;color:#2c211c;font-family:'Bricolage Grotesque',Arial,Helvetica,sans-serif;"><div style="padding:24px 12px;background:#f5f0e8;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#fffdf9;"><tr><td style="padding:32px 28px 24px;text-align:left;"><img src="${logoUrl}" width="210" alt="Altstadtliebe breakfast &amp; lunch" style="display:block;width:210px;max-width:100%;height:auto;border:0;"></td></tr><tr><td style="padding:12px 28px 32px;"><h1 style="margin:0;font-size:34px;line-height:1.08;letter-spacing:-1px;font-weight:700;color:#2c211c;">${escapeHtml(isCancellation ? text.cancellationTitle : text.confirmationTitle)}</h1><p style="margin:18px 0 0;font-size:16px;line-height:1.55;color:#66574f;">${body}</p></td></tr><tr><td style="padding:0 28px 28px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="50%" style="padding:18px 16px;background:#2c211c;color:#f5f0e8;"><div style="font-size:12px;line-height:1.3;text-transform:uppercase;letter-spacing:1px;">${text.date}</div><div style="margin-top:7px;font-size:16px;line-height:1.35;font-weight:700;">${escapeHtml(date)}</div></td><td width="50%" style="padding:18px 16px;background:#2c211c;color:#f5f0e8;border-left:1px solid #8b776a;"><div style="font-size:12px;line-height:1.3;text-transform:uppercase;letter-spacing:1px;">${text.time}</div><div style="margin-top:7px;font-size:20px;line-height:1.35;font-weight:700;">${escapeHtml(time)}</div></td></tr></table></td></tr><tr><td style="padding:0 28px 32px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;line-height:1.5;color:#66574f;"><tr><td style="padding:0 0 12px;"><strong style="color:#2c211c;">${text.guests}:</strong> ${reservation.guestCount}</td></tr><tr><td style="padding:0 0 12px;"><strong style="color:#2c211c;">${text.address}:</strong><br>${escapeHtml(address)}</td></tr>${noteRow}</table><a href="${directionsUrl}" style="display:inline-block;margin-top:24px;padding:13px 20px;background:#2c211c;color:#f5f0e8;text-decoration:none;font-size:14px;line-height:1.2;font-weight:700;">${text.directions}</a><p style="margin:28px 0 0;font-size:16px;line-height:1.5;color:#66574f;">${isCancellation ? text.cancellationSignoff : text.confirmationSignoff}</p></td></tr><tr><td style="padding:20px 28px 28px;background:#f5f0e8;font-size:12px;line-height:1.5;color:#66574f;">Altstadtliebe · ${escapeHtml(address)}</td></tr></table></div></body></html>`;
  const plainText = [isCancellation ? text.cancellationTitle : text.confirmationTitle, "", body.replace(/&amp;/g, "&"), "", `${text.date}: ${date}`, `${text.time}: ${time}`, `${text.guests}: ${reservation.guestCount}`, `${text.address}: ${address}`, ...(reservation.specialRequests ? [`${text.note}: ${reservation.specialRequests}`] : []), "", `${text.directions}: ${directionsUrl}`, "", isCancellation ? text.cancellationSignoff : text.confirmationSignoff].join("\n");
  return { subject: isCancellation ? text.cancellationSubject : text.confirmationSubject, html, text: plainText };
}

export function renderReservationConfirmationEmail(reservation: ReservationEmailData) {
  return renderReservationEmail(reservation, "confirmation");
}

export function renderReservationCancellationEmail(reservation: ReservationEmailData) {
  return renderReservationEmail(reservation, "cancellation");
}
