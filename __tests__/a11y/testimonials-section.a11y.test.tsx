import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { TestimonialsSection } from '@/components/testimonials-section';

describe('TestimonialsSection accessibility', () => {
  it('has no detectable a11y violations', async () => {
    const { container } = render(<TestimonialsSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
