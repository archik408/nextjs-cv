'use client';

import Image from 'next/image';
import { Github, Linkedin, NotebookText, Mail, Send } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import ArticleTitle from '@/components/article-title';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <header className="hero-section relative h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/background.avif"
          alt="Background"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>
      <div className="relative z-10 text-center px-4">
        <div className="mb-8 flex justify-center">
          <Image
            src="/avatar.jpeg"
            alt="Artur Basak"
            width={160}
            height={160}
            className="rounded-full border-4 border-blue-500 object-cover"
            priority
          />
        </div>
        <ArticleTitle text={'Artur Basak'} />
        <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">{t.role}</h2>
        <p className="text-lg md:text-base text-gray-600 dark:text-gray-300 mb-8">{t.subtitle}</p>
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/archik408"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/arturbasak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="/blog"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label={t.blog}
          >
            <NotebookText className="w-6 h-6" />
          </a>
          <a
            href="mailto:artur.basak.devingrodno@gmail.com"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Send Email"
          >
            <Mail className="w-6 h-6" />
          </a>
          <a
            href="https://t.me/arturbasak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Telegram"
          >
            <Send className="w-6 h-6" />
          </a>
        </div>
      </div>
    </header>
  );
}
