'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
  originalElement?: HTMLElement | null;
}

export function ImageLightbox({ isOpen, src, alt, onClose }: ImageLightboxProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus trap - focus on close button
      const closeButton = containerRef.current?.querySelector('button');
      closeButton?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements inside the modal
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // If Shift+Tab on first element, focus last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
        return;
      }

      // If Tab on last element, focus first element
      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
        return;
      }

      // If focus is outside modal, focus first element
      if (!container.contains(document.activeElement)) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    // Prevent focus from leaving modal
    const handleFocusIn = (e: FocusEvent) => {
      if (!container.contains(e.target as Node)) {
        e.preventDefault();
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && src) {
      setIsLoaded(false);
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [isOpen, src]);

  if (!isOpen) return null;

  // Calculate max size with 20% margin (10% on each side)
  const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1200;
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 800;

  // Calculate display size maintaining aspect ratio
  let displayWidth = imageSize.width;
  let displayHeight = imageSize.height;

  // Scale down if image is larger than max dimensions
  if (imageSize.width > maxWidth || imageSize.height > maxHeight) {
    const widthRatio = maxWidth / imageSize.width;
    const heightRatio = maxHeight / imageSize.height;
    const ratio = Math.min(widthRatio, heightRatio);
    displayWidth = imageSize.width * ratio;
    displayHeight = imageSize.height * ratio;
  }

  // Ensure minimum size for very small images (at least 200px on smallest side)
  if (displayWidth > 0 && displayHeight > 0) {
    const minSize = 200;
    const currentMin = Math.min(displayWidth, displayHeight);
    if (currentMin < minSize) {
      const scale = minSize / currentMin;
      displayWidth = displayWidth * scale;
      displayHeight = displayHeight * scale;
      // Re-check max dimensions after scaling
      if (displayWidth > maxWidth || displayHeight > maxHeight) {
        const widthRatio = maxWidth / displayWidth;
        const heightRatio = maxHeight / displayHeight;
        const ratio = Math.min(widthRatio, heightRatio);
        displayWidth = displayWidth * ratio;
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр изображения"
      onClick={(e) => {
        // Close if clicking on backdrop
        if (e.target !== imgRef.current) {
          onClose();
        }
      }}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/70 animate-fade-in" aria-hidden="true" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200 animate-fade-in"
        aria-label="Закрыть просмотр изображения"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image container */}
      <div
        className="relative max-w-[80vw] max-h-[80vh] flex items-center justify-center"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transition:
            'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          style={{
            width: displayWidth > 0 ? `${displayWidth}px` : 'auto',
            height: 'auto',
          }}
          loading="eager"
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
