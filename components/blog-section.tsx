'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import { posts } from '@/constants/blog';
import { formatDate } from '@/utils/date';

export function BlogSection() {
  const { t } = useLanguage();

  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const featured = sorted.slice(0, 4);

  return (
    <section className="py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">{t.blog}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((post) => {
            const isExternal = post.href.includes('http');
            return (
              <a
                key={post.href}
                href={post.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={post.image || '/globe.svg'}
                      alt={post.title}
                      fill
                      className="object-contain p-3"
                      sizes="64px"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{post.excerpt}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {formatDate(new Date(post.date))}
                    </p>
                    <div className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <ExternalLink className="w-4 h-4" />
                      <span>
                        {t.readArticle} · {post.source}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
        <div className="mt-6">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{t.viewAll}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
