'use client';

import { useLanguage } from '@/lib/use-language';
import { ELanguage } from '@/constants/enums';
import { Download } from 'lucide-react';

export function DownloadResume() {
  const { t, language } = useLanguage();
  const href = `/api/resume?lang=${language || ELanguage.en}`;
  return (
    <a
      href={href}
      className="fixed top-4 left-4 z-[9000] inline-flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white shadow-lg transition-colors"
    >
      <Download className="w-4 h-4" />
      <span>{t.resumeButton}</span>
    </a>
  );
}
