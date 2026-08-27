import { create } from 'zustand';

type Category = 'ace-spades' | 'ace-clubs' | 'ace-diamonds' | 'ace-hearts';

interface PortfolioState {
  // Navigation & State
  burnedCategories: Category[];
  burnCategory: (category: Category) => void;
  reviveCategory: (category: Category) => void;
  
  // Card Expansion State
  activeCardId: string | null;
  setActiveCardId: (id: string | null) => void;

  // Easter Eggs
  rabbitUnlocked: boolean;
  unlockRabbit: () => void;
  isJokerEclipse: boolean;
  triggerEclipse: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  burnedCategories: [],
  burnCategory: (category) => 
    set((state) => ({ 
      burnedCategories: state.burnedCategories.includes(category) 
        ? state.burnedCategories 
        : [...state.burnedCategories, category] 
    })),
  reviveCategory: (category) =>
    set((state) => ({
      burnedCategories: state.burnedCategories.filter((c) => c !== category)
    })),
  
  activeCardId: null,
  setActiveCardId: (id) => set({ activeCardId: id }),

  rabbitUnlocked: false,
  unlockRabbit: () => set({ rabbitUnlocked: true }),

  isJokerEclipse: false,
  triggerEclipse: () => set((state) => ({ isJokerEclipse: !state.isJokerEclipse })),
}));
