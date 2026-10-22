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

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${Math.max(1, incomingLayer.offsetTop)}`,
        pin: heroLayer,
        pinSpacing: false,
        pinReparent: false,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      });

      let disposed = false;
      let refreshFrame = 0;
      const refresh = () => {
        window.cancelAnimationFrame(refreshFrame);
        refreshFrame = window.requestAnimationFrame(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
      };
      const resizeObserver = new ResizeObserver(refresh);
      resizeObserver.observe(heroLayer);
      resizeObserver.observe(incomingLayer);
      window.addEventListener("load", refresh, { once: true });
      document.fonts.ready.then(refresh);
      refresh();

      return () => {
        disposed = true;
        window.cancelAnimationFrame(refreshFrame);
        resizeObserver.disconnect();
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
