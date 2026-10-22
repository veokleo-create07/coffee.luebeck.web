"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, Music2, Phone } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type SiteFooterProps = { locale: Locale; dictionary: Dictionary };

const footerLinkClass =
  "group inline-flex min-h-10 w-fit items-center gap-2 text-xs text-ivory/82 transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass md:text-base";

const socialButtonClass =
  "inline-flex h-11 w-11 items-center justify-center bg-transparent text-[#F8F5F0] transition-opacity duration-200 hover:opacity-100 md:hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass";

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const homeHref = locale === "de" ? "/" : "/en";
  const menuHref = locale === "de" ? "/menu" : "/en/menu";
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const addressLines = [...dictionary.location.addressLines];
  if (locale === "de" && addressLines[1]) {
    addressLines[1] = addressLines[1].replace(", Deutschland", "");
  }
  const hours = [...dictionary.location.hours]
    .reverse()
    .map((line) => (locale === "de" ? line.replace("geschlossen", "Geschlossen") : line));
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

      gsap.fromTo(
        content,
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: footer, start: "top 92%", once: true },
        },
      );
    }, footer);

    return () => context.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="site-footer-transition overflow-hidden bg-espresso px-[var(--page-gutter)] pt-24 pb-16 font-sans text-ivory sm:pt-36 sm:pb-20"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-y-7 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-x-12 md:gap-y-9">
          <section id="footer-contact" data-footer-reveal className="flex min-w-0 flex-col md:block">
            <address className="not-italic text-[0.875rem] leading-[1.45] text-ivory/90 md:text-[1.2rem] md:leading-[1.4]">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a
              href={dictionary.location.directionsHref}
              target="_blank"
              rel="noreferrer"
              className={`${footerLinkClass} order-3 mt-2 text-ivory/78 no-underline underline-offset-4 hover:decoration-ivory/70 md:order-none md:underline md:decoration-ivory/25`}
            >
              {dictionary.location.directions}
              <span aria-hidden="true" className="md:hidden">↗</span>
            </a>

            <div className="order-2 mt-3 md:order-none md:mt-7">
              <ul className="space-y-1 text-xs leading-[1.55] text-ivory/72 md:text-sm md:leading-[1.7]">
                {hours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </section>

          <nav
            data-footer-reveal
            aria-label="Footer navigation"
            className="order-2 flex min-w-0 items-center justify-between gap-1 text-[0.6875rem] text-ivory/82 md:order-3 md:flex-col md:items-end md:gap-2.5 md:text-right md:text-base"
          >
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className={footerLinkClass}>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div data-footer-reveal className="order-3 flex justify-center md:order-2">
            <div className="flex gap-5 sm:gap-7" aria-label={dictionary.footer.contactActionsLabel}>
              <div className="flex flex-col items-center gap-2">
                <a href={dictionary.location.phoneHref} aria-label={dictionary.footer.callLabel} className={socialButtonClass}>
                  <Phone size={24} className="md:h-[26px] md:w-[26px]" strokeWidth={1.7} aria-hidden="true" />
                </a>
                <span className="text-xs text-[#F8F5F0]">{locale === "de" ? "Anrufen" : "Call"}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.instagramLabel} className={socialButtonClass}>
                  <Instagram size={24} className="md:h-[26px] md:w-[26px]" strokeWidth={1.7} aria-hidden="true" />
                </a>
                <span className="text-xs text-[#F8F5F0]">Instagram</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <a href={dictionary.footer.tiktokHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.tiktokLabel} className={socialButtonClass}>
                  <Music2 size={24} className="md:h-[26px] md:w-[26px]" strokeWidth={1.7} aria-hidden="true" />
                </a>
                <span className="text-xs text-[#F8F5F0]">TikTok</span>
              </div>
            </div>
          </div>
        </div>

        <div data-footer-reveal className="mt-10 text-center sm:mt-24">
          <Link
            href={homeHref}
            className="inline-block text-[clamp(1.9rem,4vw,3.4rem)] font-medium leading-[0.94] tracking-[-0.055em] text-ivory transition-colors duration-300 hover:text-brass sm:text-[clamp(2.35rem,4vw,3.4rem)]"
          >
            Altstadtliebe
          </Link>
          <p className="mt-1.5 text-[0.6875rem] tracking-[0.16em] text-ivory/65 sm:mt-2 sm:text-[0.7rem] sm:tracking-[0.19em] sm:text-ivory/55">
            {dictionary.footer.brandTagline} · Lübeck
          </p>
        </div>

        <div data-footer-reveal className="mt-7 flex flex-col items-center gap-1.5 text-[0.75rem] text-ivory/70 sm:mt-16 sm:flex-row sm:justify-between sm:gap-2.5 sm:text-xs sm:text-ivory/48">
          <span className="order-2 sm:order-1">© 2026 Altstadtliebe Lübeck</span>
          <div className="order-1 flex min-h-10 items-center justify-center gap-3 sm:order-2">
            <a href="#imprint" className="transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
              {dictionary.footer.imprint}
            </a>
            <span aria-hidden="true" className="text-ivory/30">·</span>
            <a href="#privacy" className="transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
              {dictionary.footer.privacy}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
