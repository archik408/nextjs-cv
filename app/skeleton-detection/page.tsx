import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { SkeletonDetectionPageDynamic } from './page-dynamic';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.skeletonDetection);

export default function SkeletonDetectionPage() {
  return <SkeletonDetectionPageDynamic />;
}
