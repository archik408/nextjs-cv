import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
import { SITE_URL } from '@/lib/site';
import { TalksPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.talks);

const talksSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Artur Basak Talks',
  description: 'Conference talks and meetup recordings with video and slides by Artur Basak.',
  url: `${SITE_URL}/talks`,
  author: {
    '@type': 'Person',
    name: 'Artur Basak',
    url: SITE_URL,
  },
};

export default function TalksPage() {
  return (
    <>
      <StructuredData data={talksSchema} />
      <TalksPageClient />
    </>
  );
}
