"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { LocalReview } from "@/lib/reviews";
import type { Locale } from "@/lib/i18n";
import { localReviews } from "@/lib/reviews";

gsap.registerPlugin(ScrollTrigger);

type ReviewsSectionProps = { locale: Locale; dictionary: Dictionary };

const reviewImages = ["/menu-matcha.png", "/menu-coffee.png", "/menu-breakfast.png"];

function ReviewCopy({ review, dictionary }: { review: LocalReview; dictionary: Dictionary }) {
  return <>
    {review.rating ? <div className="flex items-center gap-1 text-brass" aria-label={`${review.rating} stars`}>
      {Array.from({ length: review.rating }, (_, index) => <Star key={index} size={15} strokeWidth={0} fill="currentColor" aria-hidden="true" />)}
    </div> : <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brass">{review.approvalStatus}</p>}
    <blockquote className="mt-6 max-w-[12ch] text-[clamp(2.7rem,5.5vw,5.8rem)] font-medium leading-[0.9] tracking-[-0.055em] text-espresso">“{review.quote}”</blockquote>
    <div className="mt-10 flex items-center gap-4 text-sm text-espresso-soft md:mt-14">
      <span className="font-medium text-espresso">{review.name}</span>
      <span className="h-px w-8 bg-brass/60" aria-hidden="true" />
      <span className="text-xs uppercase tracking-[0.14em]">Google</span>
    </div>
    <p className="mt-2 text-[0.65rem] uppercase tracking-[0.12em] text-espresso-soft/70">{review.approvalStatus}</p>
    <Link href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className="group mt-10 inline-flex items-center gap-2 text-xs font-medium text-espresso transition-colors hover:text-olive-deep md:mt-14">
      <span className="border-b border-brass/70 pb-1">{dictionary.reviews.googleLink}</span>
      <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  </>;
}

export function ReviewsSection({ locale, dictionary }: ReviewsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<Array<HTMLElement | null>>([]);
  const copyRefs = useRef<Array<HTMLElement | null>>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const reviews = localReviews[locale];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReducedMotion);
    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      const images = imageRefs.current.filter(Boolean) as HTMLElement[];
      const copies = copyRefs.current.filter(Boolean) as HTMLElement[];

      const setProgress = (progress: number) => {
        const position = progress * (reviews.length - 1);
        const nextActive = Math.round(position);

        if (nextActive !== activeRef.current) {
          activeRef.current = nextActive;
          setActive(nextActive);
        }

        images.forEach((image, index) => {
          const distance = index - position;
          const strength = Math.min(Math.abs(distance), 1);
          gsap.set(image, { autoAlpha: Math.max(0, 1 - strength), xPercent: distance * 4, scale: 1 - strength * 0.025 });
        });
        copies.forEach((copy, index) => {
          const distance = index - position;
          const strength = Math.min(Math.abs(distance), 1);
          gsap.set(copy, { autoAlpha: Math.max(0, 1 - strength), x: distance * 24 });
        });
      };

      setProgress(0);
      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        onUpdate: (self) => setProgress(self.progress),
      });

      return () => scrollTrigger.kill();
    }, section);

    return () => context.revert();
  }, [reviews.length]);

  if (reducedMotion) {
    return <section ref={sectionRef} id="reviews" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 md:py-28" aria-labelledby="reviews-title"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-4"><p className="eyebrow text-olive-deep">{dictionary.reviews.eyebrow}</p><span className="text-xs font-medium tabular-nums tracking-[0.12em] text-espresso-soft">{reviews.length} / {reviews.length}</span></div><h2 id="reviews-title" className="sr-only">{dictionary.reviews.eyebrow}</h2><div className="mt-10 grid gap-16 md:grid-cols-3">{reviews.map((review, index) => <article key={review.name} className="flex flex-col"><div className="relative aspect-[0.92/1] overflow-hidden rounded-tl-[3rem] rounded-br-[1.5rem] bg-espresso-soft"><Image src={reviewImages[index]} alt={dictionary.home.imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div><div className="mt-8"><ReviewCopy review={review} dictionary={dictionary} /></div></article>)}</div></div></section>;
  }

  return <section ref={sectionRef} id="reviews" className="relative min-h-[220vh] overflow-hidden bg-ivory px-[var(--page-gutter)]" aria-labelledby="reviews-title"><div className="sticky top-0 flex min-h-screen items-center py-20 md:py-24"><div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] md:gap-20"><div className="relative aspect-[0.92/1] overflow-hidden rounded-tl-[3rem] rounded-br-[1.5rem] bg-espresso-soft md:aspect-[0.94/1] md:rounded-tl-[5rem] md:rounded-br-[2rem]">{reviews.map((review, index) => <figure key={review.name} ref={(element) => { imageRefs.current[index] = element; }} data-review-image className="absolute inset-0"><Image src={reviewImages[index]} alt={index === active ? dictionary.home.imageAlt : ""} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority={index === 0} aria-hidden={index !== active} /><div className="pointer-events-none absolute inset-0 bg-espresso/5" aria-hidden="true" /></figure>)}</div><div className="relative min-h-[30rem] max-w-xl md:min-h-[35rem]"><div className="absolute inset-x-0 top-1/2 -translate-y-1/2"><div className="flex items-center justify-between gap-4"><p className="eyebrow text-olive-deep">{dictionary.reviews.eyebrow}</p><span className="text-xs font-medium tabular-nums tracking-[0.12em] text-espresso-soft" aria-label={dictionary.reviews.progressLabel.replace("{current}", String(active + 1)).replace("{total}", String(reviews.length))}>{String(active + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}</span></div><h2 id="reviews-title" className="sr-only">{dictionary.reviews.eyebrow}</h2>{reviews.map((review, index) => <article key={review.name} ref={(element) => { copyRefs.current[index] = element; }} data-review-copy aria-hidden={index !== active} className="absolute inset-x-0 top-14"> <ReviewCopy review={review} dictionary={dictionary} /></article>)}</div></div></div></div></section>;
}
