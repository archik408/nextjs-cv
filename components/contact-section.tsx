'use client';

import { Mail } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 md:px-8 bg-gray-400/50 dark:bg-gray-900/50">
      <div className="mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">{t.contact}</h2>
        <p
          className="text-gray-700 dark:text-gray-300 mb-8"
          dangerouslySetInnerHTML={{ __html: t.contactText }}
        />
        <a
          href="mailto:artur.basak.devingrodno@gmail.com"
          className="inline-flex items-center px-6 py-3 bg-blue-100 dark:bg-blue-800 p-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200 font-medium text-blue-900 dark:text-white"
        >
          {t.contactButton} <Mail className="w-4 h-4 ml-2" />
        </a>
      </div>
    </section>
  );
}
