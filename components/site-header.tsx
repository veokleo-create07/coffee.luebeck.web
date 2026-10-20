"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

type SiteHeaderProps = { locale: Locale; dictionary: Dictionary };

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const homeHref = locale === "de" ? "/" : "/en";
  const links = [{ label: dictionary.navigation.menu, href: "#menu-preview" }, { label: dictionary.navigation.reviews, href: "#reviews" }, { label: dictionary.navigation.reservation, href: "#reservation-title" }];

  return <header className="relative z-30 page-gutter pt-6 md:pt-8"><nav className="relative flex items-center justify-between" aria-label="Primary navigation">
    <Link href={homeHref} className="group flex items-center py-1" onClick={() => setIsOpen(false)} aria-label="Altstadtliebe — home"><Image src="/altstadtliebe-logo.png" alt="Altstadtliebe" width={192} height={64} priority className="h-auto w-36 object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:w-40 md:w-52" /></Link>
    <div className="flex items-center gap-3"><LanguageSwitcher locale={locale} label={dictionary.navigation.switchTo} /><button type="button" className="group inline-flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full bg-espresso text-ivory shadow-[0_18px_28px_-18px_rgba(44,33,28,0.85)] transition-transform duration-300 hover:scale-[1.03] active:scale-95" aria-expanded={isOpen} aria-controls="navigation-menu" aria-label={isOpen ? dictionary.navigation.closeMenu : dictionary.navigation.openMenu} onClick={() => setIsOpen((open) => !open)}><span className="h-[2px] w-7 bg-ivory transition-transform duration-300 group-aria-expanded:translate-y-[4px]" aria-hidden="true" /><span className="h-[2px] w-7 bg-ivory transition-transform duration-300 group-aria-expanded:-translate-y-[4px]" aria-hidden="true" /></button></div>
    {isOpen && <div id="navigation-menu" className="absolute right-0 top-[calc(100%+1rem)] w-[min(18rem,calc(100vw-2.5rem))] rounded-[1.5rem] bg-espresso p-6 text-ivory shadow-[0_24px_48px_-24px_rgba(44,33,28,0.7)]"><div className="flex flex-col gap-1">{links.map((link) => <a key={link.href} href={link.href} className="rounded-xl px-3 py-3 text-xl font-medium tracking-[-0.04em] transition-colors hover:bg-ivory/10" onClick={() => setIsOpen(false)}>{link.label}</a>)}</div></div>}
  </nav></header>;
}
