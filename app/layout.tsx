import type { Metadata, Viewport } from 'next';
import { Rubik, JetBrains_Mono, Caveat } from 'next/font/google';
import { LanguageProvider } from '@/lib/use-language';
import { ThemeProvider } from '@/lib/use-theme';
import './globals.css';
import { CursorMount } from '@/components/cursor-mount';
import { ViewTransitions } from '@/components/view-transitions';
import { BackToTop } from '@/components/back-to-top';
import { Footer } from '@/components/footer';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SkipLink from '@/components/skip-link';
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE, SITE_URL } from '@/lib/site';
import { createPersonSchema } from '@/components/structured-data';

const rubikFont = Rubik({
  subsets: ['latin'],
});

const jetbrainsMonoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const caveatFont = Caveat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-caveat',
  display: 'swap',
});

// Default to dark; never follow OS prefers-color-scheme. Manual toggle only.
export const viewport: Viewport = {
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: 'Artur Basak', url: 'https://github.com/archik408' }],
  creator: 'Artur Basak',
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/macbook.svg',
    shortcut: '/macbook.svg',
    apple: '/macbook.svg',
  },
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      ru: '/?lang=ru',
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Artur Basak',
    images: [
      {
        url: '/ogp.jpg',
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
    locale: 'en_US',
    alternateLocale: ['ru_RU'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/ogp.jpg'],
    site: '@archik408',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = createPersonSchema();
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Manual theme only: never read prefers-color-scheme / system preference.
                // Default is dark + English; localStorage overrides after a manual switch.
                try {
                  var root = document.documentElement;
                  var theme = null;
                  var lang = null;
                  try {
                    theme = localStorage.getItem('theme');
                    lang = localStorage.getItem('language');
                  } catch (_) {}

                  var isLight = theme === 'light';
                  var meta = document.querySelector('meta[name="color-scheme"]');
                  if (isLight) {
                    root.classList.remove('dark');
                    root.style.backgroundColor = '#ffffff';
                    if (meta) meta.setAttribute('content', 'light');
                  } else {
                    root.classList.add('dark');
                    root.style.backgroundColor = '#0f172a';
                    if (meta) meta.setAttribute('content', 'dark');
                  }

                  if (lang === 'ru' || lang === 'en') {
                    root.lang = lang;
                  } else {
                    root.lang = 'en';
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.backgroundColor = '#0f172a';
                  document.documentElement.lang = 'en';
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${rubikFont.className} ${jetbrainsMonoFont.variable} ${caveatFont.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <SkipLink />
            <ViewTransitions>
              {children}
              <Footer />
              <CursorMount />
              <BackToTop />
            </ViewTransitions>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
