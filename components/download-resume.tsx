'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/use-language';
import { ELanguage } from '@/constants/enums';
import { Download } from 'lucide-react';
import { SnowEffect } from '@/components/snow-effect';
import { SantaXMasHat } from '@/components/santa-x-mas-hat';

export function DownloadResume() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const href = `/api/resume?lang=${language || ELanguage.en}`;

  useEffect(() => {
    // Задержка для плавного появления после загрузки страницы
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      aria-label={t.resumeButton}
      href={href}
      className={`fixed top-4 left-4 z-[9000] inline-flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white shadow-lg transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
      }`}
    >
      <SantaXMasHat />
      <Download className="w-4 h-4" />
      <span className="hidden md:block">{t.resumeButton}</span>
      <SnowEffect />
    </a>
  );
}
