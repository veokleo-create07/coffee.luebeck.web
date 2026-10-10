"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type CoffeeShowcaseProps = { locale: Locale; dictionary: Dictionary };

export function CoffeeShowcase({ locale, dictionary }: CoffeeShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const menuHref = locale === "de" ? "/menu" : "/en/menu";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const text = section.querySelectorAll<HTMLElement>("[data-showcase-reveal]");
      const layers = section.querySelectorAll<HTMLElement>(".food-layer");
      const masks = section.querySelectorAll<HTMLElement>(".food-layer-mask");

      if (prefersReducedMotion) {
        gsap.set(text, { autoAlpha: 1, clearProps: "transform" });
        gsap.set(layers, { autoAlpha: 1, clearProps: "transform" });
        gsap.set(masks, { yPercent: -100 });
        return;
      }

      const enter = { trigger: section, start: "top 78%", once: true };
      gsap.fromTo(text, { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.13, ease: "power3.out", scrollTrigger: enter });
      gsap.fromTo(layers, { autoAlpha: 0, y: mobile ? 36 : 90, scale: mobile ? 0.98 : 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.12, ease: "power3.out", scrollTrigger: enter });
      gsap.to(masks, { yPercent: -100, duration: 1.25, stagger: 0.1, ease: "power4.inOut", scrollTrigger: enter });

      const parallaxAmounts = mobile ? [-5, -8, -11] : [-10, -16, -22];
      layers.forEach((layer, index) => {
        gsap.to(layer, {
          yPercent: parallaxAmounts[index] ?? -10,
          rotation: (index % 2 === 0 ? 1 : -1) * (mobile ? 0.6 : 1.4),
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return <section ref={sectionRef} className="relative overflow-hidden bg-espresso px-[var(--page-gutter)] py-24 text-ivory md:py-40" aria-labelledby="showcase-title"><div className="relative mx-auto min-h-[54rem] max-w-7xl md:min-h-[48rem]"><div className="relative z-30 max-w-xl pt-2 md:absolute md:left-0 md:top-28 md:max-w-[37rem]"><p data-showcase-reveal className="eyebrow mb-7 text-brass">{dictionary.showcase.eyebrow}</p><h2 id="showcase-title" data-showcase-reveal className="editorial-heading max-w-2xl text-balance text-[clamp(3.5rem,8vw,8.5rem)] font-medium leading-[0.84] text-ivory">{dictionary.showcase.heading}</h2><p data-showcase-reveal className="mt-8 max-w-sm text-lg leading-[1.35] text-ivory/75 md:mt-12 md:text-xl">{dictionary.showcase.description}</p><Link data-showcase-reveal href={menuHref} className="mt-9 inline-flex items-center gap-3 text-sm font-medium text-ivory transition-colors hover:text-brass md:mt-12"><span className="border-b border-brass pb-1">{dictionary.showcase.cta}</span><ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" /></Link></div><figure className="food-layer absolute right-[-8%] top-56 z-10 h-[22rem] w-[88%] rotate-[2deg] overflow-hidden rounded-[1.75rem] bg-espresso-soft md:right-[2%] md:top-8 md:h-[30rem] md:w-[58%] md:rounded-[2.5rem]"><div className="absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.showcase.imageAlt} fill sizes="(max-width: 768px) 92vw, 58vw" className="object-cover object-[72%_center]" /></div><div className="food-layer-mask absolute inset-0 z-10 bg-espresso" aria-hidden="true" /></figure><figure className="food-layer absolute bottom-16 left-[-8%] z-20 h-[16rem] w-[59%] -rotate-[3deg] overflow-hidden rounded-[1.5rem] bg-espresso-soft md:bottom-10 md:left-[28%] md:h-[21rem] md:w-[34%] md:rounded-[2rem]"><div className="absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt="" fill sizes="(max-width: 768px) 62vw, 34vw" className="object-cover object-[24%_center]" aria-hidden="true" /></div><div className="food-layer-mask absolute inset-0 z-10 bg-espresso" aria-hidden="true" /></figure><figure className="food-layer absolute bottom-0 right-[-4%] z-20 h-[12rem] w-[53%] rotate-[4deg] overflow-hidden rounded-[1.5rem] bg-espresso-soft md:bottom-0 md:right-[-2%] md:h-[14rem] md:w-[27%] md:rounded-[1.75rem]"><div className="absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt="" fill sizes="(max-width: 768px) 55vw, 27vw" className="object-cover object-[92%_center]" aria-hidden="true" /></div><div className="food-layer-mask absolute inset-0 z-10 bg-espresso" aria-hidden="true" /></figure></div></section>;
}
