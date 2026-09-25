import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/lib/site';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

/** Site-wide Person — brand voice. Formal stack/experience belongs on /cv and the PDF resume. */
export const createPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Artur Basak',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/ogp.jpg`,
  sameAs: [
    'https://github.com/archik408',
    'https://www.linkedin.com/in/arturbasak',
    'https://www.smashingmagazine.com/author/artur-basak',
    'https://arturbasak.artstation.com',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'X5 Tech',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Technological College Educational Institution GRSU',
  },
  nationality: 'Belarus',
});

export const createArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  image?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  url: article.url,
  datePublished: article.publishedTime,
  dateModified: article.modifiedTime || article.publishedTime,
  author: {
    '@type': 'Person',
    name: article.author || 'Artur Basak',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Person',
    name: 'Artur Basak',
    url: SITE_URL,
  },
  image: article.image || `${SITE_URL}/ogp.jpg`,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url,
  },
});

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Artur Basak',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  inLanguage: ['en', 'ru'],
  author: {
    '@type': 'Person',
    name: 'Artur Basak',
    url: SITE_URL,
  },
  about: {
    '@type': 'Person',
    name: 'Artur Basak',
    description: SITE_TITLE,
    url: SITE_URL,
  },
  hasPart: [
    { '@type': 'WebPage', name: 'Digital Garden', url: `${SITE_URL}/garden` },
    { '@type': 'WebPage', name: 'Publications', url: `${SITE_URL}/blog` },
    { '@type': 'WebPage', name: 'Talks', url: `${SITE_URL}/talks` },
    { '@type': 'WebPage', name: 'CV', url: `${SITE_URL}/cv` },
    { '@type': 'WebPage', name: 'Tools', url: `${SITE_URL}/tools` },
    { '@type': 'WebPage', name: 'llms.txt', url: `${SITE_URL}/llms.txt` },
  ],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const createBlogSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Artur Basak Publications',
  description:
    'Technical articles about frontend development, React, TypeScript, and web technologies',
  url: `${SITE_URL}/blog`,
  author: {
    '@type': 'Person',
    name: 'Artur Basak',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Person',
    name: 'Artur Basak',
    url: SITE_URL,
  },
});
