'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/use-language';

type Props = {
  to?: 'index' | 'home';
};

export function GardenBreadcrumbs({ to = 'index' }: Props) {
  const { t } = useLanguage();
  return (
    <nav className="mb-6 text-sm">
      {to === 'home' ? (
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
          ← {t.backToHome}
        </Link>
      ) : (
        <Link href="/garden" className="text-blue-600 hover:underline dark:text-blue-400">
          ← {t.garden}
        </Link>
      )}
    </nav>
  );
}

export default GardenBreadcrumbs;
