'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/use-language';
import type { GardenNote } from '@/lib/garden';
import { formatDate } from '@/utils/date';
import { Sprout, ExternalLink } from 'lucide-react';
import { AnimatedSectionTitle } from '@/components/animated-section-title';
import { TiltCard } from '@/components/tilt-card';
import { ELanguage } from '@/constants/enums';

type Props = {
  ruNotes: GardenNote[];
  enNotes: GardenNote[];
};

const cardClassName =
  'rounded-2xl border-2 border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20';

export function GardenSectionClient({ ruNotes, enNotes }: Props) {
  const { t, language } = useLanguage();
  const notes = language === ELanguage.en ? enNotes : ruNotes;

  return (
    <section id="garden" className="scroll-mt-20 px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <AnimatedSectionTitle
          text={t.garden}
          className="justify-center"
          wrapperClassName="text-center"
        />
        {t.thinkingDescription ? (
          <p className="mb-8 text-center text-base text-gray-600 dark:text-gray-300">
            {t.thinkingDescription}
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {notes.map((n) => (
            <TiltCard
              key={n.slug}
              as={Link}
              href={`/garden/${n.slug}`}
              hrefLang={n.locale}
              lang={n.locale}
              className={cardClassName}
            >
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-5"
                aria-hidden="true"
              />
              <div
                className="absolute top-2 right-2 opacity-15 transition-opacity duration-300 group-hover:opacity-25"
                aria-hidden="true"
              >
                <Sprout size={120} className="text-green-500/40 dark:text-green-400/40" />
              </div>
              <div className="relative z-10">
                <div className="mb-4">
                  <div className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-[0_14px_28px_-6px_rgba(0,0,0,0.55)] dark:border-white/20 dark:bg-white/10 dark:group-hover:bg-white/15 dark:group-hover:shadow-[0_16px_32px_-4px_rgba(0,0,0,0.85)]">
                    <Sprout className="h-6 w-6 text-green-600 transition-transform duration-300 group-hover:scale-110 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="mb-1 text-lg font-semibold transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                  {n.frontmatter.title}
                </h3>
                {n.frontmatter.description && (
                  <p className="mb-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                    {n.frontmatter.description}
                  </p>
                )}
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  {n.frontmatter.date ? formatDate(new Date(n.frontmatter.date)) : ''}
                </p>
                <div className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <ExternalLink className="h-4 w-4" />
                  <span>{t.readArticle}</span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/garden"
            className="inline-flex items-center gap-2 text-blue-700 hover:underline dark:text-blue-400"
          >
            <ExternalLink className="h-4 w-4" />
            <span>{t.viewAll}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GardenSectionClient;
