"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TuckBox({ children }: { children: React.ReactNode }) {
  return (
    <div id="tuckbox-container" className="relative w-full flex justify-center items-center z-20 min-h-[300px]">
      
      {/* The Cards (Siblings, so they don't fade out when the box fades out) */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {children}
      </div>

      {/* The 3D Box with its own perspective wrapper */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 [perspective:2000px]">
        <div 
          className="tuckbox-box relative w-52 h-72 [transform-style:preserve-3d]"
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-[#111] border-2 border-gold rounded-lg [transform:translateZ(30px)] flex flex-col items-center justify-center p-4 shadow-2xl">
            <h3 className="font-serif text-gold text-2xl uppercase tracking-widest text-center border-b border-gold pb-2 mb-2 w-full">Houze</h3>
            <p className="text-zinc-500 font-sans text-xs tracking-[0.3em] uppercase text-center">Playing Cards</p>
            <div className="flex-grow flex items-center justify-center">
              <span className="text-5xl text-gold opacity-50">♠</span>
            </div>
            <p className="text-gold font-serif text-sm tracking-widest uppercase">Made In 2007</p>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 bg-[#0a0a0a] border border-zinc-800 rounded-lg [transform:translateZ(-30px)_rotateY(180deg)]" />

          {/* Left Face */}
          <div className="absolute left-0 top-0 h-full w-[60px] bg-[#141414] border border-zinc-800 origin-left [transform:translateZ(30px)_rotateY(90deg)]" />

          {/* Right Face */}
          <div className="absolute right-0 top-0 h-full w-[60px] bg-[#141414] border border-zinc-800 origin-right [transform:translateZ(30px)_rotateY(-90deg)]" />

          {/* Bottom Face */}
          <div className="absolute bottom-0 left-0 w-full h-[60px] bg-[#0a0a0a] border border-zinc-800 origin-bottom [transform:translateZ(30px)_rotateX(90deg)]" />

          {/* Top Face (The Lid) */}
          <div 
            className="tuckbox-lid absolute top-0 left-0 w-full h-[60px] bg-[#1a1a1a] border-2 border-gold flex items-center justify-center"
          >
            {/* A small seal on the lid */}
            <div className="w-12 h-6 bg-red-800 border-2 border-red-900 absolute left-1/2 -translate-x-1/2 -bottom-3 z-10 rounded-sm flex items-center justify-center shadow-lg">
              <span className="text-[8px] text-red-300 font-serif">V</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
