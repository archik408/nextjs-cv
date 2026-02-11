interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

// Предустановленные схемы
export const createPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Artur Basak',
  jobTitle: 'T-Shaped Web Engineer | 15+ Yrs',
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
    'HTML',
    'CSS',
    'TypeScript',
    'JavaScript',
    'Next.js',
    'Web Accessibility',
    'Web Security',
    'Web Development',
    'Frontend Architecture',
    'UI/UX Design',
    'PWA',
    'Web Performance',
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Technological College Educational Institution GRSU',
  },
  nationality: 'Belarus',
  speaksLanguage: ['English', 'Russian', 'Belarusian'],
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
    url: 'https://arturbasak.dev',
  },
  publisher: {
    '@type': 'Person',
    name: 'Artur Basak',
    url: 'https://arturbasak.dev',
  },
  image: article.image || 'https://arturbasak.dev/avatar.jpeg',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url,
  },
});

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Artur Basak Portfolio',
  description: 'T-Shaped Web Engineer portfolio and publications',
  url: 'https://arturbasak.dev',
  author: {
    '@type': 'Person',
    name: 'Artur Basak',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://arturbasak.dev/blog?q={search_term_string}',
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
  url: 'https://arturbasak.dev/blog',
  author: {
    '@type': 'Person',
    name: 'Artur Basak',
    url: 'https://arturbasak.dev',
  },
  publisher: {
    '@type': 'Person',
    name: 'Artur Basak',
    url: 'https://arturbasak.dev',
  },
});
