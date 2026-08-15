import Link from 'next/link';
import { Languages } from 'lucide-react';
import type { GardenLocale } from '@/lib/garden';

type Props = {
  translationSlug: string;
  locale: GardenLocale;
};

const LABELS: Record<GardenLocale, { hrefLabel: string; title: string }> = {
  ru: {
    hrefLabel: 'English version',
    title: 'Read this note in English',
  },
  en: {
    hrefLabel: 'Русская версия',
    title: 'Читать эту заметку на русском',
  },
};

export function GardenTranslationLink({ translationSlug, locale }: Props) {
  const label = LABELS[locale];
  return (
    <Link
      href={`/garden/${translationSlug}`}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/90 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-700"
      hrefLang={locale === 'ru' ? 'en' : 'ru'}
      title={label.title}
      translate="no"
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span>{label.hrefLabel}</span>
    </Link>
  );
}
