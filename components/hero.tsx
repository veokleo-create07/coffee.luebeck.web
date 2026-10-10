"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
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
        gsap.set(animatedElements, { clearProps: "all" });
        return;
      }

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-word", { opacity: 0, yPercent: 110 }, { opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.09 })
        .fromTo(".hero-description", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.36")
        .fromTo(".hero-cta", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.28");

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

  return <section className="page-gutter pt-8 pb-0 text-center md:pt-10" aria-labelledby="hero-title"><div ref={rootRef} className="flex w-full flex-col items-center"><h1 id="hero-title" className="editorial-heading max-w-5xl text-balance text-[clamp(3.8rem,12.5vw,11rem)] font-bold leading-[0.82] text-espresso">{words.map((word, index) => <span key={`${word}-${index}`} className="hero-word inline-block">{word}{index < words.length - 1 ? " " : ""}</span>)}</h1><p className="hero-description mt-8 max-w-xl text-lg leading-[1.3] text-espresso-soft md:mt-10 md:text-xl">{dictionary.home.description}</p><div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4 md:mt-9"><Link href={reservationHref} className="hero-cta group inline-flex w-full items-center justify-center gap-3 rounded-full bg-espresso px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-ivory shadow-[0_12px_30px_-16px_rgba(44,33,28,0.8)] transition-all duration-300 hover:-translate-y-1 hover:bg-espresso-soft hover:shadow-[0_18px_35px_-16px_rgba(44,33,28,0.85)] sm:w-auto">{dictionary.home.primaryCta}<ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link><a href="#story" className="hero-cta group inline-flex w-full items-center justify-center gap-3 rounded-full border border-espresso/45 px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-espresso shadow-[0_8px_24px_-18px_rgba(44,33,28,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-espresso hover:bg-espresso hover:text-ivory hover:shadow-[0_16px_30px_-16px_rgba(44,33,28,0.7)] sm:w-auto">{dictionary.home.secondaryCta}<ArrowDown size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5" /></a></div><div className="hero-photo-frame relative mt-14 h-[22rem] w-full overflow-hidden rounded-[1.75rem] bg-espresso/10 shadow-[0_26px_65px_-34px_rgba(44,33,28,0.7)] md:mt-20 md:h-[34rem] md:rounded-[2.5rem]"><div className="hero-photo absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.home.imageAlt} fill sizes="(max-width: 768px) 100vw, 92vw" className="object-cover object-center" /></div><div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" /></div></div></section>;
}
