import { buildLlmsTxt } from '@/lib/llms-txt';

export const dynamic = 'force-static';

export function GET(): Response {
  const body = buildLlmsTxt();

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
