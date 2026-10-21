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
      const animatedElements = root.querySelectorAll<HTMLElement>(".hero-word, .hero-cta");
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(animatedElements, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-word", { opacity: 0, yPercent: 110 }, { opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.09 })
        .fromTo(".hero-cta", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, onComplete: () => gsap.set(".hero-cta", { clearProps: "opacity,visibility" }) }, "-=0.28");

      gsap.to(".hero-photo", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-photo-frame",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="page-gutter pt-8 pb-0 md:pt-10" aria-labelledby="hero-title">
      <div ref={rootRef} className="flex w-full flex-col items-center">
        <div className="grid w-full items-end gap-8 text-center md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.65fr)] md:gap-12 md:text-left lg:gap-20">
          <h1 id="hero-title" className="editorial-heading w-full max-w-[92vw] text-balance text-[clamp(3.6rem,13vw,6rem)] font-normal leading-[0.88] tracking-[-0.045em] text-espresso md:max-w-[42rem] md:text-[clamp(4.5rem,8.5vw,8rem)]">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="hero-word inline-block">
                {word}{index < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <div className="flex max-w-[25rem] flex-col items-center gap-5 md:items-start md:pb-2">
            <p className="max-w-[22rem] text-pretty text-[0.98rem] leading-[1.45] text-espresso-soft md:text-[1.05rem]">
              {dictionary.home.description}
            </p>
            <div className="hero-actions relative isolate flex w-full flex-row items-center justify-center gap-2.5 md:justify-start md:gap-3">
              <Link href={reservationHref} className="site-button site-button-primary hero-button hero-cta min-w-0 flex-none whitespace-nowrap px-3.5 text-[0.76rem] tracking-[-0.01em] md:px-4 md:text-[0.8rem]">
                {dictionary.home.primaryCta}
              </Link>
              <a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" className="site-button site-button-secondary hero-button hero-secondary-cta hero-cta inline-flex min-w-0 flex-none items-center justify-center gap-1.5 whitespace-nowrap px-3 text-[0.76rem] tracking-[-0.01em] md:px-3.5 md:text-[0.8rem]">
                <Instagram size={15} strokeWidth={1.8} aria-hidden="true" />
                {dictionary.home.secondaryCta}
              </a>
            </div>
          </div>
        </div>

        <div className="hero-photo-frame relative mx-auto mt-12 aspect-[0.92/1] w-[calc(100%-2rem)] overflow-hidden rounded-[1.35rem] bg-espresso/10 shadow-[0_24px_50px_-34px_rgba(44,33,28,0.58)] md:mt-14 md:aspect-[1.15/1] md:w-[72%] md:max-w-[54rem] md:rounded-[1.75rem]">
          <div className="hero-photo absolute -inset-y-[8%] inset-x-0">
            <Image src="/altstadtliebe-hero.png" alt={dictionary.home.imageAlt} fill sizes="(max-width: 768px) 100vw, 76vw" className="object-cover object-center" />
          </div>
          <div className="hero-photo-gloss pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
