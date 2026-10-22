"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

type SiteHeaderProps = { locale: Locale; dictionary: Dictionary; languageHref?: string };

export function SiteHeader({ locale, dictionary, languageHref }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const homeHref = locale === "de" ? "/" : "/en";
  const links = [{ label: dictionary.navigation.menu, href: "#menu-preview" }, { label: dictionary.navigation.reviews, href: "#reviews" }, { label: dictionary.navigation.reservation, href: "#reservation-title" }];

  const closeMenu = useCallback(() => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimer.current = null;
    }, 360);
  }, [isOpen, isClosing]);

  useEffect(() => {
    document.body.style.overflow = isOpen || isClosing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isClosing]);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen && !isClosing) closeMenu();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isClosing, closeMenu]);

  function openMenu() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setIsClosing(false);
    setIsOpen(true);
  }

  useEffect(() => {
    if (window.localStorage.getItem("altstadtliebe-locale") || window.location.pathname !== "/") return;
    if (window.navigator.language.toLowerCase().startsWith("en")) window.location.replace("/en");
  }, []);

  return <header data-menu-open={isOpen && !isClosing || undefined} className="site-header relative z-50 page-gutter pt-6 md:pt-8"><nav className="relative z-50 flex items-center justify-between" aria-label="Primary navigation">
    <Link href={homeHref} className="group flex items-center py-1" onClick={closeMenu} aria-label="Altstadtliebe — home"><Image src="/altstadtliebe-logo.png" alt="Altstadtliebe" width={192} height={64} priority className="site-logo h-auto w-36 object-contain transition-[filter,transform] duration-300 group-hover:scale-[1.02] sm:w-40 md:w-52" /></Link>
    <div className="flex items-center gap-3"><LanguageSwitcher locale={locale} label={dictionary.navigation.switchTo} href={languageHref} /><button type="button" className="group relative inline-flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full bg-espresso text-ivory shadow-[0_18px_28px_-18px_rgba(44,33,28,0.85)] transition-[background-color,color,transform] duration-300 hover:scale-[1.03] active:scale-95 data-[open=true]:bg-ivory data-[open=true]:text-espresso" data-open={isOpen && !isClosing || undefined} aria-expanded={isOpen && !isClosing} aria-controls="navigation-menu" aria-label={isOpen && !isClosing ? dictionary.navigation.closeMenu : dictionary.navigation.openMenu} onClick={isOpen && !isClosing ? closeMenu : openMenu}><span className={`absolute h-[2px] w-7 bg-current transition-transform duration-300 ${isOpen && !isClosing ? "rotate-45" : "-translate-y-[4px]"}`} aria-hidden="true" /><span className={`absolute h-[2px] w-7 bg-current transition-transform duration-300 ${isOpen && !isClosing ? "-rotate-45" : "translate-y-[4px]"}`} aria-hidden="true" /></button></div>
  </nav>{isOpen && <div id="navigation-menu" className={`navigation-overlay fixed inset-0 z-40 flex items-center justify-center bg-espresso px-[var(--page-gutter)] pb-16 pt-28 text-ivory${isClosing ? " is-closing" : ""}`}><div className="w-full max-w-3xl">{links.map((link) => <a key={link.href} href={link.href} className="group flex items-center justify-between border-b border-ivory/20 py-5 text-[clamp(2.75rem,8vw,7rem)] font-normal leading-none tracking-[-0.055em] transition-colors first:border-t first:border-ivory/20 hover:text-brass" onClick={closeMenu}><span>{link.label}</span><ArrowUpRight size={40} strokeWidth={1.25} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:size-16" /></a>)}<div className="mt-8"><LanguageSwitcher locale={locale} label={dictionary.navigation.switchTo} href={languageHref} /></div></div></div>}
  </header>;
}
