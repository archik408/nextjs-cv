'use client';

import { useLanguage } from '@/lib/hooks/use-language';
import { TechIcon } from './tech-icon';
import { AnimatedSectionTitle } from '@/components/animated-section-title';

const tools = [
  'MacOS',
  'M4 Pro',
  'RedDragon EISA Pro',
  'ERGO M575S',
  'Thunderobot Mini LED',
  'Barner Eyewear',
  'WebStorm',
  'Cursor AI',
  'Chrome DevTools',
  'VoiceOver',
  'Deque axe',
  'WebAIM WAVE',
  'Figma',
  'Git',
  'Postman',
  'Sentry',
  'React DevTools',
  'SVGO/ImageOptim',
  'GitLab',
];

export function ToolsSection() {
  const { t } = useLanguage();

  const handleToolClick = (tool: string) => {
    const searchQuery = tool
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/[‑–—]/g, ' ')
      .trim();

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' developer tool')}`;
    window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 md:px-8 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <AnimatedSectionTitle
            text={t.mySetup}
            className="justify-center"
            wrapperClassName="text-center text-gray-900 dark:text-white"
          />
          <p className="text-base text-gray-600 dark:text-gray-300">{t.mySetupDescription}</p>
        </div>

        <div
          className="flex flex-wrap justify-center gap-3"
          role="list"
          aria-label={t.mySetupDescription}
        >
          {tools.map((tool) => (
            <button
              key={tool}
              onClick={() => handleToolClick(tool)}
              className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 transition-all duration-200 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
              aria-label={`${t.searchFor} ${tool} ${t.onGoogle}`}
              role="listitem"
            >
              <div className="h-5 w-5 shrink-0" aria-hidden="true">
                <TechIcon name={tool} size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
                {tool}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
