import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries/de";
import { menuContent } from "@/lib/discovery-content";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl, BUSINESS_ID, SEO_ROUTES } from "@/lib/seo";
import { JsonLd } from "./json-ld";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function MenuPage({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const copy = menuContent[locale];
  const route = SEO_ROUTES.menu[locale];
  const languageHref = SEO_ROUTES.menu[locale === "de" ? "en" : "de"];
  const breadcrumbId = `${absoluteUrl(route)}#breadcrumb`;
  const menuId = `${absoluteUrl(route)}#menu`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl(route)}#webpage`,
        url: absoluteUrl(route),
        name: copy.title,
        description: copy.intro,
        inLanguage: locale === "de" ? "de-DE" : "en-GB",
        about: { "@id": BUSINESS_ID },
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": menuId },
        dateModified: "2026-11-10",
      },
      {
        "@type": "Menu",
        "@id": menuId,
        name: locale === "de" ? "Speisekarte von Altstadtliebe" : "Altstadtliebe menu",
        inLanguage: locale === "de" ? "de-DE" : "en-GB",
        mainEntityOfPage: { "@id": `${absoluteUrl(route)}#webpage` },
        hasMenuSection: copy.categories.map((category) => ({
          "@type": "MenuSection",
          name: category.title,
          description: category.description,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: dictionary.navigation.home, item: absoluteUrl(SEO_ROUTES.home[locale]) },
          { "@type": "ListItem", position: 2, name: copy.title, item: absoluteUrl(route) },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-hidden bg-ivory">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} dictionary={dictionary} languageHref={languageHref} />
      <main className="page-gutter pb-24 pt-16 md:pb-32 md:pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <header className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow mb-6">{copy.eyebrow}</p>
              <h1 className="editorial-heading text-[clamp(4rem,9vw,9rem)] font-semibold leading-[0.82] tracking-[-0.065em] text-espresso">{copy.title}</h1>
            </div>
            <div>
              <p className="max-w-xl text-lg leading-[1.55] text-espresso-soft md:text-xl">{copy.intro}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={SEO_ROUTES.matcha[locale]} className="site-button site-button-secondary">{locale === "de" ? "Matcha in Lübeck" : "Matcha in Lübeck"}</Link>
                <Link href={SEO_ROUTES.cafe[locale]} className="site-button site-button-secondary">{locale === "de" ? "Café in Lübeck" : "Café in Lübeck"}</Link>
              </div>
            </div>
          </header>

          <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2">
            {copy.categories.map((category, index) => (
              <article key={category.title} className="group relative min-h-64 overflow-hidden rounded-[1.5rem] bg-[#eee9e1] p-7 md:min-h-80 md:p-10">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-olive-deep">{String(index + 1).padStart(2, "0")}</span>
                <div className="absolute inset-x-7 bottom-7 md:inset-x-10 md:bottom-10">
                  <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-espresso">{category.title}</h2>
                  <p className="mt-4 max-w-lg text-base leading-[1.55] text-espresso-soft">{category.description}</p>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-16 grid overflow-hidden rounded-[1.5rem] bg-espresso text-ivory md:mt-24 md:grid-cols-[0.85fr_1.15fr] md:rounded-[2rem]">
            <div className="relative min-h-72 md:min-h-[30rem]">
              <Image src="/menu-matcha.jpeg" alt={locale === "de" ? "Matcha von Altstadtliebe" : "Matcha from Altstadtliebe"} fill sizes="(max-width: 767px) 100vw, 42vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-14">
              <h2 className="editorial-heading text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.9] tracking-[-0.055em]">{locale === "de" ? "Dein Platz wartet." : "Your table awaits."}</h2>
              <p className="mt-6 max-w-xl leading-[1.6] text-ivory/75">{copy.note}</p>
              <Link href={SEO_ROUTES.reservation[locale]} className="site-button site-button-secondary mt-8 self-start">{copy.reservationCta}</Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
