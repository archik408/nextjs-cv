'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import Image from 'next/image';
import { CertificateRibbon } from './certificate-ribbon';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  isImage?: boolean;
}

export function CertificateModal({
  isOpen,
  onClose,
  title,
  url,
  isImage = false,
}: CertificateModalProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState<boolean>(!!isImage);

  useEffect(() => {
    setIsLoading(!!isImage);
  }, [url, isImage]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label={t.closeModal}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex items-center justify-center relative">
          {isImage ? (
            <div className="relative w-full h-full max-w-4xl">
              {/* Skeleton */}
              {isLoading && (
                <div className="absolute inset-0 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="animate-pulse w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
                </div>
              )}
              <Image
                src={url}
                alt={title}
                fill
                className={`object-contain rounded ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                priority
                onLoadingComplete={() => setIsLoading(false)}
              />
              {!isLoading && <CertificateRibbon />}
            </div>
          ) : (
            <iframe
              src={url}
              className="w-full h-full border-0 rounded"
              title={title}
              loading="lazy"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          {!isImage && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {t.openInNewTab}
            </a>
          )}
          {isImage && <div></div>}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            {t.closeCertificate}
          </button>
        </div>
      </div>
    </div>
  );
}
