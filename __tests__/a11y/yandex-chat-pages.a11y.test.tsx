import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { YandexAliceSkillsPageClient } from '@/app/yandex-alice-skills/page-client';

jest.mock('@/components/navigation-buttons', () => ({
  __esModule: true,
  default: () => null,
}));

describe('Yandex chat pages accessibility', () => {
  it('unified skills page has no accessibility violations', async () => {
    const { container } = render(<YandexAliceSkillsPageClient />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
