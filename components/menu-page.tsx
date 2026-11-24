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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <main className="page-gutter pb-24 pt-10 md:pb-32 md:pt-14 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <header className="text-center">
            <h1 className="editorial-heading mx-auto max-w-[21ch] text-balance text-center text-[clamp(2rem,4vw,3.75rem)] font-medium leading-[0.98] tracking-[-0.05em] text-espresso">{copy.title}</h1>
          </header>

          <div className="mx-auto mt-10 max-w-6xl md:mt-14 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-16 xl:gap-24">
            <aside>
              <div className="lg:hidden">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-espresso-soft">{locale === "de" ? "Menübereich" : "Menu section"}</p>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((current) => !current)}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu-sections"
                  className="mt-1 flex min-h-12 w-full items-center justify-between gap-4 border-b border-espresso/20 py-2 text-left text-base font-medium text-espresso"
                >
                  <span>{selectedSection.title}</span>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-4 shrink-0 transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : "rotate-0"}`} fill="none">
                    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {mobileMenuOpen && (
                  <nav id="mobile-menu-sections" aria-label={locale === "de" ? "Menübereiche" : "Menu sections"} className="menu-item-details border-b border-espresso/10 py-3">
                    {menuSections.map((section, sectionIndex) => (
                      <button
                        key={`${sectionIndex}-${section.title}`}
                        type="button"
                        onClick={() => {
                          setActiveSection(sectionIndex);
                          setExpandedItem(null);
                          setMobileMenuOpen(false);
                        }}
                        aria-pressed={activeSection === sectionIndex}
                        className={`block min-h-10 w-full py-2 text-left text-sm transition-colors ${activeSection === sectionIndex ? "font-semibold text-espresso" : "font-normal text-espresso-soft"}`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                )}
              </div>

              <nav aria-label={locale === "de" ? "Menübereiche" : "Menu sections"} className="sticky top-8 hidden flex-col items-start gap-1 lg:flex">
                <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-espresso-soft">{locale === "de" ? "Menü" : "Menu"}</p>
                {menuSections.map((section, sectionIndex) => (
                  <button
                    key={`${sectionIndex}-${section.title}`}
                    type="button"
                    onClick={() => {
                      setActiveSection(sectionIndex);
                      setExpandedItem(null);
                    }}
                    aria-pressed={activeSection === sectionIndex}
                    className={`group flex min-h-10 items-center gap-3 py-2 text-left text-[0.92rem] transition-colors ${activeSection === sectionIndex ? "font-semibold text-espresso" : "font-normal text-espresso-soft hover:text-espresso"}`}
                  >
                    <span aria-hidden="true" className={`h-px bg-espresso transition-[width,opacity] duration-300 ${activeSection === sectionIndex ? "w-4 opacity-100" : "w-0 opacity-0 group-hover:w-2 group-hover:opacity-40"}`} />
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </aside>

            <section key={selectedSection.title} className="menu-section-panel mt-12 lg:mt-0" aria-labelledby="selected-menu-section">
              <header className="text-center lg:text-left">
                <h2 id="selected-menu-section" className="editorial-heading max-w-[21ch] text-balance text-[clamp(2rem,3.8vw,3.5rem)] font-medium leading-[0.96] tracking-[-0.05em] text-espresso">
                  {selectedSection.title}
                </h2>
              </header>

            <ul className="mt-10 grid items-start gap-x-10 gap-y-9 md:grid-cols-2 md:gap-y-11">
              {selectedSection.items.map((item, itemIndex) => {
                const itemKey = `${selectedSection.title}-${itemIndex}`;
                const hasDetails = Boolean(item.description || item.extras);
                const isExpanded = expandedItem === itemKey;

                return (
                  <li
                    key={`${item.name}-${itemIndex}`}
                    className="w-full text-left"
                  >
                    {hasDetails ? (
                      <button
                        type="button"
                        onClick={() => setExpandedItem(isExpanded ? null : itemKey)}
                        aria-expanded={isExpanded}
                        aria-controls={`menu-item-details-${activeSection}-${itemIndex}`}
                        className="group flex w-full items-baseline justify-between gap-x-4 gap-y-1 text-left outline-none"
                      >
                        <h3 className="text-lg font-medium leading-tight tracking-[-0.025em] text-espresso md:text-xl">{item.name}</h3>
                        <span className="flex shrink-0 items-center gap-3">
                          <span className="text-sm font-medium tabular-nums text-olive-deep md:text-base">{item.price}</span>
                          <span aria-hidden="true" className={`inline-flex size-6 items-center justify-center text-xl font-light leading-none text-espresso transition-transform duration-300 ${isExpanded ? "rotate-45" : "rotate-0"}`}>+</span>
                        </span>
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-lg font-medium leading-tight tracking-[-0.025em] text-espresso md:text-xl">{item.name}</h3>
                        <p className="text-sm font-medium tabular-nums text-olive-deep md:text-base">{item.price}</p>
                      </div>
                    )}
                    {isExpanded && (
                      <div id={`menu-item-details-${activeSection}-${itemIndex}`} className="menu-item-details">
                        {item.description && <p className="mt-2.5 text-[0.8rem] leading-[1.55] text-espresso-soft md:text-[0.88rem]">{item.description}</p>}
                        {item.extras && <p className="mt-2.5 text-[0.75rem] italic leading-[1.55] text-olive-deep md:text-[0.82rem]">{item.extras}</p>}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            {selectedSection.extras && <p className="mx-auto mt-14 max-w-3xl text-center text-[0.75rem] italic leading-[1.55] text-olive-deep md:text-[0.82rem]">{selectedSection.extras}</p>}
            </section>
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
