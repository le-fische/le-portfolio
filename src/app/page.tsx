"use client";

import { HeroSequence } from "@/components/HeroSequence";
import { PlayingCard } from "@/components/PlayingCard";
import { usePortfolioStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";

const ACES = [
  { id: "ace-spades", suit: "♠" as const, value: "A", title: "Mechanical" },
  { id: "ace-clubs", suit: "♣" as const, value: "A", title: "Software" },
  { id: "ace-diamonds", suit: "♦" as const, value: "A", title: "Hardware" },
  { id: "ace-hearts", suit: "♥" as const, value: "A", title: "3D Design" },
];

export default function Home() {
  const { activeCardId, setActiveCardId, burnedCategories, burnCategory, reviveCategory } = usePortfolioStore();

  const handleCardClick = (id: string) => {
    // If it's burned, revive it!
    const category = id as "ace-spades" | "ace-clubs" | "ace-diamonds" | "ace-hearts";
    if (burnedCategories.includes(category)) {
      reviveCategory(category);
    }
    setActiveCardId(id);
  };

  const handleClose = () => {
    if (activeCardId) {
      burnCategory(activeCardId as "ace-spades" | "ace-clubs" | "ace-diamonds" | "ace-hearts");
      setActiveCardId(null);
    }
  };

  return (
    <main className="min-h-screen bg-ivory">
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
              onClick={() => handleCardClick(ace.id)}
            />
          ))}
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
              {/* Content of the expanded category will go here */}
              <div className="p-8 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-4xl font-serif">Category Details</h2>
                <button 
                  onClick={handleClose}
                  className="text-2xl font-sans hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>
              <div className="p-8 flex-grow overflow-y-auto">
                <p>This is where the 13 project cards for this suit will cascade in.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
