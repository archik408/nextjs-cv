'use client';

import { useLanguage } from '@/lib/use-language';
import { TechIcon } from './tech-icon';

const tools = [
  'MacOS',
  'M4 Pro',
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
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.mySetup}</h2>
          <p className="text-base text-gray-600 dark:text-gray-300">{t.mySetupDescription}</p>
        </div>

        {/* Minimalist tool grid */}
        <div
          className="flex flex-wrap justify-center gap-3"
          role="list"
          aria-label={t.mySetupDescription}
        >
          {tools.map((tool) => (
            <button
              key={tool}
              onClick={() => handleToolClick(tool)}
              className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200"
              aria-label={`${t.searchFor} ${tool} ${t.onGoogle}`}
              role="listitem"
            >
              <div className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                <TechIcon name={tool} size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {tool}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
