"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Instagram, Music2, Phone } from "lucide-react";
import Image from "next/image";
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
      const content = footer.querySelectorAll<HTMLElement>("[data-footer-reveal]");
      const image = footer.querySelector<HTMLElement>(".footer-image");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(content, { autoAlpha: 1, clearProps: "transform" });
        if (image) gsap.set(image, { clearProps: "transform" });
        return;
      }

      gsap.fromTo(content, { autoAlpha: 0, y: 12 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: footer, start: "top 88%", once: true },
      });
      if (image) {
        gsap.fromTo(image, { scale: 1.08, yPercent: -3 }, { scale: 1, yPercent: 0, ease: "none", scrollTrigger: { trigger: footer, start: "top bottom", end: "top 40%", scrub: true } });
      }
    }, footer);

    return () => context.revert();
  }, []);

  return <footer ref={footerRef} className="site-footer-transition footer-reveal isolate overflow-hidden rounded-t-[2rem] bg-espresso px-[var(--page-gutter)] py-20 text-ivory md:rounded-t-[3rem] md:py-28" aria-label="Footer">
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true"><Image src="/altstadtliebe-interior.png" alt="" fill sizes="100vw" className="footer-image object-cover object-[62%_center] opacity-45" /><div className="absolute inset-0 bg-espresso/80" /></div>
    <div className="relative z-10 mx-auto max-w-7xl">
      <p data-footer-reveal className="mb-12 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-ivory/80 md:mb-16">ALTSTADTLIEBE <span className="text-brass" aria-hidden="true">♥</span></p>
      <div className="grid gap-14 md:grid-cols-[1fr_1.25fr_0.9fr] md:gap-20">
        <div id="footer-contact" data-footer-reveal className="flex flex-col">
          <p className="eyebrow mb-5 text-brass">{dictionary.footer.contactLabel}</p>
          <address className="not-italic text-sm leading-[1.55] text-ivory/72">
            <span className="block">{dictionary.location.addressLines[0]}</span>
            <span className="block">{dictionary.location.addressLines[1]}</span>
          </address>
          <a href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className={`${footerLinkClass} mt-5 gap-2`}>
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{dictionary.location.directions}</span>
            <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <div className="mt-7 flex flex-wrap items-start gap-x-5 gap-y-7" aria-label={dictionary.footer.contactActionsLabel}>
            <div className="flex flex-col items-center gap-2">
              <a href={dictionary.location.phoneHref} aria-label={dictionary.footer.callLabel} className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-ivory text-[#2c211c] shadow-[0_10px_24px_rgba(0,0,0,0.2)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_28px_rgba(0,0,0,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"><Phone size={18} strokeWidth={1.7} color="#2c211c" aria-hidden="true" /></a>
              <span className="text-[0.68rem] text-ivory/55">{dictionary.footer.callLabel}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.instagramLabel} className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-ivory text-[#2c211c] shadow-[0_10px_24px_rgba(0,0,0,0.2)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_28px_rgba(0,0,0,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"><Instagram size={18} strokeWidth={1.7} color="#2c211c" aria-hidden="true" /></a>
              <span className="text-[0.68rem] text-ivory/55">{dictionary.footer.instagramLabel}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <a href={dictionary.footer.tiktokHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.tiktokLabel} className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-ivory text-[#2c211c] shadow-[0_10px_24px_rgba(0,0,0,0.2)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_28px_rgba(0,0,0,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"><Music2 size={18} strokeWidth={1.7} color="#2c211c" aria-hidden="true" /></a>
              <span className="text-[0.68rem] text-ivory/55">{dictionary.footer.tiktokLabel}</span>
            </div>
          </div>
        </div>

        <div data-footer-reveal>
          <p className="eyebrow mb-5 text-brass">{dictionary.footer.hoursLabel}</p>
          <ul className="space-y-2 text-sm leading-[1.45] text-ivory/72" aria-label={dictionary.footer.hoursLabel}>{dictionary.location.hours.map((line) => <li key={line}>{line}</li>)}</ul>
        </div>

        <nav data-footer-reveal aria-label="Footer navigation" className="flex flex-col gap-1 md:justify-self-end md:min-w-[10rem]">
          <p className="eyebrow mb-4 text-brass">{dictionary.footer.navHome}</p>
          {navigation.map((item) => <Link key={item.label} href={item.href} className={footerLinkClass}><span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 after:content-[''] group-hover:after:scale-x-100">{item.label}</span><ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" className="ml-2 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" /></Link>)}
        </nav>
      </div>
    </div>
  </footer>;
}
