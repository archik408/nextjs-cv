import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { SVGOptimizerPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.svgOptimizer);

export default function SVGOptimizerPage() {
  return <SVGOptimizerPageClient />;
}
