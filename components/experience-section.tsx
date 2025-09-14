'use client';

import { useState } from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import Link from 'next/link';

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
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Clock className="w-4 h-4" />
            Timeline
          </Link>
        </div>
        <div className="space-y-6 md:space-y-8">
          {t.experiences.map((experience, index) => {
            const expanded = Boolean(open[index]);
            const total = experience.listDescription.length;
            const visible = expanded
              ? experience.listDescription
              : experience.listDescription.slice(0, previewCount);

            return (
              <article
                key={index}
                className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-lg shadow-sm dark:shadow-none"
              >
                <header className="flex justify-between items-start gap-4 mb-3 md:mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">{experience.role}</h3>
                    {companyUrlMap[experience.company] ? (
                      <a
                        href={companyUrlMap[experience.company]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-900 dark:text-purple-400 hover:underline"
                      >
                        {experience.company}
                      </a>
                    ) : (
                      <p className="text-blue-700 dark:text-blue-400">{experience.company}</p>
                    )}
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {experience.period}
                  </span>
                </header>

                <div aria-controls={`exp-panel-${index}`} className="relative">
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    {visible.map((description: string, descIndex: number) => (
                      <li key={descIndex}>{description}</li>
                    ))}
                  </ul>

                  {!expanded && total > previewCount && (
                    <div className="pointer-events-none absolute -bottom-1 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-800 to-transparent rounded-b-lg" />
                  )}
                </div>

                {total > previewCount && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      className="inline-flex items-center gap-2 text-sm md:text-base text-blue-700 dark:text-blue-400 hover:underline"
                      aria-controls={`exp-panel-${index}`}
                      aria-expanded={expanded}
                    >
                      {expanded ? t.showLess : t.showMore}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
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
