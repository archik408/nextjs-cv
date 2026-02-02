'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { GardenNote } from '@/lib/garden';
import { getAllTagsFromNotes, filterNotesByTag } from '@/lib/garden-utils';
import { GardenTagLink } from '@/components/garden-tag-link';
import ArticleTitle from '@/components/article-title';
import { Sprout } from 'lucide-react';

type Props = {
  notes: GardenNote[];
  title?: string;
  description?: string;
};

export function GardenPageClient({ notes, title, description }: Props) {
  const searchParams = useSearchParams();
  const tagParam = searchParams?.get('tag') ?? null;
  const activeTag = tagParam ? decodeURIComponent(tagParam) : null;
  const tags = getAllTagsFromNotes(notes);
  const displayedNotes = activeTag && tagParam ? filterNotesByTag(notes, activeTag) : notes;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 lg:flex-row lg:gap-12">
      <aside className="order-2 shrink-0 lg:order-1 lg:w-56">
        <nav
          className="sticky top-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-gray-800/50"
          aria-label="Фильтр по темам"
        >
          <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Темы / тэги
          </h2>
          {tags.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Пока нет тэгов</p>
          ) : (
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
              <li>
                <Link
                  href="/garden"
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${!activeTag ? 'bg-neutral-100 font-medium dark:bg-neutral-800' : ''}`}
                  aria-current={!activeTag ? 'true' : undefined}
                >
                  Все заметки
                </Link>
              </li>
              {tags.map((tag) => (
                <li key={tag}>
                  <GardenTagLink tag={tag} variant="list" active={activeTag === tag} />
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 lg:order-2">
        {title && <ArticleTitle text={title} />}
        {description && (
          <p className="mb-8 text-neutral-600 dark:text-neutral-300">{description}</p>
        )}
        {activeTag && (
          <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
            Фильтр по тегу: <strong>#{activeTag}</strong>{' '}
            <Link href="/garden" className="text-green-600 hover:underline dark:text-green-400">
              сбросить
            </Link>
          </p>
        )}
        <ul className="space-y-4">
          {displayedNotes.map((note) => (
            <li
              key={note.slug}
              className="border-b border-neutral-400 pb-4 dark:border-neutral-500"
            >
              <h2 className="flex flex-row-reverse items-start justify-between gap-2 text-left text-xl font-semibold md:flex-row md:justify-start">
                <Sprout className="min-w-6 w-6 shrink-0 text-green-600 dark:text-green-400" />
                <Link href={`/garden/${note.slug}`} className="hover:underline">
                  {note.frontmatter.title}
                </Link>
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
                  {note.frontmatter.tags.map((t) => (
                    <GardenTagLink key={t} tag={t} variant="badge" />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        {displayedNotes.length === 0 && (
          <p className="text-neutral-500 dark:text-neutral-400">Нет заметок по выбранному тэгу.</p>
        )}
      </main>
    </div>
  );
}
