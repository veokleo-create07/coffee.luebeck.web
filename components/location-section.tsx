"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Phone } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";

gsap.registerPlugin(ScrollTrigger);

type LocationSectionProps = { dictionary: Dictionary };

export function LocationSection({ dictionary }: LocationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWords = dictionary.location.heading.split(" ");

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const words = section.querySelectorAll<HTMLElement>(".location-word");
      const details = section.querySelectorAll<HTMLElement>("[data-location-reveal]");
      const image = section.querySelector<HTMLElement>(".location-image");

      if (reducedMotion) {
        gsap.set([...words, ...details], { autoAlpha: 1, clearProps: "transform" });
        if (image) gsap.set(image, { clearProps: "transform" });
        return;
      }

      const reveal = { trigger: section, start: "top 80%", once: true };
      gsap.fromTo(words, { autoAlpha: 0, yPercent: 105 }, { autoAlpha: 1, yPercent: 0, duration: 0.85, stagger: 0.065, ease: "power4.out", scrollTrigger: reveal });
      gsap.fromTo(details, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, delay: 0.18, ease: "power3.out", scrollTrigger: reveal });

      if (image) {
        gsap.fromTo(image, { yPercent: 6, scale: 1.07 }, { yPercent: -6, scale: 1.02, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      }
    }, section);

    return () => context.revert();
  }, []);

  return <section ref={sectionRef} id="visit" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-24 md:py-36" aria-labelledby="location-title"><div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] md:gap-24"><div><p data-location-reveal className="eyebrow mb-8">{dictionary.location.eyebrow}</p><h2 id="location-title" className="editorial-heading max-w-[9ch] overflow-hidden text-[clamp(4rem,9vw,8.75rem)] font-medium leading-[0.83] text-espresso">{headingWords.map((word, index) => <span key={`${word}-${index}`} className="location-word mr-[0.18em] inline-block">{word}</span>)}</h2><p data-location-reveal className="mt-10 max-w-md text-lg leading-[1.35] text-espresso-soft md:mt-14 md:text-xl">{dictionary.location.description}</p><figure data-location-reveal className="relative mt-14 h-[20rem] overflow-hidden rounded-tr-[5rem] rounded-bl-[1.5rem] bg-espresso/10 md:mt-20 md:h-[27rem]"><div className="location-image absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.location.imageAlt} fill sizes="(max-width: 768px) 92vw, 50vw" className="object-cover object-[56%_center]" /></div></figure></div><div className="flex flex-col justify-end md:pb-2"><div data-location-reveal className="border-t border-espresso/25"><div className="grid gap-6 border-b border-espresso/25 py-7 sm:grid-cols-[9rem_1fr] sm:gap-10"><p className="eyebrow pt-1 text-espresso-soft">{dictionary.location.addressLabel}</p><address className="not-italic text-xl leading-[1.2] text-espresso"><span className="block">{dictionary.location.addressLines[0]}</span><span className="mt-1 block">{dictionary.location.addressLines[1]}</span></address></div><div className="grid gap-6 border-b border-espresso/25 py-7 sm:grid-cols-[9rem_1fr] sm:gap-10"><p className="eyebrow pt-1 text-espresso-soft">{dictionary.location.hoursLabel}</p><ul className="space-y-2 text-lg leading-[1.25] text-espresso" aria-label={dictionary.location.hoursLabel}>{dictionary.location.hours.map((line) => <li key={line}>{line}</li>)}</ul></div><div className="grid gap-6 border-b border-espresso/25 py-7 sm:grid-cols-[9rem_1fr] sm:gap-10"><p className="eyebrow pt-1 text-espresso-soft">{dictionary.location.contactLabel}</p><a href={dictionary.location.phoneHref} className="group inline-flex w-fit items-center gap-3 text-lg text-espresso transition-colors hover:text-olive-deep"><Phone size={17} strokeWidth={1.5} aria-hidden="true" /><span className="border-b border-brass/70 pb-1">{dictionary.location.phoneLabel}</span></a></div></div><div data-location-reveal className="mt-10"><a href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" style={{ color: "#f5f0e8" }} className="group inline-flex items-center gap-3 rounded-full bg-espresso px-6 py-3 text-sm font-medium transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-espresso-soft active:translate-y-0"><span>{dictionary.location.directions}</span><ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a><p className="mt-4 max-w-xs text-xs uppercase leading-[1.45] tracking-[0.1em] text-espresso-soft/70">{dictionary.location.directionsNote}</p></div></div></div></section>;
}
