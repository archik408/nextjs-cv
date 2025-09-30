import Link from 'next/link';
import { listGardenNotes } from '@/lib/garden';
import { generateMetadata as buildMetadata } from '@/lib/seo';
import ArticleTitle from '@/components/article-title';
import NavigationButtons from '@/components/navigation-buttons';
import { Sprout } from 'lucide-react';

export const dynamic = 'force-static';

export default function GardenIndexPage() {
  const notes = listGardenNotes();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <NavigationButtons showLanguageSwitcher={false} showThemeSwitcher />
      <ArticleTitle text="Digital Garden" />
      <p className="mb-8 text-neutral-600 dark:text-neutral-300">
        Заметки, идеи и черновики. Часто обновляются.
      </p>
      <ul className="space-y-4">
        {notes.map((note) => (
          <li key={note.slug} className="border-b border-neutral-400 pb-4 dark:border-neutral-500">
            <h2 className="text-xl font-semibold flex items-start gap-2 flex-row-reverse md:flex-row text-left justify-between">
              <Sprout className="w-6 h-6 text-green-600 dark:text-green-400" />
              <Link href={`/garden/${note.slug}`} className="hover:underline">
                {note.frontmatter.title}
              </Link>
            </h2>
            <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {note.frontmatter.date && new Date(note.frontmatter.date).toLocaleDateString('ru-RU')}
            </div>
            {note.frontmatter.description && (
              <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                {note.frontmatter.description}
              </p>
            )}
            {note.frontmatter.tags && note.frontmatter.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {note.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

export function generateMetadata() {
  return buildMetadata({
    title: 'Digital Garden — заметки и идеи',
    description:
      'Живой набор заметок, идей и черновиков по фронтенду, дизайну и разработке. Часто обновляется.',
    keywords: 'Digital Garden, заметки, фронтенд, идеи, черновики, веб-разработка, Artur Basak',
    path: '/garden',
    locale: 'ru',
  });
}
