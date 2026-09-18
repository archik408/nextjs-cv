'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, NotebookText } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { posts } from '@/constants/blog';
import { FEATURED_PUBLICATION_HREFS } from '@/constants/featured-thinking';
import { formatDate } from '@/utils/date';
import { AnimatedSectionTitle } from '@/components/animated-section-title';
import { TiltCard } from '@/components/tilt-card';

const cardClassName =
  'rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20';

export function BlogSection() {
  const { t } = useLanguage();

  const featured = FEATURED_PUBLICATION_HREFS.map((href) =>
    posts.find((post) => post.href === href)
  ).filter((post): post is (typeof posts)[number] => Boolean(post));

  return (
    <section className="px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <AnimatedSectionTitle
          text={t.blog}
          className="justify-center"
          wrapperClassName="text-center"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {featured.map((post) => {
            const isExternal = post.href.includes('http');
            const content = (
              <>
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-5"
                  aria-hidden="true"
                />
                <div
                  className="absolute top-2 right-2 opacity-15 transition-opacity duration-300 group-hover:opacity-25"
                  aria-hidden="true"
                >
                  <NotebookText size={120} className="text-blue-500/40 dark:text-blue-400/40" />
                </div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="relative z-20 flex h-12 w-12 items-center justify-center rounded-lg border border-white/30 bg-white/20 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-[0_14px_28px_-6px_rgba(0,0,0,0.55)] dark:border-white/20 dark:bg-white/10 dark:group-hover:bg-white/15 dark:group-hover:shadow-[0_16px_32px_-4px_rgba(0,0,0,0.85)]">
                      <div className="relative h-8 w-8 overflow-hidden transition-transform duration-300 group-hover:scale-110">
                        <Image
                          src={post.image || '/globe.svg'}
                          alt=""
                          fill
                          className="object-contain"
                          sizes="32px"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                    {post.title}
                  </h3>
                  <p className="mb-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                    {post.excerpt}
                  </p>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(new Date(post.date))}
                  </p>
                  <div className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <ExternalLink className="h-4 w-4" />
                    <span>
                      {t.readArticle} · {post.source}
                    </span>
                  </div>
                </div>
              </>
            );

            if (isExternal) {
              return (
                <TiltCard
                  key={post.href}
                  as="a"
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {content}
                </TiltCard>
              );
            }

            return (
              <TiltCard key={post.href} as={Link} href={post.href} className={cardClassName}>
                {content}
              </TiltCard>
            );
          })}
        </div>
        <div className="mt-6 text-center md:text-left">
          <Link
            href="/blog"
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
