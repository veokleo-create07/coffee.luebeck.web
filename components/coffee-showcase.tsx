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

const imageCrops = ["object-[30%_center]", "object-[68%_center]", "object-[50%_22%]", "object-[84%_center]"];

export function CoffeeShowcase({ locale, dictionary }: CoffeeShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const menuHref = locale === "de" ? "/menu" : "/en/menu";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const reveal = section.querySelectorAll<HTMLElement>("[data-menu-reveal]");
      const images = section.querySelectorAll<HTMLElement>(".menu-preview-image");

      if (prefersReducedMotion) {
        gsap.set([...reveal, ...images], { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      const trigger = { trigger: section, start: "top 80%", once: true };
      gsap.fromTo(reveal, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out", scrollTrigger: trigger });
      gsap.fromTo(images, { autoAlpha: 0, y: 28, scale: 1.04 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: trigger });
    }, section);

    return () => context.revert();
  }, []);

  return <section ref={sectionRef} id="menu-preview" className="overflow-hidden bg-espresso px-[var(--page-gutter)] py-20 text-ivory md:py-28" aria-labelledby="showcase-title"><div className="mx-auto max-w-7xl"><div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><p data-menu-reveal className="eyebrow mb-5 text-brass">{dictionary.showcase.eyebrow}</p><h2 id="showcase-title" data-menu-reveal className="editorial-heading max-w-[11ch] text-balance text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[0.86] text-ivory">{dictionary.showcase.heading}</h2></div><div className="max-w-sm md:mb-1"><p data-menu-reveal className="text-base leading-[1.4] text-ivory/72 md:text-lg">{dictionary.showcase.description}</p><Link data-menu-reveal href={menuHref} className="site-button site-button-secondary group mt-6 gap-3"><span>{dictionary.showcase.cta}</span><ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></div></div><div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-5">{imageCrops.map((crop, index) => <figure key={crop} className={`menu-preview-image relative overflow-hidden bg-espresso-soft ${index === 0 ? "aspect-[0.86] rounded-tl-[2rem] rounded-br-[0.75rem] md:mt-8 md:rounded-tl-[2.75rem]" : index === 1 ? "aspect-[0.86] rounded-tr-[0.75rem] rounded-bl-[2rem] md:rounded-bl-[2.75rem]" : index === 2 ? "aspect-[0.86] rounded-tl-[0.75rem] rounded-br-[2rem] md:mt-12 md:rounded-br-[2.75rem]" : "aspect-[0.86] rounded-tr-[2rem] rounded-bl-[0.75rem] md:rounded-tr-[2.75rem]"}`}><Image src="/altstadtliebe-interior.png" alt={index === 0 ? dictionary.showcase.imageAlt : ""} fill sizes="(max-width: 768px) 44vw, 23vw" className={`object-cover ${crop}`} aria-hidden={index !== 0} /></figure>)}</div></div></section>;
}
