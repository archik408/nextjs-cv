'use client';
import { ETheme } from '@/constants/enums';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/use-theme';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="shadow-lg flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
      aria-label={`Switch to ${theme === ETheme.dark ? ETheme.light : ETheme.dark} theme`}
    >
      {theme === ETheme.dark ? (
        <Sun className="w-4 h-4 text-yellow-400" />
      ) : (
        <Moon className="w-4 h-4 text-blue-600" />
      )}
      <span className="hidden sm:inline">{theme === ETheme.dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
