'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Layers, AppWindow, Radar, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { useTheme } from '@/lib/use-theme';
import { AnimatedSectionTitle } from '@/components/animated-section-title';
import { AnimatedAboutText } from '@/components/animated-about-text';
import { ETheme } from '@/constants/enums';

const Player = dynamic(() => import('@/components/lottie-player'), {
  ssr: false,
});

export function AboutSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const isDesktopRef = useRef(false);

  const interestsIntroStyles = useMemo(
    () =>
      theme === ETheme.dark
        ? {
            lineHeight: '1.25',
            backgroundImage:
              'linear-gradient(-90deg, #395171 0, #35c3ff 30%, #a07cfb 50%, #b179bc 70%, #cc7fe0 90%, #fbadc6 100%)',
            backgroundSize: '100%',
            backgroundRepeat: 'repeat',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            MozBackgroundClip: 'text',
            filter: 'drop-shadow(0 0 2rem #000)',
            textShadow: 'none',
          }
        : {
            lineHeight: '1.25',
            backgroundImage:
              'linear-gradient(-90deg,rgb(176, 194, 218) 0, #007cb1 30%, #55389e 50%, #752884 70%, #4e1f5b 90%, #492530 100%)',
            backgroundSize: '100%',
            backgroundRepeat: 'repeat',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            MozBackgroundClip: 'text',
            textShadow: 'none',
          },
    [theme]
  );

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
    <section ref={sectionRef} className="px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <AnimatedSectionTitle
          text={t.about}
          id="main-content"
          className="justify-center md:justify-start"
          wrapperClassName="text-center md:text-left"
        />
        <div className="grid items-start gap-8 md:grid-cols-2">
          <AnimatedAboutText html={t.aboutText} />
          <div>
            <p
              className="mb-4 text-center text-lg font-semibold transition-all ease-in md:text-left md:text-xl"
              style={interestsIntroStyles}
            >
              {t.interestsIntro}
            </p>
            <div className="mb-10 grid grid-cols-2 gap-4 md:mb-15">
              <div className="shimmer-card group relative overflow-hidden rounded-lg bg-white p-4 md:p-8 shadow-md dark:bg-gray-800 dark:shadow-none">
                <Layers className="mb-4 h-8 w-8 text-blue-400" aria-hidden="true" />
                <p
                  className="text-sm text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: t.cleanCodeDesc }}
                />
              </div>
              <div className="shimmer-card group relative overflow-hidden rounded-lg bg-white p-4 md:p-8 shadow-md dark:bg-gray-800 dark:shadow-none">
                <AppWindow className="mb-4 h-8 w-8 text-green-400" aria-hidden="true" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.componentsDesc}</p>
              </div>
              <div className="shimmer-card group relative overflow-hidden rounded-lg bg-white p-4 md:p-8 shadow-md dark:bg-gray-800 dark:shadow-none">
                <Radar className="mb-4 h-8 w-8 text-yellow-400" aria-hidden="true" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.bestPracticesDesc}</p>
              </div>
              <div className="shimmer-card group relative overflow-hidden rounded-lg bg-white p-4 md:p-8 shadow-md dark:bg-gray-800 dark:shadow-none">
                <GraduationCap className="mb-4 h-8 w-8 text-purple-400" aria-hidden="true" />
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
                fallbackSrc="/lottie.webp"
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
