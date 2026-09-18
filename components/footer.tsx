'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/use-language';

const footerLinkClassName =
  'underline hover:no-underline text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200';

const footerSeparator = (
  <span aria-hidden="true" className="text-gray-400 dark:text-gray-500">
    •
  </span>
);

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white px-4 py-8 text-center text-gray-500 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-400">
      <p className="mb-2">{t.copyright}</p>
      <nav
        className="mb-2 flex flex-wrap items-center justify-center gap-2"
        aria-label={t.footerSiteNav}
      >
        <Link className={footerLinkClassName} href="/cv">
          {t.cvPageTitle}
        </Link>
        {footerSeparator}
        <Link className={footerLinkClassName} href="/garden">
          {t.garden}
        </Link>
        {footerSeparator}
        <Link className={footerLinkClassName} href="/blog">
          {t.blog}
        </Link>
        {footerSeparator}
        <Link className={footerLinkClassName} href="/tools">
          {t.toolsAndExperiments}
        </Link>
      </nav>
      <p className="flex flex-wrap items-center justify-center gap-2">
        <a className={footerLinkClassName} href="/accessibility">
          {t.accessibilityTitle}
        </a>
        {footerSeparator}
        <a className={footerLinkClassName} href="/privacy">
          {t.privacyTitle}
        </a>
        {footerSeparator}
        <a className={footerLinkClassName} href="/time-machine">
          {t.timeMachineTitle}
        </a>
        {footerSeparator}
        <a className={footerLinkClassName} href="/sitemap.xml">
          Sitemap
        </a>
        {footerSeparator}
        <a className={footerLinkClassName} href="/llms.txt">
          llms.txt
        </a>
      </p>
    </footer>
  );
}
