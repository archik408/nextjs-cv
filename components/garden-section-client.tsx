'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/use-language';
import type { GardenNote } from '@/lib/garden';
import { formatDate } from '@/utils/date';
import { Sprout, ExternalLink } from 'lucide-react';
import { AnimatedSectionTitle } from '@/components/animated-section-title';

type Props = {
  notes: GardenNote[];
};

export function GardenSectionClient({ notes }: Props) {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <AnimatedSectionTitle
          text={t.garden}
          className="justify-center"
          wrapperClassName="text-center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((n) => (
            <Link
              key={n.slug}
              href={`/garden/${n.slug}`}
              className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-1 flex items-start gap-2">
                <Sprout className="w-6 h-6 min-w-6 text-green-600 dark:text-green-400" />
                {n.frontmatter.title}
              </h3>
              {n.frontmatter.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {n.frontmatter.description}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {n.frontmatter.date ? formatDate(new Date(n.frontmatter.date)) : ''}
              </p>
              <div className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <ExternalLink className="w-4 h-4" />
                <span>{t.readArticle}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center md:text-left">
          <Link
            href="/garden"
            className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{t.viewAll}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GardenSectionClient;
