'use client';
import { ETheme } from '@/constants/enums';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: ETheme;
  setTheme: (theme: ETheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeToDocument(theme: ETheme) {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="color-scheme"]');

  if (theme === ETheme.dark) {
    root.classList.add(ETheme.dark);
    root.style.backgroundColor = '#0f172a';
    meta?.setAttribute('content', 'dark');
  } else {
    root.classList.remove(ETheme.dark);
    root.style.backgroundColor = '#ffffff';
    meta?.setAttribute('content', 'light');
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Manual theme only: localStorage override or dark default. Never follows OS.
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
    // Mount-only: restore saved manual choice; never subscribe to prefers-color-scheme.
  }, []);

  useEffect(() => {
    applyThemeToDocument(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Ignore storage errors
    }
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
