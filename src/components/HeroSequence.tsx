"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!quoteRef.current) return;

    // Split text into words and chars
    const split = new SplitType(quoteRef.current, { types: 'lines,words,chars' });
    
    // Initial state
    gsap.set(split.chars, { y: 100, opacity: 0, rotationX: -90 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%", // Keep it pinned for 1.5 screen heights
        pin: true,
        scrub: 1,
      }
    });

    // 1. Dramatic Intro Reveal (Not scrubbed, happens on load)
    gsap.to(split.chars, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      stagger: 0.02,
      duration: 1.5,
      ease: "power4.out",
      delay: 4.5
    });

    // 2. Scrubbed Scatter Animation on Scroll
    tl.to(split.chars, {
      y: () => (Math.random() - 0.5) * 1000,
      x: () => (Math.random() - 0.5) * 1000,
      rotation: () => (Math.random() - 0.5) * 720,
      rotationX: () => (Math.random() - 0.5) * 360,
      opacity: 0,
      stagger: 0.01,
      ease: "power2.inOut",
    });

    return () => split.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center bg-ivory overflow-hidden relative">
      <div className="max-w-4xl text-center px-4 relative z-10">
        <h1 ref={quoteRef} className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal leading-tight [perspective:1000px]">
          &quot;Any sufficiently advanced technology is indistinguishable from magic.&quot;
        </h1>
        <p className="mt-12 text-sm font-sans text-gray-500 uppercase tracking-[0.5em] opacity-0 animate-fade-in">
          Arthur C. Clarke
        </p>
      </div>
    </div>
  );
}
