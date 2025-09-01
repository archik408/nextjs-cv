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
  const [theme, setTheme] = useState<ETheme>(ETheme.dark);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as ETheme | null;
      if (savedTheme === ETheme.light || savedTheme === ETheme.dark) {
        setTheme(savedTheme);
      } else {
        setTheme(ETheme.dark);
      }
    } catch {
      setTheme(ETheme.dark);
    }
  }, []);

  useEffect(() => {
    if (theme === ETheme.dark) {
      document.documentElement.classList.add(ETheme.dark);
    } else {
      document.documentElement.classList.remove(ETheme.dark);
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
