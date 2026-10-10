import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type HomeShellProps = { locale: Locale; dictionary: Dictionary };

export function HomeShell({ locale, dictionary }: HomeShellProps) {
  return <div className="min-h-screen overflow-hidden"><SiteHeader locale={locale} dictionary={dictionary} /><main><section className="page-gutter flex min-h-[calc(100svh-6.5rem)] items-center py-20 md:min-h-[calc(100svh-8rem)] md:py-28" aria-labelledby="hero-title"><div className="grid w-full gap-14 md:grid-cols-[minmax(0,1.25fr)_minmax(14rem,0.75fr)] md:items-end md:gap-12"><div><p className="eyebrow mb-7">{dictionary.home.eyebrow}</p><h1 id="hero-title" className="editorial-heading max-w-4xl whitespace-pre-line text-[clamp(4.5rem,14vw,12rem)] font-medium leading-[0.82] text-espresso">{dictionary.home.title}</h1></div><div className="max-w-xs md:mb-2 md:justify-self-end"><p className="text-lg leading-[1.25] text-espresso-soft md:text-xl">{dictionary.home.intro}</p><a href="#story" className="group mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em]"><span className="h-px w-8 bg-brass transition-all group-hover:w-12" aria-hidden="true" />{dictionary.home.cta}</a></div></div></section><section id="story" className="page-gutter bg-olive py-12 text-ivory md:py-16" aria-label={dictionary.home.note}><div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><p className="text-2xl font-medium tracking-[-0.04em] md:text-4xl">{dictionary.home.note}</p><span className="text-xs font-bold uppercase tracking-[0.14em] text-ivory/70" aria-hidden="true">01 / 01</span></div></section></main><SiteFooter locale={locale} dictionary={dictionary} /></div>;
}
