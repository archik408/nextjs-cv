import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { EmotionAnalysisPageDynamic } from './page-dynamic';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.emotionAnalysis);

export default function EmotionAnalysisPage() {
  return <EmotionAnalysisPageDynamic />;
}
