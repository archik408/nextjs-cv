'use client';

import Link from 'next/link';
import { useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { GardenNote } from '@/lib/garden';
import {
  DEFAULT_GARDEN_SHELF,
  GARDEN_SHELVES,
  isGardenShelf,
  type GardenShelf,
} from '@/constants/garden-shelves';
import { filterNotesByShelf } from '@/lib/garden-utils';
import ArticleTitle from '@/components/article-title';
import { Rss, Sprout } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';

type Props = {
  notes: GardenNote[];
  title?: string;
  description?: string;
};

function buildGardenHref(shelf: GardenShelf): string {
  if (shelf === DEFAULT_GARDEN_SHELF) {
    return '/garden';
  }
  return `/garden?shelf=${shelf}`;
}

function GardenTagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-block rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
      #{tag}
    </span>
  );
}

export function GardenPageClient({ notes, title, description }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shelfParam = searchParams?.get('shelf') ?? null;
  const activeShelf: GardenShelf = isGardenShelf(shelfParam) ? shelfParam : DEFAULT_GARDEN_SHELF;

  const displayedNotes = useMemo(
    () => filterNotesByShelf(notes, activeShelf),
    [notes, activeShelf]
  );

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const shelfLabels: Record<GardenShelf, string> = {
    production: t.gardenShelfProduction,
    thinking: t.gardenShelfThinking,
    kids: t.gardenShelfKids,
    archive: t.gardenShelfArchive,
  };

  const shelfDescriptions: Record<GardenShelf, string> = {
    production: t.gardenShelfProductionDesc,
    thinking: t.gardenShelfThinkingDesc,
    kids: t.gardenShelfKidsDesc,
    archive: t.gardenShelfArchiveDesc,
  };

  const selectShelf = useCallback(
    (shelf: GardenShelf) => {
      router.push(buildGardenHref(shelf), { scroll: false });
    },
    [router]
  );

  const onTabKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = GARDEN_SHELVES.length - 1;
      let nextIndex: number | null = null;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = index === last ? 0 : index + 1;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = index === 0 ? last : index - 1;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = last;
      }

      if (nextIndex === null) return;
      event.preventDefault();
      const nextShelf = GARDEN_SHELVES[nextIndex];
      selectShelf(nextShelf);
      tabRefs.current[nextIndex]?.focus();
    },
    [selectShelf]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <main className="min-w-0">
        {title && <ArticleTitle text={title} />}
        {description && (
          <p className="mb-4 text-neutral-600 dark:text-neutral-300">{description}</p>
        )}
        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
          <Link
            href="/garden/rss.xml"
            className="inline-flex items-center gap-2 rounded-md border border-orange-300 bg-orange-50 px-3 py-1.5 text-orange-900 transition hover:bg-orange-100 dark:border-orange-500/60 dark:bg-orange-950/40 dark:text-orange-100 dark:hover:bg-orange-900/60"
            aria-label="RSS-лента Digital Garden — подписаться"
          >
            <Rss className="h-4 w-4" aria-hidden="true" />
            <span>RSS-лента Digital Garden</span>
          </Link>
        </p>

        <div role="tablist" aria-label={t.gardenShelvesLabel} className="mb-6 flex flex-wrap gap-2">
          {GARDEN_SHELVES.map((shelf, index) => {
            const selected = activeShelf === shelf;
            return (
              <button
                key={shelf}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`garden-tab-${shelf}`}
                aria-selected={selected}
                aria-controls={`garden-panel-${shelf}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectShelf(shelf)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                  selected
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-white text-gray-700 hover:bg-neutral-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-neutral-700'
                }`}
              >
                {shelfLabels[shelf]}
              </button>
            );
          })}
        </div>

        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          {shelfDescriptions[activeShelf]}
        </p>

        <div
          role="tabpanel"
          id={`garden-panel-${activeShelf}`}
          aria-labelledby={`garden-tab-${activeShelf}`}
        >
          <ul className="space-y-4">
            {displayedNotes.map((note) => (
              <li
                key={note.slug}
                className="border-b border-neutral-400 pb-4 dark:border-neutral-500"
              >
                <h2 className="flex flex-row-reverse items-start justify-between gap-2 text-left text-xl font-semibold md:flex-row md:justify-start">
                  <Sprout className="min-w-6 w-6 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="min-w-0 flex-1">
                    <Link href={`/garden/${note.slug}`} className="hover:underline" lang="ru">
                      {note.frontmatter.title}
                    </Link>
                    {note.translationSlug && (
                      <Link
                        href={`/garden/${note.translationSlug}`}
                        className="ml-2 inline-flex align-middle text-xs font-medium text-blue-700 hover:underline dark:text-blue-400"
                        hrefLang="en"
                        lang="en"
                        translate="no"
                      >
                        EN
                      </Link>
                    )}
                  </span>
                </h2>
                <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {note.frontmatter.date &&
                    new Date(note.frontmatter.date).toLocaleDateString('ru-RU')}
                </div>
                {note.frontmatter.description && (
                  <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                    {note.frontmatter.description}
                  </p>
                )}
                {note.frontmatter.tags && note.frontmatter.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {note.frontmatter.tags.map((tag) => (
                      <GardenTagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          {displayedNotes.length === 0 && (
            <p className="text-neutral-500 dark:text-neutral-400">{t.gardenNoNotesInShelf}</p>
          )}
        </div>
      </main>
    </div>
  );
}
