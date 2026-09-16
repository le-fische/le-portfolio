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
    // Take scroll position out of the browser's hands; see `settle` below.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // Smooth scrolling is a motion effect. Skip it entirely when the OS says to.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // `anchors` makes Lenis intercept in-page hash links. Without it every
    // href="#work" does a native jump that Lenis immediately fights.
    const instance = reduced ? null : new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
    lenis = instance;

    /* The pinned intro adds roughly three and a half screens of spacer once it
     * initialises. The browser resolves both its restored scroll position and
     * its hash scroll before that happens, so either one lands in the wrong
     * place: a plain reload drops you into the middle of the intro, and a hard
     * load of /#about never reaches About. Re-anchor after layout settles. */
    const settle = () => {
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (!target) window.scrollTo(0, 0);
      else if (instance) instance.scrollTo(target, { immediate: true });
      else target.scrollIntoView();
    };
    settle();
    window.addEventListener("load", settle, { once: true });

    if (!instance) return () => window.removeEventListener("load", settle);

    // Drive Lenis from the GSAP ticker and feed its scroll events back into
    // ScrollTrigger. Without this the pinned timelines read stale scroll
    // positions and the sequence stutters.
    const raf = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("load", settle);
      gsap.ticker.remove(raf);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
