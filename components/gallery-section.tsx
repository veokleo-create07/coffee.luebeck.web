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

type GallerySectionProps = { locale: Locale; dictionary: Dictionary };

export function GallerySection({ locale, dictionary }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const menuHref = locale === "de" ? "/menu" : "/en/menu";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const text = section.querySelectorAll<HTMLElement>("[data-gallery-reveal]");
      const masks = section.querySelectorAll<HTMLElement>(".gallery-mask");
      const images = section.querySelectorAll<HTMLElement>(".gallery-image");

      if (prefersReducedMotion) {
        gsap.set(text, { autoAlpha: 1, clearProps: "transform" });
        gsap.set(masks, { yPercent: -100 });
        gsap.set(images, { clearProps: "transform" });
        return;
      }

      const revealTrigger = { trigger: section, start: "top 78%", once: true };
      gsap.fromTo(text, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", scrollTrigger: revealTrigger });
      gsap.to(masks, { yPercent: -100, duration: 1.2, stagger: 0.1, ease: "power4.inOut", scrollTrigger: revealTrigger });

      if (desktop) {
        const distance = () => Math.max(track.scrollWidth - window.innerWidth + 48, 360);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        images.forEach((image, index) => {
          gsap.to(image, { yPercent: -5 - index * 2.5, scale: 1.03 + index * 0.005, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 } });
        });
      } else {
        images.forEach((image, index) => {
          gsap.to(image, { yPercent: -3 - index, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.4 } });
        });
      }
    }, section);

    return () => context.revert();
  }, []);

  const imagePositions = ["object-[24%_center]", "object-[78%_center]", "object-[52%_center]", "object-[92%_center]"];
  const panelSizes = ["h-[24rem] w-[18rem] md:h-[60vh] md:min-h-[30rem] md:w-[48vw]", "h-[20rem] w-[14rem] md:h-[46vh] md:w-[25vw]", "h-[22rem] w-[20rem] md:h-[52vh] md:w-[39vw]", "h-[24rem] w-[16rem] md:h-[58vh] md:w-[28vw]"];

  return <section ref={sectionRef} className="overflow-hidden bg-ivory py-24 md:min-h-screen md:py-32" aria-labelledby="gallery-title"><div className="page-gutter"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><p data-gallery-reveal className="eyebrow mb-7">{dictionary.gallery.eyebrow}</p><h2 id="gallery-title" data-gallery-reveal className="editorial-heading max-w-3xl text-balance text-[clamp(3.5rem,8vw,8rem)] font-medium leading-[0.86] text-espresso">{dictionary.gallery.heading}</h2></div><div className="max-w-xs md:mb-2"><p data-gallery-reveal className="text-lg leading-[1.35] text-espresso-soft md:text-xl">{dictionary.gallery.description}</p><Link data-gallery-reveal href={menuHref} className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-espresso transition-colors hover:text-olive"><span className="border-b border-brass pb-1">{dictionary.gallery.link}</span><ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></div></div></div><div className="gallery-viewport mt-16 overflow-x-auto overscroll-x-contain md:mt-24 md:overflow-hidden" aria-label={dictionary.gallery.heading}><div ref={trackRef} className="gallery-track flex w-max snap-x snap-mandatory items-end gap-4 px-[var(--page-gutter)] md:gap-8"><figure className={`gallery-panel relative shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-espresso/10 md:rounded-[2.75rem] ${panelSizes[0]}`}><div className="gallery-image absolute -inset-y-[7%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.gallery.imageAlts[0]} fill sizes="(max-width: 768px) 288px, 48vw" className={`object-cover ${imagePositions[0]}`} /></div><div className="gallery-mask absolute inset-0 z-10 bg-ivory" aria-hidden="true" /></figure><figure className={`gallery-panel relative shrink-0 snap-start overflow-hidden rounded-[1.5rem] bg-espresso/10 md:rounded-[2.25rem] ${panelSizes[1]}`}><div className="gallery-image absolute -inset-y-[7%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.gallery.imageAlts[1]} fill sizes="(max-width: 768px) 224px, 25vw" className={`object-cover ${imagePositions[1]}`} /></div><div className="gallery-mask absolute inset-0 z-10 bg-ivory" aria-hidden="true" /></figure><figure className={`gallery-panel relative shrink-0 snap-start overflow-hidden rounded-[2rem] bg-espresso/10 md:rounded-[2.75rem] ${panelSizes[2]}`}><div className="gallery-image absolute -inset-y-[7%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.gallery.imageAlts[2]} fill sizes="(max-width: 768px) 320px, 39vw" className={`object-cover ${imagePositions[2]}`} /></div><div className="gallery-mask absolute inset-0 z-10 bg-ivory" aria-hidden="true" /></figure><figure className={`gallery-panel relative shrink-0 snap-start overflow-hidden rounded-[1.5rem] bg-espresso/10 md:rounded-[2.5rem] ${panelSizes[3]}`}><div className="gallery-image absolute -inset-y-[7%] inset-x-0"><Image src="/altstadtliebe-interior.png" alt={dictionary.gallery.imageAlts[3]} fill sizes="(max-width: 768px) 256px, 28vw" className={`object-cover ${imagePositions[3]}`} /></div><div className="gallery-mask absolute inset-0 z-10 bg-ivory" aria-hidden="true" /></figure></div></div></section>;
}
