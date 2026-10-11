"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type ReservationCtaProps = { locale: Locale; dictionary: Dictionary };

export function ReservationCta({ locale, dictionary }: ReservationCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const headingWords = dictionary.reservation.heading.split(" ");

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const words = section.querySelectorAll<HTMLElement>(".reservation-word");
      const copy = section.querySelectorAll<HTMLElement>("[data-reservation-reveal]");
      const image = section.querySelector<HTMLElement>(".reservation-image");

      if (reducedMotion) {
        gsap.set([...words, ...copy], { autoAlpha: 1, clearProps: "transform" });
        if (image) gsap.set(image, { clearProps: "transform" });
        return;
      }

      const reveal = { trigger: section, start: "top 78%", once: true };
      gsap.fromTo(words, { autoAlpha: 0, yPercent: 105 }, { autoAlpha: 1, yPercent: 0, duration: 0.9, stagger: 0.065, ease: "power4.out", scrollTrigger: reveal });
      gsap.fromTo(copy, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.1, delay: 0.22, ease: "power3.out", scrollTrigger: reveal });

      if (image) {
        gsap.fromTo(image, { yPercent: 7, scale: 1.08 }, { yPercent: -7, scale: 1.02, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      }
    }, section);

    return () => context.revert();
  }, []);

  return <section ref={sectionRef} className="relative isolate overflow-hidden bg-espresso px-[var(--page-gutter)] py-24 text-ivory md:py-36" aria-labelledby="reservation-title"><div className="absolute inset-y-0 right-0 hidden w-[48%] overflow-hidden md:block" aria-hidden="true"><div className="reservation-image absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt="" fill sizes="48vw" className="object-cover object-[66%_center] opacity-35 mix-blend-luminosity" /></div><div className="absolute inset-0 bg-espresso/55" /></div><div className="relative mx-auto max-w-7xl"><div className="max-w-3xl md:min-h-[35rem] md:flex md:flex-col md:justify-center"><p data-reservation-reveal className="eyebrow mb-8 text-brass">{dictionary.reservation.eyebrow}</p><h2 id="reservation-title" className="editorial-heading max-w-[10ch] overflow-hidden text-[clamp(3.8rem,9vw,8.75rem)] font-medium leading-[0.83] text-ivory">{headingWords.map((word, index) => <span key={`${word}-${index}`} className="reservation-word mr-[0.18em] inline-block">{word}</span>)}</h2><p data-reservation-reveal className="mt-10 max-w-sm text-lg leading-[1.35] text-ivory/75 md:mt-12 md:text-xl">{dictionary.reservation.description}</p><Link data-reservation-reveal href={reservationHref} className="site-button site-button-secondary group mt-9 self-start md:mt-11"><span>{dictionary.reservation.cta}</span><span aria-hidden="true" className="ml-3 text-base transition-transform duration-300 group-hover:translate-x-1">↗</span></Link></div><div className="relative mt-14 h-[17rem] overflow-hidden rounded-tl-[4rem] rounded-br-[1.5rem] md:hidden"><div className="reservation-image absolute -inset-y-[8%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.reservation.imageAlt} fill sizes="calc(100vw - 2 * var(--page-gutter))" className="object-cover object-[62%_center]" /></div><div className="absolute inset-0 bg-espresso/20" /></div></div></section>;
}
