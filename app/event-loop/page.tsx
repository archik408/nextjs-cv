import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { EventLoopPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.eventLoop);

export default function EventLoopPage() {
  return <EventLoopPageClient />;
}
