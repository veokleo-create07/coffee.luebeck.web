import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";

const reservationIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function managementSecret() {
  const value = process.env.RESERVATION_MANAGEMENT_SECRET;
  if (!value) throw new Error("Missing reservation management secret.");
  return value;
}

function signature(secret: string, payload: string) {
  return createHmac("sha256", secret).update(`altstadtliebe:${payload}`, "utf8").digest("base64url");
}

function signaturesMatch(providedSignature: string, expectedSignature: string) {
  const provided = Buffer.from(providedSignature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export function createReservationManagementToken(reservationId: string, expiresAt: string | Date) {
  if (!reservationIdPattern.test(reservationId)) throw new Error("Invalid reservation ID.");
  const expiresAtMs = expiresAt instanceof Date ? expiresAt.getTime() : Date.parse(expiresAt);
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) throw new Error("Invalid reservation management expiry.");
  const payload = Buffer.from(reservationId, "utf8").toString("base64url");
  const expires = String(Math.floor(expiresAtMs / 1000));
  const signedPayload = `${payload}.${expires}`;
  return `v2.${signedPayload}.${signature(managementSecret(), signedPayload)}`;
}

export function reservationManagementTokenDetails(value: unknown) {
  if (typeof value !== "string" || value.length > 220) return null;
  const parts = value.split(".");

  if (parts.length === 4 && parts[0] === "v2") {
    const [, payload, expires, providedSignature] = parts;
    if (!payload || !expires || !providedSignature || !/^\d{10}$/.test(expires)) return null;
    if (Number(expires) * 1000 <= Date.now()) return null;
    const signedPayload = `${payload}.${expires}`;
    if (!signaturesMatch(providedSignature, signature(managementSecret(), signedPayload))) return null;

    try {
      const reservationId = Buffer.from(payload, "base64url").toString("utf8");
      return reservationIdPattern.test(reservationId) ? { reservationId, legacy: false } : null;
    } catch {
      return null;
    }
  }

  // Temporary compatibility for links sent before expiring v2 tokens were introduced.
  const [payload, providedSignature, extra] = parts;
  const legacySecret = process.env.NEXT_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!payload || !providedSignature || extra || !legacySecret) return null;
  if (!signaturesMatch(providedSignature, signature(legacySecret, payload))) return null;

  try {
    const reservationId = Buffer.from(payload, "base64url").toString("utf8");
    return reservationIdPattern.test(reservationId) ? { reservationId, legacy: true } : null;
  } catch {
    return null;
  }
}

export function reservationIdFromManagementToken(value: unknown) {
  return reservationManagementTokenDetails(value)?.reservationId ?? null;
}

export function reservationManagementUrl(token: string, locale: Locale) {
  const path = locale === "en" ? "/en/manage-reservation" : "/manage-reservation";
  return `${SITE_URL}${path}?token=${encodeURIComponent(token)}`;
}
