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
  const words = dictionary.home.title.split(" ");
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const animatedElements = root.querySelectorAll<HTMLElement>(".hero-word, .hero-cta, .hero-cafe-photo, .hero-microcopy");
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
        .fromTo(".hero-cta", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, onComplete: () => gsap.set(".hero-cta", { clearProps: "opacity,visibility" }) }, "-=0.2");

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
    <section className="hero-editorial page-gutter" aria-labelledby="hero-title">
      <div ref={rootRef} className="hero-editorial-inner">
        <div className="hero-editorial-copy">
          <h1 id="hero-title" className="editorial-heading hero-editorial-title text-balance text-espresso">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="hero-word">
                {word}
                {index < words.length - 1 ? " " : ""}
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

        <div className="hero-editorial-visual">
          <div className="hero-cafe-photo" aria-label={locale === "de" ? "Warmer Café-Moment mit Matcha und Frühstück" : "A warm café moment with matcha and breakfast"}>
            <Image src="/hero-cafe-editorial.png" alt={dictionary.home.imageAlt} fill sizes="(max-width: 767px) 100vw, 56vw" className="object-cover object-[63%_center]" priority />
          </div>
        </div>
      </div>
    </section>
  );
}
