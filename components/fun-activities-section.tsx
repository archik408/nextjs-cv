'use client';

import Image from 'next/image';
import { Palette, Users, Bike } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';

export function FunActivitiesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-20 px-4 md:px-8 bg-gray-100/50 dark:bg-gray-800/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{t.funActivities}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <a
            href="https://arturbasak.artstation.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-700 p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <Palette className="w-8 h-8 text-pink-400" />
              <h3 className="text-xl font-semibold">{t.artTitle}</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{t.artDesc}</p>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/book1.png"
                alt="Cover of book with author illustrations"
                width={200}
                height={300}
                priority={false}
                className="rounded-lg object-cover"
              />
              <Image
                src="/book2.png"
                alt="Cover of book with author illustrations"
                width={200}
                height={300}
                priority={false}
                className="rounded-lg object-cover"
              />
              <Image
                src="/artur-basak-vaukalak.jpg"
                alt="Author illustration example"
                width={200}
                height={200}
                priority={false}
                className="rounded-lg object-cover"
              />
              <Image
                src="/artur-basak-rusalim.jpg"
                alt="Author illustration example"
                width={200}
                height={200}
                priority={false}
                className="rounded-lg object-cover"
              />
            </div>
          </a>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Users className="w-8 h-8 text-orange-400" />
              <h3 className="text-xl font-semibold">{t.kidsTitle}</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{t.kidsDesc}</p>
            <Image
              src="/scratch.jpg"
              alt="Kids Programming"
              width={400}
              height={300}
              priority={false}
              className="rounded-lg w-full object-cover"
            />
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Bike className="w-8 h-8 text-green-500" />
              <h3 className="text-xl font-semibold">{t.cycleTitle}</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{t.cycleDesc}</p>
            <div className="relative w-full aspect-[1.9/2] rounded-lg overflow-hidden">
              <Image
                src="/cycling.jpg"
                alt="Cycling family trip"
                width={400}
                height={300}
                className="rounded-lg w-full object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
