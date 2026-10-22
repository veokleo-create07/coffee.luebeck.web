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

const footerLinkClass = "group relative inline-flex min-h-10 w-fit items-center text-sm text-ivory/72 transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass";
const socialLinkClass = "group inline-flex min-h-10 items-center gap-2 rounded-full border border-ivory/22 bg-ivory/[0.06] px-3.5 text-xs text-ivory/82 transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-ivory/45 hover:bg-ivory/12 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass";

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

      gsap.fromTo(content, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: footer, start: "top 88%", once: true } });
    }, footer);

    return () => context.revert();
  }, []);

  return <footer ref={footerRef} className="site-footer-transition overflow-hidden bg-espresso px-[var(--page-gutter)] py-14 text-ivory md:py-20" aria-label="Footer">
    <div className="mx-auto max-w-6xl">
      <div data-footer-reveal className="flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3" aria-label={dictionary.footer.contactActionsLabel}>
          <a href={dictionary.location.phoneHref} aria-label={dictionary.footer.callLabel} className={socialLinkClass}><Phone size={15} strokeWidth={1.6} aria-hidden="true" /><span>{locale === "de" ? "Anrufen" : "Call"}</span></a>
          <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.instagramLabel} className={socialLinkClass}><Instagram size={15} strokeWidth={1.6} aria-hidden="true" /><span>Instagram</span></a>
          <a href={dictionary.footer.tiktokHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.tiktokLabel} className={socialLinkClass}><Music2 size={15} strokeWidth={1.6} aria-hidden="true" /><span>TikTok</span></a>
        </div>
      </div>

      <div className="mt-12 grid gap-12 border-t border-ivory/12 pt-10 md:mt-16 md:grid-cols-2 md:gap-20 md:pt-12">
        <div id="footer-contact" data-footer-reveal>
          <p className="mb-5 text-[0.68rem] uppercase tracking-[0.18em] text-brass">{dictionary.location.eyebrow}</p>
          <address className="not-italic text-base leading-[1.45] text-ivory/88">
            <span className="block">{dictionary.location.addressLines[0]}</span>
            <span className="block">{dictionary.location.addressLines[1]}</span>
          </address>
          <a href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className={`${footerLinkClass} mt-5 gap-2`}>
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{dictionary.location.directions}</span>
            <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <div className="mt-9">
            <p className="mb-3 text-[0.68rem] uppercase tracking-[0.18em] text-brass">{dictionary.location.hoursLabel}</p>
            <ul className="space-y-1.5 text-sm leading-[1.45] text-ivory/68" aria-label={dictionary.footer.hoursLabel}>{hours.map((line) => <li key={line}>{line}</li>)}</ul>
          </div>
        </div>

        <nav data-footer-reveal aria-label="Footer navigation" className="flex flex-col gap-1 md:items-end">
          <p className="mb-4 text-[0.68rem] uppercase tracking-[0.18em] text-brass">{locale === "de" ? "Entdecken" : "Explore"}</p>
          <div className="flex flex-col md:items-end">
            {navigation.map((item) => <Link key={item.label} href={item.href} className={footerLinkClass}><span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{item.label}</span><ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" className="ml-2 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" /></Link>)}
          </div>
        </nav>
      </div>

      <div className="mt-14 border-t border-ivory/15 pt-10 md:mt-20 md:pt-14">
        <div data-footer-reveal className="text-center">
          <Link href={homeHref} className="inline-block text-[clamp(3.3rem,10vw,8.5rem)] font-medium leading-[0.82] tracking-[-0.075em] text-ivory transition-colors duration-300 hover:text-brass">Altstadtliebe</Link>
          <p className="mt-5 text-xs tracking-[0.16em] text-ivory/52">{dictionary.footer.brandTagline} · Lübeck</p>
        </div>
        <div data-footer-reveal className="mt-10 flex flex-col gap-3 border-t border-ivory/12 pt-5 text-[0.68rem] tracking-[0.03em] text-ivory/48 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Altstadtliebe Lübeck</span>
          <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
            <a href="#imprint" className="transition-colors hover:text-ivory">{dictionary.footer.imprint}</a>
            <span aria-hidden="true" className="text-ivory/25">·</span>
            <a href="#privacy" className="transition-colors hover:text-ivory">{dictionary.footer.privacy}</a>
          </div>
        </div>
      </div>
    </div>
  </footer>;
}
