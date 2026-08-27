"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "@/store";
import { PlayingCard } from "./PlayingCard";

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

  // Generate 13 placeholder projects
  const projects = Array.from({ length: 13 }).map((_, i) => ({
    id: `${categoryId}-proj-${i + 1}`,
    value:
      i === 0 ? "A" : i === 10 ? "J" : i === 11 ? "Q" : i === 12 ? "K" : (i + 1).toString(),
    title: `Project ${i + 1}`,
    isFaceDown: i > 4, // First 5 are revealed, rest are face down placeholders
  }));

  return (
    <div className="flex-grow flex flex-col relative w-full h-full overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-200 flex justify-between items-center bg-ivory z-10 shadow-sm">
        <h2 className="text-3xl md:text-4xl font-serif">{title}</h2>
        <div className="flex items-center gap-6">
          <span className="text-4xl">{suit}</span>
          <button 
            onClick={onClose}
            className="text-2xl font-sans hover:scale-110 transition-transform bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-8 flex-grow overflow-y-auto">
        <div className="flex flex-wrap gap-8 justify-center pb-20">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PlayingCard
                id={proj.id}
                suit={suit}
                value={proj.value}
                title={proj.isFaceDown ? undefined : proj.title}
                isFaceDown={proj.isFaceDown}
                onClick={() => {
                  if (!proj.isFaceDown) setActiveProjectId(proj.id);
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Details Modal (Nested Expansion) */}
      <AnimatePresence>
        {activeProjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveProjectId(null)}
          >
            <motion.div
              layoutId={`card-${activeProjectId}`}
              className="bg-white w-full h-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl overflow-y-auto flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-64 bg-gray-200 border-b-4 border-gray-900 flex items-center justify-center relative overflow-hidden">
                 {/* Placeholder for project hero image */}
                 <span className="text-9xl opacity-10 absolute -right-10 -bottom-10">{suit}</span>
                 <h1 className="text-5xl font-serif z-10 text-charcoal">Project Details</h1>
              </div>
              <div className="p-8 md:p-12">
                <button
                  onClick={() => setActiveProjectId(null)}
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
