'use client';

import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/use-language';
import ArticleTitle from '@/components/article-title';

export function AccessibilityContent() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-14 md:py-16 prose-garden">
      <NavigationButtons showLanguageSwitcher showThemeSwitcher />

      <ArticleTitle text={t.accessibilityTitle} />
      <p dangerouslySetInnerHTML={{ __html: t.accessibilityIntro }} />

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
      <p>{t.accessibilityLimitationsText}</p>
    </div>
  );
}
