"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const blurbRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!nameRef.current || !blurbRef.current || !quoteRef.current) return;

    // Split text into words and chars for the scatter effect
    const splitName = new SplitType(nameRef.current, { types: 'chars' });
    const splitBlurb = new SplitType(blurbRef.current, { types: 'words' });
    const splitQuote = new SplitType(quoteRef.current, { types: 'words,chars' });
    
    // Initial state: Name and Blurb are visible (animated in via simple tween on load)
    gsap.set([...(splitName.chars || []), ...(splitBlurb.words || [])], { opacity: 0, y: 20 });
    gsap.set(splitQuote.chars, { opacity: 0, rotationX: -90 }); // Quote is hidden and folded

    // 1. Initial fade-in when preloader finishes
    gsap.to([...(splitName.chars || []), ...(splitBlurb.words || [])], {
      opacity: 1,
      y: 0,
      stagger: 0.02,
      duration: 1,
      ease: "power3.out",
      delay: 3 // Wait for preloader to finish its 3.5s sequence
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=250%", // Long pin for multi-stage animation
        pin: true,
        scrub: 1,
      }
    });

    // Stage 1: Scatter Name & Blurb away
    tl.to([...(splitName.chars || []), ...(splitBlurb.words || [])], {
      y: () => (Math.random() - 0.5) * 1000,
      x: () => (Math.random() - 0.5) * 1000,
      rotation: () => (Math.random() - 0.5) * 720,
      rotationX: () => (Math.random() - 0.5) * 360,
      opacity: 0,
      stagger: 0.005,
      ease: "power2.inOut",
      duration: 1
    });

    // Stage 2: Form the Quote "The closer you look..."
    tl.to(splitQuote.chars, {
      opacity: 1,
      rotationX: 0,
      stagger: 0.02,
      duration: 1,
      ease: "back.out(1.7)"
    });

    // Small pause to read the quote
    tl.to({}, { duration: 0.5 });

    // Stage 3: Scatter the Quote away as the box comes in
    tl.to(splitQuote.chars, {
      y: () => (Math.random() - 0.5) * 1000,
      x: () => (Math.random() - 0.5) * 1000,
      rotation: () => (Math.random() - 0.5) * 720,
      rotationX: () => (Math.random() - 0.5) * 360,
      opacity: 0,
      stagger: 0.01,
      ease: "power2.inOut",
      duration: 1
    });

    return () => {
      splitName.revert();
      splitBlurb.revert();
      splitQuote.revert();
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center bg-ivory overflow-hidden relative">
      <div className="w-full max-w-4xl h-64 relative z-10 flex items-center justify-center px-4">
        
        {/* Stage 1: Intro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 ref={nameRef} className="font-serif text-5xl md:text-7xl text-charcoal tracking-[0.2em] uppercase">
            Houze Guo
          </h1>
          <p ref={blurbRef} className="mt-8 text-lg md:text-xl font-sans text-gray-600 max-w-2xl text-center leading-relaxed">
            Software engineer, product designer, and illusionist. Building digital experiences that blur the line between technology and magic.
          </p>
        </div>

        {/* Stage 2: The Hook */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none [perspective:1000px]">
          <h2 ref={quoteRef} className="font-serif text-3xl md:text-5xl text-charcoal italic leading-relaxed text-center">
            &quot;The closer you look, the less you see.&quot;
          </h2>
        </div>

      </div>
    </div>
  );
}
