import type { MetadataRoute } from "next";
import { absoluteUrl, SEO_ROUTES, type SeoRoute } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: SeoRoute[] = ["home", "menu", "matcha", "cafe", "faq", "reservation"];
  const lastModified: Partial<Record<SeoRoute, string>> = {
    menu: "2026-11-10",
    matcha: "2026-11-10",
    cafe: "2026-11-10",
  };

  return routes.flatMap((route) => {
    const paths = SEO_ROUTES[route];
    const languages = { de: absoluteUrl(paths.de), en: absoluteUrl(paths.en), "x-default": absoluteUrl(paths.de) };
    return (["de", "en"] as const).map((locale) => ({
      url: absoluteUrl(paths[locale]),
      ...(lastModified[route] ? { lastModified: lastModified[route] } : {}),
      changeFrequency: route === "home" ? "weekly" as const : "monthly" as const,
      priority: route === "home" ? 1 : route === "matcha" || route === "cafe" || route === "menu" ? 0.9 : 0.7,
      alternates: { languages },
    }));
  });
}
