'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { AnimatedSectionTitle } from '@/components/animated-section-title';
import { TalkCard } from '@/components/talk-card';
import { FEATURED_TALK_IDS, TALKS } from '@/constants/talks';

export function TalksSection() {
  const { t } = useLanguage();

  const featured = FEATURED_TALK_IDS.map((id) => TALKS.find((talk) => talk.id === id)).filter(
    (talk): talk is (typeof TALKS)[number] => Boolean(talk)
  );

  return (
    <section id="talks" className="scroll-mt-20 px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <AnimatedSectionTitle
          text={t.talks}
          className="justify-center"
          wrapperClassName="text-center"
        />
        {t.talksDescription ? (
          <p className="mb-8 text-center text-base text-gray-600 dark:text-gray-300">
            {t.talksDescription}
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          {featured.map((talk) => (
            <TalkCard key={talk.id} talk={talk} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/talks"
            className="inline-flex items-center gap-2 text-blue-700 hover:underline dark:text-blue-400"
          >
            <ExternalLink className="h-4 w-4" />
            <span>{t.viewAll}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
