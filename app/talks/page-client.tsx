'use client';

import NavigationButtons from '@/components/navigation-buttons';
import ArticleTitle from '@/components/article-title';
import { TalkCard } from '@/components/talk-card';
import { TALKS } from '@/constants/talks';
import { useLanguage } from '@/lib/hooks/use-language';

export function TalksPageClient() {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-10 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white md:px-8 md:py-20">
      <div className="mx-auto max-w-5xl">
        <NavigationButtons showLanguageSwitcher showThemeSwitcher />
        <div className="mb-8 pt-10 md:pt-4">
          <ArticleTitle text={t.talks} />
          {t.talksDescription ? (
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{t.talksDescription}</p>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          {TALKS.map((talk) => (
            <TalkCard key={talk.id} talk={talk} />
          ))}
        </div>
      </div>
    </section>
  );
}
