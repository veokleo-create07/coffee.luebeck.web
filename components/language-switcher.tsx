import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type LanguageSwitcherProps = { locale: Locale; label: string };

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const nextLocale: Locale = locale === "de" ? "en" : "de";
  const href = nextLocale === "de" ? "/" : "/en";

  return <Link href={href} hrefLang={nextLocale} className="nav-language-toggle group inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-espresso transition-colors hover:text-olive" aria-label={`${label} — ${nextLocale.toUpperCase()}`}><span className="h-px w-4 bg-brass transition-all group-hover:w-6" aria-hidden="true" />{label}</Link>;
}
