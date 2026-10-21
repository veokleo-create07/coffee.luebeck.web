"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type HeroProps = { locale: Locale; dictionary: Dictionary };

export function Hero({ locale, dictionary }: HeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleLines = locale === "de" ? ["Bleib noch", "ein bisschen."] : ["Stay a little", "longer."];
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const animatedElements = root.querySelectorAll<HTMLElement>(".hero-word, .hero-cta, .hero-cafe-photo, .hero-microcopy, .hero-scroll-indicator");
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(animatedElements, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-word", { opacity: 0, yPercent: 110 }, { opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.09 })
        .fromTo(".hero-cafe-photo", { autoAlpha: 0, y: 28, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 }, "-=0.38")
        .fromTo(".hero-microcopy", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.3")
        .fromTo(".hero-cta", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, onComplete: () => gsap.set(".hero-cta", { clearProps: "opacity,visibility" }) }, "-=0.2")
        .fromTo(".hero-scroll-indicator", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "-=0.2");

      gsap.to(".hero-cafe-photo", {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-editorial",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section ref={rootRef} className="hero-editorial" aria-labelledby="hero-title">
      <div className="hero-cafe-photo" aria-hidden="true">
        <Image src="/hero-cafe-editorial.png" alt="" fill sizes="100vw" className="hero-cafe-image" priority />
      </div>

      <svg className="hero-cream-shape hero-cream-shape-desktop" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0H1092C1017 64 930 113 824 156C720 198 640 255 620 320C598 390 682 421 736 470C796 525 726 580 610 624C452 684 322 751 259 824C233 855 217 881 209 900H0Z" />
      </svg>
      <svg className="hero-cream-shape hero-cream-shape-mobile" viewBox="0 0 430 820" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0H430V278C374 305 338 360 330 426C319 516 250 574 139 613C74 636 30 670 0 708Z" />
      </svg>

      <div className="hero-editorial-inner page-gutter">
        <div className="hero-editorial-copy">
          <h1 id="hero-title" className="editorial-heading hero-editorial-title text-espresso">
            {titleLines.map((line) => (
              <span key={line} className="hero-title-line">
                {line.split(" ").map((word, index, words) => (
                  <span key={`${line}-${word}`} className="hero-word">
                    {word}{index < words.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-microcopy">{locale === "de" ? "Guter Matcha.\nGutes Frühstück.\nGute Zeit." : "Good matcha.\nGood breakfast.\nGood time."}</p>

          <div className="hero-editorial-actions">
            <Link href={reservationHref} className="site-button site-button-primary hero-button hero-cta">
              {dictionary.home.primaryCta}
              <span className="hero-button-arrow" aria-hidden="true">↗</span>
            </Link>
            <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" className="site-button site-button-secondary hero-button hero-secondary-cta hero-cta">
              <Instagram size={15} strokeWidth={1.8} aria-hidden="true" />
              {locale === "de" ? "Einblicke" : "Insights"}
            </a>
          </div>
        </div>

        <div className="hero-scroll-indicator" aria-hidden="true">
          <span />
          Scroll
        </div>
      </div>

      <svg className="hero-section-transition" viewBox="0 0 1600 112" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 28C202 63 383 40 548 48C711 56 811 111 1012 89C1202 68 1378 13 1600 25V112H0Z" />
      </svg>
    </section>
  );
}
