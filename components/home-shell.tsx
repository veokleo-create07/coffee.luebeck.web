import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Hero } from "./hero";
import { CoffeeShowcase } from "./coffee-showcase";
import { ReviewsSection } from "./reviews-section";
import { EventsCatering } from "./events-catering";
import { FaqSection } from "./faq-page";
import { JsonLd } from "./json-ld";
import { VisitSection } from "./visit-section";
import { absoluteUrl, BUSINESS_ID, SEO_ROUTES } from "@/lib/seo";

type HomeShellProps = { locale: Locale; dictionary: Dictionary };

export function HomeShell({ locale, dictionary }: HomeShellProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CafeOrCoffeeShop",
        "@id": BUSINESS_ID,
        name: "Altstadtliebe",
        description: dictionary.home.description,
        url: absoluteUrl(SEO_ROUTES.home.de),
        logo: absoluteUrl("/altstadtliebe-logo.png"),
        image: [absoluteUrl("/events-catering.webp"), absoluteUrl("/menu-matcha.jpeg"), absoluteUrl("/menu-breakfast.jpeg")],
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
        hasMenu: absoluteUrl(SEO_ROUTES.menu[locale]),
        acceptsReservations: true,
        hasMap: dictionary.location.directionsHref,
        servesCuisine: ["Breakfast", "Coffee", "Matcha"],
        areaServed: { "@type": "City", name: "Lübeck" },
        sameAs: [dictionary.footer.instagramHref, dictionary.footer.tiktokHref, "https://maps.app.goo.gl/12eVKxTnwfxyiZub6"],
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: "Altstadtliebe",
        inLanguage: ["de-DE", "en-GB"],
        publisher: { "@id": BUSINESS_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl(SEO_ROUTES.home[locale])}#webpage`,
        url: absoluteUrl(SEO_ROUTES.home[locale]),
        name: dictionary.home.title,
        description: dictionary.home.description,
        inLanguage: locale === "de" ? "de-DE" : "en-GB",
        about: { "@id": BUSINESS_ID },
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      },
    ],
  };

  return <div className="min-h-screen"><JsonLd data={structuredData} /><SiteHeader locale={locale} dictionary={dictionary} overlay /><main><Hero dictionary={dictionary} locale={locale} /><CoffeeShowcase locale={locale} dictionary={dictionary} /><ReviewsSection locale={locale} dictionary={dictionary} /><EventsCatering dictionary={dictionary} /><VisitSection locale={locale} dictionary={dictionary} /><FaqSection dictionary={dictionary} /></main><SiteFooter locale={locale} dictionary={dictionary} /></div>;
}
