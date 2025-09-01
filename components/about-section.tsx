'use client';

import { Code2, Boxes, Trophy, BookOpen } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useLanguage } from '@/lib/use-language';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{t.about}</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.aboutText }}
          />
          <div>
            <div className="grid grid-rows-[16rem_16rem] md:grid-rows-[12.5rem_12.5rem] grid-cols-2 gap-4 mb-10 md:mb-15">
              <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-4 rounded-lg">
                <Code2 className="w-8 h-8 mb-2 text-blue-400" />
                <h3 className="font-semibold mb-1">{t.cleanCode}</h3>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: t.cleanCodeDesc }}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-4 rounded-lg">
                <Boxes className="w-8 h-8 mb-2 text-green-400" />
                <h3 className="font-semibold mb-1">{t.components}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.componentsDesc}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-4 rounded-lg">
                <Trophy className="w-8 h-8 mb-2 text-yellow-400" />
                <h3 className="font-semibold mb-1">{t.bestPractices}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.bestPracticesDesc}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-4 rounded-lg">
                <BookOpen className="w-8 h-8 mb-2 text-purple-400" />
                <h3 className="font-semibold mb-1">{t.learning}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.learningDesc}</p>
              </div>
            </div>
            <Player autoplay loop src="/lottie.json" style={{ height: '300px', width: '100%' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
