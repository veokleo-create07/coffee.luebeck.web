"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type HeroTransitionProps = { hero: ReactNode; next: ReactNode };

export function HeroTransition({ hero, next }: HeroTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const heroLayer = root.querySelector<HTMLElement>("[data-hero-layer]");
      const incomingLayer = root.querySelector<HTMLElement>("[data-incoming-layer]");
      if (!heroLayer || !incomingLayer) return;

      // The incoming section is already in normal document flow, so scrolling
      // naturally moves it upward. Avoid a second transform on that section;
      // it creates a separate stacking context and is the source of mobile
      // overlap bugs when the pinned hero is released.
      const transition = gsap.timeline({ paused: true });
      transition.set(incomingLayer, { yPercent: 0 });
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        endTrigger: incomingLayer,
        end: "top top",
        pin: heroLayer,
        pinSpacing: false,
        pinReparent: false,
        pinType: isTouchDevice ? "transform" : "fixed",
        anticipatePin: 1,
        animation: transition,
        scrub: true,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      });

      const refresh = () => ScrollTrigger.refresh();
      const refreshFrame = window.requestAnimationFrame(refresh);
      window.addEventListener("load", refresh, { once: true });

      return () => {
        window.cancelAnimationFrame(refreshFrame);
        window.removeEventListener("load", refresh);
      };
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="hero-transition-scene">
      <div data-hero-layer className="hero-transition-hero">{hero}</div>
      <div data-incoming-layer className="hero-transition-incoming">{next}</div>
    </div>
  );
}
