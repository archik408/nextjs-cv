'use client';

import { useId, useState, type FocusEvent } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { useAnimationPreferences } from '@/lib/hooks/use-animation-preferences';
import { OTHER_CERTIFICATES } from '@/constants/other-certificates';

interface OtherCertificatesCarouselProps {
  onOpenCertificate: (title: string, url: string) => void;
}

type CertificateCopy = {
  title: string;
  alt: string;
};

export function OtherCertificatesCarousel({ onOpenCertificate }: OtherCertificatesCarouselProps) {
  const { t } = useLanguage();
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const labelId = useId();
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);

  const itemsCopy = t.otherCertificatesItems as Record<string, CertificateCopy>;
  const autoplayEnabled = shouldAnimate && !prefersReducedMotion;
  const isPaused = !autoplayEnabled || userPaused || hoverPaused || focusPaused;

  const handleFocusLeave = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!event.currentTarget.contains(next)) {
      setFocusPaused(false);
    }
  };

  return (
    <div
      className="mt-8"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      aria-hidden="true"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p
          id={labelId}
          className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed"
        >
          {t.otherCertificatesLabel}
        </p>
        {autoplayEnabled && (
          <button
            type="button"
            onClick={() => setUserPaused((paused) => !paused)}
            className="shrink-0 inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
            aria-pressed={userPaused}
            aria-label={userPaused ? t.otherCertificatesPlay : t.otherCertificatesPause}
          >
            {userPaused ? (
              <Play className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Pause className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <div
        className={
          autoplayEnabled
            ? 'relative overflow-hidden rounded-lg mask-certificates-fade'
            : 'relative overflow-x-auto rounded-lg overscroll-x-contain'
        }
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocusCapture={() => setFocusPaused(true)}
        onBlurCapture={handleFocusLeave}
      >
        <ul
          className={
            autoplayEnabled
              ? 'flex w-max gap-3 py-1 animate-certificates-marquee'
              : 'flex w-max gap-3 py-1'
          }
          style={
            autoplayEnabled ? { animationPlayState: isPaused ? 'paused' : 'running' } : undefined
          }
          role="list"
        >
          {OTHER_CERTIFICATES.map((certificate) => {
            const copy = itemsCopy[certificate.id];
            if (!copy) return null;

            return (
              <li key={certificate.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenCertificate(copy.title, certificate.src)}
                  className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                >
                  <Image
                    src={certificate.src}
                    alt={copy.alt}
                    width={160}
                    height={112}
                    className="h-20 w-auto rounded-md border border-gray-200/80 dark:border-gray-700 object-cover shadow-sm transition-opacity group-hover:opacity-90"
                    sizes="160px"
                    loading="lazy"
                  />
                </button>
              </li>
            );
          })}

          {/* Duplicate track for seamless loop; hidden from assistive tech */}
          {autoplayEnabled &&
            OTHER_CERTIFICATES.map((certificate) => {
              const copy = itemsCopy[certificate.id];
              if (!copy) return null;

              return (
                <li key={`dup-${certificate.id}`} className="shrink-0" aria-hidden="true">
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => onOpenCertificate(copy.title, certificate.src)}
                    className="block rounded-md"
                  >
                    <Image
                      src={certificate.src}
                      alt=""
                      width={160}
                      height={112}
                      className="h-20 w-auto rounded-md border border-gray-200/80 dark:border-gray-700 object-cover shadow-sm"
                      sizes="160px"
                      loading="lazy"
                    />
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
