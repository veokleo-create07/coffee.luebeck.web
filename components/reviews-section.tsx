"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";
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

function ReviewText({ review, dictionary }: { review: LocalReview; dictionary: Dictionary }) {
  return <>
    {review.rating ? <div className="flex items-center gap-1 text-brass" aria-label={`${review.rating} stars`}>
      {Array.from({ length: review.rating }, (_, index) => <Star key={index} size={15} strokeWidth={0} fill="currentColor" aria-hidden="true" />)}
    </div> : null}
    <blockquote className="mt-6 max-w-[15ch] text-[clamp(2.25rem,4.7vw,5rem)] font-medium leading-[0.92] tracking-[-0.055em] text-espresso">“{review.quote}”</blockquote>
    <div className="mt-9 flex items-center gap-4 text-sm text-espresso-soft md:mt-12">
      <span className="font-medium text-espresso">{review.name}</span>
      <span className="h-px w-8 bg-brass/60" aria-hidden="true" />
      <span className="text-[0.65rem] uppercase tracking-[0.15em]">Google</span>
    </div>
    <Link href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className="group mt-9 inline-flex items-center gap-2 text-xs font-medium text-espresso transition-colors hover:text-olive-deep md:mt-12">
      <span className="border-b border-brass/70 pb-1">{dictionary.reviews.googleLink}</span>
      <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  </>;
}

function EmptyReviews({ dictionary }: { dictionary: Dictionary }) {
  return <section id="reviews" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 md:py-28" aria-labelledby="reviews-title"><div className="mx-auto max-w-7xl"><p className="eyebrow text-olive-deep">Google Bewertungen</p><h2 id="reviews-title" className="mt-4 max-w-[10ch] text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[0.86] tracking-[-0.055em] text-espresso">{dictionary.reviews.heading}</h2><div className="relative mt-12 overflow-hidden rounded-[2.5rem_5rem_3rem_4rem] bg-espresso/5 p-8 md:mt-16 md:min-h-[22rem] md:p-14"><div className="absolute inset-y-0 right-0 w-[48%] overflow-hidden rounded-l-[8rem] opacity-70"><Image src="/menu-coffee.png" alt={dictionary.home.imageAlt} fill sizes="48vw" className="object-cover" /></div><div className="relative z-10 flex min-h-[13rem] max-w-sm flex-col justify-center"><p className="max-w-[20rem] text-lg leading-[1.35] text-espresso-soft">{dictionary.reviews.emptyNotice}</p><Link href={dictionary.location.directionsHref} target="_blank" rel="noreferrer" className="group mt-7 inline-flex w-fit items-center gap-2 text-xs font-medium text-espresso"><span className="border-b border-brass/70 pb-1">{dictionary.reviews.googleLink}</span><ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></div></div></div></section>;
}

export function ReviewsSection({ locale, dictionary }: ReviewsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<Array<HTMLElement | null>>([]);
  const copyRefs = useRef<Array<HTMLElement | null>>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const reviews = localReviews[locale];
  const publishedReviews = reviews.filter((review) => review.approved);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || !publishedReviews.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReducedMotion);
    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      const images = imageRefs.current.filter(Boolean) as HTMLElement[];
      const copies = copyRefs.current.filter(Boolean) as HTMLElement[];
      gsap.set(images, { autoAlpha: 0, xPercent: 0, scale: 1 });
      gsap.set(copies, { autoAlpha: 0, x: 0 });
      const applyProgress = (progress: number) => {
        const position = progress * (publishedReviews.length - 1);
        const next = Math.round(position);
        if (next !== activeRef.current) {
          activeRef.current = next;
          setActive(next);
        }
        images.forEach((image, index) => {
          const distance = index - position;
          const strength = Math.min(Math.abs(distance), 1);
          gsap.set(image, { autoAlpha: 1 - strength, xPercent: distance * 3, scale: 1 - strength * 0.025 });
        });
        copies.forEach((copy, index) => {
          const distance = index - position;
          gsap.set(copy, { autoAlpha: 1 - Math.min(Math.abs(distance), 1), x: distance * 22 });
        });
      };

      applyProgress(0);
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        onUpdate: (self) => applyProgress(self.progress),
      });
    }, section);

    return () => context.revert();
  }, [publishedReviews.length]);

  if (!publishedReviews.length) return <EmptyReviews dictionary={dictionary} />;

  if (reducedMotion) return <section ref={sectionRef} id="reviews" className="overflow-hidden bg-ivory px-[var(--page-gutter)] py-20 md:py-28" aria-labelledby="reviews-title"><div className="mx-auto max-w-7xl"><p className="eyebrow text-olive-deep">{dictionary.reviews.eyebrow}</p><h2 id="reviews-title" className="mt-4 max-w-[10ch] text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[0.86] tracking-[-0.055em] text-espresso">{dictionary.reviews.heading}</h2><div className="mt-12 grid gap-12 md:grid-cols-3">{publishedReviews.map((review, index) => <article key={review.name}><div className="relative aspect-[0.9/1] overflow-hidden rounded-[45%_55%_48%_52%/40%_45%_55%_60%] bg-espresso/5"><Image src={reviewImages[index]} alt={dictionary.home.imageAlt} fill sizes="33vw" className="object-cover" /></div><div className="mt-7"><ReviewText review={review} dictionary={dictionary} /></div></article>)}</div></div></section>;

  return <section ref={sectionRef} id="reviews" className="relative min-h-[215vh] overflow-hidden bg-ivory px-[var(--page-gutter)]" aria-labelledby="reviews-title"><div className="sticky top-0 flex min-h-screen items-center py-16 md:py-20"><div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[minmax(0,0.92fr)_minmax(22rem,1.08fr)] md:gap-20"><div className="relative aspect-[0.95/1] overflow-hidden rounded-[42%_58%_54%_46%/38%_44%_56%_62%] bg-espresso/5 shadow-[0_30px_70px_-48px_rgba(44,33,28,0.7)] md:aspect-[0.92/1]"><div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-olive/20 blur-2xl" aria-hidden="true" />{publishedReviews.map((review, index) => <figure key={review.name} ref={(element) => { imageRefs.current[index] = element; }} className="absolute inset-0"><Image src={reviewImages[index]} alt={index === active ? dictionary.home.imageAlt : ""} fill sizes="(max-width: 768px) 100vw, 46vw" className="object-cover" priority={index === 0} aria-hidden={index !== active} /></figure>)}</div><div className="relative min-h-[28rem] max-w-xl"><div className="absolute inset-x-0 top-1/2 -translate-y-1/2"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow text-olive-deep">Google Bewertungen</p><h2 id="reviews-title" className="mt-4 max-w-[10ch] text-[clamp(3rem,6vw,6.4rem)] font-medium leading-[0.84] tracking-[-0.06em] text-espresso">{dictionary.reviews.heading}</h2></div><div className="flex shrink-0 gap-2" aria-label={dictionary.reviews.progressLabel.replace("{current}", String(active + 1)).replace("{total}", String(publishedReviews.length))}>{publishedReviews.map((review, index) => <span key={review.name} className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${index === active ? "bg-espresso" : "bg-espresso/20"}`} aria-hidden="true" />)}</div></div>{publishedReviews.map((review, index) => <article key={review.name} ref={(element) => { copyRefs.current[index] = element; }} aria-hidden={index !== active} className="absolute inset-x-0 top-[13rem] rounded-[2.5rem_4.5rem_3rem_4rem] bg-white/45 p-7 shadow-[0_24px_60px_-46px_rgba(44,33,28,0.7)] md:p-10"><ReviewText review={review} dictionary={dictionary} /></article>)}<div className="absolute right-0 top-[11.5rem] flex gap-2"><button type="button" onClick={() => setActive((current) => (current - 1 + publishedReviews.length) % publishedReviews.length)} className="site-button site-button-secondary h-11 w-11 min-h-11 !rounded-full !p-0" aria-label={dictionary.reviews.previous}><ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" /></button><button type="button" onClick={() => setActive((current) => (current + 1) % publishedReviews.length)} className="site-button site-button-secondary h-11 w-11 min-h-11 !rounded-full !p-0" aria-label={dictionary.reviews.next}><ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" /></button></div></div></div></div></div></section>;
}
