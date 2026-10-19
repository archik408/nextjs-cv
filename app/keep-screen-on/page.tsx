import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { KeepScreenOnPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.keepScreenOn);

export default function KeepScreenOnPage() {
  return <KeepScreenOnPageClient />;
}
