"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

type SiteHeaderProps = { locale: Locale; dictionary: Dictionary; languageHref?: string; overlay?: boolean };

export function SiteHeader({ locale, dictionary, languageHref, overlay = false }: SiteHeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const navigationTimer = useRef<number | null>(null);
  const homeHref = locale === "de" ? "/" : "/en";
  const menuHref = locale === "de" ? "/menu" : "/en/menu";
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const reviewsHref = `${homeHref}#reviews`;
  const faqHref = locale === "de" ? "/faq" : "/en/faq";
  const links = [{ label: dictionary.navigation.menu, href: menuHref }, { label: dictionary.navigation.reservation, href: reservationHref }, { label: dictionary.navigation.reviews, href: reviewsHref }, { label: dictionary.footer.navFaq, href: faqHref, isFaq: true }];

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
    if (navigationTimer.current) window.clearTimeout(navigationTimer.current);
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
    if (navigationTimer.current) window.clearTimeout(navigationTimer.current);
    setIsClosing(false);
    setIsNavigating(false);
    setIsOpen(true);
  }

  function navigateFromMenu(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (isNavigating) return;

    const destination = new URL(href, window.location.href);
    const isSameDocument = destination.pathname === window.location.pathname && destination.search === window.location.search;

    setIsNavigating(true);
    navigationTimer.current = window.setTimeout(() => {
      navigationTimer.current = null;
      router.push(href);

      // A hash change on the current page does not unmount this header, so the
      // overlay needs to reveal the newly positioned section itself. Cross-page
      // navigation keeps the opaque overlay mounted until Next.js swaps routes.
      if (isSameDocument) {
        window.setTimeout(() => closeMenu(), 40);
      }
    }, 180);
  }

  useEffect(() => {
    if (window.localStorage.getItem("altstadtliebe-locale") || window.location.pathname !== "/") return;
    if (window.navigator.language.toLowerCase().startsWith("en")) window.location.replace("/en");
  }, []);

  return <header data-menu-open={isOpen && !isClosing || undefined} className={`site-header z-50 page-gutter pt-6 md:pt-8 ${overlay ? "fixed inset-x-0 top-0" : "relative"}`}><nav className="relative z-50 flex items-center justify-between" aria-label="Primary navigation">
    <Link href={homeHref} className="group flex items-center py-1" onClick={closeMenu} aria-label="Altstadtliebe — home"><Image src="/altstadtliebe-logo.png" alt="Altstadtliebe" width={192} height={64} priority className="site-logo h-auto w-36 object-contain transition-[filter,transform] duration-500 group-hover:scale-[1.02] sm:w-40 md:w-52" /></Link>
    <div className="flex items-center gap-3"><LanguageSwitcher locale={locale} label={dictionary.navigation.switchTo} href={languageHref} /><button type="button" disabled={isNavigating} className="group relative inline-flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full bg-espresso text-ivory shadow-[0_18px_28px_-18px_rgba(44,33,28,0.85)] transition-[background-color,color,transform] duration-500 hover:scale-[1.03] active:scale-95 data-[open=true]:bg-ivory data-[open=true]:text-espresso disabled:pointer-events-none" data-open={isOpen && !isClosing || undefined} aria-expanded={isOpen && !isClosing} aria-controls="navigation-menu" aria-label={isOpen && !isClosing ? dictionary.navigation.closeMenu : dictionary.navigation.openMenu} onClick={isOpen && !isClosing ? closeMenu : openMenu}><span className={`absolute h-[2px] w-7 bg-current transition-transform duration-300 ${isOpen && !isClosing ? "rotate-45" : "-translate-y-[4px]"}`} aria-hidden="true" /><span className={`absolute h-[2px] w-7 bg-current transition-transform duration-300 ${isOpen && !isClosing ? "-rotate-45" : "translate-y-[4px]"}`} aria-hidden="true" /></button></div>
  </nav>{isOpen && <div id="navigation-menu" aria-busy={isNavigating || undefined} className={`navigation-overlay fixed inset-0 z-40 flex items-center justify-center bg-espresso px-[var(--page-gutter)] pb-16 pt-28 text-ivory${isClosing ? " is-closing" : ""}${isNavigating ? " is-navigating" : ""}`}><div className="w-full max-w-3xl">{links.map((link) => <Link key={link.href} href={link.href} className="group flex items-center justify-between border-b border-ivory/20 py-5 text-[clamp(2.15rem,6vw,5.5rem)] font-normal leading-none tracking-[-0.055em] transition-colors first:border-t first:border-ivory/20 hover:text-brass" onClick={(event) => navigateFromMenu(event, link.href)}><span>{link.isFaq ? <>FA<span className="faq-nav-q">Q</span></> : link.label}</span><ArrowUpRight size={40} strokeWidth={1.25} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:size-16" /></Link>)}</div></div>}
  </header>;
}
