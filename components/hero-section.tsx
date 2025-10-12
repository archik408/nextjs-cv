'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Github, Linkedin, NotebookText, Mail, Send, Wrench, Sprout } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import ArticleTitle from '@/components/article-title';
import { AVATAR_PLACEHOLDER } from '@/lib/avatar-placeholder';
import Link from 'next/link';
import TypingRotate from '@/components/typing-rotate';

export function HeroSection() {
  const { t, language } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Простой автоматический flip через 1 секунду после загрузки компонента
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);

      setTimeout(() => {
        setIsFlipped(false);
      }, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Обработчики hover
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <header className="hero-section relative h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <Image src="/background.avif" alt="" fill className="object-cover opacity-10" priority />
      </div>
      <div className="relative z-10 text-center px-4">
        <div className="mb-8 flex justify-center">
          <div
            className="group relative w-40 h-40 [perspective:1000px] cursor-pointer"
            onClick={() => setIsFlipped((prev) => !prev)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={t.heroAvatarFlipCard}
            role="button"
          >
            <div
              className={`relative size-full transition-transform duration-700 [transform-style:preserve-3d] 
              custom-gradient-before before:absolute before:-z-10 before:w-full before:h-full before:[left:-50%] before:transform before:translate-x-1/2 before:scale-105 before:rounded-full`}
              style={{
                transform: isFlipped || isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              <Image
                src="/avatar.jpeg"
                alt="Artur Basak"
                fill
                className="absolute inset-0 rounded-full object-cover [backface-visibility:hidden]"
                priority
                placeholder="blur"
                blurDataURL={AVATAR_PLACEHOLDER}
              />
              <Image
                src="/back-bg.jpg"
                alt=""
                fill
                className="absolute inset-0 rounded-full object-cover rotate-y-180 [backface-visibility:hidden]"
                priority
                placeholder="blur"
                blurDataURL={AVATAR_PLACEHOLDER}
              />
            </div>
          </div>
        </div>
        <ArticleTitle text={'Artur Basak'} />
        <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">{t.role}</h2>
        <div className="mb-8 min-h-[3rem] md:min-h-[2.5rem] flex items-center justify-center">
          <p className="text-base md:text-sm text-gray-600 dark:text-gray-300 font-[var(--font-jetbrains-mono)] text-center">
            <TypingRotate
              texts={[t.subtitle]}
              fixedPrefix={
                language === 'en' ? 'Building the Web of Tomorrow, ' : 'Создаю веб будущего, '
              }
              periodMs={2000}
              typingSpeedMs={110}
              deletingSpeedMs={55}
              pauseAfterDeleteMs={2000}
              pauseAfterCompleteMs={3000}
            />
          </p>
        </div>
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/archik408"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            aria-label={t.heroGitHubProfile}
          >
            <Github className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce" />
          </a>
          <a
            href="https://www.linkedin.com/in/arturbasak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            aria-label={t.heroLinkedInProfile}
          >
            <Linkedin className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce" />
          </a>
          <a
            href="https://t.me/arturbasak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            aria-label={t.heroTelegram}
          >
            <Send className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce" />
          </a>
          <Link
            href="/garden"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            aria-label={t.garden}
          >
            <Sprout className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce" />
          </Link>
          <Link
            href="/blog"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            aria-label={t.blog}
          >
            <NotebookText className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce" />
          </Link>
          <Link
            href="/tools"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            aria-label={t.toolsAndExperiments || 'Tools & Experiments'}
          >
            <Wrench className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce" />
          </Link>
          <a
            href="mailto:artur.basak.devingrodno@gmail.com"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            aria-label={t.heroSendEmail}
          >
            <Mail className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce" />
          </a>
        </div>
      </div>
    </header>
  );
}
