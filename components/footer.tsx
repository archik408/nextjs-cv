'use client';

import { useLanguage } from '@/lib/use-language';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
      <p>{t.copyright}</p>
    </footer>
  );
}
