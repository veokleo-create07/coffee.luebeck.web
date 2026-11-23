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
        dateModified: "2026-11-23",
      },
      {
        "@type": "Menu",
        "@id": menuId,
        name: locale === "de" ? "Speisekarte von Altstadtliebe" : "Altstadtliebe menu",
        inLanguage: locale === "de" ? "de-DE" : "en-GB",
        mainEntityOfPage: { "@id": `${absoluteUrl(route)}#webpage` },
        hasMenuSection: copy.sections.map((section) => ({
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
          <header className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow mb-6">{copy.eyebrow}</p>
              <h1 className="editorial-heading text-[clamp(4rem,9vw,9rem)] font-semibold leading-[0.82] tracking-[-0.065em] text-espresso">{copy.title}</h1>
            </div>
            <div>
              <p className="max-w-xl text-lg leading-[1.55] text-espresso-soft md:text-xl">{copy.intro}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={SEO_ROUTES.matcha[locale]} className="site-button site-button-secondary">Matcha in Lübeck</Link>
                <Link href={SEO_ROUTES.cafe[locale]} className="site-button site-button-secondary">Café in Lübeck</Link>
              </div>
            </div>
          </header>

          <div className="mt-16 space-y-5 md:mt-24 md:space-y-8">
            {copy.sections.map((section, sectionIndex) => (
              <section key={`${sectionIndex}-${section.title}`} className="overflow-hidden rounded-[1.5rem] bg-[#eee9e1] md:rounded-[2rem]" aria-labelledby={`menu-section-${sectionIndex}`}>
                <header className="border-b border-espresso/10 px-6 py-8 sm:px-8 md:px-12 md:py-12">
                  <p className="eyebrow mb-4">{String(sectionIndex + 1).padStart(2, "0")}</p>
                  <h2 id={`menu-section-${sectionIndex}`} className="editorial-heading max-w-4xl text-[clamp(2.65rem,6vw,5.75rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-espresso">
                    {section.title}
                  </h2>
                </header>

                <ol className="px-6 sm:px-8 md:px-12">
                  {section.items.map((item, itemIndex) => (
                    <li key={item.name} className="grid gap-3 border-b border-espresso/10 py-7 last:border-b-0 md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-10 md:py-9">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-3">
                          <span className="w-6 shrink-0 text-xs font-semibold tabular-nums text-olive-deep" aria-hidden="true">{String(item.number ?? itemIndex + 1).padStart(2, "0")}</span>
                          <h3 className="text-xl font-semibold leading-tight tracking-[-0.025em] text-espresso md:text-2xl">{item.name}</h3>
                        </div>
                        {item.description && <p className="mt-3 max-w-3xl pl-9 text-[0.95rem] leading-[1.6] text-espresso-soft md:text-base">{item.description}</p>}
                        {item.extras && <p className="mt-3 max-w-3xl pl-9 text-sm italic leading-[1.6] text-olive-deep">{item.extras}</p>}
                      </div>
                      <p className="pl-9 text-base font-semibold tabular-nums text-espresso md:pl-0 md:text-lg">{item.price}</p>
                    </li>
                  ))}
                </ol>
                {section.extras && <p className="border-t border-espresso/10 px-6 py-6 text-sm italic leading-[1.6] text-olive-deep sm:px-8 md:px-12">{section.extras}</p>}
              </section>
            ))}
          </div>

          <section className="mt-16 overflow-hidden rounded-[1.5rem] bg-[#eee9e1] px-6 py-10 sm:px-8 md:mt-24 md:rounded-[2rem] md:px-12 md:py-16 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-5">{copy.occasion.subtitle}</p>
              <h2 className="editorial-heading max-w-3xl text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-espresso">{copy.occasion.title}</h2>
            </div>
            <div className="mt-9 flex flex-col justify-end lg:mt-0">
              <div className="space-y-4 text-base leading-[1.65] text-espresso-soft md:text-lg">
                {copy.occasion.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-8 border-t border-espresso/10 pt-6">
                <p className="text-sm text-espresso-soft">{copy.occasion.instagramLabel}</p>
                <a href="https://www.instagram.com/altstadtliebe.luebeck/" target="_blank" rel="noreferrer" className="mt-2 inline-block text-lg font-semibold text-espresso underline decoration-brass underline-offset-4 transition-colors hover:text-olive-deep">
                  {copy.occasion.instagramHandle}
                </a>
              </div>
            </div>
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
