import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { AlgorithmsPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.algorithms);

export default function AlgorithmsPage() {
  return <AlgorithmsPageClient />;
}
