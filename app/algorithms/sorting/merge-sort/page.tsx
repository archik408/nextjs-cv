import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { MergeSortPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Merge Sort Visualization',
  description:
    'Learn Merge Sort through a concise explanation, a practical implementation, and an interactive visualization with start, stop, continue, and shuffle controls.',
  keywords:
    'Merge Sort, Sorting Visualization, Algorithms, Data Structures, JavaScript, Interactive Demo',
  path: '/algorithms/sorting/merge-sort',
});

export default function MergeSortPage() {
  return <MergeSortPageClient />;
}
