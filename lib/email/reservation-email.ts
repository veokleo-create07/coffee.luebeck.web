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
  managementUrl?: string | null;
};

const phoneDisplay = "0451 61917800";
const phoneHref = "tel:+4945161917800";

const copy = {
  de: {
    confirmationSubject: "Deine Reservierung bei Altstadtliebe",
    cancellationSubject: "Deine Reservierung wurde storniert",
    confirmationTitle: "Deine Reservierung ist bestätigt.",
    cancellationTitle: "Deine Reservierung wurde storniert.",
    greeting: "Hallo {firstName},",
    confirmationDescription: "Deine Reservierung bei Altstadtliebe ist bestätigt. Wir freuen uns auf deinen Besuch.",
    cancellationDescription: "Deine Reservierung bei Altstadtliebe wurde storniert.",
    name: "Name",
    dateAndTime: "Datum & Uhrzeit",
    guests: "Gäste",
    duration: "Dauer",
    email: "E-Mail",
    at: "um",
    durationValue: "{minutes} Minuten",
    manage: "Reservierung verwalten",
    confirmationClosing: "Bis bald bei Altstadtliebe.",
    cancellationClosing: "Wir hoffen, dich bald wieder bei Altstadtliebe begrüßen zu dürfen.",
    questions: "Wenn du Fragen hast, erreichst du uns unter",
    team: "Dein Altstadtliebe-Team",
  },
  en: {
    confirmationSubject: "Your reservation at Altstadtliebe",
    cancellationSubject: "Your Altstadtliebe reservation was cancelled",
    confirmationTitle: "Your reservation is confirmed.",
    cancellationTitle: "Your reservation was cancelled.",
    greeting: "Hey {firstName},",
    confirmationDescription: "Your reservation at Altstadtliebe is confirmed. We look forward to seeing you.",
    cancellationDescription: "Your reservation at Altstadtliebe was cancelled.",
    name: "Name",
    dateAndTime: "Date & Time",
    guests: "Guests",
    duration: "Duration",
    email: "Email",
    at: "at",
    durationValue: "{minutes} minutes",
    manage: "Manage your reservation",
    confirmationClosing: "See you soon at Altstadtliebe.",
    cancellationClosing: "We hope to welcome you back to Altstadtliebe soon.",
    questions: "If you have any questions, reach us at",
    team: "Your team at Altstadtliebe",
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

function firstNameFromFullName(fullName: string) {
  return fullName.trim().split(/\s+/u).find(Boolean) ?? fullName.trim();
}

function formatDate(value: string, language: ReservationEmailData["language"]) {
  return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
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

function durationMinutes(startsAt: string, endsAt: string) {
  const duration = Math.round((new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60_000);
  return Number.isFinite(duration) && duration > 0 ? duration : 90;
}

function isSecureManagementUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function detailRow(label: string, value: string, isLast = false) {
  return `<tr>
    <td style="padding:16px 0;vertical-align:top;${isLast ? "" : "border-bottom:1px solid #e5ded5;"}">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td width="38%" style="padding:0 12px 0 0;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.4;font-weight:700;vertical-align:top;">${label}</td>
          <td width="62%" style="padding:0;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.45;font-weight:400;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export function renderReservationEmail(reservation: ReservationEmailData, kind: ReservationEmailKind) {
  const language = reservation.language === "en" ? "en" : "de";
  const text = copy[language];
  const isCancellation = kind === "cancellation";
  const title = isCancellation ? text.cancellationTitle : text.confirmationTitle;
  const description = isCancellation ? text.cancellationDescription : text.confirmationDescription;
  const closing = isCancellation ? text.cancellationClosing : text.confirmationClosing;
  const firstName = firstNameFromFullName(reservation.customerName);
  const greetingText = text.greeting.replace("{firstName}", firstName);
  const greeting = escapeHtml(greetingText);
  const dateAndTime = `${formatDate(reservation.startsAt, language)} ${text.at} ${formatTime(reservation.startsAt)}`;
  const minutes = durationMinutes(reservation.startsAt, reservation.endsAt);
  const duration = text.durationValue.replace("{minutes}", String(minutes));
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://altstadtliebe.com").replace(/\/$/u, "");
  const logoUrl = `${siteUrl}/altstadtliebe-logo.png`;
  const heartUrl = `${siteUrl}/altstadtliebe-heart.png`;
  const managementUrl = !isCancellation && isSecureManagementUrl(reservation.managementUrl)
    ? reservation.managementUrl
    : null;

  const managementButton = managementUrl
    ? `<tr>
        <td style="padding:30px 0 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td bgcolor="#321A10" style="border-radius:10px;text-align:center;">
                <a href="${escapeHtml(managementUrl)}" style="display:block;padding:17px 24px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.25;font-weight:700;text-decoration:none;">${text.manage}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  const html = `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light only; supported-color-schemes: light only; }
      body, table, td, p, a { font-family: Arial, Helvetica, sans-serif; }
      @media only screen and (max-width: 620px) {
        .email-gutter { padding: 0 18px !important; }
        .content-cell { padding-left: 24px !important; padding-right: 24px !important; }
        .brand-cell { padding: 34px 24px 24px !important; }
        .brand-logo { width: 220px !important; max-width: 100% !important; }
        .headline { font-size: 34px !important; line-height: 1.08 !important; letter-spacing: -1.2px !important; }
        .details-cell { padding: 4px 18px !important; }
      }
      @media only screen and (max-width: 360px) {
        .email-gutter { padding: 0 12px !important; }
        .content-cell { padding-left: 18px !important; padding-right: 18px !important; }
        .headline { font-size: 31px !important; }
        .details-cell { padding: 2px 14px !important; }
      }
    </style>
  </head>
  <body bgcolor="#FFFFFF" style="margin:0;padding:0;background-color:#FFFFFF;color:#241814;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" style="width:100%;background-color:#FFFFFF;">
      <tr>
        <td class="email-gutter" align="center" bgcolor="#FFFFFF" style="padding:0 24px;background-color:#FFFFFF;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" style="width:100%;max-width:600px;margin:0 auto;background-color:#FFFFFF;">
            <tr>
              <td class="brand-cell" align="center" bgcolor="#FFFFFF" style="padding:46px 32px 32px;background-color:#FFFFFF;">
                <img class="brand-logo" src="${logoUrl}" width="270" alt="Altstadtliebe breakfast &amp; lunch" style="display:block;width:270px;max-width:100%;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;">
              </td>
            </tr>
            <tr>
              <td class="content-cell" bgcolor="#FFFFFF" style="padding:26px 32px 0;background-color:#FFFFFF;">
                <h1 class="headline" style="margin:0;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:44px;line-height:1.06;letter-spacing:-1.8px;font-weight:700;">${escapeHtml(title)}</h1>
                <p style="margin:34px 0 0;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.45;font-weight:700;">${greeting}</p>
                <p style="margin:8px 0 0;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.55;font-weight:400;">${escapeHtml(description)}</p>
              </td>
            </tr>
            <tr>
              <td class="content-cell" bgcolor="#FFFFFF" style="padding:38px 32px 0;background-color:#FFFFFF;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#FAF7F2" style="width:100%;background-color:#FAF7F2;border-radius:16px;">
                  <tr>
                    <td class="details-cell" bgcolor="#FAF7F2" style="padding:5px 24px;background-color:#FAF7F2;border-radius:16px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        ${detailRow(text.name, escapeHtml(reservation.customerName))}
                        ${detailRow(text.dateAndTime, escapeHtml(dateAndTime))}
                        ${detailRow(text.guests, String(reservation.guestCount))}
                        ${detailRow(text.duration, escapeHtml(duration))}
                        ${detailRow(text.email, escapeHtml(reservation.customerEmail), true)}
                      </table>
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  ${managementButton}
                </table>
              </td>
            </tr>
            <tr>
              <td class="content-cell" bgcolor="#FFFFFF" style="padding:38px 32px 48px;background-color:#FFFFFF;">
                <div style="height:1px;line-height:1px;background-color:#E8E1D8;font-size:1px;">&nbsp;</div>
                <p style="margin:36px 0 0;text-align:center;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.4;font-weight:700;">${escapeHtml(closing)}</p>
                <p style="margin:12px 0 0;text-align:center;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;font-weight:400;">${text.questions}</p>
                <p style="margin:12px 0 0;text-align:center;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:19px;line-height:1.4;font-weight:700;">
                  <a href="${phoneHref}" style="color:#241814;text-decoration:none;">${phoneDisplay}</a>
                </p>
                <p style="margin:28px 0 0;text-align:center;color:#241814;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.4;font-style:italic;">${text.team}</p>
                <img src="${heartUrl}" width="34" alt="Altstadtliebe" style="display:block;width:34px;height:34px;margin:24px auto 0;border:0;outline:none;text-decoration:none;">
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const plainText = [
    title,
    "",
    greetingText,
    description,
    "",
    `${text.name}: ${reservation.customerName}`,
    `${text.dateAndTime}: ${dateAndTime}`,
    `${text.guests}: ${reservation.guestCount}`,
    `${text.duration}: ${duration}`,
    `${text.email}: ${reservation.customerEmail}`,
    ...(managementUrl ? ["", `${text.manage}: ${managementUrl}`] : []),
    "",
    closing,
    text.questions,
    phoneDisplay,
    "",
    text.team,
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
