"use client";

import { HeroSequence } from "@/components/HeroSequence";
import { PlayingCard } from "@/components/PlayingCard";
import { CategoryView } from "@/components/CategoryView";
import { SafeModal } from "@/components/SafeModal";
import { WhiteRabbit } from "@/components/WhiteRabbit";
import { TuckBox } from "@/components/TuckBox";
import { ArcadeModal } from "@/components/ArcadeModal";
import { usePortfolioStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACES = [
  { id: "ace-spades", suit: "♠" as const, value: "A", title: "Mechanical", isMarked: true },
  { id: "ace-clubs", suit: "♣" as const, value: "A", title: "Software", isMarked: false },
  { id: "ace-diamonds", suit: "♦" as const, value: "A", title: "Hardware", isMarked: false },
  { id: "ace-hearts", suit: "♥" as const, value: "A", title: "3D Design", isMarked: false },
];

export default function Home() {
  const { activeCardId, setActiveCardId, burnedCategories, burnCategory, reviveCategory, isJokerEclipse, triggerEclipse } = usePortfolioStore();
  const [isSafeOpen, setIsSafeOpen] = useState(false);

  const handleCardClick = (id: string) => {
    const category = id as "ace-spades" | "ace-clubs" | "ace-diamonds" | "ace-hearts";
    if (burnedCategories.includes(category)) {
      reviveCategory(category);
    }
    setActiveCardId(id);
  };

  const handleClose = () => {
    if (activeCardId) {
      if (activeCardId.startsWith("ace-")) {
        burnCategory(activeCardId as "ace-spades" | "ace-clubs" | "ace-diamonds" | "ace-hearts");
      }
      setActiveCardId(null);
    }
  };

  const handleJokerDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: import("framer-motion").PanInfo) => {
    const blackJoker = document.getElementById("card-black-joker");
    if (blackJoker) {
      const rect = blackJoker.getBoundingClientRect();
      const dropX = info.point.x;
      const dropY = info.point.y;
      
      if (dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom) {
        triggerEclipse();
      }
    }
  };

  const deckRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".scatter-card");
    
    // Initial state: Cards perfectly hidden inside the box
    gsap.set(cards, { 
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0, 
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 0.65, 
      opacity: 1 
    });

    // Initial state: Box is closed, rotated to show its front and side
    gsap.set(".tuckbox-box", { rotationX: 10, rotationY: -15, x: 0, y: 0, rotationZ: 0, scale: 1 });
    // Lid folded flat over the top (rotationX: 90 closes it forward)
    gsap.set(".tuckbox-lid", { z: -30, rotationX: 90, transformOrigin: "top" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: deckRef.current,
        start: "top top",
        end: "+=250%", // Longer scrub for the sequence
        scrub: 1,
        pin: true,
      }
    });

    // Step 1: Flip the box over to face the BACK
    tl.to(".tuckbox-box", {
      rotationX: 10,
      rotationY: -165,
      duration: 1,
      ease: "power2.inOut",
    }, 0);
    
    // Step 2: Open the flap
    tl.to(".tuckbox-lid", {
      rotationX: 0, // Opens backwards, hanging flat down the back
      duration: 0.6,
      ease: "power2.inOut",
    }, 1.0);

    // Step 3: Shoot cards up out of the box
    tl.to(cards, {
      y: -260, 
      scale: 0.8,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.out",
    }, 1.6)
    
    // Step 3.5: Discard the empty box to the bottom left
    tl.to(".tuckbox-box", {
      x: "-35vw",
      y: "25vh",
      rotationZ: -15, // slight spin as it drops
      rotationY: -180, // flatten it out a bit
      scale: 0.65,
      duration: 1.2,
      ease: "power2.out",
    }, 1.6);
    
    // Step 4: Fan out cards to grid positions
    tl.to(cards, {
      x: (_, target) => parseFloat(target.dataset.targetX || "0"),
      y: (_, target) => parseFloat(target.dataset.targetY || "0"),
      rotationZ: () => (Math.random() - 0.5) * 15, 
      scale: 1,
      duration: 0.6,
      stagger: 0.02,
      ease: "power3.inOut",
    }, 2.0);
  }, { scope: deckRef });

  return (
    <main className="min-h-screen bg-ivory">
      {/* Scroll-locked Hero */}
      <HeroSequence />

      {/* Main Content: The Aces & Jokers */}
      <section ref={deckRef} className="relative z-10 py-32 flex flex-col items-center justify-center min-h-screen">
        <h2 className="absolute top-12 md:top-24 font-serif text-3xl md:text-5xl text-charcoal z-0">Select Your Discipline</h2>
        
        <TuckBox>
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            {ACES.map((ace, i) => {
              // Target positions for the grid
              const targetX = (i - 1.5) * 220; // 4 cards: -330, -110, 110, 330
              const targetY = -180; // Higher so they don't get covered by the box too much

              return (
                <div 
                  key={ace.id} 
                  className="scatter-card absolute pointer-events-auto"
                  data-target-x={targetX}
                  data-target-y={targetY}
                >
                  <PlayingCard
                    id={ace.id}
                    suit={ace.suit}
                    value={ace.value}
                    title={ace.title}
                    isBurned={burnedCategories.includes(ace.id as "ace-spades" | "ace-clubs" | "ace-diamonds" | "ace-hearts")}
                    isMarked={ace.isMarked}
                    onMarkClick={() => setIsSafeOpen(true)}
                    onClick={() => handleCardClick(ace.id)}
                  />
                </div>
              );
            })}
            
            <div 
              id="card-black-joker" 
              className="scatter-card absolute pointer-events-auto"
              data-target-x={-120}
              data-target-y={200}
            >
              <PlayingCard
                id="black-joker"
                suit="♠"
                value="J"
                title="About Me"
                className="border-black shadow-2xl"
                onClick={() => setActiveCardId("black-joker")}
              />
            </div>
            
            <div 
              className="scatter-card absolute pointer-events-auto"
              data-target-x={120}
              data-target-y={200}
            >
              <PlayingCard
                id="red-joker"
                suit="♥"
                value="J"
                title="Playground"
                className="border-red-700 shadow-2xl"
                onClick={() => setActiveCardId("red-joker")}
                drag
                dragSnapToOrigin
                onDragEnd={handleJokerDragEnd}
              />
            </div>
          </div>
        </TuckBox>
      </section>

      {/* Expanded Card Overlay (Shared Layout Animation) */}
      <AnimatePresence>
        {activeCardId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              layoutId={`card-${activeCardId}`}
              className="bg-ivory w-full h-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              {activeCardId.startsWith("ace-") ? (
                <CategoryView categoryId={activeCardId} onClose={handleClose} />
              ) : activeCardId === "red-joker" ? (
                <ArcadeModal onClose={() => setActiveCardId(null)} />
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                  <h2 className="text-5xl font-serif mb-6">About Me</h2>
                  <p className="text-xl max-w-2xl text-gray-700">
                    I am Houze Guo. An engineer, a developer, and a magician. Here is where the resume goes.
                  </p>
                  <button 
                    onClick={handleClose}
                    className="mt-12 px-8 py-3 bg-charcoal text-ivory rounded-full text-lg hover:bg-black transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Joker Eclipse (Prank) */}
      <AnimatePresence>
        {isJokerEclipse && (
          <motion.div
            initial={{ opacity: 0, scale: 1.5, rotate: 10, filter: "invert(0)" }}
            animate={{ opacity: 1, scale: 1, rotate: 0, filter: "invert(1)" }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className="fixed inset-0 z-[999999] bg-black text-white flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Chaotic UI elements flying around */}
            {Array.from({ length: 20 }).map((_, i) => {
              // Deterministic pseudo-random for render purity
              const rand1 = (Math.sin(i + 1) + 1) / 2;
              const rand2 = (Math.cos(i + 1) + 1) / 2;
              const rand3 = (Math.sin(i * 10) + 1) / 2;
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0 }}
                  animate={{ 
                    x: (rand1 - 0.5) * window.innerWidth,
                    y: (rand2 - 0.5) * window.innerHeight,
                    rotate: rand3 * 360
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                  className="absolute text-6xl text-red-600 opacity-20 font-serif"
                >
                  HAHA
                </motion.div>
              );
            })}

            <motion.h1 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 2 }}
              className="font-serif text-5xl md:text-8xl text-red-600 z-10"
            >
              Why so serious?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4 }}
              className="mt-8 font-sans text-xl z-10 animate-pulse cursor-pointer hover:text-red-400"
              onClick={() => window.location.reload()}
            >
              [ Click to revive ]
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <SafeModal isOpen={isSafeOpen} onClose={() => setIsSafeOpen(false)} />
      <WhiteRabbit />
    </main>
  );
}
