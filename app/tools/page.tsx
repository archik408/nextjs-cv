import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { ToolsPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.tools);

export default function ToolsPage() {
  return <ToolsPageClient />;
}
