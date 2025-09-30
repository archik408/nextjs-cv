import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import { LanguageProvider } from '@/lib/use-language';
import { ThemeProvider } from '@/lib/use-theme';
import './globals.css';
import { CursorMount } from '@/components/cursor-mount';
import { ViewTransitions } from '@/components/view-transitions';
import { BackToTop } from '@/components/back-to-top';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const rubikFont = Rubik({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Artur Basak - Frontend Engineer & UI/UX Enthusiast',
  description:
    'Passionate second generation programmer with over a decade of hands-on experience in full-stack web development. Specializing in JavaScript, React, Node.js, and Progressive Web Apps (PWA).',
  keywords:
    'Frontend Developer, React, Next.js, TypeScript, JavaScript, UI/UX, Web Development, PWA',
  authors: [{ name: 'Artur Basak', url: 'https://github.com/archik408' }],
  creator: 'Artur Basak',
  metadataBase: new URL('https://arturbasak.dev'),
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
    title: 'Artur Basak - Frontend Engineer & UI/UX Enthusiast',
    description:
      'Passionate second generation programmer with over a decade of hands-on experience in full-stack web development.',
    url: 'https://arturbasak.dev',
    siteName: 'Artur Basak Portfolio',
    images: [
      {
        url: '/avatar.jpeg',
        width: 1200,
        height: 630,
        alt: 'Artur Basak - Senior Frontend Engineer & UI/UX Enthusiast',
      },
    ],
    locale: 'en_US',
    alternateLocale: ['ru_RU'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artur Basak - Frontend Engineer & UI/UX Enthusiast',
    description:
      'Passionate second generation programmer with over a decade of hands-on experience in full-stack web development.',
    images: ['/avatar.jpeg'],
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Artur Basak',
    jobTitle: 'Senior Frontend Engineer',
    url: 'https://arturbasak.dev',
    image: 'https://arturbasak.dev/avatar.jpeg',
    sameAs: [
      'https://github.com/archik408',
      'https://www.linkedin.com/in/arturbasak',
      'https://www.smashingmagazine.com/author/artur-basak',
      'https://arturbasak.artstation.com',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'IntexSoft',
    },
    knowsAbout: [
      'React',
      'Svelte',
      'Web Components',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Design Systems',
      'Web Accessibility',
      'Core Web Vitals',
      'PWA',
      'Node.js',
      'GraphQL',
      'Automated Testing',
      'CI/CD',
      'UI/UX',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BY',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Technological College Educational Institution GRSU',
    },
    nationality: 'Belarus',
    gender: 'Male',
    speaksLanguage: ['English', 'Belarusian', 'Russian'],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || !theme) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.backgroundColor = '#0f172a';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.backgroundColor = '#ffffff';
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.backgroundColor = '#0f172a';
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${rubikFont.className} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <LanguageProvider>
            <ViewTransitions>
              <main id="main-content" role="main">
                {children}
              </main>
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
