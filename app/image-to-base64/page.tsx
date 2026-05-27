import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { ImageToBase64PageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  ...seoConfigs.tools,
  title: 'Image to Base64',
  description:
    'Convert images to Base64 data URIs, CSS background rules, or HTML img tags — locally in your browser.',
  path: '/image-to-base64',
});

export default function ImageToBase64Page() {
  return <ImageToBase64PageClient />;
}
