import type { Metadata } from "next";
import type { Locale } from "./i18n";

export const SITE_URL = "https://www.altstadtliebe.com";
export const BUSINESS_ID = `${SITE_URL}/#cafe`;

export const SEO_ROUTES = {
  home: { de: "/", en: "/en" },
  menu: { de: "/menu", en: "/en/menu" },
  matcha: { de: "/matcha-luebeck", en: "/en/matcha-lubeck" },
  cafe: { de: "/cafe-luebeck", en: "/en/cafe-lubeck" },
  faq: { de: "/faq", en: "/en/faq" },
  reservation: { de: "/reservation", en: "/en/reservation" },
  legal: { de: "/impressum", en: "/en/legal-notice" },
  privacy: { de: "/datenschutz", en: "/en/privacy" },
} as const;

export type SeoRoute = keyof typeof SEO_ROUTES;

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function localizedMetadata({
  locale,
  route,
  title,
  description,
  image = "/events-catering.webp",
  noIndex = false,
}: {
  locale: Locale;
  route: SeoRoute;
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const paths = SEO_ROUTES[route];
  const canonical = absoluteUrl(paths[locale]);
  const imageUrl = absoluteUrl(image);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        de: absoluteUrl(paths.de),
        en: absoluteUrl(paths.en),
        "x-default": absoluteUrl(paths.de),
      },
    },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Altstadtliebe",
      locale: locale === "de" ? "de_DE" : "en_GB",
      alternateLocale: locale === "de" ? ["en_GB"] : ["de_DE"],
      title,
      description,
      url: canonical,
      images: [{ url: imageUrl, alt: "Altstadtliebe in Lübeck" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</gu, "\\u003c");
}
