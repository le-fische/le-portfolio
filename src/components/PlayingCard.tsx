"use client";

import { motion } from "framer-motion";

interface PlayingCardProps {
  id: string;
  suit: "♠" | "♣" | "♦" | "♥";
  value: string;
  title?: string;
  isFaceDown?: boolean;
  isBurned?: boolean;
  className?: string;
  onClick?: () => void;
  drag?: boolean | "x" | "y";
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: import("framer-motion").PanInfo) => void;
  dragSnapToOrigin?: boolean;
  isMarked?: boolean;
  onMarkClick?: (e: React.MouseEvent) => void;
}

export function PlayingCard({ id, suit, value, title, isFaceDown = false, isBurned = false, className = "", onClick, drag, onDragEnd, dragSnapToOrigin, isMarked, onMarkClick }: PlayingCardProps) {
  const isRed = suit === "♦" || suit === "♥";
  
  return (
    <motion.div
      layoutId={`card-${id}`}
      onClick={onClick}
      className={`relative w-48 h-72 rounded-2xl bg-[#faf9f6] cursor-pointer border flex flex-col justify-between p-5 transition-colors duration-500 will-change-transform
        ${isBurned ? "border-zinc-800 bg-zinc-200 opacity-90 sepia-[.3]" : "border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"}
        ${className}
      `}
      whileHover={{ y: -15, scale: 1.05, rotateY: 5, rotateX: 5, z: 50 }}
      whileTap={{ scale: 0.95 }}
      drag={drag}
      onDragEnd={onDragEnd}
      dragSnapToOrigin={dragSnapToOrigin}
      dragElastic={0.5}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Inner Border for elegance */}
      <div className="absolute inset-2 border border-zinc-200 rounded-xl pointer-events-none" />

      {/* Burn mark overlays */}
      {isBurned && (
        <>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-black/40 to-transparent rounded-tr-2xl mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-black/60 to-transparent rounded-bl-2xl mix-blend-multiply" />
        </>
      )}

      {/* The Marked Card Easter Egg */}
      {isMarked && (
        <div 
          className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-zinc-400 opacity-50 cursor-crosshair z-20 hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            if (onMarkClick) onMarkClick(e);
          }}
        />
      )}
      
      {isFaceDown ? (
        <div className="absolute inset-2 bg-[url('/card-back-pattern.png')] bg-zinc-800 bg-cover bg-center rounded-xl opacity-90" />
      ) : (
        <>
          <div className={`text-2xl font-serif font-bold ${isRed ? "text-red-700" : "text-zinc-900"} leading-none`}>
            {value}
            <div className="text-3xl mt-1">{suit}</div>
          </div>
          
          {title && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 text-center">
              <h3 className="font-sans text-sm tracking-[0.2em] uppercase text-zinc-800 break-words leading-relaxed">{title}</h3>
            </div>
          )}

          <div className={`text-2xl font-serif font-bold ${isRed ? "text-red-700" : "text-zinc-900"} self-end rotate-180 leading-none`}>
            {value}
            <div className="text-3xl mt-1">{suit}</div>
          </div>
        </>
      )}
    </motion.div>
  );
}
