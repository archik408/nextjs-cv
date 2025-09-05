import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { posts } from '@/constants/blog';
import { formatDate } from '@/utils/date';

export default function BlogListPage() {
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="py-10 md:py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Все статьи</h1>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <span>На главную</span>
            </Link>
          </div>
        </div>
        <div className="space-y-5">
          {sorted.map((post) => (
            <a
              key={post.href}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={post.image || '/globe.svg'}
                    alt="cover"
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
                    <span>{post.source}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
