'use client';

import { useLanguage } from '@/lib/hooks/use-language';

const SkipLink = () => {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="skip-link"
      onClick={() =>
        document
          ?.querySelector('#main-content')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    >
      {t.skipLinkMain}
    </a>
  );
};

export default SkipLink;
