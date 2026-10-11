"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

  return <section className="page-gutter pt-8 pb-0 text-center md:pt-8" aria-labelledby="hero-title"><div ref={rootRef} className="flex w-full flex-col items-center"><h1 id="hero-title" className="editorial-heading w-full max-w-[92vw] text-balance text-[clamp(3.6rem,13vw,6rem)] font-extrabold leading-[0.78] tracking-[-0.065em] text-espresso md:text-[clamp(5rem,13.5vw,12rem)]">{words.map((word, index) => <span key={`${word}-${index}`} className="hero-word inline-block">{word}{index < words.length - 1 ? " " : ""}</span>)}</h1><p className="hero-description mt-6 max-w-xl text-lg leading-[1.3] text-espresso-soft md:mt-7 md:text-xl">{dictionary.home.description}</p><div className="mx-auto mt-6 flex w-full max-w-[48rem] flex-row items-center justify-center gap-[10px] md:mt-7 md:gap-5"><Link href={reservationHref} className="hero-cta inline-flex h-14 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-[#2C211C] px-3 text-[0.78rem] font-medium tracking-[-0.01em] !text-[#F7F3EA] shadow-[0_22px_28px_-15px_rgba(44,33,28,0.7),inset_0_2px_2px_rgba(255,255,255,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3A2922] hover:shadow-[0_26px_32px_-15px_rgba(44,33,28,0.72),inset_0_2px_2px_rgba(255,255,255,0.18)] active:translate-y-0 md:px-6 md:text-sm">{dictionary.home.primaryCta}</Link><a href="#story" className="hero-cta inline-flex h-14 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-[#FFFDF9] px-3 text-[0.78rem] font-medium tracking-[-0.01em] text-[#2C211C] shadow-[0_18px_26px_-16px_rgba(44,33,28,0.4),inset_0_2px_2px_rgba(255,255,255,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_30px_-16px_rgba(44,33,28,0.42),inset_0_2px_2px_rgba(255,255,255,0.98)] active:translate-y-0 md:px-6 md:text-sm">{dictionary.home.secondaryCta}</a></div><div className="hero-photo-frame relative mt-10 h-[20rem] w-full overflow-hidden rounded-[1.75rem] bg-espresso/10 shadow-[0_26px_65px_-34px_rgba(44,33,28,0.7)] md:mt-12 md:h-[30rem] md:rounded-[2.5rem]"><div className="hero-photo absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.home.imageAlt} fill sizes="(max-width: 768px) 100vw, 92vw" className="object-cover object-center" /></div><div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" /></div></div></section>;
}
