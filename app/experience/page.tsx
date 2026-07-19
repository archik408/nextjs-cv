import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { ExperiencePageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.experience);

export default function ExperiencePage() {
  return <ExperiencePageClient />;
}
