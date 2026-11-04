import type { MetadataRoute } from "next";
import { absoluteUrl, SEO_ROUTES, type SeoRoute } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: SeoRoute[] = ["home", "menu", "matcha", "cafe", "faq", "reservation"];

  return routes.flatMap((route) => {
    const paths = SEO_ROUTES[route];
    const languages = { de: absoluteUrl(paths.de), en: absoluteUrl(paths.en) };
    return (["de", "en"] as const).map((locale) => ({
      url: absoluteUrl(paths[locale]),
      changeFrequency: route === "home" ? "weekly" as const : "monthly" as const,
      priority: route === "home" ? 1 : route === "matcha" || route === "cafe" || route === "menu" ? 0.9 : 0.7,
      alternates: { languages },
    }));
  });
}
