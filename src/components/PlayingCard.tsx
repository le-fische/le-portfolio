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
      className={`relative w-48 h-72 rounded-2xl cursor-pointer transition-colors duration-500 will-change-transform shadow-[0_20px_50px_rgba(0,0,0,0.15)]
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
      {/* FRONT FACE */}
      <div className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between p-5 border [backface-visibility:hidden] overflow-hidden
        ${isBurned ? "border-zinc-800 bg-zinc-200 opacity-90 sepia-[.3]" : "border-zinc-200 bg-[#faf9f6]"}
      `}>
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
      </div>

      {/* BACK FACE (Prinstream Tech Pattern) */}
      <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#0a0a0a] border border-zinc-800 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-2 border border-zinc-800 rounded-xl pointer-events-none z-10" />
        
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#222_10px,#222_11px)]" />
          <div className="absolute bottom-6 left-6 w-8 h-2 bg-zinc-300" />
          <div className="absolute top-6 right-6 w-8 h-2 bg-gold" />
        </div>
        
        <div className="flex gap-2 font-mono text-zinc-600 text-2xl font-black tracking-widest z-0 opacity-50">
          <span>X</span>
          <span>O</span>
        </div>
      </div>
    </motion.div>
  );
}
