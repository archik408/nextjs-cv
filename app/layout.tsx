import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import { LanguageProvider } from '@/lib/use-language';
import { ThemeProvider } from '@/lib/use-theme';
import './globals.css';

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
    icon: '/floppy.svg',
    shortcut: '/floppy.svg',
    apple: '/floppy.svg',
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
        width: 800,
        height: 600,
        alt: 'Artur Basak Profile Picture',
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
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Design Systems',
      'Web Accessibility',
      'Core Web Vitals',
      'PWA',
      'Node.js',
      'GraphQL',
      'Testing',
      'CI/CD',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PL',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Technological College Educational Institution GRSU',
    },
    nationality: 'Belarus',
    gender: 'Male',
    speaksLanguage: ['English', 'Russian'],
  };
  return (
    <html lang="en">
      <body className={`${rubikFont.className} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
