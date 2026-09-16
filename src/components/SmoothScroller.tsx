"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** The live Lenis instance, or null when smooth scrolling is off. */
export function getLenis() {
  return lenis;
}

/** Scroll to a selector, using Lenis when it is running and native otherwise. */
export function scrollToId(id: string) {
  const target = document.querySelector(id);
  if (!target) return;
  if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0 });
  else target.scrollIntoView({ behavior: "smooth" });
}

export function SmoothScroller() {
  useEffect(() => {
    // Browsers restore scroll position on reload, which drops you into the
    // middle of the pinned intro with its timeline half-applied. Take over and
    // start at the top, unless the URL names a target to honour.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const toTop = () => {
      if (!window.location.hash) window.scrollTo(0, 0);
    };
    toTop();
    // The browser's own restore can land after this effect, so re-assert once
    // the document is fully loaded.
    if (document.readyState !== "complete") window.addEventListener("load", toTop, { once: true });

    // Smooth scrolling is a motion effect. Skip it entirely when the OS says to.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // `anchors` makes Lenis intercept in-page hash links. Without it every
    // href="#work" does a native jump that Lenis immediately fights.
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
    lenis = instance;

    // Drive Lenis from the GSAP ticker and feed its scroll events back into
    // ScrollTrigger. Without this the pinned timelines read stale scroll
    // positions and the sequence stutters.
    const raf = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("load", toTop);
      gsap.ticker.remove(raf);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
