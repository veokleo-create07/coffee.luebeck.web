"use client";

import { Instagram, Music2, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

type SiteFooterProps = { locale: Locale; dictionary: Dictionary };

const socialButtonClass =
  "inline-flex h-14 w-14 items-center justify-center bg-transparent text-[#F8F5F0] transition-[opacity,transform] duration-200 hover:scale-105 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass sm:h-16 sm:w-16";

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const homeHref = locale === "de" ? "/" : "/en";
  const legalNoticeHref = locale === "de" ? "/impressum" : "/en/legal-notice";
  const privacyHref = locale === "de" ? "/datenschutz" : "/en/privacy";

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const content = footer.querySelectorAll<HTMLElement>("[data-footer-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      footer.dataset.footerRevealed = "true";
      return;
    }

    footer.dataset.footerReveal = "ready";
    content.forEach((item, index) => {
      item.style.setProperty("--footer-reveal-delay", `${index * 70}ms`);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        footer.dataset.footerRevealed = "true";
        observer.disconnect();
      },
      { rootMargin: "0px 0px 8% 0px", threshold: 0.01 },
    );
    observer.observe(footer);

    return () => {
      observer.disconnect();
      delete footer.dataset.footerReveal;
      delete footer.dataset.footerRevealed;
      content.forEach((item) => item.style.removeProperty("--footer-reveal-delay"));
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="site-footer-transition overflow-hidden bg-espresso px-[var(--page-gutter)] py-16 font-sans text-ivory sm:min-h-[38rem] sm:py-20"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[28rem] flex-col">
          <div data-footer-reveal className="text-center">
            <Link
              href={homeHref}
              className="group inline-block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
              aria-label="Altstadtliebe — home"
            >
              <Image
                src="/altstadtliebe-logo.png"
                alt="Altstadtliebe breakfast & lunch"
                width={759}
                height={251}
                className="h-auto w-[clamp(16rem,48vw,36rem)] brightness-0 invert transition-[opacity,transform] duration-300 group-hover:scale-[1.015] group-hover:opacity-90"
              />
            </Link>
          </div>

          <div data-footer-reveal className="mt-auto flex justify-center pb-14 sm:pb-20">
            <div className="flex gap-6 sm:gap-10" aria-label={dictionary.footer.contactActionsLabel}>
              <div className="flex flex-col items-center gap-2">
                <a href={dictionary.location.phoneHref} aria-label={dictionary.footer.callLabel} className={socialButtonClass}>
                  <Phone size={30} strokeWidth={2.25} aria-hidden="true" />
                </a>
              </div>
              <div className="flex flex-col items-center gap-2">
                <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.instagramLabel} className={socialButtonClass}>
                  <Instagram size={30} strokeWidth={2.25} aria-hidden="true" />
                </a>
              </div>
              <div className="flex flex-col items-center gap-2">
                <a href={dictionary.footer.tiktokHref} target="_blank" rel="noreferrer" aria-label={dictionary.footer.tiktokLabel} className={socialButtonClass}>
                  <Music2 size={30} strokeWidth={2.25} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

        <div data-footer-reveal className="mt-auto flex flex-col items-center gap-1.5 text-[0.75rem] font-medium text-[#F8F5F0] sm:flex-row sm:justify-between sm:gap-2.5 sm:text-xs">
          <span className="order-2 sm:order-1">© 2026 Altstadtliebe Lübeck</span>
          <div className="order-1 flex min-h-10 items-center justify-center gap-3 sm:order-2">
            <Link href={legalNoticeHref} className="transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
              {dictionary.footer.imprint}
            </Link>
            <span aria-hidden="true" className="text-[#F8F5F0]">·</span>
            <Link href={privacyHref} className="transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
              {dictionary.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
