import type { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  locale?: 'en' | 'ru';
}

const baseUrl = 'https://arturbasak.dev';
const defaultImage = '/avatar.jpeg';

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    path = '',
    image = defaultImage,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'Artur Basak',
    locale = 'en',
  } = config;

  const url = `${baseUrl}${path}`;
  const fullTitle = path ? `${title} | Artur Basak` : title;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: author, url: 'https://github.com/archik408' }],
    creator: author,
    publisher: author,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: {
        en: locale === 'en' ? url : `${url}?lang=en`,
        ru: locale === 'ru' ? url : `${url}?lang=ru`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Artur Basak Portfolio',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: locale === 'en' ? 'en_US' : 'ru_RU',
      alternateLocale: locale === 'en' ? 'ru_RU' : 'en_US',
      type,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      site: '@archik408',
      creator: '@archik408',
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

  return metadata;
}

// Предустановленные конфигурации для основных страниц
export const seoConfigs = {
  home: {
    title: 'Artur Basak - Senior Frontend Engineer & UI/UX Enthusiast',
    description:
      'Passionate second generation programmer with over a decade of hands-on experience in full-stack web development. Specializing in React, TypeScript, Next.js, and Progressive Web Apps.',
    keywords:
      'Frontend Developer, React, Next.js, TypeScript, JavaScript, UI/UX, Web Development, PWA, Senior Engineer, Full Stack',
  },
  blog: {
    title: 'Publications - Articles about Frontend Development',
    description:
      'Technical articles about frontend development, React, TypeScript, web performance, and modern web technologies by Artur Basak.',
    keywords:
      'Frontend Publications, React Articles, TypeScript Tutorials, Web Development, JavaScript, Technical Writing',
    path: '/blog',
  },
  tools: {
    title: 'Tools & Experiments - Developer Utilities',
    description:
      'Collection of useful developer tools and experiments including OCR text recognition, algorithms implementation, and various utilities for web development.',
    keywords:
      'Developer Tools, OCR, Text Recognition, Algorithms, Web Utilities, Programming Tools',
    path: '/tools',
  },
  algorithms: {
    title: 'Algorithms & Data Structures Implementation',
    description:
      'Collection of algorithm implementations and data structure solutions from competitive programming practice. Examples include sorting algorithms, tree algorithms, and graph algorithms.',
    keywords:
      'Algorithms, Data Structures, Programming, Competitive Programming, Sorting, Trees, Graphs, JavaScript',
    path: '/algorithms',
  },
  ocr: {
    title: 'OCR - Image Text Recognition Tool',
    description:
      'Extract text from images with support for Russian, English, and digits using advanced OCR technology. Upload an image and get accurate text recognition results.',
    keywords:
      'OCR, Text Recognition, Image to Text, Russian OCR, English OCR, Tesseract, Image Processing',
    path: '/ocr',
  },
  svgOptimizer: {
    title: 'SVG Optimizer - Clean and Optimize SVG Code',
    description:
      'Optimize your SVG code by removing unnecessary attributes, empty groups, and metadata. Reduce file size and improve performance.',
    keywords: 'SVG, optimization, clean, minify, performance, web development',
    path: '/svg-optimizer',
    type: 'website',
    locale: 'en',
  },
  eventLoop: {
    title: 'JavaScript Event Loop Visualization',
    description:
      'Animated visual explanation of the JS runtime: Call Stack, Web APIs, Task Queue and Microtask Queue with examples like fetch and setTimeout.',
    keywords:
      'JavaScript, Event Loop, Call Stack, Microtask Queue, Task Queue, Web APIs, setTimeout, fetch, setInterval, IndexedDB',
    path: '/event-loop',
  },
} as const;
