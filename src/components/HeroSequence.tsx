"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Scroll-locked quote animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%", // How long the scroll lock lasts
        pin: true,
        scrub: 1,
      },
    });

    // Scatter the quote text (simplified for now, usually requires Splitting.js)
    tl.to(quoteRef.current, {
      opacity: 0,
      y: -50,
      filter: "blur(10px)",
      scale: 1.1,
      duration: 1,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center bg-ivory">
      <div ref={quoteRef} className="max-w-2xl text-center px-4">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight">
          &quot;Any sufficiently advanced technology is indistinguishable from magic.&quot;
        </h1>
        <p className="mt-8 text-lg font-sans text-gray-500 uppercase tracking-widest">
          Arthur C. Clarke
        </p>
      </div>
    </div>
  );
}
