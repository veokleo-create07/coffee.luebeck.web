"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";

gsap.registerPlugin(ScrollTrigger);

type ReviewsSectionProps = { dictionary: Dictionary };

export function ReviewsSection({ dictionary }: ReviewsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasEntered = useRef(false);
  const direction = useRef(1);
  const [active, setActive] = useState(0);
  const review = dictionary.reviews.items[active];
  const quoteWords = review.quote.split(" ");

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        hasEntered.current = true;
        gsap.set(section.querySelectorAll(".review-word, .review-meta"), { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          hasEntered.current = true;
          gsap.fromTo(section.querySelectorAll(".review-word"), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.035, ease: "power3.out" });
          gsap.fromTo(section.querySelectorAll(".review-meta"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.28, ease: "power3.out" });
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || !hasEntered.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(section.querySelectorAll(".review-word"), { autoAlpha: 0, x: direction.current * 22, y: 8 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.55, stagger: 0.032, ease: "power3.out" });
      gsap.fromTo(section.querySelectorAll(".review-meta"), { autoAlpha: 0, x: direction.current * 14 }, { autoAlpha: 1, x: 0, duration: 0.45, delay: 0.12, ease: "power3.out" });
    }, section);

    return () => context.revert();
  }, [active]);

  function moveReview(step: number) {
    direction.current = step;
    setActive((current) => (current + step + dictionary.reviews.items.length) % dictionary.reviews.items.length);
  }

  const progressLabel = dictionary.reviews.progressLabel.replace("{current}", String(active + 1)).replace("{total}", String(dictionary.reviews.items.length));

  return <section ref={sectionRef} id="reviews" className="bg-[#E9E0D2] px-[var(--page-gutter)] py-24 md:py-40" aria-labelledby="reviews-title"><div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[minmax(12rem,0.42fr)_minmax(0,1.58fr)] md:gap-20"><div className="flex flex-col justify-between md:min-h-[34rem]"><div><p className="eyebrow mb-7 text-olive-deep">{dictionary.reviews.eyebrow}</p><h2 id="reviews-title" className="editorial-heading max-w-[9ch] text-5xl font-medium leading-[0.88] text-espresso md:text-7xl">{dictionary.reviews.eyebrow}</h2></div><p className="mt-8 max-w-[16rem] text-xs uppercase leading-[1.45] tracking-[0.12em] text-espresso-soft/75 md:mt-0">{dictionary.reviews.placeholderNotice}</p></div><div className="flex min-h-[26rem] flex-col justify-between md:min-h-[34rem]"><div aria-live="polite" aria-atomic="true" className="max-w-5xl"><blockquote className="editorial-heading text-[clamp(2.5rem,6vw,6.5rem)] font-medium leading-[0.94] text-espresso"><span aria-hidden="true">“</span>{quoteWords.map((word, index) => <span key={`${active}-${word}-${index}`} className="review-word inline-block">{word}{index < quoteWords.length - 1 ? " " : ""}</span>)}<span aria-hidden="true">”</span></blockquote></div><div className="review-meta mt-14 border-t border-espresso/20 pt-5"><div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-espresso">{review.name}</p><p className="mt-2 text-xs uppercase tracking-[0.14em] text-espresso-soft">{review.rating}</p></div><div className="flex items-center gap-5"><span className="text-xs font-medium tabular-nums text-espresso-soft" aria-label={progressLabel}>{String(active + 1).padStart(2, "0")} / {String(dictionary.reviews.items.length).padStart(2, "0")}</span><div className="flex items-center gap-2"><button type="button" onClick={() => moveReview(-1)} className="group flex h-11 w-11 items-center justify-center rounded-full border border-espresso/35 text-espresso transition-colors hover:border-espresso hover:bg-espresso hover:text-ivory active:scale-95" aria-label={dictionary.reviews.previous}><ArrowLeft size={17} strokeWidth={1.5} className="transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" /></button><button type="button" onClick={() => moveReview(1)} className="group flex h-11 w-11 items-center justify-center rounded-full border border-espresso/35 text-espresso transition-colors hover:border-espresso hover:bg-espresso hover:text-ivory active:scale-95" aria-label={dictionary.reviews.next}><ArrowRight size={17} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" /></button></div></div></div></div></div></div></section>;
}
