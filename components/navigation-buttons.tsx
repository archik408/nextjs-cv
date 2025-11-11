'use client';

import Link from 'next/link';
import { ArrowLeft, Home, NotebookIcon, Sprout, Wrench } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import { FC } from 'react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSwitcher } from '@/components/language-switcher';
import { translations } from '@/lib/translations';

interface NavigationButtonsProps {
  levelUp?: 'tools' | 'blog' | 'garden' | 'timeline';
  showLanguageSwitcher: boolean;
  showThemeSwitcher: boolean;
  locale?: 'ru' | 'en';
}

const NavigationButtons: FC<NavigationButtonsProps> = ({
  levelUp,
  locale,
  showLanguageSwitcher,
  showThemeSwitcher,
}) => {
  const { t: contextT } = useLanguage();
  const t = locale ? translations[locale] : contextT;

  return (
    <>
      <nav className="fixed top-4 left-4 z-50 flex gap-2">
        {levelUp === 'tools' && (
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg dark:shadow-xl/20 transition-colors"
            title={t.toolsAndExperiments || 'Инструменты'}
          >
            <ArrowLeft className="w-4 h-4" />
            <Wrench className="w-4 h-4 hidden sm:block" />
            <span className="hidden sm:block">{t.tools || 'Инструменты'}</span>
          </Link>
        )}
        {levelUp === 'blog' && (
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg dark:shadow-xl/20 transition-colors"
            title={'Публикации'}
          >
            <ArrowLeft className="w-4 h-4" />
            <NotebookIcon className="w-4 h-4 hidden sm:block" />
            <span className="hidden sm:block">{'Публикации'}</span>
          </Link>
        )}
        {levelUp === 'garden' && (
          <Link
            href="/garden"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg dark:shadow-xl/20 transition-colors"
            title={t.garden || 'Digital Garden'}
          >
            <ArrowLeft className="w-4 h-4" />
            <Sprout className="w-4 h-4 min-w-4 hidden sm:block" />
            <span className="hidden sm:block">{t.garden || 'Digital Garden'}</span>
          </Link>
        )}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg dark:shadow-xl/20 transition-colors"
          title={t.home || 'Home'}
        >
          <Home className="w-4 h-4" />
        </Link>
      </nav>
      {(showLanguageSwitcher || showThemeSwitcher) && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {showThemeSwitcher && <ThemeSwitcher locale={locale} />}
          {showLanguageSwitcher && <LanguageSwitcher />}
        </div>
      )}
    </>
  );
};

export default NavigationButtons;
