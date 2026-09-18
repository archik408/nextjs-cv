'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Send } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import ArticleTitle from '@/components/article-title';
import { AVATAR_PLACEHOLDER } from '@/lib/avatar-placeholder';
import TypingRotate from '@/components/typing-rotate';

export function HeroSection() {
  const { t } = useLanguage();
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
        <Image
          src="/background.avif"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10"
          priority
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-full px-4 text-center md:w-[400px]">
        <div className="mb-8 flex justify-center">
          <div
            className="group relative w-40 h-40 md:w-55 md:h-55 [perspective:1000px]"
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
                src="/avatar.webp"
                alt="Artur Basak"
                fill
                sizes="160px"
                className="absolute inset-0 rounded-full object-cover [backface-visibility:hidden]"
                priority
                placeholder="blur"
                blurDataURL={AVATAR_PLACEHOLDER}
              />
              <Image
                src="/back-bg.webp"
                alt=""
                fill
                sizes="160px"
                className="absolute inset-0 rounded-full object-cover rotate-y-180 [backface-visibility:hidden]"
                priority
                placeholder="blur"
                blurDataURL={AVATAR_PLACEHOLDER}
              />
            </div>
          </div>
        </div>
        <ArticleTitle text={'Artur Basak'} />
        <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 min-h-[2rem] flex items-center justify-center">
          <TypingRotate
            texts={[t.subtitle]}
            periodMs={2000}
            typingSpeedMs={110}
            deletingSpeedMs={55}
            pauseAfterDeleteMs={2000}
            pauseAfterCompleteMs={3000}
          />
        </h2>
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
          <a
            href="mailto:artur.basak.devingrodno@gmail.com"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            aria-label={t.heroSendEmail}
          >
            <Mail className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce" />
          </a>
        </div>
      </div>
      <a
        href="#main-content"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full text-gray-500 transition-colors hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-gray-500"
        aria-label={t.heroScrollDown}
      >
        <span className="hero-scroll-mouse" aria-hidden="true">
          <span className="hero-scroll-wheel" />
        </span>
      </a>
    </header>
  );
}
