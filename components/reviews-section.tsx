"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { localReviews } from "@/lib/reviews";

gsap.registerPlugin(ScrollTrigger);

type ReviewsSectionProps = { locale: Locale; dictionary: Dictionary };

const reviewImages = ["/menu-matcha.png", "/menu-coffee.png", "/menu-breakfast.png"];

export function ReviewsSection({ locale, dictionary }: ReviewsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const reviews = localReviews[locale];
  const activeReview = reviews[active];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const next = Math.min(reviews.length - 1, Math.floor(self.progress * reviews.length));
          if (next === activeRef.current) return;
          activeRef.current = next;
          setActive(next);
        },
      });

      return () => scrollTrigger.kill();
    }, section);

    return () => context.revert();
  }, [reviews.length]);

  useLayoutEffect(() => {
    const image = sectionRef.current?.querySelector<HTMLElement>("[data-active-review-image]");
    const copy = sectionRef.current?.querySelector<HTMLElement>("[data-active-review-copy]");
    if (!image || !copy || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(image, { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power2.out" });
    gsap.fromTo(copy, { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.55, delay: 0.04, ease: "power2.out" });
  }, [active]);

  return (
    <section ref={sectionRef} id="reviews" className="relative min-h-[210vh] overflow-hidden bg-ivory px-[var(--page-gutter)]" aria-labelledby="reviews-title">
      <div className="sticky top-0 flex min-h-screen items-center py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] md:gap-20">
          <figure data-active-review-image className="relative aspect-[0.92/1] overflow-hidden rounded-tl-[3rem] rounded-br-[1.5rem] bg-espresso-soft md:aspect-[0.94/1] md:rounded-tl-[5rem] md:rounded-br-[2rem]">
            <Image src={reviewImages[active]} alt={dictionary.home.imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority={active === 0} />
            <div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" />
          </figure>

          <div data-active-review-copy className="max-w-xl">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow text-olive-deep">{dictionary.reviews.eyebrow}</p>
              <span className="text-xs font-medium tabular-nums tracking-[0.12em] text-espresso-soft" aria-label={dictionary.reviews.progressLabel.replace("{current}", String(active + 1)).replace("{total}", String(reviews.length))}>{String(active + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}</span>
            </div>
            <h2 id="reviews-title" className="sr-only">{dictionary.reviews.eyebrow}</h2>

            <div className="mt-10 md:mt-14">
              {activeReview.rating ? (
                <div className="flex items-center gap-1 text-brass" aria-label={`${activeReview.rating} stars`}>
                  {Array.from({ length: activeReview.rating }, (_, index) => <Star key={index} size={15} strokeWidth={0} fill="currentColor" aria-hidden="true" />)}
                </div>
              ) : (
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brass">{activeReview.approvalStatus}</p>
              )}
              <blockquote className="mt-6 max-w-[12ch] text-[clamp(2.7rem,5.5vw,5.8rem)] font-medium leading-[0.9] tracking-[-0.055em] text-espresso">“{activeReview.quote}”</blockquote>
              <div className="mt-10 flex items-center gap-4 text-sm text-espresso-soft md:mt-14">
                <span className="font-medium text-espresso">{activeReview.name}</span>
                <span className="h-px w-8 bg-brass/60" aria-hidden="true" />
                <span className="text-xs uppercase tracking-[0.14em]">Google</span>
              </div>
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.12em] text-espresso-soft/70">{activeReview.approvalStatus}</p>
            </div>

            <Link href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className="group mt-10 inline-flex items-center gap-2 text-xs font-medium text-espresso transition-colors hover:text-olive-deep md:mt-14">
              <span className="border-b border-brass/70 pb-1">{dictionary.reviews.googleLink}</span>
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
