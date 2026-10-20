import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type LanguageSwitcherProps = { locale: Locale; label: string };

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const nextLocale: Locale = locale === "de" ? "en" : "de";
  const href = nextLocale === "de" ? "/" : "/en";
  const currentLabel = locale === "de" ? "De" : "En";
  const nextLabel = nextLocale === "de" ? "De" : "En";

  return <div className="nav-language-toggle" aria-label={label} role="group"><span className="language-option language-option-active" aria-current="page">{currentLabel}</span><Link href={href} hrefLang={nextLocale} className="language-option language-option-link" aria-label={`${label} — ${nextLabel}`} onClick={() => window.localStorage.setItem("altstadtliebe-locale", nextLocale)}>{nextLabel}</Link></div>;
}
