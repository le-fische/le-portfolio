"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Minesweeper } from "./Minesweeper";

export function ArcadeModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"minesweeper" | "blackjack" | "chess">("minesweeper");

  return (
    <div className="w-full h-full relative overflow-y-auto overflow-x-hidden bg-[#0a0a0a] text-zinc-200">
      <div className="sticky top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-md z-[60] border-b border-zinc-800">
        <h2 className="text-3xl md:text-4xl font-serif text-gold">The Arcade</h2>
        <div className="flex items-center gap-6">
          <span className="text-4xl text-red-600">♥</span>
          <button 
            onClick={onClose}
            className="text-2xl font-sans hover:scale-110 transition-transform bg-zinc-800 hover:bg-zinc-700 w-10 h-10 rounded-full flex items-center justify-center text-zinc-300"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {(["minesweeper", "blackjack", "chess"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-sans text-sm tracking-widest uppercase rounded-full transition-all duration-300 ${
                activeTab === tab 
                  ? "bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl flex flex-col items-center"
            >
              {activeTab === "minesweeper" && (
                <>
                  <h3 className="font-serif text-3xl mb-4 text-gold">Illusionist&apos;s Minesweeper</h3>
                  <p className="text-zinc-500 mb-12 text-center max-w-lg">
                    A test of state management and recursive flood-fill algorithms. Find all the safe cards. Avoid the Jokers.
                  </p>
                  <Minesweeper />
                </>
              )}

              {activeTab === "blackjack" && (
                <div className="text-center">
                  <h3 className="font-serif text-3xl mb-4 text-gold">Cardshark&apos;s Blackjack</h3>
                  <p className="text-zinc-500 mb-8 max-w-lg mx-auto">
                    A test of backend persistence and database management. You play against a dealer AI. 
                  </p>
                  <div className="inline-block border border-zinc-800 rounded-xl p-8 bg-zinc-900/50">
                    <span className="text-4xl block mb-4">🃏</span>
                    <p className="font-mono text-gold animate-pulse">Connection to database establishing...</p>
                    <p className="text-xs text-zinc-600 mt-4">[ This feature is locked in Phase 1 ]</p>
                  </div>
                </div>
              )}

              {activeTab === "chess" && (
                <div className="text-center">
                  <h3 className="font-serif text-3xl mb-4 text-gold">Grandmaster&apos;s Chess</h3>
                  <p className="text-zinc-500 mb-8 max-w-lg mx-auto">
                    A beautifully designed board against a custom algorithmic engine. Beat the AI to unlock a secret.
                  </p>
                  <div className="inline-block border border-zinc-800 rounded-xl p-8 bg-zinc-900/50">
                    <span className="text-4xl block mb-4">♞</span>
                    <p className="font-mono text-gold animate-pulse">Initializing AlphaBeta Pruning Engine...</p>
                    <p className="text-xs text-zinc-600 mt-4">[ This feature is locked in Phase 1 ]</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
