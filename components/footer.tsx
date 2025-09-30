'use client';

import { useLanguage } from '@/lib/use-language';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
      <p className="mb-2">{t.copyright}</p>
      <p>
        <a className="underline hover:no-underline" href="/accessibility">
          {t.accessibilityTitle}
        </a>
      </p>
    </footer>
  );
}
