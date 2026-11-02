"use client";

import { Instagram, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

type SiteFooterProps = { locale: Locale; dictionary: Dictionary };

const socialButtonClass =
  "inline-flex h-14 w-14 items-center justify-center bg-transparent text-[#F8F5F0] transition-[opacity,transform] duration-200 hover:scale-105 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass sm:h-16 sm:w-16";

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.68 3.18-6.03 3.19-1.46.08-2.92-.32-4.18-1.03-2.08-1.18-3.45-3.49-3.51-5.86-.05-.61-.04-1.22-.01-1.82.3-2.69 2.42-5.13 5.05-5.89 1.32-.38 2.77-.25 3.99.37.01 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.79-.14.35-.1.72-.09 1.08.15 1.62 1.54 2.94 3.16 3.06 1.08.11 2.17-.31 2.88-1.14.74-.85 1.1-1.92 1.1-3.04.05-5.43.03-10.86.04-16.29z" />
    </svg>
  );
}

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
        <div className="flex min-h-[20rem] flex-col sm:min-h-[28rem]">
          <div data-footer-reveal className="pt-8 text-center sm:pt-0">
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

          <div data-footer-reveal className="mt-auto flex justify-center pb-10 sm:pb-20">
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
                  <TikTokIcon />
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
