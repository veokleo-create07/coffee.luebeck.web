"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { localReviews } from "@/lib/reviews";

gsap.registerPlugin(ScrollTrigger);

type ReviewsSectionProps = { locale: Locale; dictionary: Dictionary };

function ReviewCard({ quote, name, rating, approvalStatus }: { quote: string; name: string; rating: number | null; approvalStatus: string }) {
  return <article className="review-card flex min-h-[12.5rem] flex-col justify-between rounded-[1.25rem] border border-espresso/12 bg-ivory/65 p-5 md:p-6"><div>{rating ? <div className="flex items-center gap-1 text-brass" aria-label={`${rating} stars`}>
    {Array.from({ length: rating }, (_, index) => <Star key={index} size={14} strokeWidth={0} fill="currentColor" aria-hidden="true" />)}
  </div> : <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brass">{approvalStatus}</p>}<p className="mt-5 text-[1.15rem] leading-[1.18] text-espresso">“{quote}”</p></div><div className="mt-7 flex items-end justify-between gap-3 border-t border-espresso/12 pt-4"><div><p className="text-sm font-medium text-espresso">{name}</p><p className="mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-espresso-soft">{rating ? `${rating}/5` : approvalStatus}</p></div><span className="text-[0.65rem] uppercase tracking-[0.14em] text-olive-deep">Google</span></div></article>;
}

export function ReviewsSection({ locale, dictionary }: ReviewsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reviews = localReviews[locale];
  const activeReview = reviews[active];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const context = gsap.context(() => {
      const reveal = section.querySelectorAll<HTMLElement>("[data-review-reveal]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(reveal, { autoAlpha: 1, clearProps: "transform" });
        return;
      }
      gsap.fromTo(reveal, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 84%", once: true } });
    }, section);
    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const activeCard = sectionRef.current?.querySelector<HTMLElement>("[data-active-review]");
    if (!activeCard || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(activeCard, { autoAlpha: 0, x: 12 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out" });
  }, [active]);

  function moveReview(step: number) {
    setActive((current) => (current + step + reviews.length) % reviews.length);
  }

  return <section ref={sectionRef} id="reviews" className="overflow-hidden bg-[#E9E0D2] px-[var(--page-gutter)] py-16 md:py-20" aria-labelledby="reviews-title"><div className="mx-auto max-w-7xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p data-review-reveal className="eyebrow mb-3 text-olive-deep">{dictionary.reviews.eyebrow}</p><h2 id="reviews-title" data-review-reveal className="editorial-heading text-[clamp(2.7rem,5vw,4.8rem)] font-medium leading-[0.88] text-espresso">{dictionary.reviews.eyebrow}</h2></div><p data-review-reveal className="max-w-sm text-xs uppercase leading-[1.45] tracking-[0.11em] text-espresso-soft/75 sm:text-right">{dictionary.reviews.placeholderNotice}</p></div><div className="mt-9 hidden grid-cols-3 gap-4 md:grid">{reviews.map((review, index) => <div key={`${review.name}-${index}`} data-review-reveal><ReviewCard {...review} /></div>)}</div><div className="mt-8 md:hidden"><div data-active-review aria-live="polite"><ReviewCard {...activeReview} /></div><div className="mt-4 flex items-center justify-between"><span className="text-xs font-medium tabular-nums text-espresso-soft" aria-label={dictionary.reviews.progressLabel.replace("{current}", String(active + 1)).replace("{total}", String(reviews.length))}>{String(active + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}</span><div className="flex gap-2"><button type="button" onClick={() => moveReview(-1)} className="site-button site-button-secondary h-10 w-10 min-h-10 !rounded-full !p-0" aria-label={dictionary.reviews.previous}><ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" /></button><button type="button" onClick={() => moveReview(1)} className="site-button site-button-secondary h-10 w-10 min-h-10 !rounded-full !p-0" aria-label={dictionary.reviews.next}><ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" /></button></div></div></div><Link data-review-reveal href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className="group mt-8 inline-flex items-center text-xs font-medium text-espresso transition-colors hover:text-olive-deep"><span className="border-b border-brass/70 pb-1">{dictionary.reviews.googleLink}</span></Link></div></section>;
}
