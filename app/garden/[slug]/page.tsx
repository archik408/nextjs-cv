import { notFound } from 'next/navigation';
import { getGardenNoteBySlug, listGardenNotes } from '@/lib/garden';
import { renderMarkdownToHtml } from '@/lib/markdown';
import { ArticleTitle } from '@/components/article-title';
import { generateMetadata as buildMetadata } from '@/lib/seo';
import NavigationButtons from '@/components/navigation-buttons';
import { SharePanel } from '@/components/share-panel';
import { GardenArticle } from '@/components/garden-article';
import { GardenTagLink } from '@/components/garden-tag-link';
import { GardenTranslationLink } from '@/components/garden-translation-link';

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
  const dateLocale = note.locale === 'en' ? 'en-US' : 'ru-RU';
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <main className="mx-auto max-w-3xl px-4 py-12" lang={note.locale} translate="yes">
        <NavigationButtons
          levelUp="garden"
          locale={note.locale}
          showLanguageSwitcher={false}
          showThemeSwitcher
        />
        <div className="mb-4 flex justify-end">
          {note.translationSlug && (
            <GardenTranslationLink translationSlug={note.translationSlug} locale={note.locale} />
          )}
        </div>
        <ArticleTitle text={note.frontmatter.title} />
        {note.frontmatter.date && (
          <div className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
            <time dateTime={note.frontmatter.date} lang={note.locale}>
              {new Date(note.frontmatter.date).toLocaleDateString(dateLocale)}
            </time>
          </div>
        )}
        {note.frontmatter.tags && note.frontmatter.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {note.frontmatter.tags.map((tag) => (
              <GardenTagLink key={tag} tag={tag} variant="badge" />
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

  const languages: Partial<Record<'en' | 'ru' | 'x-default', string>> = {
    [note.locale]: `/garden/${note.slug}`,
  };
  if (note.translationSlug) {
    const otherLocale = note.locale === 'en' ? 'ru' : 'en';
    languages[otherLocale] = `/garden/${note.translationSlug}`;
    languages['x-default'] =
      note.locale === 'ru' ? `/garden/${note.slug}` : `/garden/${note.translationSlug}`;
  } else {
    languages['x-default'] = `/garden/${note.slug}`;
  }

  return buildMetadata({
    title: note.frontmatter.title,
    description:
      note.frontmatter.description ||
      (note.locale === 'en' ? 'A note from the Digital Garden' : 'Заметка из Digital Garden'),
    path: `/garden/${slug}`,
    type: 'article',
    publishedTime: note.frontmatter.date,
    modifiedTime: note.frontmatter.date,
    locale: note.locale,
    languages,
  });
}
