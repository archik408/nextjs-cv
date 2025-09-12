import { NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

async function pickRandomImage(dirRelative?: string): Promise<string | null> {
  try {
    const base = path.join(process.cwd(), 'public', 'image-placeholders');
    const dir = dirRelative ? path.join(base, dirRelative) : base;
    const files = await fs.readdir(dir);
    const candidates = files.filter((f) => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(f));
    if (!candidates.length) return null;
    const file = candidates[Math.floor(Math.random() * candidates.length)];
    const rel = dirRelative ? `${dirRelative.replace(/\\/g, '/')}/` : '';
    return `/image-placeholders/${rel}${file}`;
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
    // If original requested and we have an image, redirect to the asset
    if (useOriginal && src) {
      const redirectUrl = new URL(src, request.url);
      return NextResponse.redirect(redirectUrl);
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
    },
  });
  return res;
}
