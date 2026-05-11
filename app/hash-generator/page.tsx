import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { HashGeneratorPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  ...seoConfigs.tools,
  title: 'Hash Generator',
  description: 'Generate common hashes (SHA-1/SHA-2/MD5/SHA3/SHAKE) right in your browser.',
  path: '/hash-generator',
});

export default function HashGeneratorPage() {
  return <HashGeneratorPageClient />;
}
