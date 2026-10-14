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

const menuImages = [
  "/menu-matcha.png",
  "/menu-coffee.png",
  "/menu-breakfast.png",
  "/menu-bowl.png",
];

export function CoffeeShowcase({ locale, dictionary }: CoffeeShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const menuHref = locale === "de" ? "/menu" : "/en/menu";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const words = section.querySelectorAll<HTMLElement>(".menu-word");
      const figures = Array.from(section.querySelectorAll<HTMLElement>("[data-menu-photo]"));
      const copy = section.querySelector<HTMLElement>("[data-menu-copy]");
      const central = figures[1];

      if (!central || figures.length < 4) return;

      if (reducedMotion) {
        section.style.minHeight = "auto";
        gsap.set([...words, ...figures, copy].filter(Boolean), { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      const entrance = { trigger: section, start: "top 82%", once: true };
      gsap.fromTo(words, { autoAlpha: 0, yPercent: 110 }, { autoAlpha: 1, yPercent: 0, duration: 0.9, stagger: 0.065, ease: "power4.out", scrollTrigger: entrance });
      gsap.fromTo(figures, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: entrance });

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (isMobile) {
        gsap.fromTo(copy, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: copy, start: "top 88%", once: true } });
        figures.forEach((figure, index) => gsap.fromTo(figure, { y: [18, 28, 12, 24][index], rotate: [ -2, 2, 1, -1 ][index] }, { y: 0, rotate: 0, duration: 1, delay: index * 0.05, ease: "power3.out", scrollTrigger: entrance }));
        return;
      }

      gsap.set(figures, { transformPerspective: 1200, transformOrigin: "center center" });
      gsap.set(figures[0], { xPercent: -3, yPercent: 5, rotate: -4, scale: 0.96 });
      gsap.set(figures[1], { xPercent: 0, yPercent: 4, rotate: 1.5, scale: 0.91 });
      gsap.set(figures[2], { xPercent: 4, yPercent: 7, rotate: 3.5, scale: 0.94 });
      gsap.set(figures[3], { xPercent: -2, yPercent: 4, rotate: -2.5, scale: 0.95 });
      gsap.set(copy, { autoAlpha: 0, y: 28 });

      const sequence = gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 1.1 } });
      sequence
        .to(figures[0], { xPercent: -34, yPercent: -20, rotate: -9, scale: 0.78, autoAlpha: 0.65, ease: "none" }, 0.08)
        .to(figures[2], { xPercent: 35, yPercent: -13, rotate: 8, scale: 0.77, autoAlpha: 0.62, ease: "none" }, 0.08)
        .to(figures[3], { xPercent: -39, yPercent: 32, rotate: -8, scale: 0.72, autoAlpha: 0.55, ease: "none" }, 0.08)
        .to(central, { xPercent: 0, yPercent: -3, rotate: 0, scale: 1.46, ease: "power2.inOut" }, 0.28)
        .to(copy, { autoAlpha: 1, y: 0, ease: "power2.out" }, 0.7);
    }, section);

    return () => {
      section.style.minHeight = "";
      context.revert();
    };
  }, []);

  return <section ref={sectionRef} id="menu-preview" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 text-espresso md:min-h-[230vh] md:py-0" aria-labelledby="showcase-title">
    <div className="mx-auto max-w-7xl md:sticky md:top-0 md:flex md:min-h-screen md:flex-col md:justify-center">
      <header className="relative z-30 max-w-2xl md:absolute md:left-0 md:top-[12vh]">
        <p className="eyebrow mb-5 text-olive-deep">{dictionary.showcase.eyebrow}</p>
        <h2 id="showcase-title" className="editorial-heading max-w-[10ch] text-balance text-[clamp(3.5rem,8vw,8rem)] font-medium leading-[0.82] tracking-[-0.055em] text-espresso">{dictionary.showcase.heading.split(" ").map((word, index) => <span key={`${word}-${index}`} className="menu-word mr-[0.16em] inline-block">{word}</span>)}</h2>
      </header>

      <div className="menu-collage relative mt-14 h-[31rem] [perspective:1200px] md:mt-0 md:h-[82vh] md:min-h-[39rem]" aria-label={dictionary.showcase.heading}>
        {menuImages.map((image, index) => <figure key={image} data-menu-photo className={`absolute overflow-hidden bg-espresso-soft will-change-transform ${index === 0 ? "left-0 top-[7%] z-10 h-[42%] w-[49%] rounded-[2rem_0.6rem_2rem_0.6rem] md:left-[4%] md:top-[23%] md:h-[40%] md:w-[22%] md:rounded-[3.5rem_0.8rem_2rem_0.8rem]" : index === 1 ? "left-[19%] top-[7%] z-20 h-[62%] w-[62%] rounded-[0.6rem_3rem_0.6rem_3rem] md:left-[27%] md:top-[13%] md:h-[67%] md:w-[46%] md:rounded-[1rem_5rem_1rem_5rem]" : index === 2 ? "right-0 top-[22%] z-10 h-[49%] w-[49%] rounded-[0.6rem_2.5rem_0.6rem_2.5rem] md:right-[3%] md:top-[29%] md:h-[43%] md:w-[24%] md:rounded-[0.8rem_4rem_0.8rem_3rem]" : "bottom-0 left-[10%] z-10 h-[39%] w-[45%] rounded-[2.5rem_0.6rem_2.5rem_0.6rem] md:bottom-[4%] md:left-[14%] md:h-[35%] md:w-[26%] md:rounded-[3rem_0.8rem_3rem_0.8rem]"}`}>
          <div className="absolute -inset-y-[7%] inset-x-0"><Image src={image} alt={index === 1 ? dictionary.showcase.imageAlt : ""} fill sizes="(max-width: 767px) 50vw, 46vw" className="object-cover object-center" aria-hidden={index !== 1} /></div>
        </figure>)}
      </div>

      <div data-menu-copy className="relative z-30 mt-10 max-w-sm md:absolute md:bottom-[10vh] md:right-0 md:mt-0">
        <p className="text-lg leading-[1.35] text-espresso-soft md:text-xl">{dictionary.showcase.description}</p>
        <Link href={menuHref} className="site-button site-button-secondary group mt-7 gap-3"><span>{dictionary.showcase.cta}</span><ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
      </div>
    </div>
  </section>;
}
