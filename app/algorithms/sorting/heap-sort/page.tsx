import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { HeapSortPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Heap Sort Visualization',
  description:
    'Learn Heap Sort through a concise explanation, a practical implementation, and an interactive visualization with start, stop, continue, and shuffle controls.',
  keywords:
    'Heap Sort, Sorting Visualization, Algorithms, Data Structures, JavaScript, Interactive Demo',
  path: '/algorithms/sorting/heap-sort',
});

export default function HeapSortPage() {
  return <HeapSortPageClient />;
}
