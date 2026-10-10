"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";

gsap.registerPlugin(ScrollTrigger);

type StorySectionProps = { dictionary: Dictionary };

export function StorySection({ dictionary }: StorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const text = section.querySelectorAll<HTMLElement>("[data-story-reveal]");
      const mask = section.querySelector<HTMLElement>(".story-image-mask");
      const image = section.querySelector<HTMLElement>(".story-image");

      if (prefersReducedMotion) {
        gsap.set(text, { autoAlpha: 1, clearProps: "transform" });
        if (mask) gsap.set(mask, { yPercent: -100 });
        if (image) gsap.set(image, { clearProps: "transform" });
        return;
      }

      const revealTrigger = { trigger: section, start: "top 78%", once: true };
      gsap.fromTo(text, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", scrollTrigger: revealTrigger });

      if (mask) {
        gsap.to(mask, { yPercent: -100, duration: 1.25, ease: "power4.inOut", scrollTrigger: revealTrigger });
      }

      if (image) {
        gsap.to(image, { yPercent: -7, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 } });
      }
    }, section);

    return () => context.revert();
  }, []);

  return <section ref={sectionRef} id="story" className="page-gutter overflow-hidden bg-ivory py-24 md:py-40" aria-labelledby="story-title"><div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.28fr)] md:items-end md:gap-16"><div className="md:pb-16"><p data-story-reveal className="eyebrow mb-7">{dictionary.story.eyebrow}</p><h2 id="story-title" data-story-reveal className="editorial-heading max-w-xl text-balance text-[clamp(3.5rem,8vw,8rem)] font-medium leading-[0.86] text-espresso">{dictionary.story.heading}</h2><p data-story-reveal className="mt-8 max-w-sm text-lg leading-[1.35] text-espresso-soft md:mt-12 md:text-xl">{dictionary.story.description}</p></div><figure className="story-image-frame relative aspect-[0.92/1] overflow-hidden rounded-[2rem] bg-espresso/10 md:aspect-[1.2/1] md:rounded-[2.75rem]"><div className="story-image absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.story.imageAlt} fill sizes="(max-width: 768px) 100vw, 62vw" className="object-cover object-center" /></div><div className="story-image-mask absolute inset-0 z-10 bg-ivory" aria-hidden="true" /></figure></div></section>;
}
