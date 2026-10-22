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
const googleReviewsHref = "https://maps.app.goo.gl/12eVKxTnwfxyiZub6";

function ReviewQuote({ review }: { review: LocalReview }) {
  const words = review.quote.split(" ");

  return <article className="absolute inset-0 flex flex-col justify-center" aria-live="polite">
    <div className="flex items-center gap-2.5 text-sm tracking-normal text-espresso-soft">
      {review.rating ? <span className="flex items-center gap-1 text-brass" aria-label={`${review.rating} stars`}>
        {Array.from({ length: review.rating }, (_, index) => <Star key={index} size={13} strokeWidth={0} fill="currentColor" aria-hidden="true" />)}
      </span> : null}
      <span className="font-medium text-espresso">{review.name}</span>
      <span className="h-1 w-1 rounded-full bg-brass" aria-hidden="true" />
      <span className="text-espresso-soft">Google</span>
    </div>
    <blockquote className="mt-4 max-w-4xl text-[clamp(2rem,4.4vw,4.75rem)] font-medium leading-[0.94] tracking-[-0.055em] text-espresso md:mt-8">
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

      const reveal = section.querySelectorAll<HTMLElement>("[data-review-reveal]");
      gsap.fromTo(reveal, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: section, start: "top 80%", once: true } });
      gsap.set(words, { y: "0.45em", autoAlpha: 0 });
      gsap.to(section.querySelectorAll<HTMLElement>("[data-review-index='0'] .review-word"), { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.032, delay: 0.16, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 80%", once: true } });
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
    timeline.to(quotes[previous], { autoAlpha: 0, y: active > previous ? -18 : 18, duration: 0.32 }).fromTo(quotes[active], { autoAlpha: 0, y: active > previous ? 18 : -18 }, { autoAlpha: 1, y: 0, duration: 0.52 }, "-=0.1").fromTo(quotes[active].querySelectorAll(".review-word"), { y: "0.3em", autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.52, stagger: 0.022 }, "-=0.3");
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
      <div className="relative min-h-[10rem] md:min-h-[18rem]" data-review-reveal>
        {reviews.map((review, index) => <div key={`${review.name}-${index}`} ref={(element) => { quoteRefs.current[index] = element; }} data-review-index={index} aria-hidden={index !== active}><ReviewQuote review={review} /></div>)}
      </div>
      <div data-review-reveal className="-mt-3 flex flex-wrap items-center justify-between gap-6 pt-1 md:mt-0">
        <Link href={googleReviewsHref} target="_blank" rel="noreferrer" aria-label={dictionary.reviews.googleLink} className="site-button site-button-primary group h-12 min-h-12 gap-3 !rounded-full px-5 text-sm"><span>{locale === "de" ? "Alle Bewertungen ansehen" : "See all reviews on"}</span><svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true"><path fill="#4285F4" d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z" /><path fill="#34A853" d="M12 21.99c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.99Z" /><path fill="#FBBC05" d="M6.54 14.09A5.86 5.86 0 0 1 6.24 12c0-.73.13-1.44.3-2.09V7.38H3.3A9.99 9.99 0 0 0 2.25 12c0 1.67.4 3.25 1.05 4.62l3.24-2.53Z" /><path fill="#EA4335" d="M12 5.88c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 2.96 14.63 2 12 2a9.75 9.75 0 0 0-8.7 5.38l3.24 2.53C7.31 7.6 9.46 5.88 12 5.88Z" /></svg><ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
        <div className="flex items-center gap-3" aria-label={dictionary.reviews.progressLabel.replace("{current}", String(active + 1)).replace("{total}", String(reviews.length))}>
          <button type="button" onClick={() => moveReview(-1)} className="site-button site-button-secondary h-11 w-11 min-h-11 !rounded-full !p-0" aria-label={dictionary.reviews.previous}><ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" /></button>
          <button type="button" onClick={() => moveReview(1)} className="site-button site-button-primary h-11 w-11 min-h-11 !rounded-full !p-0" aria-label={dictionary.reviews.next}><ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  </section>;
}
