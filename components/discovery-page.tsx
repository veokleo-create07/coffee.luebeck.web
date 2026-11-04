import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { DiscoveryPageContent } from "@/lib/discovery-content";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl, BUSINESS_ID, SEO_ROUTES } from "@/lib/seo";
import { JsonLd } from "./json-ld";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type DiscoveryPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  content: DiscoveryPageContent;
  page: "matcha" | "cafe";
};

export function DiscoveryPage({ locale, dictionary, content, page }: DiscoveryPageProps) {
  const route = SEO_ROUTES[page][locale];
  const languageHref = SEO_ROUTES[page][locale === "de" ? "en" : "de"];
  const menuHref = SEO_ROUTES.menu[locale];
  const reservationHref = SEO_ROUTES.reservation[locale];
  const breadcrumbs = [
    { name: locale === "de" ? "Start" : "Home", url: absoluteUrl(SEO_ROUTES.home[locale]) },
    { name: content.eyebrow, url: absoluteUrl(route) },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl(route)}#webpage`,
        url: absoluteUrl(route),
        name: content.title,
        description: content.intro,
        inLanguage: locale === "de" ? "de-DE" : "en-GB",
        about: { "@id": BUSINESS_ID },
        breadcrumb: { "@id": `${absoluteUrl(route)}#breadcrumb` },
        primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(content.image) },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${absoluteUrl(route)}#breadcrumb`,
        itemListElement: breadcrumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.url })),
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-hidden bg-ivory">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} dictionary={dictionary} languageHref={languageHref} />
      <main>
        <section className="page-gutter pb-20 pt-16 md:pb-28 md:pt-24 lg:pb-36 lg:pt-32">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div className="max-w-3xl">
              <p className="eyebrow mb-6">{content.eyebrow}</p>
              <h1 className="editorial-heading text-balance text-[clamp(3.25rem,7vw,7.5rem)] font-semibold leading-[0.87] tracking-[-0.06em] text-espresso">{content.title}</h1>
              <p className="mt-8 max-w-2xl text-lg leading-[1.5] text-espresso-soft md:text-xl">{content.intro}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={reservationHref} className="site-button site-button-primary">{content.reservationCta}</Link>
                <Link href={menuHref} className="site-button site-button-secondary">{content.menuCta}</Link>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-espresso/10 md:rounded-[2rem]">
              <Image src={content.image} alt={content.imageAlt} fill priority sizes="(max-width: 1023px) 100vw, 44vw" className="object-cover" />
            </div>
          </div>
        </section>

        <section className="page-gutter bg-[#eee9e1] py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {content.sections.map((section) => (
              <article key={section.title} className="rounded-[1.25rem] bg-ivory p-7 md:p-9">
                <h2 className="text-2xl font-semibold tracking-[-0.035em] text-espresso">{section.title}</h2>
                <p className="mt-4 text-base leading-[1.6] text-espresso-soft">{section.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-gutter py-20 md:py-28" aria-labelledby="local-questions-title">
          <div className="mx-auto max-w-5xl">
            <h2 id="local-questions-title" className="editorial-heading text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-espresso">{locale === "de" ? "Gut zu wissen." : "Good to know."}</h2>
            <div className="mt-12 divide-y divide-espresso/15 border-y border-espresso/15">
              {content.questions.map((item) => (
                <article key={item.question} className="grid gap-3 py-7 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:py-9">
                  <h3 className="text-lg font-semibold text-espresso md:text-xl">{item.question}</h3>
                  <p className="leading-[1.6] text-espresso-soft">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
