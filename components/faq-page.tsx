"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl, BUSINESS_ID, SEO_ROUTES } from "@/lib/seo";
import { JsonLd } from "./json-ld";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type FaqPageProps = { locale: Locale; dictionary: Dictionary };

type FaqItem = { question: string; answer: string };

function FaqList({ items, page = false }: { items: FaqItem[]; page?: boolean }) {
  return (
    <div className="border-t border-espresso/15">
      {items.map((item) => <FaqRow key={item.question} item={item} page={page} />)}
    </div>
  );
}

function FaqRow({ item, page }: { item: FaqItem; page: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId().replace(/:/g, "");
  const answerId = `faq-answer-${id}`;

  return (
    <div className="border-b border-espresso/15">
      <button
        type="button"
        className={`group flex w-full cursor-pointer items-center justify-between gap-6 text-left font-medium text-espresso ${page ? "py-6 text-lg md:py-8 md:text-2xl" : "py-5 text-lg md:py-6 md:text-xl"}`}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{item.question}</span>
        <span aria-hidden="true" className={`shrink-0 text-2xl font-normal transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "rotate-45" : "rotate-0"}`}>+</span>
      </button>
      <div
        id={answerId}
        role="region"
        aria-hidden={!isOpen}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className={`min-h-0 overflow-hidden pr-10 transition-[opacity,transform,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "translate-y-0 pb-7 opacity-100 md:pb-9" : "translate-y-2 pb-0 opacity-0"}`}>
          <p className={`max-w-2xl text-sm leading-[1.65] text-espresso-soft ${page ? "md:text-base" : "md:text-base"}`}>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection({ dictionary }: { dictionary: Dictionary }) {
  const copy = dictionary.faq;

  return (
    <section className="bg-ivory px-[var(--page-gutter)] py-24 text-espresso md:py-32" aria-labelledby="homepage-faq-title">
      <div className="mx-auto max-w-4xl">
        <header className="max-w-2xl">
          <h2 id="homepage-faq-title" className="editorial-heading text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[0.9] tracking-[-0.055em]">{copy.title}</h2>
          <p className="mt-7 max-w-xl text-base leading-[1.55] text-espresso-soft md:text-lg">{copy.intro}</p>
        </header>
        <div className="mt-12 md:mt-16"><FaqList items={copy.items} /></div>
      </div>
    </section>
  );
}

export function FaqPage({ locale, dictionary }: FaqPageProps) {
  const copy = dictionary.faq;
  const homeHref = SEO_ROUTES.home[locale];
  const reservationHref = SEO_ROUTES.reservation[locale];
  const route = SEO_ROUTES.faq[locale];
  const languageHref = SEO_ROUTES.faq[locale === "de" ? "en" : "de"];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${absoluteUrl(route)}#faq`,
        url: absoluteUrl(route),
        inLanguage: locale === "de" ? "de-DE" : "en-GB",
        about: { "@id": BUSINESS_ID },
        mainEntity: copy.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${absoluteUrl(route)}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: dictionary.navigation.home, item: absoluteUrl(homeHref) },
          { "@type": "ListItem", position: 2, name: copy.title, item: absoluteUrl(route) },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-hidden bg-ivory">
      <JsonLd data={structuredData} />
      <SiteHeader locale={locale} dictionary={dictionary} languageHref={languageHref} />
      <main className="page-gutter py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl">
          <header className="max-w-2xl">
            <p className="eyebrow mb-6">{copy.eyebrow}</p>
            <h1 className="editorial-heading text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.055em] text-espresso">{copy.title}</h1>
            <p className="mt-8 max-w-xl text-base leading-[1.55] text-espresso-soft md:text-lg">{copy.intro}</p>
          </header>
          <section aria-label={copy.title} className="mt-16 md:mt-24"><FaqList items={copy.items} page /></section>
          <div className="mt-12 flex flex-wrap items-center gap-4 md:mt-16">
            <Link href={reservationHref} className="site-button site-button-primary">{copy.cta}</Link>
            <Link href={homeHref} className="site-button site-button-secondary">{dictionary.navigation.home}</Link>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
