"use client";

import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

type HeroProps = { locale: Locale; dictionary: Dictionary };

export function Hero({ locale, dictionary }: HeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const words = dictionary.home.title.split(" ");
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const menuHref = locale === "de" ? "/menu" : "/en/menu";

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
    }, root);

    return () => context.revert();
  }, []);

  return <section className="page-gutter flex min-h-[calc(100svh-7rem)] items-center justify-center py-20 text-center md:min-h-[calc(100svh-9rem)] md:py-28" aria-labelledby="hero-title"><div ref={rootRef} className="flex w-full max-w-6xl flex-col items-center"><h1 id="hero-title" className="editorial-heading max-w-5xl text-balance text-[clamp(4rem,13vw,11rem)] font-bold leading-[0.82] text-espresso">{words.map((word, index) => <span key={`${word}-${index}`} className="hero-word inline-block">{word}{index < words.length - 1 ? " " : ""}</span>)}</h1><p className="hero-description mt-9 max-w-xl text-lg leading-[1.3] text-espresso-soft md:mt-12 md:text-xl">{dictionary.home.description}</p><div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4 md:mt-10"><Link href={reservationHref} className="hero-cta inline-flex min-w-44 items-center justify-center bg-espresso px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-espresso-soft">{dictionary.home.primaryCta}</Link><Link href={menuHref} className="hero-cta group inline-flex min-w-44 items-center justify-center gap-3 border border-espresso px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-espresso transition-colors hover:bg-espresso hover:text-ivory">{dictionary.home.secondaryCta}<ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></div></div></section>;
}
