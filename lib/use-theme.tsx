'use client';
import { ETheme } from '@/constants/enums';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: ETheme;
  setTheme: (theme: ETheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme from localStorage or default to dark
  const [theme, setTheme] = useState<ETheme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme') as ETheme | null;
        return savedTheme === ETheme.light || savedTheme === ETheme.dark ? savedTheme : ETheme.dark;
      } catch {
        return ETheme.dark;
      }
    }
    return ETheme.dark;
  });

  useEffect(() => {
    // Only run this effect once on mount to sync with any changes
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme') as ETheme | null;
        if (savedTheme === ETheme.light || savedTheme === ETheme.dark) {
          if (savedTheme !== theme) {
            setTheme(savedTheme);
          }
        }
      } catch {
        // Handle localStorage errors gracefully
      }
    }
  }, []); // Remove theme dependency to avoid infinite loops

  useEffect(() => {
    if (theme === ETheme.dark) {
      document.documentElement.classList.add(ETheme.dark);
      document.documentElement.style.backgroundColor = '#0f172a';
    } else {
      document.documentElement.classList.remove(ETheme.dark);
      document.documentElement.style.backgroundColor = '#ffffff';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === ETheme.dark ? ETheme.light : ETheme.dark));
  };

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
