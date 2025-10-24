import React from 'react';
jest.mock('@/components/navigation-buttons', () => ({ __esModule: true, default: () => null }));
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ImageOptimizerPageClient } from '@/app/image-optimizer/page-client';
import { ImagePlaceholderClient } from '@/app/image-placeholder/page-client';
import { OCRPageClient } from '@/app/ocr/page-client';

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
});
