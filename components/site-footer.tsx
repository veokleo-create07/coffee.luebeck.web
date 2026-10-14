"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Heart, Instagram, Music2, Phone } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type SiteFooterProps = { locale: Locale; dictionary: Dictionary };

const footerLinkClass = "group relative inline-flex min-h-10 w-fit items-center text-sm text-ivory/72 transition-colors duration-300 hover:text-ivory";

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const homeHref = locale === "de" ? "/" : "/en";
  const menuHref = locale === "de" ? "/menu" : "/en/menu";
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const wordmarkLetters = dictionary.footer.wordmark.split("");
  const navigation = [
    { label: dictionary.footer.navHome, href: homeHref },
    { label: dictionary.footer.navMenu, href: menuHref },
    { label: dictionary.footer.navReservations, href: reservationHref },
    { label: dictionary.footer.navContact, href: "#footer-contact" },
  ];

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const letters = footer.querySelectorAll<HTMLElement>(".footer-wordmark-letter");
      const content = footer.querySelectorAll<HTMLElement>("[data-footer-reveal]");
      const heart = footer.querySelector<HTMLElement>(".footer-heart");

      if (reducedMotion) {
        gsap.set([...letters, ...content], { autoAlpha: 1, clearProps: "transform,clipPath" });
        if (heart) gsap.set(heart, { clearProps: "transform" });
        return;
      }

      const reveal = { trigger: footer, start: "top 88%", once: true };
      gsap.fromTo(content, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: reveal });
      gsap.fromTo(letters, { autoAlpha: 0, yPercent: 105, rotateX: -35 }, { autoAlpha: 1, yPercent: 0, rotateX: 0, duration: 0.8, stagger: 0.04, ease: "power4.out", scrollTrigger: { trigger: footer.querySelector(".footer-wordmark"), start: "top 92%", once: true } });
      if (heart) gsap.to(heart, { scale: 1.08, rotate: 4, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.4 });
    }, footer);

    return () => context.revert();
  }, []);

  return <footer ref={footerRef} className="site-footer-transition overflow-hidden bg-espresso px-[var(--page-gutter)] pt-24 text-ivory md:pt-36" aria-label="Footer">
    <div className="relative z-10 mx-auto max-w-7xl">
      <div data-footer-reveal className="flex flex-col gap-8 border-b border-ivory/15 pb-12 md:flex-row md:items-end md:justify-between md:pb-16">
        <div className="max-w-xl">
          <Heart className="footer-heart mb-6 text-brass" size={22} strokeWidth={1.35} aria-hidden="true" />
          <p className="mb-3 text-lg font-medium tracking-[-0.04em] text-ivory">Altstadtliebe</p>
          <p className="mb-6 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/45">{dictionary.footer.brandTagline}</p>
          <p className="max-w-[18rem] text-[clamp(1.6rem,3vw,3rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ivory">{dictionary.footer.claim}</p>
        </div>
        <Link href={reservationHref} className="group inline-flex min-h-11 w-fit items-center gap-3 text-sm font-medium text-ivory"><span className="border-b border-brass pb-1">{dictionary.reservation.cta}</span><ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
      </div>

      <div className="grid gap-12 py-14 md:grid-cols-[0.7fr_1.1fr_0.9fr] md:gap-16 md:py-20">
        <nav data-footer-reveal aria-label="Footer navigation" className="flex flex-col gap-1">
          <p className="eyebrow mb-4 text-brass">{dictionary.footer.navHome}</p>
          {navigation.map((item) => <Link key={item.label} href={item.href} className={footerLinkClass}><span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{item.label}</span><ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" className="ml-2 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" /></Link>)}
        </nav>

        <div id="footer-contact" data-footer-reveal className="grid gap-10 sm:grid-cols-2 sm:gap-12">
          <div>
            <p className="eyebrow mb-5 text-brass">{dictionary.footer.contactLabel}</p>
            <address className="not-italic text-sm leading-[1.55] text-ivory/72"><span className="block">{dictionary.location.addressLines[0]}</span><span className="block">{dictionary.location.addressLines[1]}</span></address>
            <div className="mt-6 flex flex-wrap items-center gap-3" aria-label={dictionary.footer.contactActionsLabel}>
              <a href={dictionary.location.phoneHref} aria-label={dictionary.footer.callLabel} className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors duration-300 hover:border-brass hover:bg-brass hover:text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"><Phone size={17} strokeWidth={1.5} aria-hidden="true" /></a>
              <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.instagramLabel} className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors duration-300 hover:border-brass hover:bg-brass hover:text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"><Instagram size={17} strokeWidth={1.5} aria-hidden="true" /></a>
              <a href={dictionary.footer.tiktokHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.tiktokLabel} className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors duration-300 hover:border-brass hover:bg-brass hover:text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"><Music2 size={17} strokeWidth={1.5} aria-hidden="true" /></a>
            </div>
            <a href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className={`${footerLinkClass} mt-1 gap-2`}><span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{dictionary.location.directions}</span><ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
          </div>
          <div>
            <p className="eyebrow mb-5 text-brass">{dictionary.footer.hoursLabel}</p>
            <ul className="space-y-2 text-sm leading-[1.45] text-ivory/72" aria-label={dictionary.footer.hoursLabel}>{dictionary.location.hours.map((line) => <li key={line}>{line}</li>)}</ul>
          </div>
        </div>
      </div>

      <div className="footer-wordmark overflow-hidden border-t border-ivory/15 pt-10" aria-label={dictionary.footer.wordmark}>
        <div className="flex origin-bottom whitespace-nowrap text-[clamp(2.55rem,12.1vw,13rem)] font-medium leading-[0.76] tracking-[-0.09em] text-ivory md:text-[clamp(5rem,12.3vw,13.5rem)]">{wordmarkLetters.map((letter, index) => <span key={`${letter}-${index}`} className="footer-wordmark-letter inline-block">{letter}</span>)}</div>
        <div data-footer-reveal className="flex flex-col gap-5 border-t border-ivory/15 py-7 text-[0.64rem] uppercase tracking-[0.13em] text-ivory/45 sm:flex-row sm:items-center sm:justify-between"><span>{dictionary.footer.copyright}</span><div className="flex flex-wrap gap-x-5 gap-y-3"><a href="#imprint" className="transition-colors hover:text-ivory">{dictionary.footer.imprint}</a><a href="#privacy" className="transition-colors hover:text-ivory">{dictionary.footer.privacy}</a><a href="#cookies" className="transition-colors hover:text-ivory">{dictionary.footer.cookies}</a></div></div>
      </div>
    </div>
  </footer>;
}
