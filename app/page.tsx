import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { SkillsSection } from '@/components/skills-section';
import { ToolsSection } from '@/components/tools-section';
import { ExperienceSection } from '@/components/experience-section';
import { BlogSection } from '@/components/blog-section';
import { GardenSection } from '@/components/garden-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { CertificatesSection } from '@/components/certificates-section';
import { FunActivitiesSection } from '@/components/fun-activities-section';
import { ContactSection } from '@/components/contact-section';
import { DownloadResume } from '@/components/download-resume';
import {
  StructuredData,
  createPersonSchema,
  createWebsiteSchema,
} from '@/components/structured-data';
import { SectionDivider } from '@/components/section-divider';

export default function Home() {
  return (
    <>
      <StructuredData data={createPersonSchema()} />
      <StructuredData data={createWebsiteSchema()} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <DownloadResume />
        {/* Theme and Language Switchers */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>

        {/* Hero Section */}
        <HeroSection />
        <main>
          {/* About Section */}
          <AboutSection />

          {/* Skills Section */}
          <SkillsSection />

          {/* Experience Section */}
          <ExperienceSection />

          {/* Testimonials Section */}
          <SectionDivider />
          <TestimonialsSection />

          {/* Certificates Section */}
          <SectionDivider />
          <CertificatesSection />

          {/* Garden Section */}
          <SectionDivider />
          <GardenSection />

          {/* Blog Section */}
          <SectionDivider />
          <BlogSection />

          {/* Tools Section */}
          <SectionDivider />
          <ToolsSection />

          {/* Fun Activities Section */}
          <SectionDivider />
          <FunActivitiesSection />

          {/* Contact Section */}
          <ContactSection />
        </main>
      </div>
    </>
  );
}
