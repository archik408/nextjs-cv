'use client';

import NavigationButtons from '@/components/navigation-buttons';
import { ExperienceSection } from '@/components/experience-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { CertificatesSection } from '@/components/certificates-section';
import { SectionDivider } from '@/components/section-divider';
import { DownloadResume } from '@/components/download-resume';
import ArticleTitle from '@/components/article-title';
import { useLanguage } from '@/lib/hooks/use-language';

export function CvPageClient() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <NavigationButtons showLanguageSwitcher showThemeSwitcher />
      <DownloadResume />
      <main id="main-content">
        <div className="px-4 pt-20 md:px-8">
          <div className="mx-auto max-w-5xl text-center md:text-left">
            <ArticleTitle text={t.cvPageTitle} />
            <p className="mb-4 text-base text-gray-600 dark:text-gray-300">{t.cvPageDescription}</p>
          </div>
        </div>
        <ExperienceSection animateTitle titleAs="h2" />
        <SectionDivider />
        <TestimonialsSection />
        <SectionDivider />
        <CertificatesSection />
      </main>
    </div>
  );
}
