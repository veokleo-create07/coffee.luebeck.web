import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type UtilityPageProps = { locale: Locale; dictionary: Dictionary; title: string; body: string };

export function UtilityPage({ locale, dictionary, title, body }: UtilityPageProps) {
  const homeHref = locale === "de" ? "/" : "/en";
  return <div className="min-h-screen overflow-hidden"><SiteHeader locale={locale} dictionary={dictionary} /><main className="page-gutter flex min-h-[calc(100svh-12rem)] items-center justify-center py-24 text-center"><div className="max-w-2xl"><p className="eyebrow mb-7">Altstadtliebe</p><h1 className="editorial-heading text-6xl font-bold leading-[0.9] text-espresso md:text-8xl">{title}</h1><p className="mx-auto mt-8 max-w-md text-lg leading-[1.35] text-espresso-soft">{body}</p><Link href={homeHref} className="site-button site-button-secondary mt-10">{dictionary.navigation.home}</Link></div></main><SiteFooter locale={locale} dictionary={dictionary} /></div>;
}
