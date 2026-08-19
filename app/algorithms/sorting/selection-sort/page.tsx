import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { SelectionSortPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Selection Sort Visualization',
  description:
    'Learn Selection Sort through a concise explanation, a practical implementation, and an interactive visualization with start, stop, continue, and shuffle controls.',
  keywords:
    'Selection Sort, Sorting Visualization, Algorithms, Data Structures, JavaScript, Interactive Demo',
  path: '/algorithms/sorting/selection-sort',
});

export default function SelectionSortPage() {
  return <SelectionSortPageClient />;
}
