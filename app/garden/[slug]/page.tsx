import { notFound } from 'next/navigation';
import { getGardenNoteBySlug, listGardenNotes } from '@/lib/garden';
import { renderMarkdownToHtml } from '@/lib/markdown';
import { ArticleTitle } from '@/components/article-title';
import { generateMetadata as buildMetadata } from '@/lib/seo';
import NavigationButtons from '@/components/navigation-buttons';
import { SharePanel } from '@/components/share-panel';
import { GardenArticle } from '@/components/garden-article';
import { SnowEffect } from '@/components/snow-effect';

export const dynamic = 'force-static';

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const notes = listGardenNotes();
  return notes.map((n) => ({ slug: n.slug }));
}

export default async function GardenNotePage({ params }: PageParams) {
  const { slug } = await params;
  const note = getGardenNoteBySlug(slug);
  if (!note) return notFound();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <SnowEffect />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <NavigationButtons
          levelUp="garden"
          locale="ru"
          showLanguageSwitcher={false}
          showThemeSwitcher
        />
        <ArticleTitle text={note.frontmatter.title} />
        {note.frontmatter.date && (
          <div className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
            {new Date(note.frontmatter.date).toLocaleDateString('ru-RU')}
          </div>
        )}
        {note.frontmatter.tags && note.frontmatter.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
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
        <GardenArticle htmlContent={renderMarkdownToHtml(note.content)} />
        <div className="mt-8">
          <SharePanel
            title={note.frontmatter.title}
            url={`https://arturbasak.dev/garden/${note.slug}`}
            summary={note.frontmatter.description}
          />
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getGardenNoteBySlug(slug);
  if (!note) return {};
  return buildMetadata({
    title: note.frontmatter.title,
    description: note.frontmatter.description || 'Заметка из Digital Garden',
    path: `/garden/${slug}`,
    type: 'article',
    publishedTime: note.frontmatter.date,
    modifiedTime: note.frontmatter.date,
    locale: 'ru',
  });
}
