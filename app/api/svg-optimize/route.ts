import { NextRequest, NextResponse } from 'next/server';
// Import svgo dynamically inside the handler in production to avoid bundling issues on Vercel
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
    const safeMode: boolean = Boolean(body && (body as any).safeMode);
    const noOpMode: boolean = Boolean(body && (body as any).noOpMode);

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

    // Load svgo at runtime (avoids css-tree data file resolution issues in some edge runtimes)
    const { optimize } = await import('svgo');

    // SVGO v3 configuration tuned to preserve filters/clipPaths/gradients and foreignObject
    // Key points:
    // - cleanupIds disabled to avoid breaking url(#id) references
    // - removeUnknownsAndDefaults disabled to keep foreignObject and its children
    // - inlineStyles disabled to avoid rewriting CSS like backdrop-filter
    // - removeUselessDefs disabled to prevent accidental removal of referenced <defs>
    const result = optimize(svgWithoutScripts, {
      multipass: true,
      plugins: noOpMode
        ? [
            // No-op mode: keep structure; only strip doctype/comments (scripts removed earlier)
            'removeDoctype',
            'removeComments',
          ]
        : safeMode
          ? [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                    cleanupIds: false,
                    removeUnknownsAndDefaults: false,
                    inlineStyles: false,
                    removeUselessDefs: false,
                    convertPathData: false,
                    mergePaths: false,
                    convertShapeToPath: false,
                    collapseGroups: false,
                    moveElemsAttrsToGroup: false,
                    moveGroupAttrsToElems: false,
                    convertTransform: false,
                    cleanupNumericValues: false,
                    minifyStyles: false,
                    removeHiddenElems: false,
                    removeEmptyAttrs: false,
                    removeUnusedNS: false,
                    sortAttrs: false,
                  },
                },
              },
              'removeScripts',
              'removeDoctype',
              'removeComments',
            ]
          : [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                    cleanupIds: false,
                    removeUnknownsAndDefaults: false,
                    inlineStyles: false,
                    removeUselessDefs: false,
                  },
                },
              },
              // Keep namespace; some consumers rely on xmlns for embedded content
              // 'removeXMLNS',
              'removeMetadata',
              'removeTitle',
              'removeDesc',
              'removeScripts',
              'removeEmptyAttrs',
              'removeHiddenElems',
              // 'removeUselessDefs', // handled above via preset override
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
