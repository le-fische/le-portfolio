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
      className={`relative w-48 h-72 rounded-xl bg-white shadow-xl cursor-pointer overflow-hidden border flex flex-col justify-between p-4 transition-colors duration-500
        ${isBurned ? "border-gray-800 bg-gray-200 opacity-90 sepia-[.3]" : "border-gray-200"}
        ${className}
      `}
      whileHover={{ y: -10, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      drag={drag}
      onDragEnd={onDragEnd}
      dragSnapToOrigin={dragSnapToOrigin}
      dragElastic={0.5}
    >
      {/* Burn mark overlays */}
      {isBurned && (
        <>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-black/40 to-transparent rounded-tr-xl mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-black/60 to-transparent rounded-bl-xl mix-blend-multiply" />
        </>
      )}

      {/* The Marked Card Easter Egg */}
      {isMarked && (
        <div 
          className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-gray-300 opacity-50 cursor-crosshair z-20 hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            if (onMarkClick) onMarkClick(e);
          }}
        />
      )}
      {isFaceDown ? (
        <div className="absolute inset-0 bg-[url('/card-back-pattern.png')] bg-cover bg-center border-4 border-white opacity-80" />
      ) : (
        <>
          <div className={`text-xl font-bold ${isRed ? "text-red-700" : "text-black"}`}>
            <div>{value}</div>
            <div>{suit}</div>
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            {title && <h3 className="font-serif text-lg font-semibold text-center text-charcoal">{title}</h3>}
          </div>

          <div className={`text-xl font-bold ${isRed ? "text-red-700" : "text-black"} rotate-180`}>
            <div>{value}</div>
            <div>{suit}</div>
          </div>
        </>
      )}
    </motion.div>
  );
}
