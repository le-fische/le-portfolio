"use client";

import { HeroSequence } from "@/components/HeroSequence";
import { PlayingCard } from "@/components/PlayingCard";
import { CategoryView } from "@/components/CategoryView";
import { SafeModal } from "@/components/SafeModal";
import { WhiteRabbit } from "@/components/WhiteRabbit";
import { usePortfolioStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";

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
    // If it's burned, revive it!
    if (id.startsWith("ace-")) {
      const category = id as "ace-spades" | "ace-clubs" | "ace-diamonds" | "ace-hearts";
      if (burnedCategories.includes(category)) {
        reviveCategory(category);
      }
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

  return (
    <main className={`min-h-screen transition-colors duration-1000 ${isJokerEclipse ? "bg-black text-ivory invert" : "bg-ivory"}`}>
      {/* Scroll-locked Hero */}
      <HeroSequence />

      {/* The 4 Aces Selection (Main Portfolio Grid) */}
      <section className="min-h-screen flex flex-col items-center justify-center py-20 relative z-10">
        <h2 className="font-serif text-3xl mb-16">Pick Your Discipline</h2>
        
        <div className="flex flex-wrap justify-center gap-8 px-4 max-w-5xl">
          {ACES.map((ace) => (
            <PlayingCard
              key={ace.id}
              id={ace.id}
              suit={ace.suit}
              value={ace.value}
              title={ace.title}
              isBurned={burnedCategories.includes(ace.id as "ace-spades" | "ace-clubs" | "ace-diamonds" | "ace-hearts")}
              isMarked={ace.isMarked}
              onMarkClick={() => setIsSafeOpen(true)}
              onClick={() => handleCardClick(ace.id)}
            />
          ))}
        </div>

        {/* The Jokers */}
        <h2 className="font-serif text-3xl mt-24 mb-16">The Magician</h2>
        <div className="flex flex-wrap justify-center gap-16 px-4 max-w-5xl">
            <div id="card-black-joker">
              <PlayingCard
                id="black-joker"
                suit="♠"
                value="J"
                title="About Me"
                className="border-black shadow-2xl"
                onClick={() => setActiveCardId("black-joker")}
              />
            </div>
            
            <div className="z-10">
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
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                  <h2 className="text-5xl font-serif mb-6">
                    {activeCardId === "black-joker" ? "About Me" : "The Playground"}
                  </h2>
                  <p className="text-xl max-w-2xl text-gray-700">
                    {activeCardId === "black-joker" 
                      ? "I am Aleister Vance. An engineer, a developer, and a magician. Here is where the resume goes." 
                      : "Welcome to the playground. Experimental projects, raw code, and untamed ideas live here."}
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

      <SafeModal isOpen={isSafeOpen} onClose={() => setIsSafeOpen(false)} />
      <WhiteRabbit />
    </main>
  );
}
