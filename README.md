# The Elegant Illusion: Portfolio Architecture

This repository contains the source code for a highly interactive, magic-themed personal portfolio. 

## 🎩 The Concept
A minimalist, premium engineering portfolio framed as a deck of 54 playing cards. It is designed to act as a clean showcase for serious recruiters, while hiding a massive layer of technical easter eggs and minigames for the curious.

## 🛠️ Tech Stack & Optimization
*   **Framework:** Next.js (App Router) using `template.tsx` for layout-shift-free transitions.
*   **Interactive Animations:** Framer Motion (utilizing `layoutId` for seamless card expansion).
*   **Scroll Narratives:** GSAP (GreenSock) & ScrollTrigger.
*   **Global State:** Zustand (Managing persistent minigame scores and UI state).
*   **Styling:** Tailwind CSS.

## 🎴 The Architecture
The portfolio is constrained strictly to 54 interactive elements:
*   **4 Aces (Categories):** Act as the main navigation (Software, Hardware, Mechanical, 3D).
*   **52 Suit Cards (Projects):** Hovering triggers a 3D flip; clicking expands the card into a full-screen project case study.
*   **The Black Joker (About Me):** Triggers an embossed Magician's License reveal.
*   **The Red Joker (Playground):** A chaotic particle reveal for experimental projects.

## 🔐 The Prestige (Easter Eggs)
The site is built with three distinct layers of hidden technical flexes:
1.  **The Joker Eclipse:** Dragging the Jokers together triggers a beautifully animated site crash and dark-mode inversion.
2.  **The Magic Arcade:** A hidden 3D Tuck Box contains three isolated, lazy-loaded minigames:
    *   *Illusionist's Minesweeper* (React 2D Array State Flex)
    *   *Cardshark's Blackjack* (AI Opponent & Persistent Database Flex)
    *   *Grandmaster's Chess* (Algorithmic Flex)
3.  **The Riddler's Safe:** Solving CS/Math riddles unlocks a global state "White Rabbit" companion that follows the user.

## 🚀 Development Roadmap
Development is strictly phased to ensure maximum performance and zero animation conflicts:
1.  **Phase 1:** Global State (Zustand) & Routing Engine.
2.  **Phase 2:** Core Deck UI & Framer Motion expansions.
3.  **Phase 3:** GSAP Scroll Narrative (Arthur C. Clarke quote).
4.  **Phase 4:** Lazy-loaded Arcade Minigames.
5.  **Phase 5:** Easter Eggs & Polish.
