import { posts } from '@/constants/blog';
import { listGardenNotes } from '@/lib/garden';
import { SITE_URL } from '@/lib/site';

type LlmsLink = {
  title: string;
  path: string;
  note: string;
};

const ABOUT: LlmsLink[] = [
  {
    title: 'Home / Portfolio',
    path: '/',
    note: 'Overview of Artur Basak — UI/UX Engineer & Frontend Architect with 15+ years experience',
  },
  {
    title: 'Experience',
    path: '/experience',
    note: 'Full work history across X5 Tech, IntexSoft, Godel, Indy, and earlier roles',
  },
  {
    title: 'Digital Garden',
    path: '/garden',
    note: 'Living notes on accessibility, PWA, design systems, testing, and web engineering (RU + EN)',
  },
  {
    title: 'Publications',
    path: '/blog',
    note: 'Index of articles on Smashing Magazine, Habr, Medium, and Better Programming',
  },
  {
    title: 'Timeline',
    path: '/timeline',
    note: 'Career and web-platform timeline with milestones',
  },
];

const TOOLS: LlmsLink[] = [
  {
    title: 'Tools hub',
    path: '/tools',
    note: 'Catalog of browser tools and experiments',
  },
  {
    title: 'Algorithms hub',
    path: '/algorithms',
    note: 'Interactive sorting algorithms and visualizations',
  },
  {
    title: 'JavaScript Event Loop',
    path: '/event-loop',
    note: 'Animated Call Stack / Web APIs / Task & Microtask queues explanation',
  },
  {
    title: 'OCR',
    path: '/ocr',
    note: 'Client-side image-to-text recognition (RU/EN)',
  },
  {
    title: 'SVG Optimizer',
    path: '/svg-optimizer',
    note: 'Clean and minify SVG markup in the browser',
  },
  {
    title: 'Skeleton Detection',
    path: '/skeleton-detection',
    note: 'On-device pose estimation with MoveNet / WebGPU',
  },
  {
    title: 'Emotion Analysis',
    path: '/emotion-analysis',
    note: 'On-device facial expression detection from the camera',
  },
  {
    title: 'Speech Recognition',
    path: '/speech-recognition',
    note: 'Live speech-to-text via the Web Speech API',
  },
  {
    title: 'Micro:bit Connector',
    path: '/microbit-connector',
    note: 'Web Bluetooth / WebUSB UART control for BBC micro:bit v2',
  },
  {
    title: 'AI Assistant',
    path: '/ai-assistant',
    note: 'Streaming chat UI powered by free AI model backends',
  },
  {
    title: 'Braille Converter',
    path: '/braille-converter',
    note: 'Text ↔ Braille for Russian, Belarusian, and English',
  },
];

const POLICIES: LlmsLink[] = [
  {
    title: 'Accessibility Statement',
    path: '/accessibility',
    note: 'WCAG 2.2 Level AA commitment for this site',
  },
  {
    title: 'Privacy Policy',
    path: '/privacy',
    note: 'What data is collected and how it is handled',
  },
];

function formatLink({ title, path, note }: LlmsLink): string {
  const url = path.startsWith('http') ? path : `${SITE_URL}${path}`;
  return `- [${title}](${url}): ${note}`;
}

function formatExternalPost(post: (typeof posts)[number]): string {
  return `- [${post.title}](${post.href}): ${post.excerpt} (${post.source}, ${post.date})`;
}

/**
 * Builds a curated /llms.txt (llmstxt.org) for AI agents and scrapers.
 * Keep this focused: sitemap.xml lists everything; this file highlights what to read first.
 */
export function buildLlmsTxt(): string {
  const gardenEn = listGardenNotes({ locale: 'en' }).slice(0, 12);
  const externalPosts = posts.filter((post) => post.href.startsWith('http'));

  const sections: string[] = [
    '# Artur Basak',
    '',
    '> UI/UX Engineer & Frontend Architect (Belarus). Portfolio, digital garden, publications, and browser tools at arturbasak.dev. Focus: React/Next.js, TypeScript, accessibility (WCAG), PWAs, design systems, Edge AI demos, and web performance.',
    '',
    'This site is bilingual (English and Russian). Prefer English URLs ending with `_en` for garden notes when available. Structured data uses schema.org Person / WebSite / Article / Blog. Canonical host: https://arturbasak.dev. Full crawl map: https://arturbasak.dev/sitemap.xml. Crawl rules: https://arturbasak.dev/robots.txt.',
    '',
    '## About',
    ...ABOUT.map(formatLink),
    '',
    '## Tools & demos',
    ...TOOLS.map(formatLink),
    '',
    '## Policies',
    ...POLICIES.map(formatLink),
    '',
    '## External publications',
    ...externalPosts.map(formatExternalPost),
    '',
    '## Optional',
    `- [Sitemap](${SITE_URL}/sitemap.xml): Complete URL list for crawlers`,
    `- [robots.txt](${SITE_URL}/robots.txt): Crawl allow/disallow rules`,
    ...gardenEn.map((note) =>
      formatLink({
        title: note.frontmatter.title,
        path: `/garden/${note.slug}`,
        note: note.frontmatter.description || 'Digital garden note (English)',
      })
    ),
    '',
  ];

  return sections.join('\n');
}
