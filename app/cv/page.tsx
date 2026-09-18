import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { CvPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.cv);

export default function CvPage() {
  return <CvPageClient />;
}
