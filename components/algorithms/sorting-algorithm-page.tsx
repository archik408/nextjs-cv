'use client';

import Link from 'next/link';
import { ChevronRight, ExternalLink, Github } from 'lucide-react';
import NavigationButtons from '@/components/navigation-buttons';
import { CodeBlock } from '@/components/code-block';
import { SortingStep, SortingVisualizer } from '@/components/algorithms/sorting-visualizer';
import { useLanguage } from '@/lib/hooks/use-language';

type Props = {
  title: string;
  description: string;
  conceptTitle: string;
  conceptParagraphs: string[];
  implementationDescription: string;
  visualizationDescription: string;
  code: string;
  repoUrl: string;
  buildSteps: (source: number[]) => SortingStep[];
};

export function SortingAlgorithmPage({
  title,
  description,
  conceptTitle,
  conceptParagraphs,
  implementationDescription,
  visualizationDescription,
  code,
  repoUrl,
  buildSteps,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <nav
            aria-label={t.algorithmsBreadcrumbs || 'Breadcrumbs'}
            className="mt-12 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <Link
              href="/algorithms"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-300"
            >
              {t.algorithmsTitle || 'Algorithms & Data Structures'}
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link
              href="/algorithms/sorting"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-300"
            >
              {t.algorithmsSortingTitle || 'Sorting Algorithms'}
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="text-gray-900 dark:text-white">{title}</span>
          </nav>

          <section className="rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-xl shadow-gray-200/40 dark:border-gray-700/70 dark:bg-gray-800/90 dark:shadow-black/20">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">
                {t.algorithmCategories?.sorting || 'Sorting Algorithms'}
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <section className="space-y-8">
              <article className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="text-2xl font-semibold">{conceptTitle}</h2>
                {conceptParagraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-8 text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </article>

              <article className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {t.algorithmsImplementationTitle || 'Implementation'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {implementationDescription}
                    </p>
                  </div>

                  <Link
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-blue-400 hover:text-blue-700 dark:border-gray-600 dark:text-gray-100 dark:hover:border-blue-500 dark:hover:text-blue-300"
                  >
                    <Github className="h-4 w-4" />
                    {t.algorithmsRepoLinkLabel || 'Repository link'}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>

                <CodeBlock language="typescript" code={code} />
              </article>
            </section>

            <SortingVisualizer
              buildSteps={buildSteps}
              visualizationDescription={visualizationDescription}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
