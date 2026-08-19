import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { BubbleSortPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Bubble Sort Visualization',
  description:
    'Learn Bubble Sort through a concise explanation, a practical implementation, and an interactive visualization with start, stop, continue, and shuffle controls.',
  keywords:
    'Bubble Sort, Sorting Visualization, Algorithms, Data Structures, JavaScript, TypeScript, Interactive Demo',
  path: '/algorithms/sorting/bubble-sort',
});

export default function BubbleSortPage() {
  return <BubbleSortPageClient />;
}
