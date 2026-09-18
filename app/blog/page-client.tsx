'use client';

import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { posts } from '@/constants/blog';
import { formatDate } from '@/utils/date';
import NavigationButtons from '@/components/navigation-buttons';
import ArticleTitle from '@/components/article-title';
import { useLanguage } from '@/lib/hooks/use-language';

export function BlogPageClient() {
  const { t } = useLanguage();
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-10 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white md:px-8 md:py-20">
      <div className="mx-auto max-w-5xl">
        <NavigationButtons showLanguageSwitcher showThemeSwitcher />
        <div className="mb-8 pt-10 md:pt-4">
          <ArticleTitle text={t.blog} />
        </div>
        <div className="space-y-5">
          {sorted.map((post) => {
            const isExternal = post.href.includes('http');
            return (
              <a
                key={post.href}
                href={post.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="block rounded-lg bg-white p-5 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:shadow-none dark:hover:bg-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={post.image || '/globe.svg'}
                      alt={post.title}
                      fill
                      className="object-contain p-3"
                      sizes="64px"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-1 text-lg font-semibold">{post.title}</h2>
                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(new Date(post.date))}
                    </p>
                    <div className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <ExternalLink className="h-4 w-4" />
                      <span>{post.source}</span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
