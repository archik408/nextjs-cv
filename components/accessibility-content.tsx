'use client';

import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/hooks/use-language';
import ArticleTitle from '@/components/article-title';
import Image from 'next/image';

export function AccessibilityContent() {
  const { t } = useLanguage();

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-14 md:py-16">
        <NavigationButtons showLanguageSwitcher showThemeSwitcher />
        <main className="prose-garden">
          <ArticleTitle text={t.accessibilityTitle} />
          <p dangerouslySetInnerHTML={{ __html: t.accessibilityIntro }} />
          <Image
            src="/disability-persons.png"
            role="presentation"
            alt=""
            width="540"
            height="100"
          />
          <h2>{t.accessibilityMeasuresTitle}</h2>
          <ul>
            {t.accessibilityMeasuresList.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>{t.accessibilityFeedbackTitle}</h2>
          <p dangerouslySetInnerHTML={{ __html: t.accessibilityFeedbackText }} />

          <h2>{t.accessibilityAssessmentTitle}</h2>
          <p>{t.accessibilityAssessmentText}</p>

          <h2>{t.accessibilityLimitationsTitle}</h2>
          <ul>
            {t.accessibilityLimitationsText.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </main>
      </div>
    </article>
  );
}
