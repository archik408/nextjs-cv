'use client';

import { Award } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';

export function CertificatesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{t.certificates}</h2>
        <div className="grid gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-semibold">{t.diploma}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t.college}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4">
              <Award className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-semibold">Professional Front-End Web Developer</h3>
                <p className="text-gray-600 dark:text-gray-400">W3Cx • 2019</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4">
              <Award className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-xl font-semibold">Foundation of UX Design</h3>
                <p className="text-gray-600 dark:text-gray-400">Google • 2021</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
