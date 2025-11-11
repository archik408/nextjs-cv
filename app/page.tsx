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

          {/* Divider */}
          <div className="mx-auto max-w-6xl px-4">
            <hr className="my-8 border-gray-300 dark:border-gray-700" />
          </div>

          {/* Testimonials Section */}
          <TestimonialsSection />

          {/* Divider */}
          <div className="mx-auto max-w-6xl px-4">
            <hr className="my-8 border-gray-300 dark:border-gray-700" />
          </div>

          {/* Certificates Section */}
          <CertificatesSection />

          {/* Divider */}
          <div className="mx-auto max-w-6xl px-4">
            <hr className="my-8 border-gray-300 dark:border-gray-700" />
          </div>

          {/*/!* Garden Section *!/*/}
          <GardenSection />

          {/* Divider */}
          <div className="mx-auto max-w-6xl px-4">
            <hr className="my-8 border-gray-300 dark:border-gray-700" />
          </div>

          {/* Blog Section */}
          <BlogSection />

          {/* Divider */}
          <div className="mx-auto max-w-6xl px-4">
            <hr className="my-8 border-gray-300 dark:border-gray-700" />
          </div>

          {/* Tools Section */}
          <ToolsSection />

          {/* Divider */}
          <div className="mx-auto max-w-6xl px-4">
            <hr className="my-8 border-gray-300 dark:border-gray-700" />
          </div>

          {/* Fun Activities Section */}
          <FunActivitiesSection />

          {/* Contact Section */}
          <ContactSection />
        </main>
      </div>
    </>
  );
}
