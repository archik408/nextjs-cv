import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { CodeReviewEmojisPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  ...seoConfigs.tools,
  title: 'Code Review Emoji Picker',
  description:
    'Pick useful emoji reactions for code review comments and copy them instantly in your browser.',
  path: '/code-review-emojis',
});

export default function CodeReviewEmojisPage() {
  return <CodeReviewEmojisPageClient />;
}
