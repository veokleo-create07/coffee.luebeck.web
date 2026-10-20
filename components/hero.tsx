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
      const animatedElements = root.querySelectorAll<HTMLElement>(".hero-word, .hero-description, .hero-cta");
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(animatedElements, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-word", { opacity: 0, yPercent: 110 }, { opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.09 })
        .fromTo(".hero-description", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.36")
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

  return <section className="page-gutter pt-8 pb-0 text-center md:pt-8" aria-labelledby="hero-title"><div ref={rootRef} className="flex w-full flex-col items-center"><h1 id="hero-title" className="editorial-heading w-full max-w-[92vw] text-balance text-[clamp(3.6rem,13vw,6rem)] font-extrabold leading-[0.78] tracking-[-0.065em] text-espresso md:text-[clamp(5rem,13.5vw,12rem)]">{words.map((word, index) => <span key={`${word}-${index}`} className="hero-word inline-block">{word}{index < words.length - 1 ? " " : ""}</span>)}</h1><p className="hero-description mt-6 max-w-xl text-lg leading-[1.3] text-espresso-soft md:mt-7 md:text-xl">{dictionary.home.description}</p><div className="mx-auto mt-6 flex w-full max-w-[48rem] flex-row items-center justify-center gap-[10px] md:mt-7 md:gap-5"><Link href={reservationHref} className="site-button site-button-primary hero-cta min-w-0 flex-1 whitespace-nowrap px-3 text-[0.78rem] tracking-[-0.01em] md:px-6 md:text-sm">{dictionary.home.primaryCta}</Link><a href={dictionary.footer.instagramHref} target="_blank" rel="noreferrer" className="site-button site-button-secondary hero-cta inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap px-3 text-[0.78rem] tracking-[-0.01em] md:px-6 md:text-sm"><Instagram size={15} strokeWidth={1.8} aria-hidden="true" />{dictionary.home.secondaryCta}</a></div><div className="hero-photo-frame relative -left-1 mx-auto mt-12 aspect-[0.9/1] w-full overflow-hidden rounded-2xl bg-espresso/10 shadow-[0_20px_45px_-30px_rgba(44,33,28,0.62)] md:left-0 md:mt-10 md:aspect-[1.15/1] md:w-[76%] md:max-w-[58rem] md:rounded-[1.5rem]"><div className="hero-photo absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.home.imageAlt} fill sizes="(max-width: 768px) 100vw, 76vw" className="object-cover object-[58%_center] md:object-center" /></div><div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" /></div></div></section>;
}
