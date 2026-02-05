'use client';
import { ETheme } from '@/constants/enums';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/hooks/use-theme';
import { useLanguage } from '@/lib/hooks/use-language';
import { translations } from '@/lib/translations';
import { FC } from 'react';

interface ThemeSwitcherProps {
  locale?: 'ru' | 'en';
}

export const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ locale }) => {
  const { theme, toggleTheme } = useTheme();
  const { t: contextT } = useLanguage();
  const t = locale ? translations[locale] : contextT;

  return (
    <button
      onClick={toggleTheme}
      className="shadow-lg dark:shadow-xl/20 flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
      aria-label={theme === ETheme.dark ? t.switchToLight : t.switchToDark}
    >
      {theme === ETheme.dark ? (
        <Sun className="w-4 h-4 text-yellow-400" />
      ) : (
        <Moon className="w-4 h-4 text-blue-600" />
      )}
      <span className="hidden sm:inline">{theme === ETheme.dark ? t.light : t.dark}</span>
    </button>
  );
};
