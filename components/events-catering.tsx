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
  const pointerFrameRef = useRef(0);
  const pendingPointerRef = useRef<{ heading: HTMLHeadingElement; x: number; y: number } | null>(null);
  const copy = dictionary.events;
  const titleImages = [
    "/reveal-coffee.jpeg",
    "/reveal-matcha.jpeg",
    "/reveal-breakfast.jpeg",
    "/reveal-interior.jpeg",
  ];

  const moveTitleImages = (event: React.PointerEvent<HTMLHeadingElement>) => {
    if (event.pointerType !== "mouse") return;
    pendingPointerRef.current = { heading: event.currentTarget, x: event.clientX, y: event.clientY };
    if (pointerFrameRef.current) return;

    pointerFrameRef.current = window.requestAnimationFrame(() => {
      pointerFrameRef.current = 0;
      const pending = pendingPointerRef.current;
      if (!pending) return;
      pending.heading.querySelectorAll<HTMLElement>("[data-event-title-word]").forEach((word) => {
        const bounds = word.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((pending.x - bounds.left) / bounds.width) * 100));
        const y = Math.max(0, Math.min(100, ((pending.y - bounds.top) / bounds.height) * 100));
        word.style.setProperty("--reveal-x", `${x}%`);
        word.style.setProperty("--reveal-y", `${y}%`);
      });
    });
  };

  const resetTitleImages = (event: React.PointerEvent<HTMLHeadingElement>) => {
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = 0;
    pendingPointerRef.current = null;
    event.currentTarget.querySelectorAll<HTMLElement>("[data-event-title-word]").forEach((word) => {
      word.style.setProperty("--reveal-x", "50%");
      word.style.setProperty("--reveal-y", "50%");
    });
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const reveal = section.querySelectorAll<HTMLElement>("[data-event-reveal]");
      const images = section.querySelectorAll<HTMLElement>("[data-event-image]");
      const titleWords = section.querySelectorAll<HTMLElement>("[data-event-title-word]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set([...reveal, ...images, ...titleWords], { autoAlpha: 1, clearProps: "transform,clipPath" });
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });

      timeline
        .fromTo(
          titleWords,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.85, stagger: 0.12, ease: "power2.inOut", onComplete: () => gsap.set(titleWords, { clearProps: "clipPath" }) },
          0,
        )
        .fromTo(
          reveal,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.09,
            onComplete: () => gsap.set(reveal, { clearProps: "transform,opacity,visibility" }),
          },
        )
        .fromTo(
          images,
          { scale: 1.035 },
          {
            scale: 1,
            duration: 1.15,
            stagger: 0.1,
            onComplete: () => gsap.set(images, { clearProps: "transform" }),
          },
          0.08,
        );
    }, section);

    return () => {
      window.cancelAnimationFrame(pointerFrameRef.current);
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-24 text-espresso md:py-32" aria-labelledby="events-title">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="events-title" aria-label={copy.heading} className="event-mask-heading editorial-heading text-balance text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.88] tracking-[-0.055em]" onPointerMove={moveTitleImages} onPointerLeave={resetTitleImages}>
            {copy.heading.split(" ").map((word, index) => (
              <span key={`${word}-${index}`} data-event-title-word className="event-mask-word inline-block whitespace-nowrap" style={{ backgroundImage: `url("${titleImages[index % titleImages.length]}")` }}>{word}</span>
            ))}
          </h2>
          <p data-event-reveal className="mx-auto mt-7 max-w-2xl text-base leading-[1.5] text-espresso-soft md:mt-9 md:text-lg">{copy.subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:mt-20 md:gap-7">
          <article data-event-reveal className="flex flex-col overflow-hidden rounded-[1.25rem] bg-[#eee9e1] p-2 shadow-[0_10px_28px_-24px_rgb(73_48_36_/_24%)] md:rounded-[1.75rem] md:p-4">
            <div data-event-image className="group relative aspect-square overflow-hidden rounded-[0.85rem] bg-espresso/10 md:aspect-[1.08/1] md:rounded-[1.25rem]">
              <Image src="/events-private.png" alt={copy.privateImageAlt} fill sizes="(max-width: 767px) 48vw, (max-width: 1280px) 45vw, 550px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
            </div>
            <div className="flex-1 px-1.5 pb-1.5 pt-3 md:px-2 md:pb-2 md:pt-5">
              <h3 className="text-[clamp(0.95rem,3.8vw,1.65rem)] font-semibold tracking-[-0.03em]">{copy.privateTitle}</h3>
              <p className="mt-1.5 text-[clamp(0.68rem,2.5vw,1rem)] leading-[1.35] text-espresso-soft md:mt-2.5 md:text-base md:leading-[1.45]">{copy.privateDescription}</p>
            </div>
          </article>

          <article data-event-reveal className="flex flex-col overflow-hidden rounded-[1.25rem] bg-[#eee9e1] p-2 shadow-[0_10px_28px_-24px_rgb(73_48_36_/_24%)] md:rounded-[1.75rem] md:p-4">
            <div data-event-image className="group relative aspect-square overflow-hidden rounded-[0.85rem] bg-espresso/10 md:aspect-[1.08/1] md:rounded-[1.25rem]">
              <Image src="/events-catering.png" alt={copy.cateringImageAlt} fill sizes="(max-width: 767px) 48vw, (max-width: 1280px) 45vw, 550px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
            </div>
            <div className="flex-1 px-1.5 pb-1.5 pt-3 md:px-2 md:pb-2 md:pt-5">
              <h3 className="text-[clamp(0.95rem,3.8vw,1.65rem)] font-semibold tracking-[-0.03em]">{copy.cateringTitle}</h3>
              <p className="mt-1.5 text-[clamp(0.68rem,2.5vw,1rem)] leading-[1.35] text-espresso-soft md:mt-2.5 md:text-base md:leading-[1.45]">{copy.cateringDescription}</p>
            </div>
          </article>
        </div>

        <div className="mx-auto mt-12 grid max-w-[950px] grid-cols-[42%_58%] overflow-hidden rounded-[1.25rem] bg-[#eee9e1] p-2 shadow-[0_10px_28px_-24px_rgb(73_48_36_/_24%)] md:mt-20 md:grid-cols-[42%_58%] md:rounded-[1.75rem] md:p-4">
          <div data-event-reveal className="relative top-3 order-2 flex min-w-0 flex-col justify-center p-2 md:top-5 md:order-2 md:p-8 lg:p-10">
            <h3 className="editorial-heading max-w-[10ch] text-[clamp(1.35rem,4vw,2.75rem)] font-medium leading-[0.92] tracking-[-0.05em]">{copy.featureHeading}</h3>
            <p className="mt-2 max-w-md text-[clamp(0.68rem,2.5vw,1rem)] leading-[1.35] text-espresso-soft md:mt-6 md:text-base md:leading-[1.5]">{copy.featureDescription}</p>
            <a href={dictionary.location.phoneHref} className="events-feature-cta site-button site-button-primary mt-3 min-h-11 self-start rounded-full px-4 text-xs md:mt-6 md:min-h-12 md:px-6 md:text-sm"><span className="relative z-10">{copy.featureCta}</span></a>
          </div>
          <div data-event-image className="order-1 group relative min-h-[13rem] overflow-hidden rounded-[0.9rem] md:order-1 md:min-h-[22rem] md:rounded-[1.25rem]">
            <Image src="/events-feature.jpeg" alt={copy.featureImageAlt} fill sizes="(max-width: 767px) 42vw, 400px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
          </div>
        </div>
      </div>
    </section>
  );
}
