"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolioStore } from "@/store";
import { PlayingCard } from "./PlayingCard";

gsap.registerPlugin(ScrollTrigger);

const SUIT_MAP: Record<string, "♠" | "♣" | "♦" | "♥"> = {
  "ace-spades": "♠",
  "ace-clubs": "♣",
  "ace-diamonds": "♦",
  "ace-hearts": "♥",
};

const SUIT_TITLES: Record<string, string> = {
  "ace-spades": "Mechanical Engineering",
  "ace-clubs": "Software Development",
  "ace-diamonds": "Hardware & Electronics",
  "ace-hearts": "3D Design & Rendering",
};

export function CategoryView({ categoryId, onClose }: { categoryId: string; onClose: () => void }) {
  const suit = SUIT_MAP[categoryId];
  const title = SUIT_TITLES[categoryId];
  const { activeProjectId, setActiveProjectId } = usePortfolioStore();
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  // Generate 13 placeholder projects
  const projects = Array.from({ length: 13 }).map((_, i) => ({
    id: `${categoryId}-proj-${i + 1}`,
    value: i === 0 ? "A" : i === 10 ? "J" : i === 11 ? "Q" : i === 12 ? "K" : (i + 1).toString(),
    title: `Project ${i + 1}`,
    isFaceDown: i > 6, // First 7 revealed
  }));

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".spring-card");
    
    // Initial state: stacked tightly together
    gsap.set(cards, { x: 0, y: 0, rotation: 0, scale: 0.8 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: scrollerRef.current,
        start: "top top",
        end: "+=200%", // 200vh of scrolling to complete the spring
        pin: true,
        scrub: 1,
      }
    });

    // The Spring Animation: Fan them out into a curved deck
    const radius = window.innerWidth > 768 ? 600 : 300;
    const spreadAngle = window.innerWidth > 768 ? 120 : 90; // total angle spread
    
    cards.forEach((card, i) => {
      // Map 0-12 to -spread/2 to +spread/2
      const angleDeg = -(spreadAngle / 2) + (i / (projects.length - 1)) * spreadAngle;
      const angleRad = (angleDeg * Math.PI) / 180;
      
      const targetX = Math.sin(angleRad) * radius;
      // y follows the curve of the circle
      const targetY = (1 - Math.cos(angleRad)) * radius;

      tl.to(card, {
        x: targetX,
        y: targetY,
        rotation: angleDeg,
        scale: 1,
        ease: "power2.out",
      }, 0); // All animate at the same time in the timeline (time 0)
    });

  }, { scope: scrollerRef });

  const handleCardInteraction = (projId: string) => {
    // 1. First click: Flip it (Pick & Flip)
    if (flippedCardId !== projId) {
      setFlippedCardId(projId);
    } 
    // 2. Second click: Expand it (The Expansion)
    else {
      setActiveProjectId(projId);
    }
  };

  return (
    <div ref={scrollerRef} id="category-scroller" className="w-full h-full relative overflow-y-auto overflow-x-hidden bg-ivory">
      {/* Sticky Header */}
      <div className="sticky top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center bg-ivory/90 backdrop-blur-md z-[60]">
        <h2 className="text-3xl md:text-4xl font-serif text-charcoal">{title}</h2>
        <div className="flex items-center gap-6">
          <span className="text-4xl text-charcoal">{suit}</span>
          <button 
            onClick={onClose}
            className="text-2xl font-sans hover:scale-110 transition-transform bg-gray-200 text-charcoal hover:bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      {/* GSAP Scroll Container */}
      <div ref={containerRef} className="h-[300vh] w-full bg-ivory relative">
        <div ref={cardsWrapperRef} className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <p className="absolute top-[20%] text-gray-400 font-serif text-xl tracking-widest uppercase animate-pulse">
            Scroll to fan deck
          </p>
          
          {/* The Stack of Cards */}
          {projects.map((proj, i) => {
            const isFlipped = flippedCardId === proj.id;
            const isDimmed = flippedCardId && !isFlipped;

            return (
              <div 
                key={proj.id} 
                className="spring-card absolute z-10"
                style={{ zIndex: isFlipped ? 50 : 10 + i }}
              >
                <motion.div
                  animate={{
                    y: isFlipped ? -50 : 0,
                    scale: isFlipped ? 1.2 : 1,
                    rotateY: isFlipped ? (proj.isFaceDown ? 180 : 0) : 0, // 3D flip if it was face down
                    opacity: isDimmed ? 0.3 : 1,
                    filter: isDimmed ? "blur(4px)" : "blur(0px)",
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="origin-center"
                >
                  <PlayingCard
                    id={proj.id}
                    suit={suit}
                    value={proj.value}
                    title={proj.title}
                    isFaceDown={proj.isFaceDown && !isFlipped}
                    onClick={() => handleCardInteraction(proj.id)}
                    className="shadow-2xl hover:shadow-3xl transition-shadow"
                  />
                </motion.div>
                
                {/* Expand Hint */}
                {isFlipped && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-charcoal text-ivory px-4 py-2 rounded-full text-sm font-sans"
                  >
                    Click again to expand
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Details Modal (Nested Expansion) */}
      <AnimatePresence>
        {activeProjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => {
              setActiveProjectId(null);
              setFlippedCardId(null);
            }}
          >
            <motion.div
              layoutId={`card-${activeProjectId}`}
              className="bg-ivory w-full h-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl overflow-y-auto flex flex-col relative text-charcoal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-64 bg-gray-200 border-b-4 border-charcoal flex items-center justify-center relative overflow-hidden">
                 <span className="text-9xl opacity-10 absolute -right-10 -bottom-10 text-charcoal">{suit}</span>
                 <h1 className="text-5xl font-serif z-10">Project Details</h1>
              </div>
              <div className="p-8 md:p-12">
                <button
                  onClick={() => {
                    setActiveProjectId(null);
                    setFlippedCardId(null);
                  }}
                  className="absolute top-4 right-6 text-3xl font-sans bg-white/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black hover:text-white transition-colors z-20 shadow-md"
                >
                  ✕
                </button>
                
                <h2 className="text-3xl font-serif mb-4">The Illusion (Problem)</h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Placeholder text for the problem statement. This project requires adding your actual portfolio details later.
                </p>

                <h2 className="text-3xl font-serif mb-4">The Method (Process)</h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Explanation of the tech stack, the mechanical design process, or the hardware schematics used.
                </p>

                <h2 className="text-3xl font-serif mb-4">The Prestige (Result)</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  The final outcome and impact of the project.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
