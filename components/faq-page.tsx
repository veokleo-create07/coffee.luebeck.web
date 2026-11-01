import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type FaqPageProps = { locale: Locale; dictionary: Dictionary };

export function FaqSection({ dictionary }: { dictionary: Dictionary }) {
  const copy = dictionary.faq;

  return (
    <section className="bg-ivory px-[var(--page-gutter)] py-24 text-espresso md:py-32" aria-labelledby="homepage-faq-title">
      <div className="mx-auto max-w-4xl">
        <header className="max-w-2xl">
          <h2 id="homepage-faq-title" className="editorial-heading text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[0.9] tracking-[-0.055em]">{copy.title}</h2>
          <p className="mt-7 max-w-xl text-base leading-[1.55] text-espresso-soft md:text-lg">{copy.intro}</p>
        </header>
        <div className="mt-12 border-t border-espresso/15 md:mt-16">
          {copy.items.map((item) => (
            <details key={item.question} className="group border-b border-espresso/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-medium marker:hidden md:py-6 md:text-xl [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span aria-hidden="true" className="shrink-0 text-2xl font-normal transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-2xl pb-6 pr-10 text-sm leading-[1.65] text-espresso-soft md:text-base">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqPage({ locale, dictionary }: FaqPageProps) {
  const copy = dictionary.faq;
  const homeHref = locale === "de" ? "/" : "/en";
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";

  return (
    <div className="min-h-screen overflow-hidden bg-ivory">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main className="page-gutter py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl">
          <header className="max-w-2xl">
            <p className="eyebrow mb-6">{copy.eyebrow}</p>
            <h1 className="editorial-heading text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.055em] text-espresso">{copy.title}</h1>
            <p className="mt-8 max-w-xl text-base leading-[1.55] text-espresso-soft md:text-lg">{copy.intro}</p>
          </header>
          <section aria-label={copy.title} className="mt-16 border-t border-espresso/15 md:mt-24">
            {copy.items.map((item) => (
              <details key={item.question} className="group border-b border-espresso/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-medium text-espresso marker:hidden md:py-8 md:text-2xl [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span aria-hidden="true" className="shrink-0 text-2xl font-normal transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pb-7 pr-10 text-sm leading-[1.65] text-espresso-soft md:pb-9 md:text-base">{item.answer}</p>
              </details>
            ))}
          </section>
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
