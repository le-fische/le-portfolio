"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "@/store";

interface SafeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SafeModal({ isOpen, onClose }: SafeModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const { unlockRabbit } = usePortfolioStore();

  const CORRECT_PIN = "7314"; // Example answers to riddles

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setError(false);
    }
  };

  const handleClear = () => setPin("");

  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      unlockRabbit();
      onClose();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Riddles Section */}
            <div className="p-8 flex-1 border-b md:border-b-0 md:border-r border-zinc-700 bg-zinc-800/50">
              <h2 className="text-2xl font-serif mb-6 text-gold">The Riddler&apos;s Safe</h2>
              <ol className="list-decimal list-inside space-y-4 text-sm font-sans text-zinc-300">
                <li>I am the first prime number that is also a Mersenne prime exponent. What am I?</li>
                <li>How many spatial dimensions are represented in standard 3D Design?</li>
                <li>I am the boolean representation of &quot;True&quot;. What number am I?</li>
                <li>How many suits are in a standard deck of cards?</li>
              </ol>
              <p className="mt-8 text-xs text-zinc-500 italic">Answers form a 4-digit PIN.</p>
            </div>

            {/* Keypad Section */}
            <div className="p-8 flex flex-col items-center justify-center w-full md:w-64 bg-zinc-900">
              <div className={`w-32 h-10 mb-6 flex items-center justify-center tracking-[0.5em] text-2xl font-mono border-b-2 ${error ? "border-red-500 text-red-500" : "border-zinc-500 text-gold"}`}>
                {pin.padEnd(4, "_")}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num.toString())}
                    className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-sans transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleClear}
                  className="w-12 h-12 rounded-full bg-red-900/30 hover:bg-red-900/50 text-red-400 font-sans text-xs transition-colors"
                >
                  CLR
                </button>
                <button
                  onClick={() => handleKeyPress("0")}
                  className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-sans transition-colors"
                >
                  0
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-12 h-12 rounded-full bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 font-sans text-xs transition-colors"
                >
                  ENT
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
