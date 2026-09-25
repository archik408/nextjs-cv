'use client';

import Image from 'next/image';
import { ExternalLink, FileText, Play } from 'lucide-react';
import type { Talk } from '@/constants/talks';
import { ELanguage } from '@/constants/enums';
import { useLanguage } from '@/lib/hooks/use-language';

type TalkCardProps = {
  talk: Talk;
};

export function TalkCard({ talk }: TalkCardProps) {
  const { t, language } = useLanguage();
  const locale = language === ELanguage.ru ? 'ru' : 'en';
  const title = talk.title[locale];
  const coverAlt = talk.coverAlt[locale];
  const resources = talk.resources ?? [];

  return (
    <article className="flex flex-col">
      <a
        href={talk.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-gray-500 dark:focus-visible:ring-offset-gray-900"
        aria-label={`${t.talksWatchVideo}: ${title}`}
      >
        <div className="mb-3 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
          <div className="relative aspect-video w-full">
            <Image
              src={talk.coverSrc}
              alt={coverAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
            <span
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white shadow-lg ring-1 ring-white/30 transition-transform duration-200 group-hover:scale-110 dark:bg-black/65">
                <Play className="ml-0.5 h-7 w-7 fill-current" />
              </span>
            </span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:underline dark:text-white">
          {title}
        </h3>
        <p className="mt-1 font-[var(--font-jetbrains-mono)] text-sm text-gray-500 dark:text-gray-400">
          {talk.event}
        </p>
      </a>
      {resources.length > 0 ? (
        <div className="mt-3 flex flex-col gap-2">
          {resources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-700 hover:underline dark:text-blue-400"
            >
              {resource.kind === 'article' ? (
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              ) : (
                <FileText className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{resource.kind === 'article' ? t.talksReadArticle : t.talksViewSlides}</span>
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
