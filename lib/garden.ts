import fs from 'node:fs';
import path from 'node:path';

export type GardenLocale = 'ru' | 'en';

export type GardenNoteFrontmatter = {
  // ISO date string, e.g. 2025-09-23
  date?: string;
  title: string;
  description?: string;
  tags?: string[];
};

export type GardenNote = {
  slug: string;
  content: string;
  frontmatter: GardenNoteFrontmatter;
  locale: GardenLocale;
  /** Slug of the paired translation, if it exists on disk */
  translationSlug: string | null;
};

const GARDEN_DIR = path.join(process.cwd(), 'content', 'garden');
const EN_SLUG_SUFFIX = '_en';

function ensureGardenDirExists(): void {
  if (!fs.existsSync(GARDEN_DIR)) {
    fs.mkdirSync(GARDEN_DIR, { recursive: true });
  }
}

function readFileAsString(absolutePath: string): string {
  return fs.readFileSync(absolutePath, 'utf8');
}

function parseFrontmatter(raw: string): { frontmatter: GardenNoteFrontmatter; body: string } {
  // Very small frontmatter parser supporting YAML-like key: value and arrays with [a, b]
  // Format:
  // ---\n
  // key: value\n
  // tags: [a, b]\n
  // ---\n
  // content
  const FRONTMATTER_DELIM = '---';
  const trimmed = raw.trimStart();
  if (!trimmed.startsWith(FRONTMATTER_DELIM)) {
    return { frontmatter: { title: 'Untitled' }, body: raw };
  }
  const afterOpen = trimmed.slice(FRONTMATTER_DELIM.length);
  const endIndex = afterOpen.indexOf(`\n${FRONTMATTER_DELIM}`);
  if (endIndex === -1) {
    return { frontmatter: { title: 'Untitled' }, body: raw };
  }
  const fmBlock = afterOpen.slice(0, endIndex).trim();
  const body = afterOpen.slice(endIndex + `\n${FRONTMATTER_DELIM}`.length).trimStart();
  const frontmatter: Record<string, unknown> = {};
  for (const line of fmBlock.split('\n')) {
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    const rawValue = line.slice(sep + 1).trim();
    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      frontmatter[key] = rawValue
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    } else {
      frontmatter[key] = rawValue.replace(/^"|"$/g, '');
    }
  }
  const result: GardenNoteFrontmatter = {
    title:
      typeof frontmatter.title === 'string' && frontmatter.title
        ? (frontmatter.title as string)
        : 'Untitled',
    description:
      typeof frontmatter.description === 'string' ? (frontmatter.description as string) : undefined,
    date: typeof frontmatter.date === 'string' ? (frontmatter.date as string) : undefined,
    tags: Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : undefined,
  };
  return { frontmatter: result, body };
}

export function getGardenLocaleFromSlug(slug: string): GardenLocale {
  return slug.endsWith(EN_SLUG_SUFFIX) ? 'en' : 'ru';
}

export function getGardenBaseSlug(slug: string): string {
  return slug.endsWith(EN_SLUG_SUFFIX) ? slug.slice(0, -EN_SLUG_SUFFIX.length) : slug;
}

export function getGardenPairedSlug(slug: string): string {
  return getGardenLocaleFromSlug(slug) === 'en'
    ? getGardenBaseSlug(slug)
    : `${slug}${EN_SLUG_SUFFIX}`;
}

function noteFileExists(slug: string): boolean {
  return (
    fs.existsSync(path.join(GARDEN_DIR, `${slug}.md`)) ||
    fs.existsSync(path.join(GARDEN_DIR, `${slug}.mdx`))
  );
}

function toGardenNote(slug: string, frontmatter: GardenNoteFrontmatter, body: string): GardenNote {
  const pairedSlug = getGardenPairedSlug(slug);
  return {
    slug,
    content: body,
    frontmatter,
    locale: getGardenLocaleFromSlug(slug),
    translationSlug: noteFileExists(pairedSlug) ? pairedSlug : null,
  };
}

function sortNotesByDateDesc(notes: GardenNote[]): GardenNote[] {
  return notes.sort((a, b) => {
    const aDate = a.frontmatter.date ? Date.parse(a.frontmatter.date) : 0;
    const bDate = b.frontmatter.date ? Date.parse(b.frontmatter.date) : 0;
    if (aDate !== bDate) return bDate - aDate;
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });
}

export type ListGardenNotesOptions = {
  /** Default: all locales (RU + EN). Use for sitemap and static params. */
  locale?: GardenLocale | 'all';
};

export function listGardenNotes(options: ListGardenNotesOptions = {}): GardenNote[] {
  const { locale = 'all' } = options;
  ensureGardenDirExists();
  const files = fs
    .readdirSync(GARDEN_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && (d.name.endsWith('.md') || d.name.endsWith('.mdx')))
    .map((d) => d.name);
  const notes: GardenNote[] = files.map((file) => {
    const absolutePath = path.join(GARDEN_DIR, file);
    const content = readFileAsString(absolutePath);
    const { frontmatter, body } = parseFrontmatter(content);
    const slug = file.replace(/\.(md|mdx)$/i, '');
    return toGardenNote(slug, frontmatter, body);
  });
  const filtered = locale === 'all' ? notes : notes.filter((note) => note.locale === locale);
  return sortNotesByDateDesc(filtered);
}

export function getGardenNoteBySlug(slug: string): GardenNote | null {
  ensureGardenDirExists();
  const candidates = [path.join(GARDEN_DIR, `${slug}.md`), path.join(GARDEN_DIR, `${slug}.mdx`)];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const raw = readFileAsString(candidate);
      const { frontmatter, body } = parseFrontmatter(raw);
      return toGardenNote(slug, frontmatter, body);
    }
  }
  return null;
}

export { getAllTagsFromNotes, filterNotesByTag } from './garden-utils';
