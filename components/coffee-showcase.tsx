"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { ParticleTitle } from "@/components/ui/particle-title";

type CoffeeShowcaseProps = { locale: Locale; dictionary: Dictionary };

const menuImages = ["/menu-matcha.jpeg", "/menu-breakfast.jpeg", "/coffee-pause.jpg"];

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
    let revealTimeline: gsap.core.Timeline | null = null;
    let handleScroll: (() => void) | null = null;

    const context = gsap.context(() => {
      const reveal = section.querySelectorAll<HTMLElement>("[data-menu-reveal]");
      const panels = section.querySelectorAll<HTMLElement>("[data-menu-card]");
      const images = section.querySelectorAll<HTMLElement>("[data-menu-card] img");
      const track = section.querySelector<HTMLElement>(".menu-experience-track");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion || !track) {
        gsap.set([...reveal, ...panels, ...images], { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.set(reveal, { autoAlpha: 1, clearProps: "transform" });
      gsap.set(panels, { autoAlpha: 0, y: 38, scale: 0.97, transformOrigin: "50% 70%", willChange: "transform, opacity" });
      gsap.set(images, { scale: 1.075, transformOrigin: "50% 50%", willChange: "transform" });

      let hasRevealed = false;
      const playReveal = () => {
        if (hasRevealed) return;
        hasRevealed = true;
        observer?.disconnect();
        if (handleScroll) window.removeEventListener("scroll", handleScroll);

        revealTimeline = gsap.timeline({ defaults: { ease: "power3.out" } })
          .to(panels, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.95,
            stagger: 0.13,
            onComplete: () => gsap.set(panels, { clearProps: "transform,opacity,visibility,willChange" }),
          })
          .to(images, {
            scale: 1,
            duration: 1.2,
            stagger: 0.13,
            onComplete: () => gsap.set(images, { clearProps: "transform,willChange" }),
          }, 0);
      };

      observer = new IntersectionObserver(([entry]) => {
        const hasPassedRevealPoint = entry.boundingClientRect.top < window.innerHeight * 0.92;
        if (entry.isIntersecting || hasPassedRevealPoint) playReveal();
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      observer.observe(track);

      handleScroll = () => {
        if (track.getBoundingClientRect().top < window.innerHeight * 0.92) playReveal();
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.requestAnimationFrame(handleScroll);
    }, section);

    return () => {
      observer?.disconnect();
      if (handleScroll) window.removeEventListener("scroll", handleScroll);
      revealTimeline?.kill();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="menu-preview" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 text-espresso md:py-24" aria-labelledby="showcase-title">
      <div className="mx-auto max-w-7xl">
        <ParticleTitle id="showcase-title" text={dictionary.showcase.heading} className="mx-auto h-[clamp(145px,17vw,205px)] max-w-[22ch] text-[clamp(2.15rem,4.25vw,4.5rem)] font-medium leading-[0.94] tracking-[-0.05em]" />

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
