"use client";

import gsap from "gsap";
import { Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

type HeroProps = { locale: Locale; dictionary: Dictionary };

export function Hero({ locale, dictionary }: HeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const words = dictionary.home.title.split(" ");
  const titleLines = locale === "de"
    ? [words.slice(0, 2), words.slice(2)]
    : [words.slice(0, 3), words.slice(3)];
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const animatedElements = root.querySelectorAll<HTMLElement>(".hero-word, .hero-description, .hero-cta");
      const photoFrame = root.querySelector<HTMLElement>(".hero-photo-frame");
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(animatedElements, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      const opening = gsap.timeline({ defaults: { ease: "power3.out" } });
      const photoImage = root.querySelector<HTMLImageElement>(".hero-photo img");
      const photoIsReady = Boolean(photoImage?.complete && photoImage.naturalWidth > 0);
      const shouldAnimatePhoto = Boolean(photoFrame && photoIsReady && window.scrollY < 12);

      if (photoFrame && shouldAnimatePhoto) {
        const restingRadius = window.getComputedStyle(photoFrame).borderRadius;

        opening.fromTo(photoFrame, {
          clipPath: `inset(100% 0% 0% 0% round ${restingRadius})`,
        }, {
          clipPath: `inset(0% 0% 0% 0% round ${restingRadius})`,
          duration: 1.2,
          ease: "power3.inOut",
        }, 0);
        opening.fromTo(".hero-photo img", { scale: 1.08 }, {
          scale: 1,
          duration: 1.35,
          ease: "power2.out",
          onComplete: () => gsap.set(".hero-photo img", { clearProps: "transform" }),
        }, 0);
      }

      opening
        .fromTo(".hero-word", { autoAlpha: 0, yPercent: 115 }, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.82,
          stagger: 0.09,
          ease: "back.out(1.35)",
        }, shouldAnimatePhoto ? 0.18 : 0)
        .fromTo(".hero-description", { autoAlpha: 0, x: -12, y: 10 }, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.58,
          ease: "power3.out",
        }, "-=0.2")
        .fromTo(".hero-cta", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.1, onComplete: () => gsap.set(".hero-cta", { clearProps: "opacity,visibility" }) }, "-=0.2");

    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="page-gutter pt-8 pb-0 md:pt-10" aria-labelledby="hero-title">
      <div ref={rootRef} className="flex w-full flex-col items-center">
        <div className="flex w-full flex-col items-center gap-5 text-center md:gap-6">
          <h1 id="hero-title" className="editorial-heading relative left-[2vw] w-full max-w-full text-[clamp(1.8rem,8.8vw,3.5rem)] font-normal leading-[0.94] tracking-[-0.05em] text-espresso md:left-[6vw] md:text-[clamp(3rem,5.4vw,6rem)]">
            {titleLines.map((line, lineIndex) => (
              <span key={`line-${lineIndex}`} className="block whitespace-nowrap">
                {line.map((word, wordIndex) => (
                  <span key={`${word}-${wordIndex}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <span className="hero-word inline-block">
                      {word}{wordIndex < line.length - 1 ? " " : ""}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <div className="flex w-full max-w-[52rem] flex-col items-center gap-5">
            <p className="hero-description mx-auto w-[92%] max-w-[48rem] text-pretty text-center font-serif text-[0.98rem] font-medium leading-[1.5] text-espresso-soft md:text-[1.25rem]">
              {dictionary.home.description}
            </p>
            <div className="hero-actions relative isolate mt-1 flex w-full flex-row items-center justify-center gap-3">
              <Link href={reservationHref} className="site-button site-button-primary hero-button hero-primary-cta hero-cta min-h-14 min-w-0 flex-none whitespace-nowrap px-5 text-sm tracking-[-0.01em] md:px-6 md:text-base">
                <span className="relative z-10">{dictionary.home.primaryCta}</span>
              </Link>
              <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" className="site-button site-button-secondary hero-button hero-secondary-cta hero-cta inline-flex min-h-14 min-w-0 flex-none items-center justify-center gap-2 whitespace-nowrap px-5 text-sm tracking-[-0.01em] md:px-6 md:text-base">
                <Instagram size={17} strokeWidth={1.8} aria-hidden="true" />
                {dictionary.home.secondaryCta}
              </a>
            </div>
          </div>
        </div>

        <div className="hero-photo-shell relative mx-auto mt-12 aspect-[0.92/1] w-[calc(100%-2rem)] md:mt-14 md:aspect-[1.15/1] md:w-[72%] md:max-w-[54rem]">
          <div className="hero-photo-frame absolute inset-[0.55rem] overflow-hidden rounded-[1.05rem] bg-espresso/10 shadow-[0_24px_50px_-34px_rgba(44,33,28,0.58)] md:inset-[0.7rem] md:rounded-[1.45rem]">
            <div className="hero-photo absolute -inset-y-[8%] inset-x-0">
              <Image src="/hero-altstadtliebe-interior.jpg" alt={dictionary.home.imageAlt} fill priority sizes="(max-width: 768px) 100vw, 76vw" className="object-cover object-center" />
            </div>
            <div className="hero-photo-gloss pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
