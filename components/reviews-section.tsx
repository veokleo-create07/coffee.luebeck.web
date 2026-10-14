"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { LocalReview } from "@/lib/reviews";
import type { Locale } from "@/lib/i18n";
import { localReviews } from "@/lib/reviews";

gsap.registerPlugin(ScrollTrigger);

type ReviewsSectionProps = { locale: Locale; dictionary: Dictionary };

function ReviewQuote({ review }: { review: LocalReview }) {
  const words = review.quote.split(" ");

  return <article className="absolute inset-0 flex flex-col justify-center" aria-live="polite">
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-espresso-soft">
      {review.rating ? <span className="flex items-center gap-1 text-brass" aria-label={`${review.rating} stars`}>
        {Array.from({ length: review.rating }, (_, index) => <Star key={index} size={13} strokeWidth={0} fill="currentColor" aria-hidden="true" />)}
      </span> : null}
      <span>{review.name}</span>
      <span className="h-px w-8 bg-brass/70" aria-hidden="true" />
      <span>Google</span>
    </div>
    <blockquote className="mt-6 max-w-4xl text-[clamp(2rem,4.4vw,4.75rem)] font-medium leading-[0.94] tracking-[-0.055em] text-espresso md:mt-8">
      “{words.map((word, index) => <span key={`${word}-${index}`} className="review-word inline-block">{word}{index < words.length - 1 ? "\u00a0" : ""}</span>)}”
    </blockquote>
  </article>;
}

export function ReviewsSection({ locale, dictionary }: ReviewsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRefs = useRef<Array<HTMLElement | null>>([]);
  const previousActive = useRef(0);
  const [active, setActive] = useState(0);
  const reviews = localReviews[locale].filter((review) => review.approved);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || reviews.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      const quotes = quoteRefs.current.filter(Boolean) as HTMLElement[];
      const words = section.querySelectorAll<HTMLElement>(".review-word");
      gsap.set(quotes, { autoAlpha: 0, y: 24 });
      gsap.set(quotes[0], { autoAlpha: 1, y: 0 });

      if (reducedMotion) {
        gsap.set(quotes, { autoAlpha: 0, y: 0 });
        gsap.set(quotes[0], { autoAlpha: 1 });
        return;
      }

      gsap.fromTo(section.querySelectorAll<HTMLElement>("[data-review-reveal]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 78%", once: true } });
      gsap.set(words, { y: "0.45em", autoAlpha: 0 });
      gsap.to(section.querySelectorAll<HTMLElement>("[data-review-index='0'] .review-word"), { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.035, delay: 0.2, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 78%", once: true } });
    }, section);

    return () => context.revert();
  }, [reviews.length]);

  useLayoutEffect(() => {
    const quotes = quoteRefs.current.filter(Boolean) as HTMLElement[];
    const previous = previousActive.current;
    if (!quotes.length) {
      previousActive.current = active;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(quotes, { autoAlpha: 0, y: 0 });
      gsap.set(quotes[active], { autoAlpha: 1 });
      previousActive.current = active;
      return;
    }
    if (previous === active) return;

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.to(quotes[previous], { autoAlpha: 0, y: active > previous ? -24 : 24, duration: 0.3 }).fromTo(quotes[active], { autoAlpha: 0, y: active > previous ? 24 : -24 }, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.08").fromTo(quotes[active].querySelectorAll(".review-word"), { y: "0.35em", autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.025 }, "-=0.25");
    previousActive.current = active;
    return () => { timeline.kill(); };
  }, [active]);

  function moveReview(step: number) {
    setActive((current) => (current + step + reviews.length) % reviews.length);
  }

  if (!reviews.length) return null;

  return <section ref={sectionRef} id="reviews" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 md:py-32" aria-labelledby="reviews-title">
    <div className="mx-auto max-w-7xl">
      <h2 id="reviews-title" className="sr-only">{dictionary.reviews.heading}</h2>
      <div className="relative min-h-[20rem] md:min-h-[25rem]" data-review-reveal>
        {reviews.map((review, index) => <div key={`${review.name}-${index}`} ref={(element) => { quoteRefs.current[index] = element; }} data-review-index={index} aria-hidden={index !== active}><ReviewQuote review={review} /></div>)}
      </div>
      <div data-review-reveal className="flex flex-col gap-7 border-t border-espresso/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-espresso transition-colors hover:text-olive-deep"><span className="border-b border-brass/70 pb-1">{dictionary.reviews.googleLink.replace(" ↗", "")}</span><ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
        <div className="flex items-center gap-3" aria-label={dictionary.reviews.progressLabel.replace("{current}", String(active + 1)).replace("{total}", String(reviews.length))}>
          <button type="button" onClick={() => moveReview(-1)} className="site-button site-button-secondary h-11 w-11 min-h-11 !rounded-full !p-0" aria-label={dictionary.reviews.previous}><ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" /></button>
          <button type="button" onClick={() => moveReview(1)} className="site-button site-button-primary h-11 w-11 min-h-11 !rounded-full !p-0" aria-label={dictionary.reviews.next}><ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  </section>;
}
