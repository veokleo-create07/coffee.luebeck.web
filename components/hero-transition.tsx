"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type HeroTransitionProps = {
  hero: ReactNode;
  next: ReactNode;
};

export function HeroTransition({ hero, next }: HeroTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const heroLayer = root.querySelector<HTMLElement>(".hero-transition-hero");
      const incomingLayer = root.querySelector<HTMLElement>(".hero-transition-incoming");
      if (!heroLayer || !incomingLayer) return;

      ScrollTrigger.create({
        trigger: heroLayer,
        start: "top top",
        endTrigger: incomingLayer,
        end: "top top",
        pin: heroLayer,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      gsap.fromTo(
        incomingLayer,
        { yPercent: 3 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: incomingLayer,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      ScrollTrigger.refresh();
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="hero-transition-scene">
      <div className="hero-transition-hero">{hero}</div>
      <div className="hero-transition-incoming">{next}</div>
    </div>
  );
}
