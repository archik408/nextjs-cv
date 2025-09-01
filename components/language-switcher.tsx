'use client';
import { ELanguage } from '@/constants/enums';

import { Globe2 } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === ELanguage.en ? ELanguage.ru : ELanguage.en)}
      className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
    >
      <Globe2 className="w-4 h-4" />
      {language === ELanguage.en ? 'RU' : 'EN'}
    </button>
  );
}
