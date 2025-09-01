'use client';

import { useLanguage } from '@/lib/use-language';

const skills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js (SSR/SSG/ISR)',
  'HTML5',
  'CSS3',
  'UX',
  'Frontend Architecture',
  'Design Systems',
  'Micro‑frontends',
  'Web Performance',
  'Accessibility (WCAG)',
  'PWA / Service Workers',
  'REST / GraphQL',
  'Node.js / Express',
  'Python / Django',
  'SQL / NoSQL',
  'WebAssembly',
  'Web Security',
  'FrontOps',
  'QA / Testing',
  'Automated Testing',
  'Headless CMS',
  'SEO',
];

export function SkillsSection() {
  const { t } = useLanguage();

  const handleSkillClick = (skill: string) => {
    const searchQuery = skill
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/[‑–—]/g, ' ')
      .trim();

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' web')}`;
    window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-10 md:py-20 px-4 md:px-8 bg-gray-100/50 dark:bg-gray-800/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{t.skills}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillClick(skill)}
              className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200 text-left"
              aria-label={`Search for ${skill} on Google`}
            >
              <span className="font-medium text-blue-900 dark:text-white">{skill}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
