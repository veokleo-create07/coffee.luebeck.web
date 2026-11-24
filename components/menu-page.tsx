"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import { menuContent, type MenuSection } from "@/lib/discovery-content";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl, BUSINESS_ID, SEO_ROUTES } from "@/lib/seo";
import { JsonLd } from "./json-ld";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function MenuPage({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const copy = menuContent[locale];
  const route = SEO_ROUTES.menu[locale];
  const languageHref = SEO_ROUTES.menu[locale === "de" ? "en" : "de"];
  const [activeSection, setActiveSection] = useState(0);
  const sectionOrder = locale === "de"
    ? ["Ei, Brot & Liebe", "Brioche", "Bagels", "Bowls", "Süßes mit Liebe", "Iced Matcha Latte", "Frische Limonade", "Säfte & Smoothies", "Heißgetränke"]
    : ["Eggs, Bread & Love", "Brioche", "Bagels", "Bowls", "Sweet Treats Made with Love", "Iced Matcha Latte", "Fresh Lemonades", "Juices & Smoothies", "Hot Drinks"];
  const menuSections = copy.sections.reduce<MenuSection[]>((sections, section) => {
    const existingSection = sections.find((candidate) => candidate.title === section.title);

    if (existingSection) {
      existingSection.items.push(...section.items);
      return sections;
    }

    sections.push({ ...section, items: [...section.items] });
    return sections;
  }, []).sort((first, second) => sectionOrder.indexOf(first.title) - sectionOrder.indexOf(second.title));
  const selectedSection = menuSections[activeSection] ?? menuSections[0];

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
        dateModified: "2026-11-24",
      },
      {
        "@type": "Menu",
        "@id": menuId,
        name: locale === "de" ? "Speisekarte von Altstadtliebe" : "Altstadtliebe menu",
        inLanguage: locale === "de" ? "de-DE" : "en-GB",
        mainEntityOfPage: { "@id": `${absoluteUrl(route)}#webpage` },
        hasMenuSection: menuSections.map((section) => ({
          "@type": "MenuSection",
          name: section.title,
          hasMenuItem: section.items.map((item) => ({
            "@type": "MenuItem",
            name: item.name,
            description: item.description || undefined,
            offers: {
              "@type": "Offer",
              price: item.priceValue,
              priceCurrency: "EUR",
            },
          })),
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
          <header className="text-center">
            <h1 className="editorial-heading mx-auto max-w-[21ch] text-balance text-center text-[clamp(2rem,4.2vw,4rem)] font-medium leading-[0.98] tracking-[-0.05em] text-espresso">{copy.title}</h1>
            <nav aria-label={locale === "de" ? "Menübereiche" : "Menu sections"} className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-2 md:mt-10 md:gap-2.5">
              {menuSections.map((section, sectionIndex) => (
                <button
                  key={`${sectionIndex}-${section.title}`}
                  onClick={() => setActiveSection(sectionIndex)}
                  type="button"
                  aria-pressed={activeSection === sectionIndex}
                  data-selected={activeSection === sectionIndex}
                  className="menu-filter-pill inline-flex h-10 items-center justify-center rounded-full px-4 text-[0.78rem] font-medium md:px-5 md:text-sm"
                >
                  <span className="relative z-10">{section.title}</span>
                </button>
              ))}
            </nav>
          </header>

          <section key={selectedSection.title} className="menu-section-panel mt-14 md:mt-24" aria-labelledby="selected-menu-section">
            <header className="text-center">
              <h2 id="selected-menu-section" className="editorial-heading mx-auto max-w-[21ch] text-balance text-[clamp(2rem,4.2vw,4rem)] font-medium leading-[0.98] tracking-[-0.05em] text-espresso">
                {selectedSection.title}
              </h2>
            </header>

            <ul className="mx-auto mt-10 grid max-w-6xl items-start gap-x-16 gap-y-10 md:mt-20 md:grid-cols-2 md:gap-y-14">
              {selectedSection.items.map((item, itemIndex) => {
                const alignRight = itemIndex % 2 === 1;

                return (
                  <li
                    key={`${item.name}-${itemIndex}`}
                    className={`w-full max-w-xl text-left md:w-[92%] ${
                      alignRight
                        ? "md:ml-auto md:text-right md:justify-self-end"
                        : "md:mr-auto md:text-left md:justify-self-start"
                    }`}
                  >
                    <div className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 ${alignRight ? "md:justify-end" : "md:justify-start"}`}>
                      <h3 className="text-lg font-medium leading-tight tracking-[-0.025em] text-espresso md:text-xl">{item.name}</h3>
                      <p className="text-sm font-medium tabular-nums text-olive-deep md:text-base">{item.price}</p>
                    </div>
                    {item.description && <p className="mt-2.5 text-[0.8rem] leading-[1.55] text-espresso-soft md:text-[0.88rem]">{item.description}</p>}
                    {item.extras && <p className="mt-2.5 text-[0.75rem] italic leading-[1.55] text-olive-deep md:text-[0.82rem]">{item.extras}</p>}
                  </li>
                );
              })}
            </ul>
            {selectedSection.extras && <p className="mx-auto mt-14 max-w-3xl text-center text-[0.75rem] italic leading-[1.55] text-olive-deep md:text-[0.82rem]">{selectedSection.extras}</p>}
          </section>

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
