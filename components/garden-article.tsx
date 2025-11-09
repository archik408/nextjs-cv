'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageLightbox } from './image-lightbox';

interface GardenArticleProps {
  htmlContent: string;
}

export function GardenArticle({ htmlContent }: GardenArticleProps) {
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

  const handlersRef = useRef<{
    article: HTMLElement | null;
    handleClick: ((e: MouseEvent) => void) | null;
    handleKeyDown: ((e: KeyboardEvent) => void) | null;
  }>({
    article: null,
    handleClick: null,
    handleKeyDown: null,
  });

  useEffect(() => {
    // Small delay to ensure DOM is ready after dangerouslySetInnerHTML
    const timeoutId = setTimeout(() => {
      // Cleanup old handlers first
      if (
        handlersRef.current.article &&
        handlersRef.current.handleClick &&
        handlersRef.current.handleKeyDown
      ) {
        handlersRef.current.article.removeEventListener('click', handlersRef.current.handleClick);
        handlersRef.current.article.removeEventListener(
          'keydown',
          handlersRef.current.handleKeyDown
        );
      }

      // Find all images in the article
      const article = document.querySelector('.prose-garden') as HTMLElement;
      if (!article) return;

      // Use event delegation for better reliability
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'IMG') return;

        const img = target as HTMLImageElement;
        // Make sure the image is inside our article
        if (!article || !article.contains(img)) return;

        const src = img.src || img.getAttribute('src') || '';
        const alt = img.alt || 'Изображение';

        if (src) {
          setLightboxState((prev) => {
            // Only open if not already open
            if (prev.isOpen) return prev;
            return {
              isOpen: true,
              src,
              alt,
              originalElement: img,
            };
          });
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'IMG') return;

        const img = target as HTMLImageElement;
        // Make sure the image is inside our article
        if (!article || !article.contains(img)) return;

        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const src = img.src || img.getAttribute('src') || '';
          const alt = img.alt || 'Изображение';

          if (src) {
            setLightboxState((prev) => {
              // Only open if not already open
              if (prev.isOpen) return prev;
              return {
                isOpen: true,
                src,
                alt,
                originalElement: img,
              };
            });
          }
        }
      };

      // Store handlers
      handlersRef.current = {
        article,
        handleClick,
        handleKeyDown,
      };

      article.addEventListener('click', handleClick);
      article.addEventListener('keydown', handleKeyDown);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (
        handlersRef.current.article &&
        handlersRef.current.handleClick &&
        handlersRef.current.handleKeyDown
      ) {
        handlersRef.current.article.removeEventListener('click', handlersRef.current.handleClick);
        handlersRef.current.article.removeEventListener(
          'keydown',
          handlersRef.current.handleKeyDown
        );
      }
    };
  }, [htmlContent]);

  const handleClose = () => {
    // Save reference to original element before state update
    const originalElement = lightboxState.originalElement;

    setLightboxState((prev) => ({ ...prev, isOpen: false }));

    // Return focus to original image after modal closes
    if (originalElement) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Check if element still exists and is focusable
          if (originalElement && document.contains(originalElement)) {
            try {
              originalElement.focus();
            } catch (error) {
              // Element might not be focusable, ignore error
              console.warn('Could not focus on original image:', error);
            }
          }
        }, 100);
      });
    }
  };

  return (
    <>
      <article
        className="prose prose-neutral prose-garden dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: htmlContent.replaceAll('<img', '<img role="button" tabIndex="0"'),
        }}
      />
      <ImageLightbox
        isOpen={lightboxState.isOpen}
        src={lightboxState.src}
        alt={lightboxState.alt}
        onClose={handleClose}
        originalElement={lightboxState.originalElement}
      />
    </>
  );
}
