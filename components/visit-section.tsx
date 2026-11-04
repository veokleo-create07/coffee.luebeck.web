import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SEO_ROUTES } from "@/lib/seo";

export function VisitSection({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <section className="page-gutter bg-[#eee9e1] py-20 text-espresso md:py-28" aria-labelledby="visit-altstadtliebe-title">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <div>
          <p className="eyebrow mb-6">{locale === "de" ? "Besuch uns" : "Visit us"}</p>
          <h2 id="visit-altstadtliebe-title" className="editorial-heading text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.88] tracking-[-0.055em]">{locale === "de" ? "Mitten in Lübecks Altstadt." : "In the heart of Lübeck's Old Town."}</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-olive-deep">{dictionary.location.addressLabel}</h3>
            <address className="mt-3 not-italic text-lg leading-[1.5] text-espresso-soft">{dictionary.location.addressLines[0]}<br />{dictionary.location.addressLines[1]}</address>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-olive-deep">{dictionary.location.hoursLabel}</h3>
            <p className="mt-3 text-lg leading-[1.5] text-espresso-soft">{dictionary.location.hours.map((line) => <span key={line} className="block">{line}</span>)}</p>
          </div>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <a href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className="site-button site-button-primary">{dictionary.location.directions}</a>
            <Link href={SEO_ROUTES.reservation[locale]} className="site-button site-button-secondary">{dictionary.reservation.cta}</Link>
            <a href={dictionary.location.phoneHref} className="site-button site-button-secondary">{dictionary.location.phoneLabel}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
