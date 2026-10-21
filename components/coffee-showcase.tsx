"use client";

import gsap from "gsap";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

type CoffeeShowcaseProps = { locale: Locale; dictionary: Dictionary };

const menuImages = ["/menu-matcha.png", "/menu-breakfast.png", "/menu-coffee.png"];

export function CoffeeShowcase({ locale, dictionary }: CoffeeShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const experienceRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);
  const menuHref = locale === "de" ? "/menu" : "/en/menu";
  const experiences = dictionary.showcase.experiences;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let observer: IntersectionObserver | null = null;
    let revealIfVisible: (() => void) | null = null;
    let revealTimeout: number | null = null;

    const context = gsap.context(() => {
      const reveal = section.querySelectorAll<HTMLElement>("[data-menu-reveal]");
      const panels = section.querySelectorAll<HTMLElement>("[data-menu-panel]");
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

  useLayoutEffect(() => {
    const panels = experienceRefs.current.filter(Boolean) as HTMLElement[];
    if (!panels.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (desktop) {
      panels.forEach((panel, index) => gsap.to(panel, { flexGrow: index === active ? 1.6 : 0.8, duration: 0.7, ease: "power3.out", overwrite: true }));
    } else {
      panels.forEach((panel, index) => gsap.to(panel, { scale: index === active ? 1 : 0.965, duration: 0.45, ease: "power3.out", overwrite: true }));
      panels[active]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [active]);

  function moveExperience(step: number) {
    setActive((current) => (current + step + experiences.length) % experiences.length);
  }

  return (
    <section ref={sectionRef} id="menu-preview" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 text-espresso md:py-28" aria-labelledby="showcase-title">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p data-menu-reveal className="eyebrow mb-5">{dictionary.showcase.eyebrow}</p>
            <h2 id="showcase-title" data-menu-reveal className="editorial-heading max-w-[12ch] text-balance text-[clamp(3.4rem,7vw,7rem)] font-medium leading-[0.86] text-espresso">{dictionary.showcase.heading}</h2>
          </div>
          <p data-menu-reveal className="max-w-sm text-base leading-[1.4] text-espresso-soft md:mb-1 md:text-lg">{dictionary.showcase.description}</p>
        </div>

        <div className="menu-experience-track mt-12 flex gap-4 overflow-x-auto pb-4 md:mt-16 md:gap-3 md:overflow-visible" role="list" aria-label={dictionary.showcase.heading}>
          {experiences.map((experience, index) => (
            <article
              key={experience.title}
              ref={(element) => { experienceRefs.current[index] = element; }}
              data-menu-panel
              role="listitem"
              style={{ flexGrow: active === index ? 1.6 : 0.8 }}
              className={`menu-experience-panel group relative flex min-w-[78vw] flex-[0.8_1_0%] flex-col md:min-w-0 ${index === 0 ? "md:order-2" : index === 1 ? "md:order-1" : "md:order-3"}`}
            >
              <button type="button" onClick={() => setActive(index)} className="menu-experience-image relative block h-[26rem] w-full overflow-hidden rounded-[1.5rem] text-left md:h-[34rem] md:rounded-[2rem]" aria-pressed={active === index} aria-label={`${experience.title}: ${experience.description}`}>
                <Image src={menuImages[index]} alt={experience.imageAlt} fill sizes="(max-width: 767px) 78vw, 42vw" className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
                <span className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" aria-hidden="true" />
                <span className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-ivory md:inset-x-7 md:bottom-7">
                  <span className="max-w-[10ch] text-balance text-[clamp(1.55rem,3vw,3.2rem)] font-normal leading-[0.95] tracking-[-0.045em]">{experience.title}</span>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ivory/50 transition-colors duration-300 ${active === index ? "bg-ivory text-espresso" : "bg-espresso/15 text-ivory"}`} aria-hidden="true"><ArrowUpRight size={17} strokeWidth={1.5} /></span>
                </span>
              </button>
              <div className={`menu-experience-detail overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-out ${active === index ? "mt-4 max-h-40 opacity-100 md:mt-5" : "max-h-0 opacity-0 md:mt-0"}`}>
                <p className="max-w-[20rem] text-sm leading-[1.4] text-espresso-soft md:text-base">{experience.description}</p>
                <Link href={menuHref} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-espresso transition-colors hover:text-olive-deep">
                  {dictionary.showcase.cta}<ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between md:hidden">
          <p className="text-xs tracking-[0.12em] text-espresso-soft">{String(active + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => moveExperience(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-espresso/20 text-espresso transition-colors hover:bg-espresso hover:text-ivory" aria-label="Previous experience"><ChevronLeft size={16} strokeWidth={1.5} /></button>
            <button type="button" onClick={() => moveExperience(1)} className="grid h-10 w-10 place-items-center rounded-full bg-espresso text-ivory transition-colors hover:bg-olive-deep" aria-label="Next experience"><ChevronRight size={16} strokeWidth={1.5} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
