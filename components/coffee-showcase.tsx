"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

type CoffeeShowcaseProps = { locale: Locale; dictionary: Dictionary };

const menuImages = ["/menu-matcha.jpeg", "/menu-breakfast.jpeg", "/coffee-pause-premium.png"];

export function CoffeeShowcase({ locale, dictionary }: CoffeeShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const menuHref = locale === "de" ? "/menu" : "/en/menu";
  const experiences = dictionary.showcase.experiences;
  const cards = [experiences[0], experiences[1], experiences[2]];
  const imageIndexes = [0, 1, 2];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let observer: IntersectionObserver | null = null;
    let revealIfVisible: (() => void) | null = null;
    let revealTimeout: number | null = null;

    const context = gsap.context(() => {
      const reveal = section.querySelectorAll<HTMLElement>("[data-menu-reveal]");
      const panels = section.querySelectorAll<HTMLElement>("[data-menu-card]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set([...reveal, ...panels], { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.set([...reveal, ...panels], { autoAlpha: 1 });
      gsap.set(reveal, { y: 24 });
      gsap.set(panels, { y: 56 });

      const playReveal = () => {
        gsap.to(reveal, { y: 0, duration: 0.75, stagger: 0.08, ease: "power3.out", overwrite: true });
        gsap.to(panels, { y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", overwrite: true });
      };
      revealIfVisible = () => {
        const bounds = section.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0) playReveal();
      };
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) playReveal();
      }, { threshold: 0.08 });
      observer.observe(section);
      window.addEventListener("scroll", revealIfVisible, { passive: true });
      revealIfVisible();
      revealTimeout = window.setTimeout(playReveal, 900);
    }, section);

    return () => {
      observer?.disconnect();
      if (revealIfVisible) window.removeEventListener("scroll", revealIfVisible);
      if (revealTimeout) window.clearTimeout(revealTimeout);
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="menu-preview" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 text-espresso md:py-24" aria-labelledby="showcase-title">
      <div className="mx-auto max-w-7xl">
        <h2 id="showcase-title" data-menu-reveal className="editorial-heading mx-auto max-w-[13ch] text-center text-balance text-[clamp(2.8rem,5.5vw,5.8rem)] font-medium leading-[0.88] tracking-[-0.055em] text-espresso">{dictionary.showcase.heading}</h2>

        <div className="menu-experience-track mx-auto mt-12 grid w-full max-w-[760px] grid-cols-3 gap-2 md:mt-16 md:gap-5" role="list" aria-label={dictionary.showcase.heading}>
          {cards.map((experience, index) => (
            <article
              key={experience.title}
              data-menu-card
              role="listitem"
              className="menu-experience-card group relative aspect-[3/4] overflow-hidden rounded-[0.9rem] bg-espresso/10 shadow-[0_18px_35px_-28px_rgb(44_33_28_/_70%)] transition-transform duration-500 hover:-translate-y-1 md:rounded-[1.8rem]"
            >
              <Link href={menuHref} className="absolute inset-0" aria-label={experience.title}>
                <Image src={menuImages[imageIndexes[index]]} alt={experience.imageAlt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
                <span className="absolute inset-x-1.5 bottom-1.5 rounded-full bg-ivory/95 px-1 py-2 text-center text-[0.68rem] font-medium leading-none text-espresso shadow-[0_10px_24px_-18px_rgb(44_33_28_/_65%)] backdrop-blur-sm md:inset-x-5 md:bottom-5 md:px-6 md:py-3.5 md:text-base">{experience.title}</span>
              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
