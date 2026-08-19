import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { ShellSortPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Shell Sort Visualization',
  description:
    'Learn Shell Sort through a concise explanation, a practical implementation, and an interactive visualization with start, stop, continue, and shuffle controls.',
  keywords:
    'Shell Sort, Sorting Visualization, Algorithms, Data Structures, JavaScript, Interactive Demo',
  path: '/algorithms/sorting/shell-sort',
});

export default function ShellSortPage() {
  return <ShellSortPageClient />;
}
