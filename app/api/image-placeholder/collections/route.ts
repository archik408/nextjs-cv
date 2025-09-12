import { NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';

export async function GET() {
  try {
    const base = path.join(process.cwd(), 'public', 'image-placeholders');
    const dirents = await fs.readdir(base, { withFileTypes: true });
    const directories = dirents.filter((d) => d.isDirectory()).map((d) => d.name);
    const imagesRegex = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

    // Keep only directories that contain at least one image
    const valid: string[] = [];
    for (const name of directories) {
      try {
        const files = await fs.readdir(path.join(base, name));
        if (files.some((f) => imagesRegex.test(f))) valid.push(name);
      } catch {
        // ignore
      }
    }

    // Map to display names for known collections
    const displayNameMap: Record<string, string> = {
      'mortal-kombat': 'Mortal Kombat',
      tmnt: 'Teenage Mutant Ninja Turtles',
    };

    const result = valid.map((name) => ({ value: name, label: displayNameMap[name] || name }));
    return NextResponse.json({ collections: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ collections: [] }, { status: 200 });
  }
}
