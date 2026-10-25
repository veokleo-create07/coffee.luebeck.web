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
        <div className="grid w-full items-end gap-8 text-center md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.65fr)] md:gap-12 md:text-left lg:gap-20">
          <h1 id="hero-title" className="editorial-heading w-full max-w-[92vw] translate-x-[4vw] text-balance text-[clamp(3.3rem,12vw,5.7rem)] font-normal leading-[0.88] tracking-[-0.055em] text-espresso md:max-w-[44rem] md:translate-x-8 md:text-[clamp(4.5rem,8.2vw,7.6rem)]">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span className="hero-word inline-block">
                  {word}{index < words.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </h1>

          <div className="flex w-full max-w-[25rem] flex-col items-center gap-5 md:items-start md:pb-2">
            <p className="hero-description ml-auto w-[92%] max-w-[22rem] translate-x-3 text-pretty text-right text-[0.94rem] leading-[1.55] text-espresso-soft md:translate-x-6 md:text-[1rem]">
              {dictionary.home.description}
            </p>
            <div className="hero-actions relative isolate mt-0 flex w-full translate-y-2 flex-row items-center justify-start gap-2.5 self-start md:gap-3">
              <Link href={reservationHref} className="site-button site-button-primary hero-button hero-primary-cta hero-cta min-w-0 flex-none whitespace-nowrap px-3 text-[0.74rem] tracking-[-0.01em] md:px-3.5 md:text-[0.78rem]">
                <span className="relative z-10">{dictionary.home.primaryCta}</span>
              </Link>
              <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" className="site-button site-button-secondary hero-button hero-secondary-cta hero-cta inline-flex min-w-0 flex-none items-center justify-center gap-1.5 whitespace-nowrap px-2.5 text-[0.74rem] tracking-[-0.01em] md:px-3 md:text-[0.78rem]">
                <Instagram size={15} strokeWidth={1.8} aria-hidden="true" />
                {dictionary.home.secondaryCta}
              </a>
            </div>
          </div>
        </div>

        <div className="hero-photo-shell relative mx-auto mt-12 aspect-[0.92/1] w-[calc(100%-2rem)] md:mt-14 md:aspect-[1.15/1] md:w-[72%] md:max-w-[54rem]">
          <div className="hero-photo-frame absolute inset-[0.55rem] overflow-hidden rounded-[1.05rem] bg-espresso/10 shadow-[0_24px_50px_-34px_rgba(44,33,28,0.58)] md:inset-[0.7rem] md:rounded-[1.45rem]">
            <div className="hero-photo absolute -inset-y-[8%] inset-x-0">
              <Image src="/menu-coffee.jpeg" alt={dictionary.home.imageAlt} fill priority sizes="(max-width: 768px) 100vw, 76vw" className="object-cover object-center" />
            </div>
            <div className="hero-photo-gloss pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
