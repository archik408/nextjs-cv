import { NextResponse } from 'next/server';
import { listGardenNotes } from '@/lib/garden';

const SITE_URL = 'https://arturbasak.dev';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET() {
  const notes = listGardenNotes();

  const latestDate =
    notes.reduce<Date | null>((latest, note) => {
      if (!note.frontmatter.date) return latest;
      const current = new Date(note.frontmatter.date);
      if (Number.isNaN(current.getTime())) return latest;
      if (!latest || current > latest) return current;
      return latest;
    }, null) ?? new Date();

  const itemsXml = notes
    .map((note) => {
      const title = escapeXml(note.frontmatter.title);
      const description = escapeXml(
        note.frontmatter.description ??
          (note.content ? `${note.content.slice(0, 240)}…` : 'Заметка из Digital Garden')
      );
      const link = `${SITE_URL}/garden/${note.slug}`;
      const pubDate = note.frontmatter.date
        ? new Date(note.frontmatter.date).toUTCString()
        : latestDate.toUTCString();

      return [
        '<item>',
        `<title>${title}</title>`,
        `<link>${link}</link>`,
        `<guid>${link}</guid>`,
        `<description>${description}</description>`,
        `<pubDate>${pubDate}</pubDate>`,
        '</item>',
      ].join('');
    })
    .join('');

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    `<title>Digital Garden — arturbasak.dev</title>`,
    `<link>${SITE_URL}/garden</link>`,
    '<description>Заметки, идеи и черновики Digital Garden (на русском языке).</description>',
    '<language>ru-RU</language>',
    `<lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>`,
    itemsXml,
    '</channel>',
    '</rss>',
  ].join('');

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
    },
  });
}
