import { NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';

/** Keep NFT traces scoped to placeholders only (see next.config outputFileTracing*). */
const PLACEHOLDERS_DIR = path.join(process.cwd(), 'public', 'image-placeholders');

export async function GET() {
  try {
    const dirents = await fs.readdir(/*turbopackIgnore: true*/ PLACEHOLDERS_DIR, {
      withFileTypes: true,
    });
    const directories = dirents.filter((d) => d.isDirectory()).map((d) => d.name);
    const imagesRegex = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

    const valid: string[] = [];
    for (const name of directories) {
      try {
        const files = await fs.readdir(/*turbopackIgnore: true*/ path.join(PLACEHOLDERS_DIR, name));
        if (files.some((f) => imagesRegex.test(f))) valid.push(name);
      } catch {
        // ignore unreadable collection dirs
      }
    }

    const displayNameMap: Record<string, string> = {
      belarus: 'Belarus',
      world: 'World',
    };

    const result = valid.map((name) => ({ value: name, label: displayNameMap[name] || name }));
    return NextResponse.json({ collections: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ collections: [] }, { status: 200 });
  }
}
