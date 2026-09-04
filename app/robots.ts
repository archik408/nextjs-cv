import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Crawl policy for search engines and AI agents.
 * Search/citation bots and training bots are allowed; only /api/ is blocked.
 * Curated AI overview: /llms.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // OpenAI — ChatGPT search + browsing + training
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: ['/api/'] },
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/'] },
      // Anthropic — Claude search + browsing + training
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Claude-User', allow: '/', disallow: ['/api/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/'] },
      // Perplexity
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Perplexity-User', allow: '/', disallow: ['/api/'] },
      // Google Gemini / AI features training token
      { userAgent: 'Google-Extended', allow: '/', disallow: ['/api/'] },
      // Apple, Meta, Common Crawl, ByteDance, Amazon
      { userAgent: 'Applebot-Extended', allow: '/', disallow: ['/api/'] },
      { userAgent: 'meta-externalagent', allow: '/', disallow: ['/api/'] },
      { userAgent: 'CCBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Bytespider', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Amazonbot', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
