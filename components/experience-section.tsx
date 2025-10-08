'use client';

import { useState } from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import Link from 'next/link';
import ArticleTitle from '@/components/article-title';

export function ExperienceSection() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const previewCount = 2;

  const companyUrlMap: Record<string, string> = {
    IntexSoft: 'https://intexsoft.com',
    'Godel Technologies': 'https://www.godeltech.com',
    'Indy (ex-Tispr)': 'https://www.tispr.com',
    'instinctools EE Labs': 'https://www.instinctools.com',
    'IT Academy': 'https://www.it-academy.by',
  };

  const toggle = (idx: number) => setOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <section className="py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{t.experience}</h2>
          <Link
            href="/timeline"
            className="animate-wobble group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Clock className="w-4 h-4 transition-all duration-300" />
            Timeline
          </Link>
        </div>
        <div className="space-y-6 md:space-y-8">
          {t.experiences.map((experience, index) => {
            const expanded = Boolean(open[index]);
            const total = experience.listDescription.length;

            return (
              <article
                key={index}
                className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-lg shadow-sm dark:shadow-none"
              >
                <header className="flex justify-between items-start gap-4 mb-3 md:mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">{experience.role}</h3>
                    {companyUrlMap[experience.company] ? (
                      <a
                        className="block w-fit"
                        href={companyUrlMap[experience.company]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ArticleTitle text={experience.company} small />
                      </a>
                    ) : (
                      <ArticleTitle text={experience.company} small />
                    )}
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {experience.period}
                  </span>
                </header>

                <div id={`exp-panel-${index}`} className="relative">
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expanded ? 'max-h-96' : 'max-h-20'
                    }`}
                  >
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                      {experience.listDescription.map((description: string, descIndex: number) => (
                        <li
                          key={descIndex}
                          className={`transition-all duration-300 ease-in-out ${
                            descIndex < previewCount || expanded
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 -translate-y-2'
                          }`}
                          style={{
                            transitionDelay: expanded ? `${descIndex * 30}ms` : '0ms',
                          }}
                        >
                          {description}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!expanded && total > previewCount && (
                    <div className="pointer-events-none absolute -bottom-1 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-800 to-transparent rounded-b-lg transition-opacity duration-300" />
                  )}
                </div>

                {total > previewCount && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      className="group inline-flex items-center gap-2 text-sm md:text-base text-blue-700 dark:text-blue-400 hover:underline transition-all duration-200"
                      aria-controls={`exp-panel-${index}`}
                      aria-expanded={expanded}
                    >
                      {expanded ? t.showLess : t.showMore}
                      <ChevronDown
                        className={`w-4 h-4 transition-all duration-300 ease-in-out group-hover:animate-bounce ${
                          expanded ? 'rotate-180' : 'mt-0.5 group-hover:mt-2'
                        }`}
                        aria-hidden
                      />
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
