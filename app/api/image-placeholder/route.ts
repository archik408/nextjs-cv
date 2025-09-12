import { NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

async function pickRandomImage(dirRelative?: string): Promise<string | null> {
  try {
    const base = path.join(process.cwd(), 'public', 'image-placeholders');
    // Allow only safe directory names (defense-in-depth in case caller forgets to sanitize)
    const safeSegment = dirRelative && /^[a-z0-9_-]+$/i.test(dirRelative) ? dirRelative : '';
    const dir = safeSegment ? path.join(base, safeSegment) : base;
    const resolvedBase = path.resolve(base);
    const resolvedDir = path.resolve(dir);
    if (resolvedDir !== resolvedBase && !resolvedDir.startsWith(resolvedBase + path.sep)) {
      return null;
    }
    const files = await fs.readdir(resolvedDir);
    const candidates = files.filter((f) => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(f));
    if (!candidates.length) return null;
    const file = candidates[Math.floor(Math.random() * candidates.length)];
    const rel = safeSegment ? `${encodeURIComponent(safeSegment)}/` : '';
    return `/image-placeholders/${rel}${encodeURIComponent(file)}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const w = clamp(Number(searchParams.get('width') || searchParams.get('w') || 400), 1, 4000);
  const h = clamp(Number(searchParams.get('height') || searchParams.get('h') || w), 1, 4000);
  const showIllustration = /^(1|true|yes|on)$/i.test(
    String(searchParams.get('illustration') ?? '1')
  );
  const rawCollection = String(searchParams.get('collection') ?? '').trim();
  // sanitize collection path: allow letters, numbers, dash and underscore only
  const collection = rawCollection && /^[a-z0-9_-]+$/i.test(rawCollection) ? rawCollection : '';
  const useOriginal = /^(1|true|yes|on)$/i.test(String(searchParams.get('original') ?? '0'));

  // Build SVG content
  let svg: string;
  if (!showIllustration) {
    // Gray box with size text
    const bg = '#e5e7eb'; // gray-200
    const fg = '#374151'; // gray-700
    const fontSize = Math.max(12, Math.round(Math.min(w, h) / 8));
    svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${fontSize}" fill="${fg}">${w}×${h}</text>
</svg>`;
  } else {
    const src = (await pickRandomImage(collection || undefined)) ?? '';
    // If original requested and we have an image, stream the file directly (avoid redirect/CORP issues)
    if (useOriginal && src) {
      try {
        const publicDir = path.join(process.cwd(), 'public');
        const filePathUnsafe = path.join(publicDir, src.replace(/^\//, ''));
        const filePath = path.resolve(filePathUnsafe);
        const resolvedPublic = path.resolve(publicDir);
        if (!filePath.startsWith(resolvedPublic + path.sep)) {
          throw new Error('Path traversal detected');
        }
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const typeMap: Record<string, string> = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.webp': 'image/webp',
          '.gif': 'image/gif',
          '.avif': 'image/avif',
          '.svg': 'image/svg+xml',
        };
        const contentType = typeMap[ext] || 'application/octet-stream';
        // Copy Buffer into a new ArrayBuffer (avoids SharedArrayBuffer typing issues)
        const arrayBuffer = new ArrayBuffer(data.byteLength);
        new Uint8Array(arrayBuffer).set(data);
        return new NextResponse(arrayBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
            // Allow embedding this resource across origins (overrides global CORP same-origin)
            'Cross-Origin-Resource-Policy': 'cross-origin',
            // Basic CORS for image fetches
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
          },
        });
      } catch {
        // fall through to gray box if reading failed
      }
    }
    // If no images found, fallback to gray box text
    if (!src) {
      const bg = '#e5e7eb';
      const fg = '#374151';
      const fontSize = Math.max(12, Math.round(Math.min(w, h) / 8));
      svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${fontSize}" fill="${fg}">No images</text>
</svg>`;
    } else {
      // Use pure SVG <image> element (better CSP compatibility than foreignObject)
      svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <clipPath id="clip"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath>
  </defs>
  <image href="${src}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip)"/>
</svg>`;
    }
  }

  const res = new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
  return res;
}
