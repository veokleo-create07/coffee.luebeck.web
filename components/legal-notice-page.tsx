import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type LegalNoticePageProps = { locale: Locale; dictionary: Dictionary };

const legalCopy = {
  de: {
    title: "Impressum",
    statutoryNote: "Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)",
    businessType: "Einzelunternehmen",
    proprietorLabel: "Inhaber",
    contactHeading: "Kontakt",
    phoneLabel: "Telefon",
    vatHeading: "Umsatzsteuer-Identifikationsnummer",
    vatLabel: "Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz (UStG)",
    backLabel: "Zurück zur Startseite",
  },
  en: {
    title: "Legal Notice",
    statutoryNote: "Information pursuant to Section 5 of the German Digital Services Act (DDG)",
    businessType: "Sole proprietorship",
    proprietorLabel: "Proprietor",
    contactHeading: "Contact",
    phoneLabel: "Phone",
    vatHeading: "VAT Identification Number",
    vatLabel: "VAT identification number pursuant to Section 27a of the German VAT Act (UStG)",
    backLabel: "Back to homepage",
  },
} as const;

export function LegalNoticePage({ locale, dictionary }: LegalNoticePageProps) {
  const copy = legalCopy[locale];
  const homeHref = locale === "de" ? "/" : "/en";
  const languageHref = locale === "de" ? "/en/legal-notice" : "/impressum";

  return (
    <div className="min-h-screen overflow-hidden bg-ivory text-espresso">
      <SiteHeader locale={locale} dictionary={dictionary} languageHref={languageHref} />
      <main className="page-gutter py-20 md:py-28">
        <article className="mx-auto max-w-4xl">
          <header className="max-w-3xl">
            <p className="eyebrow">Altstadtliebe</p>
            <h1 className="editorial-heading mt-6 text-[clamp(3.5rem,9vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.055em]">
              {copy.title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-[1.55] text-espresso-soft md:text-lg">
              {copy.statutoryNote}
            </p>
          </header>

          <div className="mt-16 grid gap-x-16 gap-y-12 border-t border-espresso/15 pt-10 md:mt-20 md:grid-cols-2 md:pt-12">
            <section aria-labelledby="business-heading">
              <h2 id="business-heading" className="text-2xl font-semibold tracking-[-0.035em] md:text-3xl">Altstadtliebe</h2>
              <address className="mt-5 space-y-1 not-italic text-base leading-[1.55] text-espresso-soft md:text-lg">
                <p>{copy.businessType}</p>
                <p><span className="text-espresso">{copy.proprietorLabel}:</span> Kubilay Kilic</p>
                <p className="pt-3">Mühlenstraße 51<br />23552 Lübeck<br />{locale === "de" ? "Deutschland" : "Germany"}</p>
              </address>
            </section>

            <section aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-2xl font-semibold tracking-[-0.035em] md:text-3xl">{copy.contactHeading}</h2>
              <p className="mt-5 text-base leading-[1.55] text-espresso-soft md:text-lg">
                <span className="text-espresso">{copy.phoneLabel}:</span>{" "}
                <a className="underline decoration-espresso/25 underline-offset-4 transition-colors hover:decoration-espresso" href={dictionary.location.phoneHref}>
                  {dictionary.location.phoneLabel}
                </a>
              </p>
            </section>

            <section aria-labelledby="vat-heading" className="border-t border-espresso/15 pt-10 md:col-span-2">
              <h2 id="vat-heading" className="text-2xl font-semibold tracking-[-0.035em] md:text-3xl">{copy.vatHeading}</h2>
              <p className="mt-5 max-w-2xl text-base leading-[1.55] text-espresso-soft md:text-lg">
                {copy.vatLabel}: <span className="font-medium text-espresso">DE452357082</span>
              </p>
            </section>
          </div>

          <Link href={homeHref} className="site-button site-button-secondary mt-14 md:mt-16">
            {copy.backLabel}
          </Link>
        </article>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
