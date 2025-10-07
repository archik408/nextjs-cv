import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { HeroSection } from '@/components/hero-section';

describe('HeroSection accessibility', () => {
  it('has no detectable a11y violations', async () => {
    const { container } = render(<HeroSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
