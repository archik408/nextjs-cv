'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Wrench } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import { FC } from 'react';

interface NavigationButtonsProps {
  levelUp?: 'tools';
}

const NavigationButtons: FC<NavigationButtonsProps> = ({ levelUp }) => {
  const { t } = useLanguage();

  return (
    <nav className="fixed top-4 left-4 z-50 flex gap-2">
      {levelUp === 'tools' && (
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg transition-colors"
          title={t.toolsAndExperiments || 'Tools & Experiments'}
        >
          <ArrowLeft className="w-4 h-4" />
          <Wrench className="w-4 h-4 hidden sm:block" />
          <span className="hidden sm:block">{t.tools || 'Tools'}</span>
        </Link>
      )}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg transition-colors"
        title={t.home || 'Home'}
      >
        <Home className="w-4 h-4" />
      </Link>
    </nav>
  );
};

export default NavigationButtons;
