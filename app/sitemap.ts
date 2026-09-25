import type { MetadataRoute } from 'next';
import { posts } from '@/constants/blog';
import { listGardenNotes } from '@/lib/garden';
import { SITE_URL } from '@/lib/site';

const baseUrl = SITE_URL;

type StaticPage = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const staticPageDefs: StaticPage[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/garden', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/talks', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/cv', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/timeline', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/tools', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/algorithms', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/algorithms/sorting', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/algorithms/sorting/bubble-sort', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/algorithms/sorting/quick-sort', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/algorithms/sorting/insertion-sort', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/algorithms/sorting/selection-sort', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/algorithms/sorting/merge-sort', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/algorithms/sorting/shell-sort', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/algorithms/sorting/heap-sort', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/event-loop', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/react-fiber', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/microbit-connector', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/yandex-alice-skills', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/yandex-hub', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/yandex-witcher', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/ocr', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/braille-converter', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/svg-optimizer', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/image-optimizer', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/image-to-base64', changeFrequency: 'monthly', priority: 0.45 },
  { path: '/image-placeholder', changeFrequency: 'monthly', priority: 0.45 },
  { path: '/hash-generator', changeFrequency: 'monthly', priority: 0.45 },
  { path: '/qr-code-generator', changeFrequency: 'monthly', priority: 0.45 },
  { path: '/code-review-emojis', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/ai-assistant', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/skeleton-detection', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/emotion-analysis', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/speech-recognition', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/accessibility', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/time-machine', changeFrequency: 'yearly', priority: 0.35 },
  { path: '/llms.txt', changeFrequency: 'monthly', priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = staticPageDefs.map((page) => ({
    url: page.path === '/' ? baseUrl : `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Blog posts
  const blogPages = posts
    .filter((post) => !post.href.includes('http')) // Only internal blog posts
    .map((post) => ({
      url: `${baseUrl}${post.href}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }));

  // Digital Garden notes (RU + EN). Paired translations declare honest hreflang alternates.
  const gardenNotes = listGardenNotes().map((note) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${baseUrl}/garden/${note.slug}`,
      lastModified: note.frontmatter.date ? new Date(note.frontmatter.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
    if (note.translationSlug) {
      entry.alternates = {
        languages: {
          [note.locale]: `${baseUrl}/garden/${note.slug}`,
          [note.locale === 'en' ? 'ru' : 'en']: `${baseUrl}/garden/${note.translationSlug}`,
        },
      };
    }
    return entry;
  });

  return [...staticPages, ...blogPages, ...gardenNotes];
}
