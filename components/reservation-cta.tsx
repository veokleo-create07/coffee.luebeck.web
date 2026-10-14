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
      const mask = section.querySelector<HTMLElement>(".reservation-image-mask");
      const transition = section.querySelector<HTMLElement>(".reservation-transition");

      if (reducedMotion) {
        gsap.set([...words, ...copy], { autoAlpha: 1, clearProps: "transform" });
        if (image) gsap.set(image, { clearProps: "transform" });
        if (mask) gsap.set(mask, { autoAlpha: 0, clearProps: "clipPath" });
        if (transition) gsap.set(transition, { height: "3rem" });
        return;
      }

      const reveal = { trigger: section, start: "top 76%", once: true };
      gsap.fromTo(words, { autoAlpha: 0, yPercent: 110 }, { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.08, ease: "power4.out", scrollTrigger: reveal });
      gsap.fromTo(copy, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.25, ease: "power3.out", scrollTrigger: reveal });

      if (mask) {
        gsap.fromTo(mask, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.25, delay: 0.15, ease: "power4.inOut", scrollTrigger: reveal });
      }

      if (image) {
        gsap.fromTo(image, { yPercent: 7, scale: 1.1 }, { yPercent: -7, scale: 1.02, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      }

      if (transition) {
        gsap.to(transition, { height: 0, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top 72%", scrub: 0.8 } });
      }
    }, section);

    return () => context.revert();
  }, []);

  return <section ref={sectionRef} className="relative isolate overflow-hidden bg-espresso px-[var(--page-gutter)] py-24 text-ivory md:py-36" aria-labelledby="reservation-title">
    <div className="reservation-transition absolute -top-px left-[-5%] z-20 h-16 w-[110%] rounded-[0_0_50%_50%] bg-ivory" aria-hidden="true" />
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-ivory/30" aria-hidden="true" />
    <div className="relative z-10 mx-auto grid max-w-7xl gap-9 md:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.28fr)] md:items-center md:gap-0">
      <div className="relative z-20 md:row-span-2 md:pb-20">
        <p data-reservation-reveal className="eyebrow mb-7 text-brass">{dictionary.reservation.eyebrow}</p>
        <h2 id="reservation-title" className="editorial-heading max-w-[8ch] overflow-hidden text-[clamp(4rem,12vw,10rem)] font-medium leading-[0.8] tracking-[-0.06em] text-ivory md:max-w-[7ch] md:text-[clamp(5rem,9vw,9.5rem)]">{headingWords.map((word, index) => <span key={`${word}-${index}`} className="reservation-word mr-[0.14em] inline-block">{word}</span>)}</h2>
      </div>
      <figure className="relative order-first h-[20rem] overflow-hidden rounded-[0.5rem_4rem_0.5rem_4rem] bg-espresso/80 md:order-none md:-ml-16 md:h-[39rem] md:rounded-[1rem_8rem_1rem_5rem]">
        <div className="reservation-image absolute -inset-y-[9%] inset-x-0"><Image src="/menu-breakfast.png" alt={dictionary.reservation.imageAlt} fill sizes="(max-width: 767px) calc(100vw - 2 * var(--page-gutter)), 72vw" className="object-cover object-center" /></div>
        <div className="reservation-image-mask absolute inset-0 z-10 bg-espresso" aria-hidden="true" />
      </figure>
      <div className="relative z-20 md:-ml-20 md:mt-[-5rem] md:max-w-sm">
        <p data-reservation-reveal className="max-w-xs text-lg leading-[1.35] text-ivory/72 md:text-xl">{dictionary.reservation.description}</p>
        <Link data-reservation-reveal href={reservationHref} className="site-button site-button-primary group mt-8 gap-3 !bg-ivory !text-espresso md:mt-10"><span>{dictionary.reservation.cta}</span><ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
      </div>
    </div>
  </section>;
}
