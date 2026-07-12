import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { MicrobitConnectorPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.microbitConnector);

export default function MicrobitConnectorPage() {
  return <MicrobitConnectorPageClient />;
}
