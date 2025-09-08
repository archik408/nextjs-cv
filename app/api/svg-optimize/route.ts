import { NextRequest, NextResponse } from 'next/server';
import { optimize } from 'svgo';
import { secureHeaders, RateLimiter } from '@/lib/security';

// 20 requests per minute per IP
const rateLimiter = new RateLimiter(60000, 20);

export async function POST(req: NextRequest) {
  try {
    const clientIP =
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!rateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { status: 429, headers: { ...secureHeaders, 'Retry-After': '60' } }
      );
    }

    const body = await req.json().catch(() => null);
    const svg: unknown = body && (body as any).svg;

    if (typeof svg !== 'string' || svg.trim().length === 0) {
      return NextResponse.json(
        { error: 'SVG code is required' },
        { status: 400, headers: secureHeaders }
      );
    }

    const trimmed = svg.trim();
    if (!trimmed.startsWith('<svg') && !trimmed.startsWith('<?xml')) {
      return NextResponse.json(
        { error: 'Invalid SVG format' },
        { status: 400, headers: secureHeaders }
      );
    }

    // Strip any script blocks defensively (SVGO will also remove them)
    const svgWithoutScripts = trimmed.replace(/<script[\s\S]*?<\/script>/gi, '');

    // SVGO v3 valid plugins only
    const result = optimize(svgWithoutScripts, {
      plugins: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
        'removeXMLNS',
        'removeEmptyContainers',
        'removeMetadata',
        'removeTitle',
        'removeDesc',
        'removeStyleElement',
        'removeScripts',
        'removeEmptyAttrs',
        'removeHiddenElems',
        'removeUselessDefs',
        'removeUnusedNS',
        'removeDoctype',
        'removeComments',
        'sortAttrs',
      ],
    });

    if ((result as any).error) {
      return NextResponse.json(
        { error: 'Failed to optimize SVG: ' + (result as any).error },
        { status: 400, headers: secureHeaders }
      );
    }

    const data = (result as any).data as string;
    const originalSize = Buffer.byteLength(svgWithoutScripts, 'utf8');
    const optimizedSize = Buffer.byteLength(data, 'utf8');
    const savings = Math.max(0, originalSize - optimizedSize);
    const savingsPercent = originalSize > 0 ? (savings / originalSize) * 100 : 0;

    return NextResponse.json(
      { optimizedSvg: data, stats: { originalSize, optimizedSize, savings, savingsPercent } },
      { status: 200, headers: secureHeaders }
    );
  } catch (error) {
    console.error('SVG optimization error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: secureHeaders }
    );
  }
}
