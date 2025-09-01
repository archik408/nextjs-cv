import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { SkillsSection } from '@/components/skills-section';
import { ExperienceSection } from '@/components/experience-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { CertificatesSection } from '@/components/certificates-section';
import { FunActivitiesSection } from '@/components/fun-activities-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';
import { CursorFollower } from '@/components/cursor-follower';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <CursorFollower />
      {/* Theme and Language Switchers */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Experience Section */}
      <ExperienceSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Certificates Section */}
      <CertificatesSection />

      {/* Fun Activities Section */}
      <FunActivitiesSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
