import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { ToolsSection } from '@/components/tools-section';
import { BlogSection } from '@/components/blog-section';
import { GardenSection } from '@/components/garden-section';
import { TalksSection } from '@/components/talks-section';
import { FunActivitiesSection } from '@/components/fun-activities-section';
import { ContactSection } from '@/components/contact-section';
import {
  StructuredData,
  createPersonSchema,
  createWebsiteSchema,
} from '@/components/structured-data';
import { SectionDivider } from '@/components/section-divider';
import { SnowEffect } from '@/components/snow-effect';
import { SantaXMasHat } from '@/components/santa-x-mas-hat';

export default function Home() {
  return (
    <>
      <StructuredData data={createPersonSchema()} />
      <StructuredData data={createWebsiteSchema()} />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <ThemeSwitcher />
          <SantaXMasHat />
          <LanguageSwitcher />
          <SnowEffect />
        </div>

        <HeroSection />
        <main>
          <AboutSection />
          <ToolsSection />
          <GardenSection />
          <SectionDivider />
          <TalksSection />
          <SectionDivider />
          <BlogSection />
          <SectionDivider />
          <FunActivitiesSection />
          <ContactSection />
        </main>
      </div>
    </>
  );
}
