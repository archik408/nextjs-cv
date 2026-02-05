'use client';

import { useState } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { CertificateModal } from './certificate-modal';
import { AnimatedSectionTitle } from '@/components/animated-section-title';

export function CertificatesSection() {
  const { t } = useLanguage();
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    isImage: boolean;
  }>({
    isOpen: false,
    title: '',
    url: '',
    isImage: false,
  });

  const openCertificate = (title: string, url: string, isImage: boolean = false) => {
    setModalData({
      isOpen: true,
      title,
      url,
      isImage,
    });
  };

  const closeCertificate = () => {
    setModalData({
      isOpen: false,
      title: '',
      url: '',
      isImage: false,
    });
  };

  return (
    <section className="py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <AnimatedSectionTitle
          text={t.certificates}
          className="justify-center md:justify-start"
          wrapperClassName="text-center"
        />
        <div className="grid gap-6">
          <div className="bg-white dark:bg-gray-900/40 p-6 rounded-lg shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4">
              <Award className="min-w-8 w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-semibold">{t.diploma}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t.college}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900/40 p-6 rounded-lg shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Award className="min-w-8 w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-semibold">Professional Front-End Web Developer</h3>
                  <p className="text-gray-600 dark:text-gray-400">W3Cx • 2019</p>
                </div>
              </div>
              <button
                onClick={() =>
                  openCertificate(
                    'W3Cx Professional Front-End Web Developer Certificate',
                    '/certificates/w3cx-professional-frontend.png',
                    true
                  )
                }
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-lg transition-colors"
                aria-label={t.viewCertificate}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="inline">{t.viewCertificate}</span>
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900/40 p-6 rounded-lg shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Award className="min-w-8 w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-xl font-semibold">Professional Google UX Design</h3>
                  <p className="text-gray-600 dark:text-gray-400">Coursera • 2025</p>
                </div>
              </div>
              <button
                onClick={() =>
                  openCertificate(
                    'Google UX Design Professional Certificate',
                    '/certificates/google-ux-design.png',
                    true
                  )
                }
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-lg transition-colors"
                aria-label={t.viewCertificate}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="inline">{t.viewCertificate}</span>
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900/40 p-6 rounded-lg shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Award className="min-w-8 w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-xl font-semibold">Web Accessibility</h3>
                  <p className="text-gray-600 dark:text-gray-400">W3Cx WAI0.1x • 2021</p>
                </div>
              </div>
              <button
                onClick={() =>
                  openCertificate(
                    'W3Cx WAI0.1x Certificate - Introduction to Web Accessibility',
                    '/certificates/w3cx-wai-accessibility.png',
                    true
                  )
                }
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-lg transition-colors"
                aria-label={t.viewCertificate}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="inline">{t.viewCertificate}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CertificateModal
        isOpen={modalData.isOpen}
        onClose={closeCertificate}
        title={modalData.title}
        url={modalData.url}
        isImage={modalData.isImage}
      />
    </section>
  );
}
