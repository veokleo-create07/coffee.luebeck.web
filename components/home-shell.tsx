import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Hero } from "./hero";
import { CoffeeShowcase } from "./coffee-showcase";
import { ReviewsSection } from "./reviews-section";
import { EventsCatering } from "./events-catering";
import { FaqSection } from "./faq-page";

type HomeShellProps = { locale: Locale; dictionary: Dictionary };

export function HomeShell({ locale, dictionary }: HomeShellProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: "Altstadtliebe",
    description: dictionary.home.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://altstadtliebe.vercel.app"}${locale === "en" ? "/en" : "/"}`,
    telephone: dictionary.location.phoneLabel,
    address: {
      "@type": "PostalAddress",
      streetAddress: dictionary.location.addressLines[0],
      postalCode: "23552",
      addressLocality: "Lübeck",
      addressCountry: "DE",
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "09:00", closes: "18:00" },
    ],
    sameAs: [dictionary.footer.instagramHref, dictionary.footer.tiktokHref],
  };

  return <div className="min-h-screen"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><SiteHeader locale={locale} dictionary={dictionary} overlay /><main><Hero dictionary={dictionary} locale={locale} /><CoffeeShowcase locale={locale} dictionary={dictionary} /><ReviewsSection locale={locale} dictionary={dictionary} /><EventsCatering dictionary={dictionary} /><FaqSection dictionary={dictionary} /></main><SiteFooter locale={locale} dictionary={dictionary} /></div>;
}
