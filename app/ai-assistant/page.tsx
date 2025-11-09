import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { AIAssistantPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.aiAssistant);

export default function AIAssistantPage() {
  return <AIAssistantPageClient />;
}
