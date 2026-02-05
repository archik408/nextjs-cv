'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Code2, Boxes, Trophy, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { AnimatedSectionTitle } from '@/components/animated-section-title';
import { AnimatedAboutText } from '@/components/animated-about-text';

const Player = dynamic(() => import('@/components/lottie-player'), {
  ssr: false,
});

export function AboutSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const isDesktopRef = useRef(false);

  useEffect(() => {
    // Check current viewport width to determine if we should apply scroll-based scaling
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      isDesktopRef.current = desktop;
    };

    // Initialize desktop state on mount
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    // Adjust Lottie illustration scale based on scroll progress through the section
    const handleScroll = () => {
      if (!isDesktopRef.current || !sectionRef.current || !lottieContainerRef.current) {
        return;
      }

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the section.
      // When the section enters the viewport, gradually increase the scale.
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight))
      );

      // Scale from 0.8 to 1.7 while scrolling through the section
      const newScale = 0.8 + scrollProgress * 0.9;
      setScale(newScale);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <AnimatedSectionTitle
          text={t.about}
          id="main-content"
          className="justify-center md:justify-start"
          wrapperClassName="text-center md:text-left"
        />
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <AnimatedAboutText html={t.aboutText} />
          <div>
            <div className="grid grid-rows-[16rem_16rem] md:grid-rows-[12.5rem_12.5rem] grid-cols-2 gap-4 mb-10 md:mb-15">
              <div className="shimmer-card bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-4 rounded-lg relative overflow-hidden group">
                <Code2 className="w-8 h-8 mb-2 text-blue-400" />
                <h3 className="font-semibold mb-1">{t.cleanCode}</h3>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: t.cleanCodeDesc }}
                />
              </div>
              <div className="shimmer-card bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-4 rounded-lg relative overflow-hidden group">
                <Boxes className="w-8 h-8 mb-2 text-green-400" />
                <h3 className="font-semibold mb-1">{t.components}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.componentsDesc}</p>
              </div>
              <div className="shimmer-card bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-4 rounded-lg relative overflow-hidden group">
                <Trophy className="w-8 h-8 mb-2 text-yellow-400" />
                <h3 className="font-semibold mb-1">{t.bestPractices}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.bestPracticesDesc}</p>
              </div>
              <div className="shimmer-card bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-4 rounded-lg relative overflow-hidden group">
                <BookOpen className="w-8 h-8 mb-2 text-purple-400" />
                <h3 className="font-semibold mb-1">{t.learning}</h3>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: t.learningDesc }}
                />
              </div>
            </div>
            <div
              ref={lottieContainerRef}
              style={{
                transform: isDesktop ? `scale(${scale})` : 'none',
                transformOrigin: 'center center',
                transition: 'transform 0.1s ease-out',
              }}
            >
              <Player
                autoplay
                loop
                src="/lottie.json"
                fallbackSrc="/lottie.png"
                fallbackAlt={t.about}
                style={{ height: '300px', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
