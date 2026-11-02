import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://altstadtliebe.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/en", "/faq", "/en/faq", "/menu", "/en/menu", "/reservation", "/en/reservation", "/impressum", "/en/legal-notice", "/datenschutz", "/en/privacy"];
  return routes.map((route) => ({ url: `${siteUrl}${route}`, lastModified: now, changeFrequency: "monthly", priority: route === "" || route === "/en" ? 1 : 0.7 }));
}
