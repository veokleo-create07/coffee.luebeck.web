"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

type SiteHeaderProps = { locale: Locale; dictionary: Dictionary };

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const homeHref = locale === "de" ? "/" : "/en";
  const links = [{ label: dictionary.navigation.menu, href: "#menu-preview" }, { label: dictionary.navigation.reviews, href: "#reviews" }, { label: dictionary.navigation.reservation, href: "#reservation-title" }];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (window.localStorage.getItem("altstadtliebe-locale") || window.location.pathname !== "/") return;
    if (window.navigator.language.toLowerCase().startsWith("en")) window.location.replace("/en");
  }, []);

  return <header data-menu-open={isOpen || undefined} className="site-header relative z-50 page-gutter pt-6 md:pt-8"><nav className="relative z-50 flex items-center justify-between" aria-label="Primary navigation">
    <Link href={homeHref} className="group flex items-center py-1" onClick={() => setIsOpen(false)} aria-label="Altstadtliebe — home"><Image src="/altstadtliebe-logo.png" alt="Altstadtliebe" width={192} height={64} priority className="site-logo h-auto w-36 object-contain transition-[filter,transform] duration-300 group-hover:scale-[1.02] sm:w-40 md:w-52" /></Link>
    <div className="flex items-center gap-3"><LanguageSwitcher locale={locale} label={dictionary.navigation.switchTo} /><button type="button" className="group relative inline-flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full bg-espresso text-ivory shadow-[0_18px_28px_-18px_rgba(44,33,28,0.85)] transition-[background-color,color,transform] duration-300 hover:scale-[1.03] active:scale-95 data-[open=true]:bg-ivory data-[open=true]:text-espresso" data-open={isOpen || undefined} aria-expanded={isOpen} aria-controls="navigation-menu" aria-label={isOpen ? dictionary.navigation.closeMenu : dictionary.navigation.openMenu} onClick={() => setIsOpen((open) => !open)}><span className={`absolute h-[2px] w-7 bg-current transition-transform duration-300 ${isOpen ? "rotate-45" : "-translate-y-[4px]"}`} aria-hidden="true" /><span className={`absolute h-[2px] w-7 bg-current transition-transform duration-300 ${isOpen ? "-rotate-45" : "translate-y-[4px]"}`} aria-hidden="true" /></button></div>
  </nav>{isOpen && <div id="navigation-menu" className="navigation-overlay fixed inset-0 z-40 flex items-center justify-center bg-espresso px-[var(--page-gutter)] pb-16 pt-28 text-ivory"><div className="w-full max-w-3xl">{links.map((link) => <a key={link.href} href={link.href} className="group flex items-center justify-between border-b border-ivory/20 py-5 text-[clamp(2.75rem,8vw,7rem)] font-normal leading-none tracking-[-0.055em] transition-colors first:border-t first:border-ivory/20 hover:text-brass" onClick={() => setIsOpen(false)}><span>{link.label}</span><ArrowUpRight size={40} strokeWidth={1.25} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:size-16" /></a>)}<div className="mt-8"><LanguageSwitcher locale={locale} label={dictionary.navigation.switchTo} /></div></div></div>}
  </header>;
}
