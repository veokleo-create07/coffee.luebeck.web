"use client";

import { Menu, X } from "lucide-react";
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
  const links = [{ label: dictionary.navigation.story, href: "#story" }, { label: dictionary.navigation.visit, href: "#visit" }, { label: dictionary.navigation.menu, href: "#menu" }];

  return <header className="relative z-20 page-gutter pt-6 md:pt-8"><nav className="flex items-center justify-between" aria-label="Primary navigation">
    <Link href={homeHref} className="group flex items-center py-1" onClick={() => setIsOpen(false)} aria-label="Altstadtliebe — home"><Image src="/altstadtliebe-logo.png" alt="Altstadtliebe" width={192} height={64} priority className="h-auto w-36 object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:w-40 md:w-48" /></Link>
    <div className="hidden items-center gap-8 md:flex">{links.map((link) => <a key={link.href} href={link.href} className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-espresso-soft transition-colors hover:text-espresso">{link.label}</a>)}<LanguageSwitcher locale={locale} label={dictionary.navigation.switchTo} /></div>
    <button type="button" className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] md:hidden" aria-expanded={isOpen} aria-controls="mobile-navigation" aria-label={isOpen ? dictionary.navigation.closeMenu : dictionary.navigation.openMenu} onClick={() => setIsOpen((open) => !open)}>{isOpen ? <X size={17} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={17} strokeWidth={1.5} aria-hidden="true" />}<span>{dictionary.navigation.menu}</span></button>
  </nav>{isOpen && <div id="mobile-navigation" className="bg-ivory py-6 md:hidden"><div className="flex flex-col gap-5">{links.map((link) => <a key={link.href} href={link.href} className="text-2xl font-medium tracking-[-0.04em]" onClick={() => setIsOpen(false)}>{link.label}</a>)}<LanguageSwitcher locale={locale} label={dictionary.navigation.switchTo} /></div></div>}</header>;
}
