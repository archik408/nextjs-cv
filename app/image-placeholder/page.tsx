import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { ImagePlaceholderClient } from './page-client';
import { StructuredData } from '@/components/structured-data';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Image Placeholder Generator – Random or Gray Box',
  description:
    'Create placeholder image URLs of any size. Return a gray box with size text or a random illustration from /public/image-placeholders. Copy-ready links for mockups.',
  keywords:
    'image placeholder, placeholder generator, random image, svg placeholder, mock images, dummy images, lorem picsum alternative',
  path: '/image-placeholder',
  type: 'website',
  locale: 'en',
});

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Image Placeholder Generator',
    url: 'https://arturbasak.dev/image-placeholder',
    applicationCategory: 'DeveloperApplication',
    description:
      'Generate placeholder image URLs with width/height, with random illustrations or a gray box with size text.',
    operatingSystem: 'Web',
  } as const;

  return (
    <>
      <StructuredData data={schema} />
      <ImagePlaceholderClient />
    </>
  );
}
