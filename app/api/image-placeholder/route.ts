import { NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';

/** Only this directory is read at runtime — keep NFT traces off the rest of public/. */
const PLACEHOLDERS_DIR = path.join(process.cwd(), 'public', 'image-placeholders');

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function resolveUnderPlaceholders(...segments: string[]): string | null {
  const resolvedBase = path.resolve(PLACEHOLDERS_DIR);
  const candidate = path.resolve(path.join(PLACEHOLDERS_DIR, ...segments));
  if (candidate !== resolvedBase && !candidate.startsWith(resolvedBase + path.sep)) {
    return null;
  }
  return candidate;
}

function grayBoxSvg(w: number, h: number, label: string): string {
  const bg = '#e5e7eb';
  const fg = '#374151';
  const fontSize = Math.max(12, Math.round(Math.min(w, h) / 8));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${fontSize}" fill="${fg}">${label}</text>
</svg>`;
}

async function pickRandomImage(
  dirRelative?: string
): Promise<{ urlPath: string; absolutePath: string } | null> {
  try {
    const safeSegment = dirRelative && /^[a-z0-9_-]+$/i.test(dirRelative) ? dirRelative : '';
    const dir = resolveUnderPlaceholders(...(safeSegment ? [safeSegment] : []));
    if (!dir) return null;

    // Scoped under public/image-placeholders; ignore keeps NFT off the rest of public/
    const files = await fs.readdir(/*turbopackIgnore: true*/ dir);
    const candidates = files.filter((f) => IMAGE_EXT.test(f));
    if (!candidates.length) return null;

    const file = candidates[Math.floor(Math.random() * candidates.length)];
    const absolutePath = resolveUnderPlaceholders(...(safeSegment ? [safeSegment, file] : [file]));
    if (!absolutePath) return null;

    const rel = safeSegment ? `${encodeURIComponent(safeSegment)}/` : '';
    return {
      urlPath: `/image-placeholders/${rel}${encodeURIComponent(file)}`,
      absolutePath,
    };
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
  const collection = rawCollection && /^[a-z0-9_-]+$/i.test(rawCollection) ? rawCollection : '';
  const useOriginal = /^(1|true|yes|on)$/i.test(String(searchParams.get('original') ?? '0'));

  let svg: string;
  if (!showIllustration) {
    svg = grayBoxSvg(w, h, `${w}×${h}`);
  } else {
    const picked = await pickRandomImage(collection || undefined);

    if (useOriginal && picked) {
      try {
        const data = await fs.readFile(/*turbopackIgnore: true*/ picked.absolutePath);
        const ext = path.extname(picked.absolutePath).toLowerCase();
        const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
        const arrayBuffer = new ArrayBuffer(data.byteLength);
        new Uint8Array(arrayBuffer).set(data);
        return new NextResponse(arrayBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
            'Cross-Origin-Resource-Policy': 'cross-origin',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
          },
        });
      } catch {
        // fall through to gray box if reading failed
      }
    }

    if (!picked) {
      svg = grayBoxSvg(w, h, 'No images');
    } else {
      try {
        const data = await fs.readFile(/*turbopackIgnore: true*/ picked.absolutePath);
        const ext = path.extname(picked.absolutePath).toLowerCase();
        const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
        const dataUri = `data:${contentType};base64,${data.toString('base64')}`;

        svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <clipPath id="clip"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath>
  </defs>
  <image href="${dataUri}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip)"/>
</svg>`;
      } catch {
        svg = grayBoxSvg(w, h, 'Image load failed');
      }
    }
  }

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
