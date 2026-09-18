jest.mock('@/components/navigation-buttons', () => ({ __esModule: true, default: () => null }));
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ImageOptimizerPageClient } from '@/app/image-optimizer/page-client';
import { ImagePlaceholderClient } from '@/app/image-placeholder/page-client';
import { OCRPageClient } from '@/app/ocr/page-client';
import { SkeletonDetectionPageClient } from '@/app/skeleton-detection/page-client';
import { EmotionAnalysisPageClient } from '@/app/emotion-analysis/page-client';
import { SpeechRecognitionPageClient } from '@/app/speech-recognition/page-client';

describe('Tools pages accessibility', () => {
  beforeAll(() => {
    // Mock fetch for ImagePlaceholderClient
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ collections: [] }) });
  });
  it('ImageOptimizer has no a11y violations', async () => {
    const { container } = render(<ImageOptimizerPageClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ImagePlaceholder has no a11y violations', async () => {
    const { container } = render(<ImagePlaceholderClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('OCR page has no a11y violations', async () => {
    const { container } = render(<OCRPageClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Skeleton Detection has no a11y violations', async () => {
    const { container } = render(<SkeletonDetectionPageClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Emotion Analysis has no a11y violations', async () => {
    const { container } = render(<EmotionAnalysisPageClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Speech Recognition has no a11y violations', async () => {
    const { container } = render(<SpeechRecognitionPageClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
