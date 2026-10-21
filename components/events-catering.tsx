"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";

gsap.registerPlugin(ScrollTrigger);

type EventsCateringProps = { dictionary: Dictionary };

export function EventsCatering({ dictionary }: EventsCateringProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copy = dictionary.events;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const reveal = section.querySelectorAll<HTMLElement>("[data-event-reveal]");
      const images = section.querySelectorAll<HTMLElement>("[data-event-image]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set([...reveal, ...images], { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      const trigger = { trigger: section, start: "top 78%", once: true };
      gsap.fromTo(reveal, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: trigger });
      gsap.fromTo(images, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: trigger });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-24 text-espresso md:py-32" aria-labelledby="events-title">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="events-title" data-event-reveal className="editorial-heading text-balance text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.88] tracking-[-0.055em]">{copy.heading}</h2>
          <p data-event-reveal className="mx-auto mt-7 max-w-2xl text-base leading-[1.5] text-espresso-soft md:mt-9 md:text-lg">{copy.subtitle}</p>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 md:gap-7">
          <article data-event-reveal>
            <div data-event-image className="group relative aspect-[1.08/1] overflow-hidden rounded-[1.4rem] bg-espresso/10 md:rounded-[2rem]">
              <Image src="/altstadtliebe-interior.png" alt={copy.privateImageAlt} fill sizes="(max-width: 767px) 100vw, 45vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
            </div>
            <div className="mt-5 max-w-md">
              <h3 className="text-[1.35rem] font-medium tracking-[-0.025em] md:text-[1.55rem]">{copy.privateTitle}</h3>
              <p className="mt-2.5 text-sm leading-[1.5] text-espresso-soft md:text-base">{copy.privateDescription}</p>
            </div>
          </article>

          <article data-event-reveal>
            <div data-event-image className="group relative aspect-[1.08/1] overflow-hidden rounded-[1.4rem] bg-espresso/10 md:rounded-[2rem]">
              <Image src="/menu-breakfast.jpeg" alt={copy.cateringImageAlt} fill sizes="(max-width: 767px) 100vw, 45vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
            </div>
            <div className="mt-5 max-w-md">
              <h3 className="text-[1.35rem] font-medium tracking-[-0.025em] md:text-[1.55rem]">{copy.cateringTitle}</h3>
              <p className="mt-2.5 text-sm leading-[1.5] text-espresso-soft md:text-base">{copy.cateringDescription}</p>
            </div>
          </article>
        </div>

        <div className="mt-20 grid overflow-hidden rounded-[1.5rem] bg-[#e9e1d5] md:mt-28 md:grid-cols-[0.82fr_1.18fr] md:rounded-[2rem]">
          <div data-event-reveal className="flex flex-col justify-center p-8 md:p-14 lg:p-20">
            <h3 className="editorial-heading max-w-[9ch] text-[clamp(2.7rem,5vw,5.2rem)] font-medium leading-[0.9] tracking-[-0.055em]">{copy.featureHeading}</h3>
            <p className="mt-7 max-w-md text-base leading-[1.5] text-espresso-soft md:mt-9 md:text-lg">{copy.featureDescription}</p>
            <a href={dictionary.location.phoneHref} data-event-reveal className="site-button site-button-primary mt-8 self-start md:mt-10">{copy.featureCta}</a>
          </div>
          <div data-event-image className="group relative min-h-[19rem] overflow-hidden md:min-h-[30rem]">
            <Image src="/menu-coffee.jpeg" alt={copy.featureImageAlt} fill sizes="(max-width: 767px) 100vw, 60vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
          </div>
        </div>
      </div>
    </section>
  );
}
