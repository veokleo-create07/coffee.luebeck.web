"use client";

import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
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
    }
  }, [active]);

  return (
    <section ref={sectionRef} id="menu-preview" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 text-espresso md:py-24" aria-labelledby="showcase-title">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p data-menu-reveal className="eyebrow mb-4">{dictionary.showcase.eyebrow}</p>
          <h2 id="showcase-title" data-menu-reveal className="editorial-heading text-balance text-[clamp(2.5rem,5vw,4.8rem)] font-medium leading-[0.9] tracking-[-0.045em] text-espresso">{dictionary.showcase.heading}</h2>
          <p data-menu-reveal className="mx-auto mt-5 max-w-md text-sm leading-[1.45] text-espresso-soft md:text-base">{dictionary.showcase.description}</p>
        </div>

        <div className="menu-experience-track mt-10 grid grid-cols-3 items-start gap-2 md:mt-14 md:gap-5" role="list" aria-label={dictionary.showcase.heading}>
          {experiences.map((experience, index) => (
            <article
              key={experience.title}
              ref={(element) => { experienceRefs.current[index] = element; }}
              data-menu-panel
              role="listitem"
              className={`menu-experience-panel group relative flex min-w-0 flex-col ${index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"}`}
            >
              <button type="button" onClick={() => setActive(index)} className={`menu-experience-image relative block h-[14rem] w-full overflow-hidden rounded-[1rem] text-left transition-shadow duration-500 md:h-[27rem] md:rounded-[1.6rem] ${index === 0 ? "md:-translate-y-3" : ""} ${active === index ? "shadow-[0_18px_38px_-24px_rgb(44_33_28_/_65%)]" : "shadow-[0_12px_30px_-26px_rgb(44_33_28_/_45%)]"}`} aria-pressed={active === index} aria-label={`${experience.title}: ${experience.description}`}>
                <Image src={menuImages[index]} alt={experience.imageAlt} fill sizes="(max-width: 767px) 78vw, 42vw" className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
                <span className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" aria-hidden="true" />
                <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-ivory md:inset-x-6 md:bottom-6">
                  <span className="max-w-[10ch] text-balance text-[clamp(0.9rem,2.2vw,2.25rem)] font-normal leading-[0.95] tracking-[-0.045em]">{experience.title}</span>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ivory/50 transition-colors duration-300 md:h-10 md:w-10 ${active === index ? "bg-ivory text-espresso" : "bg-espresso/15 text-ivory"}`} aria-hidden="true"><ArrowUpRight size={14} strokeWidth={1.5} /></span>
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

      </div>
    </section>
  );
}
