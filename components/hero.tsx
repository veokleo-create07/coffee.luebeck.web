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

const VIDEO_REVEAL_END = 0.82;
const FALLBACK_DURATION = 6;

export function Hero({ locale, dictionary }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reservationHref = locale === "de" ? "/reservation" : "/en/reservation";
  const instagramHref = dictionary.footer.instagramHref;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = root?.querySelector<HTMLVideoElement>("[data-matcha-video]");
    if (!root || !video) return;

    const scrollIndicator = root.querySelector<HTMLElement>("[data-scroll-indicator]");
    const finalFrame = root.querySelector<HTMLElement>("[data-final-frame]");
    const shade = root.querySelector<HTMLElement>("[data-final-shade]");
    const finalContent = root.querySelector<HTMLElement>("[data-final-content]");
    const finalItems = root.querySelectorAll<HTMLElement>("[data-final-item]");
    const siteHeader = document.querySelector<HTMLElement>(".site-header");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileViewport = window.matchMedia("(max-width: 767px)").matches;
    let trigger: ScrollTrigger | null = null;
    let seekFrame = 0;
    let fallbackTimer = 0;
    let targetTime = 0;
    let lastProgress = 0;
    let videoDuration = FALLBACK_DURATION;
    let scrubbingReady = false;
    let primeAttempted = false;

    const showStaticFallback = () => {
      trigger?.kill();
      window.clearTimeout(fallbackTimer);
      cancelAnimationFrame(seekFrame);
      root.dataset.static = "true";
      gsap.set(scrollIndicator, { autoAlpha: 0 });
      gsap.set(finalFrame, { opacity: 0 });
      gsap.set(shade, { opacity: 0.12 });
      gsap.set(finalContent, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(finalItems, { autoAlpha: 1, y: 0 });
      siteHeader?.setAttribute("data-final-hero", "true");
    };

    if (reduceMotion) {
      showStaticFallback();
      return;
    }

    const scheduleSeek = () => {
      if (seekFrame || video.seeking || !scrubbingReady) return;
      seekFrame = requestAnimationFrame(() => {
        seekFrame = 0;
        if (video.seeking || !scrubbingReady) return;
        const safeTime = Math.min(targetTime, Math.max(0, videoDuration - 0.025));
        if (Math.abs(video.currentTime - safeTime) < 0.035) return;
        try {
          video.currentTime = safeTime;
        } catch {
          showStaticFallback();
        }
      });
    };

    const requestSeek = (time: number) => {
      targetTime = Math.max(0, Math.min(time, videoDuration));
      scheduleSeek();
    };

    const isSeekable = () => video.readyState >= HTMLMediaElement.HAVE_METADATA && video.seekable.length > 0;

    const primeDecoder = () => {
      if (primeAttempted || !isSeekable()) return;
      primeAttempted = true;
      const playAttempt = video.play();
      if (playAttempt) playAttempt.then(() => video.pause()).catch(() => { primeAttempted = false; });
    };

    const enableScrubbing = () => {
      if (!isSeekable()) return;
      scrubbingReady = true;
      window.clearTimeout(fallbackTimer);
      primeDecoder();
      scheduleSeek();
      ScrollTrigger.refresh();
    };

    const context = gsap.context(() => {
      gsap.set(finalContent, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(finalItems, { autoAlpha: 0, y: 28 });
      gsap.set(finalFrame, { opacity: 0 });
      gsap.set(shade, { opacity: 0 });
      gsap.set(video, { scale: 1, transformOrigin: "50% 50%" });
      siteHeader?.removeAttribute("data-final-hero");

      const progressProxy = { value: 0 };
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      timeline.to(progressProxy, { value: 1, duration: 1, ease: "none" }, 0);
      timeline.to(scrollIndicator, { autoAlpha: 0, duration: 0.06 }, 0.04);
      if (mobileViewport) timeline.to(video, { scale: 2.28, duration: 0.32, ease: "power1.inOut" }, 0.1);
      timeline.to(finalFrame, { opacity: 1, duration: 0.1 }, 0.78);
      timeline.to(shade, { opacity: 0.2, duration: 0.12 }, 0.8);
      timeline.to(finalContent, { autoAlpha: 1, pointerEvents: "auto", duration: 0.08 }, 0.84);
      timeline.to(finalItems, { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.025 }, 0.85);

      trigger = ScrollTrigger.create({
        id: "matcha-hero-scroll",
        trigger: root,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * (window.innerWidth < 768 ? 3.25 : 4))}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: timeline,
        scrub: 0.2,
        onUpdate: (self) => {
          if (self.progress >= 0.83) siteHeader?.setAttribute("data-final-hero", "true");
          else siteHeader?.removeAttribute("data-final-hero");
          const mappedTime = Math.min(self.progress / VIDEO_REVEAL_END, 1) * videoDuration;
          requestSeek(mappedTime);
          lastProgress = self.progress;
        },
        onRefresh: (self) => {
          const mappedTime = Math.min(self.progress / VIDEO_REVEAL_END, 1) * videoDuration;
          targetTime = mappedTime;
          scheduleSeek();
          lastProgress = self.progress;
        },
      });
    }, root);

    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) videoDuration = video.duration;
      enableScrubbing();
    };

    const handleLoadedData = () => {
      root.dataset.videoReady = "true";
    };

    const primeVideo = () => {
      primeDecoder();
    };

    const handleSeeked = () => {
      if (Math.abs(targetTime - video.currentTime) > 0.035) scheduleSeek();
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("durationchange", handleMetadata);
    video.addEventListener("canplay", enableScrubbing);
    video.addEventListener("progress", enableScrubbing);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", showStaticFallback);
    window.addEventListener("touchstart", primeVideo, { once: true, passive: true });
    window.addEventListener("pointerdown", primeVideo, { once: true, passive: true });
    fallbackTimer = window.setTimeout(() => {
      if (!scrubbingReady) showStaticFallback();
    }, 7000);
    video.load();
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) handleMetadata();
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) handleLoadedData();

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("durationchange", handleMetadata);
      video.removeEventListener("canplay", enableScrubbing);
      video.removeEventListener("progress", enableScrubbing);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", showStaticFallback);
      window.removeEventListener("touchstart", primeVideo);
      window.removeEventListener("pointerdown", primeVideo);
      window.clearTimeout(fallbackTimer);
      cancelAnimationFrame(seekFrame);
      context.revert();
      siteHeader?.removeAttribute("data-final-hero");
    };
  }, []);

  return (
    <section ref={rootRef} className="cinematic-hero" aria-labelledby="hero-title">
      <div className="cinematic-poster" aria-hidden="true" />

      <video
        data-matcha-video
        className="cinematic-video"
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        tabIndex={-1}
        aria-hidden="true"
      >
        <source media="(max-width: 767px)" src="/animations/matcha-hero-mobile.mp4?v=3c1d318" type="video/mp4" />
        <source src="/animations/matcha-hero.mp4?v=3c1d318" type="video/mp4" />
      </video>

      <div data-final-frame className="cinematic-final-frame" aria-hidden="true" />
      <div data-final-shade className="cinematic-final-shade" aria-hidden="true" />

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
