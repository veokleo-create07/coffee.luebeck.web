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
      const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const transition = gsap.timeline({ paused: true });
      const trigger = isAppleMobile
        ? { trigger: incomingLayer, start: "top 92%", end: "top 60%" }
        : {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.max(1, heroLayer.offsetHeight)}`,
            pin: heroLayer,
            pinSpacing: false,
            pinReparent: false,
            anticipatePin: 1,
            refreshPriority: 1,
          };

      if (isAppleMobile) {
        transition.fromTo(incomingLayer, { yPercent: 7 }, { yPercent: 0, ease: "none" });
      } else {
        transition.fromTo(incomingLayer, { yPercent: 100 }, { yPercent: 0, ease: "none" });
      }

      ScrollTrigger.create({ ...trigger, animation: transition, scrub: true, invalidateOnRefresh: true });

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
