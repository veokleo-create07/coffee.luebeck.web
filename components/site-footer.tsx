"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

gsap.registerPlugin(ScrollTrigger);

type SiteFooterProps = { locale: Locale; dictionary: Dictionary };

const footerLinkClass = "group relative inline-flex w-fit items-center text-sm text-ivory/75 transition-colors duration-300 hover:text-ivory";

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const homeHref = locale === "de" ? "/" : "/en";
  const menuHref = locale === "de" ? "/menu" : "/en/menu";
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const wordmarkLetters = dictionary.footer.wordmark.split("");
  const navigation = [
    { label: dictionary.footer.navHome, href: homeHref },
    { label: dictionary.footer.navMenu, href: menuHref },
    { label: dictionary.footer.navGallery, href: "#gallery-title" },
    { label: dictionary.footer.navReservations, href: reservationHref },
    { label: dictionary.footer.navContact, href: "#visit" },
  ];

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const letters = footer.querySelectorAll<HTMLElement>(".footer-wordmark-letter");
      const content = footer.querySelectorAll<HTMLElement>("[data-footer-reveal]");

      if (reducedMotion) {
        gsap.set([...letters, ...content], { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      const reveal = { trigger: footer, start: "top 88%", once: true };
      gsap.fromTo(letters, { autoAlpha: 0, yPercent: 110 }, { autoAlpha: 1, yPercent: 0, duration: 0.75, stagger: 0.045, ease: "power4.out", scrollTrigger: reveal });
      gsap.fromTo(content, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, delay: 0.16, ease: "power3.out", scrollTrigger: reveal });
    }, footer);

    return () => context.revert();
  }, []);

  return <footer ref={footerRef} className="overflow-hidden bg-espresso px-[var(--page-gutter)] pt-20 text-ivory md:pt-28" aria-label="Footer"><div className="mx-auto max-w-7xl"><div className="grid gap-14 md:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr] md:gap-12"><div data-footer-reveal><Link href={homeHref} className="inline-flex text-xl font-semibold tracking-[-0.05em] text-ivory transition-colors hover:text-brass">Altstadtliebe</Link><p className="mt-3 max-w-[12rem] text-sm leading-[1.35] text-ivory/60">{dictionary.footer.claim}</p></div><nav data-footer-reveal aria-label="Footer navigation" className="flex flex-col gap-3"><p className="eyebrow mb-2 text-brass">{dictionary.footer.navHome}</p>{navigation.map((item) => <Link key={item.label} href={item.href} className={footerLinkClass}><span className="relative after:absolute after:bottom-[-0.2rem] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{item.label}</span><ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="ml-2 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" /></Link>)}</nav><div data-footer-reveal className="flex flex-col gap-7"><div><p className="eyebrow mb-4 text-brass">{dictionary.footer.contactLabel}</p><address className="not-italic text-sm leading-[1.45] text-ivory/75"><span className="block">{dictionary.location.addressLines[0]}</span><span className="block">{dictionary.location.addressLines[1]}</span></address><a href={dictionary.location.phoneHref} className={`${footerLinkClass} mt-4`}><span className="relative after:absolute after:bottom-[-0.2rem] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{dictionary.location.phoneLabel}</span></a></div><a data-footer-reveal href={dictionary.footer.instagramHref} className={footerLinkClass}><span className="relative after:absolute after:bottom-[-0.2rem] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{dictionary.footer.instagramLabel}</span><ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a></div><div data-footer-reveal><p className="eyebrow mb-4 text-brass">{dictionary.footer.hoursLabel}</p><ul className="space-y-2 text-sm leading-[1.35] text-ivory/75" aria-label={dictionary.footer.hoursLabel}>{dictionary.location.hours.map((line) => <li key={line}>{line}</li>)}</ul><div className="mt-8"><LanguageSwitcher locale={locale} label={dictionary.footer.languageLabel} /></div></div></div><div className="mt-20 overflow-hidden border-t border-ivory/15 pt-8 md:mt-28"><div className="flex origin-bottom gap-[0.02em] whitespace-nowrap text-[clamp(2.45rem,12vw,13rem)] font-medium leading-[0.78] tracking-[-0.08em] text-ivory" aria-label={dictionary.footer.wordmark}>{wordmarkLetters.map((letter, index) => <span key={`${letter}-${index}`} className="footer-wordmark-letter inline-block">{letter}</span>)}</div><div data-footer-reveal className="mt-8 flex flex-col gap-3 py-7 text-[0.68rem] uppercase tracking-[0.12em] text-ivory/45 sm:flex-row sm:items-center sm:justify-between"><span>{dictionary.footer.copyright}</span><div className="flex flex-wrap gap-x-5 gap-y-2"><a href="#imprint" className="transition-colors hover:text-ivory">{dictionary.footer.imprint}</a><a href="#privacy" className="transition-colors hover:text-ivory">{dictionary.footer.privacy}</a><a href="#cookies" className="transition-colors hover:text-ivory">{dictionary.footer.cookies}</a></div></div></div></div></footer>;
}
