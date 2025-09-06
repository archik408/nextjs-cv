import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { OCRPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.ocr);

export default function OCRPage() {
  return <OCRPageClient />;
}
