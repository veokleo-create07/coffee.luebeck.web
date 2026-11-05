import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";

const reservationIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function managementSecret() {
  const value = process.env.NEXT_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("Missing reservation management secret.");
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", managementSecret()).update(`altstadtliebe:${payload}`, "utf8").digest("base64url");
}

export function createReservationManagementToken(reservationId: string) {
  if (!reservationIdPattern.test(reservationId)) throw new Error("Invalid reservation ID.");
  const payload = Buffer.from(reservationId, "utf8").toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function reservationIdFromManagementToken(value: unknown) {
  if (typeof value !== "string" || value.length > 160) return null;
  const [payload, providedSignature, extra] = value.split(".");
  if (!payload || !providedSignature || extra) return null;

  const expectedSignature = signature(payload);
  const provided = Buffer.from(providedSignature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  try {
    const reservationId = Buffer.from(payload, "base64url").toString("utf8");
    return reservationIdPattern.test(reservationId) ? reservationId : null;
  } catch {
    return null;
  }
}

export function reservationManagementUrl(token: string, locale: Locale) {
  const path = locale === "en" ? "/en/manage-reservation" : "/manage-reservation";
  return `${SITE_URL}${path}?token=${encodeURIComponent(token)}`;
}
