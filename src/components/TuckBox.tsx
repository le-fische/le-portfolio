"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TuckBox({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!boxRef.current || !lidRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "+=150%",
        scrub: 1,
      }
    });

    // Initial state: Box is closed, rotated to show its depth
    gsap.set(boxRef.current, { rotationX: 15, rotationY: -25 });
    gsap.set(lidRef.current, { rotationX: -90, transformOrigin: "top" });

    // Step 1: Rotate box to face front, open the lid
    tl.to(boxRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 1,
      ease: "power2.inOut",
    }, 0)
    .to(lidRef.current, {
      rotationX: 0, // Opens upwards
      duration: 1,
      ease: "power2.inOut",
    }, 0);

    // After box opens, children (the cards) can scatter, which is handled by their own ScrollTrigger in page.tsx
    // We just fade out the box itself so the cards are left floating
    tl.to(boxRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: "power2.in",
    }, 1);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full flex justify-center [perspective:2000px] z-20">
      <div 
        ref={boxRef} 
        className="relative w-52 h-72 [transform-style:preserve-3d]"
      >
        {/* Front Face */}
        <div className="absolute inset-0 bg-[#0f0f0f] border-2 border-gold rounded-lg [transform:translateZ(30px)] flex flex-col items-center justify-center p-4 shadow-2xl [backface-visibility:hidden]">
          <h3 className="font-serif text-gold text-2xl uppercase tracking-widest text-center border-b border-gold pb-2 mb-2 w-full">Vance</h3>
          <p className="text-zinc-500 font-sans text-xs tracking-[0.3em] uppercase text-center">Playing Cards</p>
          <div className="flex-grow flex items-center justify-center">
            <span className="text-5xl text-gold opacity-50">♠</span>
          </div>
          <p className="text-gold font-serif text-sm tracking-widest uppercase">Premium Quality</p>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 bg-[#0a0a0a] border border-zinc-800 rounded-lg [transform:translateZ(-30px)__rotateY(180deg)] [backface-visibility:hidden]" />

        {/* Left Face */}
        <div className="absolute top-0 left-0 w-[60px] h-full bg-[#141414] border border-zinc-800 [transform:rotateY(-90deg)_translateZ(30px)] origin-left" />

        {/* Right Face */}
        <div className="absolute top-0 right-0 w-[60px] h-full bg-[#141414] border border-zinc-800 [transform:rotateY(90deg)_translateZ(30px)] origin-right" />

        {/* Bottom Face */}
        <div className="absolute bottom-0 left-0 w-full h-[60px] bg-[#0a0a0a] border border-zinc-800 [transform:rotateX(-90deg)_translateZ(30px)] origin-bottom" />

        {/* Top Face (The Lid) */}
        <div 
          ref={lidRef}
          className="absolute top-0 left-0 w-full h-[60px] bg-[#1a1a1a] border-2 border-gold [transform:rotateX(90deg)_translateZ(30px)] origin-top flex items-center justify-center"
        >
          {/* A small seal on the lid */}
          <div className="w-8 h-4 bg-red-800 border border-red-900 absolute -bottom-2 z-10 rounded-sm" />
        </div>

        {/* The Cards inside the box */}
        <div className="absolute inset-0 [transform:translateZ(0px)] flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
