import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { YandexHubPageClient } from '@/app/yandex-hub/page-client';
import { YandexWitcherPageClient } from '@/app/yandex-witcher/page-client';

jest.mock('@/components/navigation-buttons', () => ({
  __esModule: true,
  default: () => null,
}));

describe('Yandex chat pages accessibility', () => {
  it('hub page has no accessibility violations', async () => {
    const { container } = render(<YandexHubPageClient />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('witcher page has no accessibility violations', async () => {
    const { container } = render(<YandexWitcherPageClient />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
