'use client';

import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/use-language';
import ArticleTitle from '@/components/article-title';

export function PrivacyContent() {
  const { t } = useLanguage();

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-14 md:py-16">
        <NavigationButtons showLanguageSwitcher showThemeSwitcher />
        <main className="prose-garden">
          <ArticleTitle text={t.privacyTitle} />
          <p dangerouslySetInnerHTML={{ __html: t.privacyIntro }} />

          <h2>{t.privacyAnalyticsTitle}</h2>
          <p dangerouslySetInnerHTML={{ __html: t.privacyAnalyticsText }} />

          <h2>{t.privacyDataTitle}</h2>
          <p dangerouslySetInnerHTML={{ __html: t.privacyDataText }} />

          <h2>{t.privacyNoSellingTitle}</h2>
          <p dangerouslySetInnerHTML={{ __html: t.privacyNoSellingText }} />

          <h2>{t.privacyOpenSourceTitle}</h2>
          <p dangerouslySetInnerHTML={{ __html: t.privacyOpenSourceText }} />
        </main>
      </div>
    </article>
  );
}
