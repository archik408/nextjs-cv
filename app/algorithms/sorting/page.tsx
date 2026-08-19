import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { SortingAlgorithmsPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Sorting Algorithms',
  description:
    'Explore sorting algorithms with focused pages, practical implementations, and interactive visualizations. Start with Bubble Sort.',
  keywords:
    'Sorting Algorithms, Bubble Sort, Algorithms Visualization, Data Structures, JavaScript, TypeScript',
  path: '/algorithms/sorting',
});

export default function SortingAlgorithmsPage() {
  return <SortingAlgorithmsPageClient />;
}
