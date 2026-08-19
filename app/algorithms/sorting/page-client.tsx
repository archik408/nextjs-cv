'use client';

import Link from 'next/link';
import { ArrowRight, Binary, ChevronRight } from 'lucide-react';
import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/hooks/use-language';

export function SortingAlgorithmsPageClient() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
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
            <span className="text-gray-900 dark:text-white">
              {t.algorithmsSortingTitle || 'Sorting Algorithms'}
            </span>
          </nav>

          <section className="rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-xl shadow-gray-200/40 dark:border-gray-700/70 dark:bg-gray-800/90 dark:shadow-black/20">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">
                {t.algorithmCategories?.sorting || 'Sorting Algorithms'}
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {t.algorithmsSortingTitle || 'Sorting Algorithms'}
              </h1>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {t.algorithmsSortingDescription ||
                  'Start with a simple comparison sort and watch how adjacent elements gradually move into ascending order.'}
              </p>
            </div>
          </section>

          <section aria-labelledby="sorting-list-title">
            <div className="mb-6">
              <h2 id="sorting-list-title" className="text-2xl font-semibold">
                {t.algorithmsBrowseAlgorithms || 'Browse algorithm categories'}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t.algorithmsSortingIntro ||
                  'This section will grow over time. For now, Bubble Sort is available as the first fully interactive demo.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Link
                href="/algorithms/sorting/bubble-sort"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <Binary className="h-6 w-6" />
                  </div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    {t.algorithmsReady || 'Available'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">
                  {t.algorithmsBubbleSortTitle || 'Bubble Sort'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {t.algorithmsSortingBubbleSortDesc ||
                    'A step-by-step visualization of Bubble Sort with code, controls, and a clear explanation of the core idea.'}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <span>{t.algorithmsOpenCategory || 'Open category'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/algorithms/sorting/quick-sort"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <Binary className="h-6 w-6" />
                  </div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    {t.algorithmsReady || 'Available'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">
                  {t.algorithmsQuickSortTitle || 'Quick Sort'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {t.algorithmsSortingQuickSortDesc ||
                    'A divide-and-conquer visualization that shows how the array is partitioned around a pivot.'}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <span>{t.algorithmsOpenCategory || 'Open category'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/algorithms/sorting/insertion-sort"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <Binary className="h-6 w-6" />
                  </div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    {t.algorithmsReady || 'Available'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">
                  {t.algorithmsInsertionSortTitle || 'Insertion Sort'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {t.algorithmsSortingInsertionSortDesc ||
                    'A visualization of how each new element is inserted into an already sorted prefix.'}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <span>{t.algorithmsOpenCategory || 'Open category'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/algorithms/sorting/selection-sort"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <Binary className="h-6 w-6" />
                  </div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    {t.algorithmsReady || 'Available'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">
                  {t.algorithmsSelectionSortTitle || 'Selection Sort'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {t.algorithmsSortingSelectionSortDesc ||
                    'A visualization of how the smallest remaining element is selected and moved into place.'}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <span>{t.algorithmsOpenCategory || 'Open category'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/algorithms/sorting/merge-sort"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <Binary className="h-6 w-6" />
                  </div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    {t.algorithmsReady || 'Available'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">
                  {t.algorithmsMergeSortTitle || 'Merge Sort'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {t.algorithmsSortingMergeSortDesc ||
                    'A divide-and-conquer visualization showing how smaller sorted fragments are merged into a final result.'}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <span>{t.algorithmsOpenCategory || 'Open category'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/algorithms/sorting/shell-sort"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <Binary className="h-6 w-6" />
                  </div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    {t.algorithmsReady || 'Available'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">
                  {t.algorithmsShellSortTitle || 'Shell Sort'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {t.algorithmsSortingShellSortDesc ||
                    'A gap-based visualization that improves insertion sort by moving distant elements earlier.'}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <span>{t.algorithmsOpenCategory || 'Open category'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/algorithms/sorting/heap-sort"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <Binary className="h-6 w-6" />
                  </div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    {t.algorithmsReady || 'Available'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">
                  {t.algorithmsHeapSortTitle || 'Heap Sort'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {t.algorithmsSortingHeapSortDesc ||
                    'A visualization of heap construction and repeated extraction of the largest element.'}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <span>{t.algorithmsOpenCategory || 'Open category'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
