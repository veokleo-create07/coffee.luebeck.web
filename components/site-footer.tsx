"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Instagram, Music2, Phone } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type SiteFooterProps = { locale: Locale; dictionary: Dictionary };

const footerLinkClass = "group relative inline-flex min-h-8 w-fit items-center text-xs text-ivory/72 transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass sm:text-sm";
const socialButtonClass = "group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-ivory text-espresso shadow-[0_8px_18px_-12px_rgba(0,0,0,0.7)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_22px_-12px_rgba(0,0,0,0.72)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass sm:h-12 sm:w-12";

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const homeHref = locale === "de" ? "/" : "/en";
  const menuHref = locale === "de" ? "/menu" : "/en/menu";
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const hours = [...dictionary.location.hours].reverse();
  const navigation = [
    { label: locale === "de" ? "Startseite" : dictionary.footer.navHome, href: homeHref },
    { label: locale === "de" ? "Speisekarte" : dictionary.footer.navMenu, href: menuHref },
    { label: locale === "de" ? "Reservieren" : dictionary.footer.navReservations, href: reservationHref },
    { label: dictionary.footer.navContact, href: "#footer-contact" },
  ];

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const context = gsap.context(() => {
      const content = footer.querySelectorAll<HTMLElement>("[data-footer-reveal]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(content, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.fromTo(content, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: footer, start: "top 92%", once: true } });
    }, footer);

    return () => context.revert();
  }, []);

  return <footer ref={footerRef} className="site-footer-transition overflow-hidden bg-espresso px-[var(--page-gutter)] py-10 text-ivory sm:py-12 md:py-16" aria-label="Footer">
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 sm:gap-6 md:gap-12">
        <div id="footer-contact" data-footer-reveal className="min-w-0">
          <address className="not-italic text-xs leading-[1.45] text-ivory/78 sm:text-sm">
            <span className="block">{dictionary.location.addressLines[0]}</span>
            <span className="block">{dictionary.location.addressLines[1]}</span>
          </address>
          <a href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className={`${footerLinkClass} mt-3 gap-1.5`}>
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{dictionary.location.directions}</span>
            <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <div className="mt-5">
            <p className="text-[0.62rem] uppercase tracking-[0.12em] text-ivory/48">{dictionary.location.hoursLabel}</p>
            <ul className="mt-2 space-y-1 text-[0.68rem] leading-[1.4] text-ivory/62 sm:text-xs">{hours.map((line) => <li key={line}>{line}</li>)}</ul>
          </div>
        </div>

        <div data-footer-reveal className="flex min-w-0 justify-center">
          <div className="flex gap-2 sm:gap-3" aria-label={dictionary.footer.contactActionsLabel}>
            <div className="flex flex-col items-center gap-1.5">
              <a href={dictionary.location.phoneHref} aria-label={dictionary.footer.callLabel} className={socialButtonClass}><Phone size={16} strokeWidth={1.7} aria-hidden="true" /></a>
              <span className="text-[0.58rem] text-ivory/55 sm:text-[0.65rem]">{locale === "de" ? "Anrufen" : "Call"}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.instagramLabel} className={socialButtonClass}><Instagram size={16} strokeWidth={1.7} aria-hidden="true" /></a>
              <span className="text-[0.58rem] text-ivory/55 sm:text-[0.65rem]">Instagram</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <a href={dictionary.footer.tiktokHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.tiktokLabel} className={socialButtonClass}><Music2 size={16} strokeWidth={1.7} aria-hidden="true" /></a>
              <span className="text-[0.58rem] text-ivory/55 sm:text-[0.65rem]">TikTok</span>
            </div>
          </div>
        </div>

        <nav data-footer-reveal aria-label="Footer navigation" className="flex min-w-0 flex-col items-end gap-0.5 text-right">
          {navigation.map((item) => <Link key={item.label} href={item.href} className={footerLinkClass}><span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{item.label}</span><ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" className="ml-1.5 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" /></Link>)}
        </nav>
      </div>

      <div className="mt-9 text-center sm:mt-11">
        <div data-footer-reveal>
          <Link href={homeHref} className="inline-block text-[clamp(2.35rem,6vw,4.8rem)] font-medium leading-[0.84] tracking-[-0.065em] text-ivory transition-colors duration-300 hover:text-brass">Altstadtliebe</Link>
          <p className="mt-2 text-[0.62rem] tracking-[0.14em] text-ivory/48 sm:text-xs">{dictionary.footer.brandTagline} · Lübeck</p>
        </div>
        <div data-footer-reveal className="mt-7 flex flex-col gap-2 text-[0.62rem] text-ivory/45 sm:flex-row sm:items-center sm:justify-between sm:text-[0.68rem]">
          <span>© 2026 Altstadtliebe Lübeck</span>
          <div className="flex justify-center gap-3 sm:justify-end">
            <a href="#imprint" className="transition-colors hover:text-ivory">{dictionary.footer.imprint}</a>
            <span aria-hidden="true" className="text-ivory/25">·</span>
            <a href="#privacy" className="transition-colors hover:text-ivory">{dictionary.footer.privacy}</a>
          </div>
        </div>
      </div>
    </div>
  </footer>;
}
