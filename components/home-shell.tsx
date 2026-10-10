import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Hero } from "./hero";

type HomeShellProps = { locale: Locale; dictionary: Dictionary };

export function HomeShell({ locale, dictionary }: HomeShellProps) {
  return <div className="min-h-screen overflow-hidden"><SiteHeader locale={locale} dictionary={dictionary} /><main><Hero dictionary={dictionary} locale={locale} /><section id="story" className="page-gutter bg-olive py-12 text-ivory md:py-16" aria-label={dictionary.home.note}><div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><p className="text-2xl font-medium tracking-[-0.04em] md:text-4xl">{dictionary.home.note}</p><span className="text-xs font-bold uppercase tracking-[0.14em] text-ivory/70" aria-hidden="true">01 / 01</span></div></section></main><SiteFooter locale={locale} dictionary={dictionary} /></div>;
}
