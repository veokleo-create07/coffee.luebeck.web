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

    let refreshFrame = 0;
    const refresh = () => ScrollTrigger.refresh();
    const context = gsap.context(() => {
      const heroLayer = root.querySelector<HTMLElement>(".hero-transition-hero");
      const incomingLayer = root.querySelector<HTMLElement>(".hero-transition-incoming");
      if (!heroLayer || !incomingLayer) return;

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${Math.max(1, heroLayer.offsetHeight)}`,
        pin: heroLayer,
        pinSpacing: false,
        // Keep the pinned layer inside the scene so its stacking order remains
        // below the incoming section on Safari and other mobile browsers.
        pinReparent: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      });

      gsap.fromTo(incomingLayer, { yPercent: 3 }, {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: incomingLayer,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      refreshFrame = window.requestAnimationFrame(refresh);
      window.addEventListener("load", refresh, { once: true });
      refresh();
    }, root);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="hero-transition-scene">
      <div className="hero-transition-hero">{hero}</div>
      <div className="hero-transition-incoming">{next}</div>
    </div>
  );
}
