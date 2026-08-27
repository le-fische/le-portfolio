"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Cell = {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

const ROWS = 10;
const COLS = 10;
const MINES = 15;

export function Minesweeper() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !gameOver && !win) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameOver, win]);

  function initGame() {
    const newGrid: Cell[][] = Array(ROWS).fill(null).map((_, y) => 
      Array(COLS).fill(null).map((_, x) => ({
        x, y, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0
      }))
    );

    // Plant Jokers (Mines)
    let planted = 0;
    while (planted < MINES) {
      const x = Math.floor(Math.random() * COLS);
      const y = Math.floor(Math.random() * ROWS);
      if (!newGrid[y][x].isMine) {
        newGrid[y][x].isMine = true;
        planted++;
      }
    }

    // Calculate neighbors
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!newGrid[y][x].isMine) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (y+dy >= 0 && y+dy < ROWS && x+dx >= 0 && x+dx < COLS && newGrid[y+dy][x+dx].isMine) {
                count++;
              }
            }
          }
          newGrid[y][x].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setTime(0);
    setIsPlaying(false);
  };

  const revealCell = (x: number, y: number) => {
    if (gameOver || win || grid[y][x].isRevealed || grid[y][x].isFlagged) return;
    if (!isPlaying) setIsPlaying(true);

    const newGrid = [...grid.map(row => [...row])];

    if (newGrid[y][x].isMine) {
      // Game Over
      newGrid[y][x].isRevealed = true;
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    // Flood fill algorithm for 0 neighbors
    const stack = [{x, y}];
    while (stack.length > 0) {
      const curr = stack.pop()!;
      if (!newGrid[curr.y][curr.x].isRevealed) {
        newGrid[curr.y][curr.x].isRevealed = true;
        if (newGrid[curr.y][curr.x].neighborMines === 0) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = curr.y + dy;
              const nx = curr.x + dx;
              if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && !newGrid[ny][nx].isRevealed && !newGrid[ny][nx].isMine) {
                stack.push({x: nx, y: ny});
              }
            }
          }
        }
      }
    }

    setGrid(newGrid);
    checkWin(newGrid);
  };

  const toggleFlag = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameOver || win || grid[y][x].isRevealed) return;
    const newGrid = [...grid.map(row => [...row])];
    newGrid[y][x].isFlagged = !newGrid[y][x].isFlagged;
    setGrid(newGrid);
  };

  const checkWin = (currentGrid: Cell[][]) => {
    let unrevealedSafe = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!currentGrid[y][x].isRevealed && !currentGrid[y][x].isMine) {
          unrevealedSafe++;
        }
      }
    }
    if (unrevealedSafe === 0) {
      setWin(true);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-zinc-900 rounded-xl shadow-inner border border-zinc-700">
      <div className="flex justify-between w-full mb-6 px-4 font-mono text-gold text-2xl">
        <span>{String(MINES).padStart(3, '0')}</span>
        <button onClick={initGame} className="hover:scale-110 transition-transform">
          {gameOver ? "💀" : win ? "😎" : "😐"}
        </button>
        <span>{String(time).padStart(3, '0')}</span>
      </div>

      <div className="bg-zinc-800 p-2 rounded-lg border-2 border-zinc-950 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {grid.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <motion.button
                key={`${x}-${y}`}
                whileTap={{ scale: 0.9 }}
                onContextMenu={(e) => toggleFlag(e, x, y)}
                onClick={() => revealCell(x, y)}
                className={`w-8 h-8 sm:w-10 sm:h-10 m-[1px] rounded-sm flex items-center justify-center font-bold text-sm sm:text-base select-none transition-colors duration-200
                  ${cell.isRevealed 
                    ? cell.isMine 
                      ? "bg-red-600 text-white" 
                      : "bg-zinc-700 text-gold shadow-inner" 
                    : "bg-zinc-300 hover:bg-zinc-400 shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)] border border-zinc-200"
                  }
                `}
              >
                {cell.isRevealed ? (
                  cell.isMine ? "🃏" : cell.neighborMines > 0 ? cell.neighborMines : ""
                ) : cell.isFlagged ? (
                  "🚩"
                ) : ""}
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      {(gameOver || win) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <h3 className={`text-2xl font-serif ${win ? "text-emerald-400" : "text-red-500"}`}>
            {win ? "The Prestige!" : "Joker Found."}
          </h3>
          <p className="text-zinc-400 font-sans mt-2">
            {win ? `You cleared the board in ${time} seconds.` : "The illusion falls apart."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
