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
  const authorRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!quoteRef.current || !authorRef.current) return;

    // Split text into words and chars
    const splitQuote = new SplitType(quoteRef.current, { types: 'lines,words,chars' });
    const splitAuthor = new SplitType(authorRef.current, { types: 'chars' });
    
    // Initial state
    gsap.set(splitQuote.chars, { y: 100, opacity: 0, rotationX: -90 });
    // Author starts hidden (handled by css animate-fade-in initially, but GSAP controls the scatter)

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
    gsap.to(splitQuote.chars, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      stagger: 0.02,
      duration: 1.5,
      ease: "power4.out",
      delay: 4.5
    });

    // 2. Scrubbed Scatter Animation on Scroll
    const allChars = [...(splitQuote.chars || []), ...(splitAuthor.chars || [])];
    
    tl.to(allChars, {
      y: () => (Math.random() - 0.5) * 1000,
      x: () => (Math.random() - 0.5) * 1000,
      rotation: () => (Math.random() - 0.5) * 720,
      rotationX: () => (Math.random() - 0.5) * 360,
      opacity: 0,
      stagger: 0.01,
      ease: "power2.inOut",
    }, 0);

    return () => {
      splitQuote.revert();
      splitAuthor.revert();
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center bg-ivory overflow-hidden relative">
      <div className="max-w-4xl text-center px-4 relative z-10">
        <h1 ref={quoteRef} className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal leading-tight [perspective:1000px]">
          &quot;Any sufficiently advanced technology is indistinguishable from magic.&quot;
        </h1>
        <p ref={authorRef} className="mt-12 text-sm font-sans text-gray-500 uppercase tracking-[0.5em] opacity-0 animate-fade-in">
          Arthur C. Clarke
        </p>
      </div>
    </div>
  );
}
