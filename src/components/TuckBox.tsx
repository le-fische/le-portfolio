"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TuckBox({ children }: { children: React.ReactNode }) {
  return (
    <div id="tuckbox-container" className="relative w-full flex justify-center items-center z-20 min-h-[300px] [perspective:2000px] [transform-style:preserve-3d]">
      
      {/* The Cards (Siblings in 3D space so they get depth-sorted INSIDE the box!) */}
      <div className="absolute inset-0 flex items-center justify-center [transform:translateZ(0px)]">
        {children}
      </div>

      {/* The 3D Box */}
      <div className="tuckbox-box relative w-52 h-72 [transform-style:preserve-3d]">
        <div className="absolute inset-0 [transform-style:preserve-3d]">
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
          <div className="absolute inset-0 bg-[#0a0a0a] border border-zinc-800 rounded-lg [transform:translateZ(-30px)_rotateY(180deg)] [transform-style:preserve-3d]">
             {/* Prinstream-style Tech Pattern */}
             <div className="absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center opacity-40">
               {/* Diagonal striping */}
               <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#222_10px,#222_11px)]" />
               {/* X O decals */}
               <div className="flex gap-4 font-mono text-zinc-600 text-3xl font-black tracking-widest z-0">
                 <span>X</span>
                 <span>O</span>
               </div>
               {/* Accent blocks */}
               <div className="absolute bottom-4 left-4 w-12 h-2 bg-zinc-300" />
               <div className="absolute top-4 right-4 w-8 h-2 bg-gold" />
             </div>

             {/* Bottom half of the seal (Stays on the box when lid opens!) */}
             <div className="w-12 h-4 bg-red-800 border-2 border-t-0 border-red-900 absolute left-1/2 -translate-x-1/2 top-[16px] rounded-b-sm flex items-center justify-center overflow-hidden [transform:translateZ(1px)]">
               <span className="text-[10px] text-red-300 font-serif -translate-y-[2px]">V</span>
             </div>
          </div>

          {/* Left Face */}
          <div className="absolute left-0 top-0 h-full w-[60px] bg-[#141414] border border-zinc-800 origin-left [transform:translateZ(30px)_rotateY(90deg)]" />

          {/* Right Face */}
          <div className="absolute right-0 top-0 h-full w-[60px] bg-[#141414] border border-zinc-800 origin-right [transform:translateZ(30px)_rotateY(-90deg)]" />

          {/* Bottom Face */}
          <div className="absolute bottom-0 left-0 w-full h-[60px] bg-[#0a0a0a] border border-zinc-800 origin-bottom [transform:translateZ(30px)_rotateX(90deg)]" />

          {/* Top Face (The Lid) */}
          <div 
            className="tuckbox-lid absolute top-0 left-0 w-full h-[60px] bg-[#1a1a1a] border-2 border-gold flex justify-center [transform-style:preserve-3d]"
          >
            {/* The tuck tab (rounded semicircle folded at 90 deg INTO the box) */}
            <div className="absolute top-[58px] w-[60%] h-[25px] bg-[#1a1a1a] border-2 border-t-0 border-gold rounded-b-3xl origin-top [transform:rotateX(90deg)_translateZ(-1px)]" />
            
            {/* Top half of the seal (Sticker folded at 90 deg OUTSIDE the box to bridge the seam, tears away!) */}
            <div className="absolute top-[60px] w-12 h-4 origin-top [transform:rotateX(90deg)_translateZ(1px)] [transform-style:preserve-3d]">
              <div className="w-full h-full bg-red-800 border-2 border-b-0 border-red-900 rounded-t-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
