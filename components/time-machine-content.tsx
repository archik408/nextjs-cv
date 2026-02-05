'use client';

import { useState, useEffect, useRef } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/hooks/use-language';
import ArticleTitle from '@/components/article-title';
import Image from 'next/image';
import { ImageLightbox } from '@/components/image-lightbox';

interface TimeMachineSnapshot {
  year: number;
  image: string;
  description: string;
}

export function TimeMachineContent() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
    originalElement: HTMLElement | null;
  }>({
    isOpen: false,
    src: '',
    alt: '',
    originalElement: null,
  });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const snapshots: TimeMachineSnapshot[] = [
    {
      year: 2021,
      image: '/time-machine/2021.png',
      description: t.timeMachine2021Description,
    },
    {
      year: 2022,
      image: '/time-machine/2022.png',
      description: t.timeMachine2022Description,
    },
    {
      year: 2023,
      image: '/time-machine/2023.png',
      description: t.timeMachine2023Description,
    },
    {
      year: 2025,
      image: '/time-machine/2025.png',
      description: t.timeMachine2025Description,
    },
  ];

  const currentSnapshot =
    snapshots.find((s) => s.year === selectedYear) || snapshots[snapshots.length - 1];

  useEffect(() => {
    setIsImageLoading(true);
  }, [selectedYear]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageClick = () => {
    const imgElement = imageContainerRef.current?.querySelector('img') as HTMLImageElement | null;
    if (imgElement) {
      setLightboxState({
        isOpen: true,
        src: currentSnapshot.image,
        alt: `${t.timeMachineScreenshot} ${selectedYear}`,
        originalElement: imgElement,
      });
    }
  };

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleImageClick();
    }
  };

  const handleCloseLightbox = () => {
    const originalElement = lightboxState.originalElement;
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
    // Return focus to original image after modal closes
    if (originalElement) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (originalElement && document.contains(originalElement)) {
            try {
              originalElement.focus();
            } catch (error) {
              console.warn('Could not focus on original image:', error);
            }
          }
        }, 100);
      });
    }
  };

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-14 md:py-16">
        <NavigationButtons showLanguageSwitcher showThemeSwitcher />
        <main className="prose-garden max-w-5xl mx-auto">
          <ArticleTitle text={t.timeMachineTitle} />
          <p dangerouslySetInnerHTML={{ __html: t.timeMachineIntro }} />

          {/* Timeline Navigation */}
          <nav className="mb-8" role="tablist" aria-label={t.timeMachineTimelineLabel}>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {snapshots.map((snapshot) => (
                <button
                  key={snapshot.year}
                  role="tab"
                  aria-selected={selectedYear === snapshot.year}
                  aria-controls={`snapshot-${snapshot.year}`}
                  id={`tab-${snapshot.year}`}
                  onClick={() => setSelectedYear(snapshot.year)}
                  className={`
                    px-6 py-3 rounded-lg font-semibold text-lg
                    transition-all duration-300 ease-in-out
                    ${
                      selectedYear === snapshot.year
                        ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {snapshot.year}
                </button>
              ))}
            </div>
          </nav>

          {/* Snapshot Display */}
          <section
            id={`snapshot-${selectedYear}`}
            role="tabpanel"
            aria-labelledby={`tab-${selectedYear}`}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
              <div className="relative aspect-video bg-transparent">
                {isImageLoading && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    role="status"
                    aria-label={t.timeMachineLoading}
                  >
                    <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                    <span className="sr-only">{t.timeMachineLoading}</span>
                  </div>
                )}
                <div
                  ref={imageContainerRef}
                  onClick={handleImageClick}
                  onKeyDown={handleImageKeyDown}
                  role="button"
                  tabIndex={0}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`${t.timeMachineViewFullSize} ${selectedYear}`}
                >
                  <Image
                    src={currentSnapshot.image}
                    alt={`${t.timeMachineScreenshot} ${selectedYear}`}
                    fill
                    className={`object-contain transition-opacity duration-300 ${
                      isImageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={handleImageLoad}
                    priority={selectedYear === 2025}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  />
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {t.timeMachineYear} {selectedYear}
                </h2>
                <p
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentSnapshot.description }}
                />
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxState.isOpen}
        src={lightboxState.src}
        alt={lightboxState.alt}
        onClose={handleCloseLightbox}
        originalElement={lightboxState.originalElement}
      />
    </article>
  );
}
