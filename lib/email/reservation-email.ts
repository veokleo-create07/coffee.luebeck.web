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
    name: "Name",
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
    name: "Name",
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
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function formatDate(value: string, language: ReservationEmailData["language"]) {
  return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-GB", {
    dateStyle: "full",
    timeZone: "Europe/Berlin",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  }).format(new Date(value));
}

function detailRow(label: string, value: string, emphasis = false) {
  return `<tr><td style="padding:0 0 14px;font-size:14px;line-height:1.45;color:#786960;vertical-align:top;width:30%;">${label}</td><td style="padding:0 0 14px;font-size:${emphasis ? "18" : "15"}px;line-height:1.45;font-weight:${emphasis ? "700" : "600"};color:#2c211c;vertical-align:top;">${value}</td></tr>`;
}

export function renderReservationEmail(reservation: ReservationEmailData, kind: ReservationEmailKind) {
  const language = reservation.language === "en" ? "en" : "de";
  const text = copy[language];
  const isCancellation = kind === "cancellation";
  const title = isCancellation ? text.cancellationTitle : text.confirmationTitle;
  const body = (isCancellation ? text.cancellationBody : text.confirmationBody)
    .replace("{name}", escapeHtml(reservation.customerName));
  const date = formatDate(reservation.startsAt, language);
  const time = formatTime(reservation.startsAt);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://altstadtliebe.com";
  const logoUrl = `${siteUrl}/altstadtliebe-logo.png`;
  const noteRow = reservation.specialRequests
    ? detailRow(text.note, escapeHtml(reservation.specialRequests))
    : "";

  const html = `<!doctype html>
<html lang="${language}">
  <head>
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f5f0e8;color:#2c211c;font-family:'Bricolage Grotesque',Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
    <div style="width:100%;padding:28px 12px 36px;background:#f5f0e8;box-sizing:border-box;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#fffdf9;border-radius:4px;">
        <tr>
          <td style="padding:40px 28px 20px;text-align:center;">
            <img src="${logoUrl}" width="210" alt="Altstadtliebe breakfast &amp; lunch" style="display:block;width:210px;max-width:100%;height:auto;margin:0 auto;border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px 30px;text-align:center;">
            <h1 style="margin:0;color:#2c211c;font-size:36px;line-height:1.05;letter-spacing:-1.2px;font-weight:700;">${escapeHtml(title)}</h1>
            <p style="margin:18px auto 0;max-width:420px;color:#66574f;font-size:16px;line-height:1.55;">${body}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px 26px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5ddd3;background:#f8f3eb;">
              <tr>
                <td style="padding:22px 20px 8px;">
                  <div style="font-size:11px;line-height:1.3;letter-spacing:1.4px;text-transform:uppercase;color:#786960;">${text.date}</div>
                  <div style="margin-top:6px;color:#2c211c;font-size:20px;line-height:1.3;font-weight:700;">${escapeHtml(date)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 20px 22px;">
                  <div style="font-size:11px;line-height:1.3;letter-spacing:1.4px;text-transform:uppercase;color:#786960;">${text.time}</div>
                  <div style="margin-top:6px;color:#2c211c;font-size:28px;line-height:1.2;font-weight:700;">${escapeHtml(time)}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px 30px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              ${detailRow(text.name, escapeHtml(reservation.customerName))}
              ${detailRow(text.guests, String(reservation.guestCount))}
              ${detailRow(text.address, escapeHtml(address))}
              ${noteRow}
            </table>
            <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:10px auto 0;">
              <tr>
                <td style="background:#2c211c;border-radius:2px;text-align:center;">
                  <a href="${directionsUrl}" style="display:inline-block;padding:14px 24px;color:#f5f0e8;text-decoration:none;font-size:14px;line-height:1.2;font-weight:700;">${text.directions}</a>
                </td>
              </tr>
            </table>
            <p style="margin:26px 0 0;text-align:center;color:#66574f;font-size:16px;line-height:1.5;">${isCancellation ? text.cancellationSignoff : text.confirmationSignoff}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px 28px;background:#f5f0e8;text-align:center;color:#786960;font-size:12px;line-height:1.5;">
            Altstadtliebe · ${escapeHtml(address)}
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;

  const plainText = [
    title,
    "",
    body.replace(/&amp;/g, "&"),
    "",
    `${text.name}: ${reservation.customerName}`,
    `${text.date}: ${date}`,
    `${text.time}: ${time}`,
    `${text.guests}: ${reservation.guestCount}`,
    `${text.address}: ${address}`,
    ...(reservation.specialRequests ? [`${text.note}: ${reservation.specialRequests}`] : []),
    "",
    `${text.directions}: ${directionsUrl}`,
    "",
    isCancellation ? text.cancellationSignoff : text.confirmationSignoff,
  ].join("\n");

  return {
    subject: isCancellation ? text.cancellationSubject : text.confirmationSubject,
    html,
    text: plainText,
  };
}

export function renderReservationConfirmationEmail(reservation: ReservationEmailData) {
  return renderReservationEmail(reservation, "confirmation");
}

export function renderReservationCancellationEmail(reservation: ReservationEmailData) {
  return renderReservationEmail(reservation, "cancellation");
}
