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

const footerLinkClass =
  "group inline-flex min-h-10 w-fit items-center gap-2 text-sm text-ivory/82 transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass md:text-base";

const socialButtonClass =
  "group inline-flex h-[3.375rem] w-[3.375rem] items-center justify-center rounded-full bg-ivory text-espresso shadow-[0_9px_20px_-13px_rgba(10,7,5,0.48)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_13px_24px_-13px_rgba(10,7,5,0.56)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass md:h-[3.625rem] md:w-[3.625rem]";

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
      className="site-footer-transition overflow-hidden bg-espresso px-[var(--page-gutter)] py-12 font-sans text-ivory sm:py-14 md:py-16"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 items-start gap-x-5 gap-y-9 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-x-12">
          <section id="footer-contact" data-footer-reveal className="min-w-0">
            <address className="not-italic text-[0.95rem] leading-[1.45] text-ivory/90 md:text-[1.2rem] md:leading-[1.4]">
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
              className={`${footerLinkClass} mt-2 text-ivory/78 underline decoration-ivory/25 underline-offset-4 hover:decoration-ivory/70`}
            >
              {dictionary.location.directions}
              <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
            </a>

            <div className="mt-6 md:mt-7">
              <ul className="space-y-1 text-[0.78rem] leading-[1.55] text-ivory/72 md:text-sm md:leading-[1.7]">
                {hours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </section>

          <nav
            data-footer-reveal
            aria-label="Footer navigation"
            className="order-2 flex min-w-0 flex-col items-end gap-2 text-right md:order-3 md:gap-2.5"
          >
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className={footerLinkClass}>
                <span>{item.label}</span>
                <ArrowUpRight size={15} strokeWidth={1.55} aria-hidden="true" className="text-ivory/65 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>

          <div data-footer-reveal className="order-3 col-span-2 flex justify-center md:order-2 md:col-span-1">
            <div className="flex gap-5 sm:gap-7" aria-label={dictionary.footer.contactActionsLabel}>
              <div className="flex flex-col items-center gap-2.5">
                <a href={dictionary.location.phoneHref} aria-label={dictionary.footer.callLabel} className={socialButtonClass} style={{ color: "var(--color-espresso)" }}>
                  <Phone size={21} strokeWidth={1.7} aria-hidden="true" />
                </a>
                <span className="text-xs text-ivory/68">{locale === "de" ? "Anrufen" : "Call"}</span>
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.instagramLabel} className={socialButtonClass} style={{ color: "var(--color-espresso)" }}>
                  <Instagram size={21} strokeWidth={1.7} aria-hidden="true" />
                </a>
                <span className="text-xs text-ivory/68">Instagram</span>
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <a href={dictionary.footer.tiktokHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.tiktokLabel} className={socialButtonClass} style={{ color: "var(--color-espresso)" }}>
                  <Music2 size={21} strokeWidth={1.7} aria-hidden="true" />
                </a>
                <span className="text-xs text-ivory/68">TikTok</span>
              </div>
            </div>
          </div>
        </div>

        <div data-footer-reveal className="mt-12 text-center md:mt-16">
          <Link
            href={homeHref}
            className="inline-block text-[clamp(2.35rem,4vw,3.4rem)] font-medium leading-[0.94] tracking-[-0.055em] text-ivory transition-colors duration-300 hover:text-brass"
          >
            Altstadtliebe
          </Link>
          <p className="mt-2 text-[0.62rem] tracking-[0.19em] text-ivory/55 sm:text-[0.7rem]">
            {dictionary.footer.brandTagline} · Lübeck
          </p>
        </div>

        <div data-footer-reveal className="mt-8 flex flex-col items-center gap-2.5 text-[0.66rem] text-ivory/48 sm:flex-row sm:justify-between sm:text-xs">
          <span>© 2026 Altstadtliebe Lübeck</span>
          <div className="flex min-h-10 items-center justify-center gap-3">
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
