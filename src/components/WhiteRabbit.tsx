"use client";

import { motion } from "framer-motion";
import { usePortfolioStore } from "@/store";
import { useEffect, useState } from "react";

export function WhiteRabbit() {
  const { rabbitUnlocked } = usePortfolioStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Make the rabbit occasionally hop around the edges of the screen
  useEffect(() => {
    if (!rabbitUnlocked) return;

    const hopInterval = setInterval(() => {
      // Random position along the bottom edge
      const randomX = Math.random() * (window.innerWidth - 100);
      setPosition({ x: randomX, y: window.innerHeight - 80 });
    }, 10000);

    return () => clearInterval(hopInterval);
  }, [rabbitUnlocked]);

  if (!rabbitUnlocked) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 100 }}
      animate={{ opacity: 1, scale: 1, x: position.x, y: position.y || window.innerHeight - 80 }}
      transition={{ type: "spring", stiffness: 50, damping: 10 }}
      className="fixed z-50 pointer-events-none"
    >
      <div className="relative w-16 h-16 cursor-pointer pointer-events-auto hover:scale-110 transition-transform">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white drop-shadow-xl">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" opacity="0.2"/>
          <path d="M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" fill="currentColor"/>
          {/* Bunny Ears */}
          <path d="M10 7V3C10 2.44772 10.4477 2 11 2C11.5523 2 12 2.44772 12 3V7M14 7V3C14 2.44772 14.4477 2 15 2C15.5523 2 16 2.44772 16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </motion.div>
  );
}
