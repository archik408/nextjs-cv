'use client';

import { useLanguage } from '@/lib/use-language';

export function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{t.experience}</h2>
        <div className="space-y-8">
          {t.experiences.map((experience, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-none"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{experience.role}</h3>
                  <p className="text-blue-700 dark:text-blue-400">{experience.company}</p>
                </div>
                <span className="text-gray-500 dark:text-gray-400">{experience.period}</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                {experience.listDescription.map((description, descIndex) => (
                  <li key={descIndex}>{description}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
