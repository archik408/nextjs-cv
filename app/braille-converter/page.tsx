import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { BrailleConverterClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.brailleConverter);

export default function BrailleConverterPage() {
  return <BrailleConverterClient />;
}
