import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { SpeechRecognitionPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.speechRecognition);

export default function SpeechRecognitionPage() {
  return <SpeechRecognitionPageClient />;
}
