'use client';

import NavigationButtons from '@/components/navigation-buttons';
import { ExperienceSection } from '@/components/experience-section';

export function ExperiencePageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons showLanguageSwitcher showThemeSwitcher />
      <main id="main-content">
        <ExperienceSection animateTitle={false} titleAs="h1" />
      </main>
    </div>
  );
}
