import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { ImageOptimizerPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  ...seoConfigs.tools,
  title: 'Image Optimizer',
  description:
    'Compress and optimize images (JPEG, PNG, WebP, GIF, BMP) right in your browser using WebAssembly and Rust',
});

export default function ImageOptimizerPage() {
  return <ImageOptimizerPageClient />;
}
