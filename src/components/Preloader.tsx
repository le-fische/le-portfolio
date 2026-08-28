"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preventScroll = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown"].includes(e.code)) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100vh";
    document.body.style.overscrollBehavior = "none";

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        window.removeEventListener("wheel", preventScroll);
        window.removeEventListener("touchmove", preventScroll);
        document.documentElement.style.overflow = "";
        document.documentElement.style.overscrollBehavior = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.height = "";
        document.body.style.overscrollBehavior = "";
      }
    });

    tl.to(".preloader-text-1", { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.2 })
      .to(".preloader-text-1", { opacity: 0, y: -20, duration: 0.8, ease: "power3.in", delay: 1.5 })
      .to(".preloader-bg", { yPercent: -100, duration: 1.2, ease: "expo.inOut" });

  }, []);

  if (!isLoading) return null;

  return (
    <div className="preloader-bg fixed inset-0 z-[10000] bg-zinc-950 flex flex-col items-center justify-center pointer-events-none px-8">
      <div className="text-center absolute">
        <h1 className="preloader-text-1 opacity-0 translate-y-10 font-serif text-2xl md:text-4xl text-zinc-300 italic max-w-3xl leading-relaxed">
          &quot;Any sufficiently advanced technology is indistinguishable from magic.&quot;
          <span className="block mt-6 text-sm font-sans text-zinc-500 tracking-[0.5em] uppercase not-italic">
            Arthur C. Clarke
          </span>
        </h1>
      </div>
    </div>
  );
}
