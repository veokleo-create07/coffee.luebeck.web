import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

type SiteFooterProps = { locale: Locale; dictionary: Dictionary };

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const homeHref = locale === "de" ? "/" : "/en";
  return <footer className="page-gutter border-t border-line py-8 md:py-10"><div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><Link href={homeHref} className="text-lg font-bold tracking-[-0.04em]">Altstadtliebe</Link><p className="mt-2 text-sm text-espresso-soft">{dictionary.footer.claim}</p></div><div className="flex gap-6 text-xs font-bold uppercase tracking-[0.12em] text-espresso-soft"><a href="#imprint" className="transition-colors hover:text-espresso">{dictionary.footer.imprint}</a><a href="#privacy" className="transition-colors hover:text-espresso">{dictionary.footer.privacy}</a></div></div></footer>;
}
