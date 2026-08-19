import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { InsertionSortPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Insertion Sort Visualization',
  description:
    'Learn Insertion Sort through a concise explanation, a practical implementation, and an interactive visualization with start, stop, continue, and shuffle controls.',
  keywords:
    'Insertion Sort, Sorting Visualization, Algorithms, Data Structures, JavaScript, Interactive Demo',
  path: '/algorithms/sorting/insertion-sort',
});

export default function InsertionSortPage() {
  return <InsertionSortPageClient />;
}
