'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/use-language';
import { ArrowRight, Binary, GitBranch, List, Network, ExternalLink, Github } from 'lucide-react';
import NavigationButtons from '@/components/navigation-buttons';

const REPOSITORY_URL = 'https://github.com/archik408/alg-and-ds-practise';

const categoryIcons = {
  sorting: Binary,
  graphs: Network,
  linkedList: List,
  trees: GitBranch,
} as const;

export function AlgorithmsPageClient() {
  const { t } = useLanguage();

  const categories = [
    {
      key: 'sorting',
      title: t.algorithmCategories?.sorting || 'Sorting Algorithms',
      description:
        t.algorithmsCategorySortingDesc ||
        'Visual explanations and interactive demos for sorting arrays step by step.',
      href: '/algorithms/sorting',
      ready: true,
    },
    {
      key: 'graphs',
      title: t.algorithmCategories?.graphs || 'Graph Algorithms',
      description:
        t.algorithmsCategoryGraphsDesc ||
        'Traversal, shortest paths, and graph thinking with visual representations.',
      href: '',
      ready: false,
    },
    {
      key: 'linkedList',
      title: t.algorithmCategories?.linkedList || 'Linked List',
      description:
        t.algorithmsCategoryLinkedListDesc ||
        'Node-based data structures with insert, delete, and traversal examples.',
      href: '',
      ready: false,
    },
    {
      key: 'trees',
      title: t.algorithmCategories?.trees || 'Tree Algorithms',
      description:
        t.algorithmsCategoryTreesDesc ||
        'Binary trees, traversals, and search operations with progressive examples.',
      href: '',
      ready: false,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <section className="rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-xl shadow-gray-200/40 dark:border-gray-700/70 dark:bg-gray-800/90 dark:shadow-black/20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">
                  {t.toolsAndExperiments || 'Tools & Experiments'}
                </p>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {t.algorithmsTitle || 'Algorithms & Data Structures'}
                </h1>
                <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  {t.algorithmsHubDescription ||
                    'Choose a topic and explore algorithms through focused pages with explanations, code, and interactive visualizations.'}
                </p>
              </div>

              <Link
                href={REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <Github className="h-4 w-4" />
                {t.viewOnGitHub || 'View on GitHub'}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <section aria-labelledby="algorithm-categories-title">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 id="algorithm-categories-title" className="text-2xl font-semibold sm:text-3xl">
                  {t.algorithmsBrowseAlgorithms || 'Browse algorithm categories'}
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t.algorithmsHubIntro ||
                    'Each category leads to dedicated pages with concrete implementations and interactive explanations.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {categories.map((category) => {
                const Icon = categoryIcons[category.key];
                const Card = category.ready ? Link : 'div';
                const cardProps = category.ready ? { href: category.href } : {};

                return (
                  // @ts-expect-error Link and div share the same visual shell here
                  <Card
                    key={category.key}
                    {...cardProps}
                    className={`group rounded-2xl border p-6 shadow-sm transition-all ${
                      category.ready
                        ? 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500'
                        : 'border-dashed border-gray-300 bg-gray-100/70 dark:border-gray-700 dark:bg-gray-800/40'
                    }`}
                    aria-disabled={!category.ready}
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          category.ready
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {category.ready
                          ? t.algorithmsReady || 'Available'
                          : t.algorithmsComingSoon || 'Coming soon'}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold">{category.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                      <span>
                        {category.ready
                          ? t.algorithmsOpenCategory || 'Open category'
                          : t.algorithmsMoreSoon || 'More examples soon'}
                      </span>
                      {category.ready && (
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
