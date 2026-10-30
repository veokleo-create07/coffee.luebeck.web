"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

type HeroProps = { locale: Locale; dictionary: Dictionary };

const VIDEO_REVEAL_END = 0.72;
const FALLBACK_DURATION = 6;

export function Hero({ locale, dictionary }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const instagramHref = dictionary.footer.instagramHref;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = root?.querySelector<HTMLVideoElement>("[data-matcha-video]");
    if (!root || !video) return;

    const opening = root.querySelector<HTMLElement>("[data-opening-content]");
    const scrollIndicator = root.querySelector<HTMLElement>("[data-scroll-indicator]");
    const midReservation = root.querySelector<HTMLElement>("[data-mid-reservation]");
    const shade = root.querySelector<HTMLElement>("[data-final-shade]");
    const finalContent = root.querySelector<HTMLElement>("[data-final-content]");
    const finalItems = root.querySelectorAll<HTMLElement>("[data-final-item]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let trigger: ScrollTrigger | null = null;
    let seekFrame = 0;
    let targetTime = 0;
    let renderedTime = 0;
    let lastProgress = 0;
    let videoDuration = FALLBACK_DURATION;

    const showStaticFallback = () => {
      trigger?.kill();
      cancelAnimationFrame(seekFrame);
      root.dataset.static = "true";
      gsap.set(opening, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(scrollIndicator, { autoAlpha: 0 });
      gsap.set(midReservation, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(shade, { opacity: 0.12 });
      gsap.set(finalContent, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(finalItems, { autoAlpha: 1, y: 0 });
    };

    if (reduceMotion) {
      showStaticFallback();
      return;
    }

    const seekTowardsTarget = () => {
      seekFrame = 0;
      const distance = targetTime - renderedTime;
      renderedTime = Math.abs(distance) < 0.012 ? targetTime : renderedTime + distance * 0.2;

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA && !video.seeking) {
        const safeTime = Math.min(renderedTime, Math.max(0, videoDuration - 0.025));
        if (Math.abs(video.currentTime - safeTime) > 0.012) video.currentTime = safeTime;
      }

      if (Math.abs(targetTime - renderedTime) > 0.012 || video.seeking) {
        seekFrame = requestAnimationFrame(seekTowardsTarget);
      }
    };

    const requestSeek = (time: number) => {
      targetTime = time;
      if (!seekFrame) seekFrame = requestAnimationFrame(seekTowardsTarget);
    };

    const context = gsap.context(() => {
      gsap.set(finalContent, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(finalItems, { autoAlpha: 0, y: 28 });
      gsap.set(midReservation, { autoAlpha: 0, pointerEvents: "none", y: 10 });
      gsap.set(shade, { opacity: 0 });

      const progressProxy = { value: 0 };
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      timeline.to(progressProxy, { value: 1, duration: 1, ease: "none" }, 0);
      timeline.to(scrollIndicator, { autoAlpha: 0, duration: 0.06 }, 0.04);
      timeline.to(opening, { autoAlpha: 0, y: -16, pointerEvents: "none", duration: 0.14 }, 0.1);
      timeline.to(midReservation, { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.1 }, 0.19);
      timeline.to(shade, { opacity: 0.2, duration: 0.12 }, 0.64);
      timeline.to(midReservation, { autoAlpha: 0, y: 8, pointerEvents: "none", duration: 0.09 }, 0.66);
      timeline.to(finalContent, { autoAlpha: 1, pointerEvents: "auto", duration: 0.08 }, 0.68);
      timeline.to(finalItems, { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.025 }, 0.69);

      trigger = ScrollTrigger.create({
        id: "matcha-hero-scroll",
        trigger: root,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 4)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: timeline,
        scrub: 0.35,
        onUpdate: (self) => {
          const mappedTime = Math.min(self.progress / VIDEO_REVEAL_END, 1) * videoDuration;
          const nextTime = self.direction >= 0 ? Math.max(targetTime, mappedTime) : mappedTime;
          requestSeek(nextTime);
          lastProgress = self.progress;
        },
        onRefresh: (self) => {
          const mappedTime = Math.min(self.progress / VIDEO_REVEAL_END, 1) * videoDuration;
          targetTime = self.progress >= lastProgress ? Math.max(targetTime, mappedTime) : mappedTime;
          renderedTime = targetTime;
          if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
            video.currentTime = Math.min(targetTime, Math.max(0, videoDuration - 0.025));
          }
          lastProgress = self.progress;
        },
      });
    }, root);

    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) videoDuration = video.duration;
      video.currentTime = 0.001;
      root.dataset.videoReady = "true";
      ScrollTrigger.refresh();
    };

    const handleSeeked = () => {
      if (Math.abs(targetTime - renderedTime) > 0.012 && !seekFrame) {
        seekFrame = requestAnimationFrame(seekTowardsTarget);
      }
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", showStaticFallback);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) handleMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", showStaticFallback);
      cancelAnimationFrame(seekFrame);
      context.revert();
    };
  }, []);

  const openingButtons = (
    <div className="cinematic-actions flex items-center justify-center gap-2.5 sm:gap-3">
      <Link href={reservationHref} className="cinematic-button cinematic-button-dark">
        {dictionary.home.primaryCta}
      </Link>
      <a href={instagramHref} target="_blank" rel="noreferrer" className="cinematic-button cinematic-button-light">
        {dictionary.home.secondaryCta}
      </a>
    </div>
  );

  return (
    <section ref={rootRef} className="cinematic-hero" aria-labelledby="hero-title">
      <video
        data-matcha-video
        className="cinematic-video"
        poster="/animations/matcha-hero-poster.png"
        preload="auto"
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/animations/matcha-hero.mp4" type="video/mp4" />
      </video>

      <div data-final-shade className="cinematic-final-shade" aria-hidden="true" />

      <div data-opening-content className="cinematic-opening">
        {openingButtons}
      </div>

      <Link data-mid-reservation href={reservationHref} className="cinematic-mid-reservation">
        {dictionary.home.primaryCta}
      </Link>

      <div data-final-content className="cinematic-final-content">
        <h1 id="hero-title" data-final-item className="cinematic-final-title">
          {dictionary.home.title}
        </h1>
        <p data-final-item className="cinematic-final-description">
          {dictionary.home.description}
        </p>
        <div data-final-item className="cinematic-actions flex items-center justify-center gap-2.5 sm:gap-3">
          <Link href={reservationHref} className="cinematic-button cinematic-button-final-primary">
            {dictionary.home.primaryCta}
          </Link>
          <a href={instagramHref} target="_blank" rel="noreferrer" className="cinematic-button cinematic-button-final-secondary">
            {dictionary.home.secondaryCta}
          </a>
        </div>
      </div>

      <div data-scroll-indicator className="cinematic-scroll-indicator" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
