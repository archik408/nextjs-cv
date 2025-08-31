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

  return (
    <section className="py-20 px-4 md:px-8 bg-gray-100/50 dark:bg-gray-800/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{t.skills}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div key={skill} className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
              <span className="font-medium text-blue-900 dark:text-white">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
