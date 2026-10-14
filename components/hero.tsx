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
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const titleWords = dictionary.home.title.split(" ");
  const titleLines = [titleWords.slice(0, 2), titleWords.slice(2)];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lines = root.querySelectorAll<HTMLElement>(".hero-line-inner");
      const description = root.querySelector<HTMLElement>(".hero-description");
      const ctas = root.querySelectorAll<HTMLElement>(".hero-cta");
      const frame = root.querySelector<HTMLElement>(".hero-photo-frame");
      const image = root.querySelector<HTMLElement>(".hero-photo");
      const mask = root.querySelector<HTMLElement>(".hero-photo-mask");

      if (reducedMotion) {
        gsap.set([...lines, description, ...ctas].filter(Boolean), { autoAlpha: 1, clearProps: "transform" });
        if (mask) gsap.set(mask, { autoAlpha: 0, clearProps: "clipPath" });
        return;
      }

      gsap.set(mask, { clipPath: "inset(0 0 0 0)" });
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      entrance.fromTo(lines, { autoAlpha: 0, yPercent: 115 }, { autoAlpha: 1, yPercent: 0, duration: 0.82, stagger: 0.12, ease: "power4.out" })
        .fromTo(description, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.62 }, "-=0.35")
        .fromTo(ctas, { autoAlpha: 0, y: 13 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.09 }, "-=0.26")
        .fromTo(mask, { clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 100% 0 0)", duration: 1.15, ease: "power4.inOut" }, "-=0.1");

      if (frame && image) {
        gsap.to(frame, { scale: 1.045, y: -8, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.to(image, { yPercent: -8, scale: 1.08, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 1 } });
      }
    }, root);

    return () => context.revert();
  }, []);

  return <section className="page-gutter overflow-hidden pt-12 pb-14 text-center md:pt-16 md:pb-20" aria-labelledby="hero-title"><div ref={rootRef} className="mx-auto flex w-full max-w-[96rem] flex-col items-center"><h1 id="hero-title" className="editorial-heading w-full max-w-[94vw] text-balance text-[clamp(3.6rem,12.5vw,6.5rem)] font-extrabold leading-[0.8] tracking-[-0.068em] text-espresso md:max-w-[90vw] md:text-[clamp(5rem,10.5vw,11rem)]"><span className="block overflow-hidden"><span className="hero-line-inner inline-block">{titleLines[0].join(" ")}</span></span><span className="block overflow-hidden"><span className="hero-line-inner inline-block">{titleLines[1].join(" ")}</span></span></h1><p className="hero-description mt-7 max-w-xl text-base leading-[1.35] text-espresso-soft md:mt-8 md:text-xl">{dictionary.home.description}</p><div className="mx-auto mt-6 flex w-full max-w-[34rem] flex-row items-center justify-center gap-[10px] md:mt-7 md:gap-4"><Link href={reservationHref} className="site-button site-button-primary hero-cta h-12 min-h-12 min-w-0 flex-1 gap-2 whitespace-nowrap px-3 text-[0.78rem] md:px-6 md:text-sm"><span>{dictionary.home.primaryCta}</span><ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link><a href="#menu-preview" className="site-button site-button-secondary hero-cta group h-12 min-h-12 min-w-0 flex-1 gap-2 whitespace-nowrap px-3 text-[0.78rem] md:px-6 md:text-sm"><span>{dictionary.home.secondaryCta}</span><ArrowDown size={15} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5" /></a></div><div className="hero-photo-frame relative mt-12 aspect-[0.92/1] w-full max-w-[58rem] overflow-hidden rounded-[1.25rem_3rem_1.25rem_3rem] bg-espresso/10 shadow-[0_24px_50px_-32px_rgba(44,33,28,0.68)] md:mt-14 md:aspect-[1.2/1] md:w-[78%] md:rounded-[1.75rem_4.5rem_1.75rem_4.5rem]"><div className="hero-photo absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.home.imageAlt} fill sizes="(max-width: 767px) 100vw, 78vw" className="object-cover object-[58%_center] md:object-center" priority /></div><div className="hero-photo-mask pointer-events-none absolute inset-0 z-10 bg-ivory" aria-hidden="true" /></div></div></section>;
}
