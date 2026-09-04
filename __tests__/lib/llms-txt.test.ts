import { buildLlmsTxt } from '@/lib/llms-txt';
import { SITE_URL } from '@/lib/site';

describe('buildLlmsTxt', () => {
  it('follows llmstxt.org shape with H1, summary, and absolute links', () => {
    const text = buildLlmsTxt();

    expect(text.startsWith('# Artur Basak\n')).toBe(true);
    expect(text).toContain(`> UI/UX Engineer`);
    expect(text).toContain('## About');
    expect(text).toContain('## Tools & demos');
    expect(text).toContain('## External publications');
    expect(text).toContain('## Optional');
    expect(text).toContain(`[Home / Portfolio](${SITE_URL}/)`);
    expect(text).toContain(`${SITE_URL}/sitemap.xml`);
    expect(text).toContain(`${SITE_URL}/robots.txt`);
    expect(text).toMatch(/\[.+\]\(https:\/\/.+\): .+/);
  });
});
