import "server-only";

import { SITE_URL } from "@/lib/seo";

export type ReviewRequestEmailData = {
  reservationId: string;
  customerName: string;
  customerEmail: string;
  language: "de" | "en";
};

export const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJR90hg8gJskcR6_QG_Nj49A4";

const copy = {
  de: {
    subject: "Wie war dein Besuch bei Altstadtliebe?",
    title: "Wie war dein Besuch?",
    greeting: "Hallo {firstName},",
    body: "wir hoffen, du hattest eine schöne Zeit bei Altstadtliebe. Wenn du einen Moment hast, freuen wir uns sehr über deine ehrliche Bewertung bei Google.",
    button: "Google-Bewertung schreiben",
    closing: "Vielen Dank für deinen Besuch.",
    team: "Dein Altstadtliebe-Team",
    consent: "Du erhältst diese einmalige Nachricht, weil du bei deiner Reservierung zugestimmt hast. Deine Einwilligung kannst du jederzeit per E-Mail widerrufen.",
  },
  en: {
    subject: "How was your visit to Altstadtliebe?",
    title: "How was your visit?",
    greeting: "Hi {firstName},",
    body: "we hope you enjoyed your time at Altstadtliebe. If you have a moment, we’d really appreciate your honest review on Google.",
    button: "Leave a Google review",
    closing: "Thank you for visiting us.",
    team: "Your team at Altstadtliebe",
    consent: "You are receiving this one-time message because you agreed during your reservation. You can withdraw your consent at any time by email.",
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

export function renderReviewRequestEmail(reservation: ReviewRequestEmailData) {
  const language = reservation.language === "en" ? "en" : "de";
  const text = copy[language];
  const greeting = text.greeting.replace("{firstName}", firstNameFromFullName(reservation.customerName));
  const logoUrl = `${SITE_URL}/altstadtliebe-logo.png`;

  const html = `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light only">
    <title>${escapeHtml(text.subject)}</title>
  </head>
  <body bgcolor="#FFFFFF" style="margin:0;padding:0;background:#FFFFFF;color:#241814;-webkit-text-size-adjust:100%;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" style="width:100%;background:#FFFFFF;">
      <tr>
        <td align="center" style="padding:0 18px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;margin:0 auto;">
            <tr><td align="center" style="padding:42px 24px 28px;"><img src="${logoUrl}" width="250" alt="Altstadtliebe breakfast &amp; lunch" style="display:block;width:250px;max-width:100%;height:auto;border:0;"></td></tr>
            <tr>
              <td style="padding:24px 28px 0;">
                <h1 style="margin:0;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:40px;line-height:1.08;letter-spacing:-1.4px;font-weight:700;">${escapeHtml(text.title)}</h1>
                <p style="margin:30px 0 0;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.45;font-weight:700;">${escapeHtml(greeting)}</p>
                <p style="margin:9px 0 0;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.6;">${escapeHtml(text.body)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" bgcolor="#321A10" style="border-radius:10px;"><a href="${GOOGLE_REVIEW_URL}" style="display:block;padding:17px 24px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.25;font-weight:700;text-decoration:none;">${escapeHtml(text.button)}</a></td></tr></table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:38px 28px 46px;">
                <div style="height:1px;background:#E8E1D8;font-size:1px;line-height:1px;">&nbsp;</div>
                <p style="margin:30px 0 0;color:#241814;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.5;font-weight:700;">${escapeHtml(text.closing)}</p>
                <p style="margin:10px 0 0;color:#241814;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.5;font-style:italic;">${escapeHtml(text.team)}</p>
                <p style="margin:28px auto 0;max-width:470px;color:#776B65;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.55;">${escapeHtml(text.consent)} <a href="mailto:reservierungen@altstadtliebe.com" style="color:#776B65;text-decoration:underline;">reservierungen@altstadtliebe.com</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const plainText = [
    text.title,
    "",
    greeting,
    text.body,
    "",
    `${text.button}: ${GOOGLE_REVIEW_URL}`,
    "",
    text.closing,
    text.team,
    "",
    `${text.consent} reservierungen@altstadtliebe.com`,
  ].join("\n");

  return { subject: text.subject, html, text: plainText };
}
