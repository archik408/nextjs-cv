'use client';

import { useLanguage } from '@/lib/use-language';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 px-4 text-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors duration-300">
      <p className="mb-2">{t.copyright}</p>
      <p>
        <a
          className="underline hover:no-underline text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          href="/accessibility"
        >
          {t.accessibilityTitle}
        </a>
      </p>
    </footer>
  );
}
