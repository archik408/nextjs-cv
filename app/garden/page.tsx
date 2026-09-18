import { Suspense } from 'react';
import { listGardenNotes } from '@/lib/garden';
import { generateMetadata as buildMetadata } from '@/lib/seo';
import NavigationButtons from '@/components/navigation-buttons';
import { GardenPageClient } from '@/components/garden-page-client';

export const dynamic = 'force-static';

function GardenListFallback() {
  const notes = listGardenNotes({ locale: 'ru' });
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <main id="main-content" className="min-w-0">
        <div
          className="mb-4 h-10 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"
          aria-hidden="true"
        />
        <div
          className="mb-8 h-5 w-96 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800"
          aria-hidden="true"
        />
        <ul className="space-y-4">
          {notes.slice(0, 5).map((note) => (
            <li
              key={note.slug}
              className="border-b border-neutral-400 pb-4 dark:border-neutral-500"
            >
              <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-2 h-4 w-1/4 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default function GardenIndexPage() {
  const notes = listGardenNotes({ locale: 'ru' });
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <NavigationButtons locale="ru" showLanguageSwitcher={false} showThemeSwitcher />
      </div>
      <Suspense fallback={<GardenListFallback />}>
        <GardenPageClient
          notes={notes}
          title="Digital Garden"
          description="Заметки, идеи и черновики. Часто обновляются."
        />
      </Suspense>
    </div>
  );
}

export function generateMetadata() {
  return buildMetadata({
    title: 'Digital Garden — Продакшен, Мышление, Детская лаборатория, Архив',
    description:
      'Живой набор заметок по полкам: Продакшен (кейсы), Мышление (эссе и книги), Детская лаборатория, Архив.',
    keywords:
      'Digital Garden, Продакшен, Мышление, Детская лаборатория, Архив, PWA, product engineering, Artur Basak',
    path: '/garden',
    locale: 'ru',
    languages: {
      ru: '/garden',
      'x-default': '/garden',
    },
  });
}
