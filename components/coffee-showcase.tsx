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

const photoRotations = [-3, 1.5, 3.5, -2];

export function CoffeeShowcase({ locale, dictionary }: CoffeeShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const menuHref = locale === "de" ? "/menu" : "/en/menu";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const reveal = section.querySelectorAll<HTMLElement>("[data-menu-reveal]");
      const photos = section.querySelectorAll<HTMLElement>("[data-menu-photo]");
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([...reveal, ...photos], { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      const trigger = { trigger: section, start: "top 78%", end: "bottom 18%", scrub: 1.1 };

      gsap.fromTo(
        reveal,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 82%", once: true } },
      );

      photos.forEach((photo, index) => {
        const finalRotation = photoRotations[index];
        const startY = [72, 112, 88, 128][index];
        const depth = [0.16, 0.08, 0.2, 0.13][index];
        const image = photo.querySelector<HTMLElement>(".menu-photo-image");

        gsap.fromTo(
          photo,
          { autoAlpha: 0, y: startY, rotate: finalRotation + (index % 2 === 0 ? -2 : 2), scale: index === 1 ? 0.94 : 0.97 },
          { autoAlpha: 1, y: 0, rotate: finalRotation, scale: index === 1 ? 1.015 : 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 88%", once: true } },
        );

        if (image) gsap.to(image, { y: -90 * depth, ease: "none", scrollTrigger: trigger });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="menu-preview" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 text-espresso md:py-28" aria-labelledby="showcase-title">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p data-menu-reveal className="eyebrow mb-5 text-olive-deep">{dictionary.showcase.eyebrow}</p>
            <h2 id="showcase-title" data-menu-reveal className="editorial-heading max-w-[11ch] text-balance text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[0.86] text-espresso">{dictionary.showcase.heading}</h2>
          </div>
          <div className="max-w-sm md:mb-1">
            <p data-menu-reveal className="text-base leading-[1.4] text-espresso-soft md:text-lg">{dictionary.showcase.description}</p>
            <Link data-menu-reveal href={menuHref} className="site-button site-button-secondary group mt-6 gap-3">
              <span>{dictionary.showcase.cta}</span>
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="relative mt-14 min-h-[47rem] md:mt-20 md:min-h-[54rem]" aria-label={dictionary.showcase.heading}>
          {menuImages.map((image, index) => (
            <figure
              key={image}
              data-menu-photo
              className={`absolute overflow-hidden bg-espresso-soft shadow-[0_24px_48px_-34px_rgba(44,33,28,0.6)] ${
                index === 0
                  ? "left-0 top-8 h-[16rem] w-[58%] rounded-tl-[2.5rem] rounded-br-[0.9rem] md:left-[4%] md:top-16 md:h-[25rem] md:w-[25%] md:rounded-tl-[3rem]"
                  : index === 1
                    ? "right-0 top-20 h-[21rem] w-[68%] rounded-tr-[0.9rem] rounded-bl-[2.75rem] md:left-[28%] md:right-auto md:top-0 md:h-[38rem] md:w-[43%] md:rounded-tr-[1.5rem] md:rounded-bl-[4rem]"
                    : index === 2
                      ? "left-[8%] top-[23rem] h-[16rem] w-[58%] rounded-tl-[0.9rem] rounded-br-[2.75rem] md:left-auto md:right-[3%] md:top-28 md:h-[27rem] md:w-[27%] md:rounded-tl-[1rem] md:rounded-br-[3.25rem]"
                      : "bottom-0 right-0 h-[18rem] w-[62%] rounded-tr-[2.5rem] rounded-bl-[0.9rem] md:bottom-8 md:left-[16%] md:right-auto md:h-[25rem] md:w-[31%] md:rounded-tr-[3.25rem]"
              }`}
            >
              <div className="menu-photo-image absolute -inset-y-[5%] inset-x-0">
                <Image src={image} alt={index === 0 ? dictionary.showcase.imageAlt : ""} fill sizes="(max-width: 768px) 62vw, 43vw" className="object-cover object-center" aria-hidden={index !== 0} />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
