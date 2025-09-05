'use client';

import Link from 'next/link';
import { Wrench, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import { useState } from 'react';

export function SidebarMenu() {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className="fixed top-1/2 -translate-y-1/2 right-0 w-6 h-20 z-[60] bg-transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <div
        className={`fixed flex items-center justify-center top-1/2 -translate-y-1/2 right-0 w-14 h-14 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl z-50 transition-transform duration-300 ease-in-out rounded-l-lg ${
          isHovered ? 'translate-x-0' : 'translate-x-10'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
          <div
            className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700 p-1 transition-transform duration-300 ${
              isHovered ? 'translate-x-0' : 'translate-x-2'
            }`}
          >
            <ChevronLeft
              className={`w-3 h-3 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                isHovered ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </div>
        <Link
          href="/tools"
          className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white`}
          title={t.toolsAndExperiments || 'Tools & Experiments'}
        >
          <div className="flex items-center justify-center w-full h-full">
            <Wrench className="w-5 h-5" />
            <div
              className={`absolute right-full mr-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200`}
            >
              {t.toolsAndExperiments || 'Tools & Experiments'}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900 dark:border-l-gray-100" />
            </div>
          </div>
        </Link>

        <div className="absolute inset-0 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none rounded-l-lg" />
      </div>
    </>
  );
}
