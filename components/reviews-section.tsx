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
  const [active, setActive] = useState(0);
  const reviews = dictionary.reviews.items;
  const activeReview = reviews[active];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const reveal = section.querySelectorAll<HTMLElement>("[data-review-reveal]");
      if (reducedMotion) {
        gsap.set(reveal, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.fromTo(reveal, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 82%", once: true } });
    }, section);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const quote = section.querySelector<HTMLElement>("[data-active-review]");
    if (!quote) return;
    gsap.fromTo(quote, { autoAlpha: 0, x: 14 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out" });
  }, [active]);

  function moveReview(step: number) {
    setActive((current) => (current + step + reviews.length) % reviews.length);
  }

  return <section ref={sectionRef} id="reviews" className="overflow-hidden bg-[#E9E0D2] px-[var(--page-gutter)] py-20 md:py-24" aria-labelledby="reviews-title"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-8"><div><p data-review-reveal className="eyebrow mb-4 text-olive-deep">{dictionary.reviews.eyebrow}</p><h2 id="reviews-title" data-review-reveal className="editorial-heading text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-[0.88] text-espresso">{dictionary.reviews.eyebrow}</h2></div><p data-review-reveal className="hidden max-w-xs text-right text-xs uppercase leading-[1.45] tracking-[0.12em] text-espresso-soft/75 md:block">{dictionary.reviews.placeholderNotice}</p></div><div className="mt-12 hidden grid-cols-3 divide-x divide-espresso/15 border-y border-espresso/15 md:grid">{reviews.map((review, index) => <article key={`${review.name}-${index}`} data-review-reveal className="px-7 py-8 first:pl-0 last:pr-0"><p className="text-2xl leading-[1.08] text-espresso">“{review.quote}”</p><div className="mt-7 flex items-end justify-between gap-4 border-t border-espresso/15 pt-4"><div><p className="text-sm font-medium text-espresso">{review.name}</p><p className="mt-1 text-[0.68rem] uppercase tracking-[0.12em] text-espresso-soft">{review.rating}</p></div><span className="text-[0.68rem] uppercase tracking-[0.12em] text-olive-deep">Google</span></div></article>)}</div><div className="mt-10 md:hidden"><article data-active-review aria-live="polite" className="border-y border-espresso/15 py-8"><p className="text-[clamp(1.8rem,8vw,2.7rem)] leading-[1.08] text-espresso">“{activeReview.quote}”</p><div className="mt-7 flex items-end justify-between gap-4 border-t border-espresso/15 pt-4"><div><p className="text-sm font-medium text-espresso">{activeReview.name}</p><p className="mt-1 text-[0.68rem] uppercase tracking-[0.12em] text-espresso-soft">{activeReview.rating}</p></div><span className="text-[0.68rem] uppercase tracking-[0.12em] text-olive-deep">Google</span></div></article><div className="mt-5 flex items-center justify-between"><span className="text-xs font-medium tabular-nums text-espresso-soft" aria-label={dictionary.reviews.progressLabel.replace("{current}", String(active + 1)).replace("{total}", String(reviews.length))}>{String(active + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}</span><div className="flex gap-2"><button type="button" onClick={() => moveReview(-1)} className="site-button site-button-secondary h-11 w-11 min-h-11 !rounded-full !p-0" aria-label={dictionary.reviews.previous}><ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /></button><button type="button" onClick={() => moveReview(1)} className="site-button site-button-secondary h-11 w-11 min-h-11 !rounded-full !p-0" aria-label={dictionary.reviews.next}><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></button></div></div></div></div></section>;
}
