import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { QuickSortPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Quick Sort Visualization',
  description:
    'Learn Quick Sort through a concise explanation, a practical implementation, and an interactive visualization with start, stop, continue, and shuffle controls.',
  keywords:
    'Quick Sort, Sorting Visualization, Algorithms, Data Structures, JavaScript, TypeScript, Interactive Demo',
  path: '/algorithms/sorting/quick-sort',
});

export default function QuickSortPage() {
  return <QuickSortPageClient />;
}
