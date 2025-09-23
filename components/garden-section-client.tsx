'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/use-language';
import type { GardenNote } from '@/lib/garden';
import { formatDate } from '@/utils/date';

type Props = {
  notes: GardenNote[];
};

export function GardenSectionClient({ notes }: Props) {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{t.garden}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((n) => (
            <Link
              key={n.slug}
              href={`/garden/${n.slug}`}
              className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-1">{n.frontmatter.title}</h3>
              {n.frontmatter.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {n.frontmatter.description}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {n.frontmatter.date ? formatDate(new Date(n.frontmatter.date)) : ''}
              </p>
              <div className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <span>{t.readArticle}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link
            href="/garden"
            className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:underline"
          >
            <span>{t.viewAll}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GardenSectionClient;
