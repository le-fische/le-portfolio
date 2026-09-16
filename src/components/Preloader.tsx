"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./SmoothScroller";

/**
 * Module scope, so it survives client-side navigation but resets on a hard
 * reload. That is deliberate: it keeps the curtain from replaying every time
 * someone comes back from a case study, without writing anything to the DOM
 * before hydration (which is what a sessionStorage + <html> attribute gate
 * would require, and what makes React report a hydration mismatch).
 */
let hasPlayed = false;

/**
 * The curtain. Under two seconds, dismissible by click or key, and skipped
 * entirely under prefers-reduced-motion (handled in CSS so there is no flash).
 * It never mutates layout, so the pinned intro measures correctly underneath.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = getLenis();
    lenis?.stop();

    const block = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    const release = () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      lenis?.start();
    };

    const tl = gsap.timeline({
      onComplete: () => {
        hasPlayed = true;
        root.style.display = "none";
        release();
        ScrollTrigger.refresh();
      },
    });

    tl.to(".curtain-quote", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.15 })
      .to(".curtain-rule", { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, "-=0.5")
      .to({}, { duration: 0.55 })
      .to(".curtain-quote", { opacity: 0, y: -16, duration: 0.45, ease: "power2.in" })
      .to(root, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.2");

    // Any deliberate input jumps to the end.
    const skip = () => tl.progress(1);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);

    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      tl.kill();
      release();
    };
  }, []);

  // Rendering nothing on a repeat visit is safe: hasPlayed is only ever true
  // after a client-side mount, so the first render still matches the server.
  if (hasPlayed) return null;

  return (
    <div
      ref={rootRef}
      className="curtain fixed inset-0 z-[9000] flex items-center justify-center bg-stage px-gutter"
      role="presentation"
    >
      <div className="max-w-2xl text-center">
        <p className="curtain-quote translate-y-4 font-display text-2xl leading-snug text-canvas/90 italic opacity-0 md:text-4xl">
          &ldquo;Any sufficiently advanced technology is indistinguishable from magic.&rdquo;
        </p>
        <div className="curtain-rule mx-auto mt-8 h-px w-24 origin-center scale-x-0 bg-accent" />
        <p className="label mt-5 text-canvas/40">Arthur C. Clarke</p>
      </div>
    </div>
  );
}
