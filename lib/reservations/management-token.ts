import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { SITE_URL } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";

const tokenPattern = /^[A-Za-z0-9_-]{43}$/;

export function createReservationManagementToken() {
  return randomBytes(32).toString("base64url");
}

export function isReservationManagementToken(value: unknown): value is string {
  return typeof value === "string" && tokenPattern.test(value);
}

export function hashReservationManagementToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function reservationManagementUrl(token: string, locale: Locale) {
  const path = locale === "en" ? "/en/manage-reservation" : "/manage-reservation";
  return `${SITE_URL}${path}?token=${encodeURIComponent(token)}`;
}
