/**
 * Digital Garden shelves (tabs). Source of truth for classification.
 * Frontmatter `shelf:` overrides this map when present.
 */
export const GARDEN_SHELVES = ['production', 'thinking', 'kids', 'archive'] as const;

export type GardenShelf = (typeof GARDEN_SHELVES)[number];

export const DEFAULT_GARDEN_SHELF: GardenShelf = 'production';

/** localStorage key for the last selected garden shelf tab */
export const GARDEN_SHELF_STORAGE_KEY = 'garden-shelf';

/** Base slug (without `_en`) → shelf */
export const GARDEN_SHELF_BY_BASE_SLUG: Record<string, GardenShelf> = {
  // Production — engineering cases / platform
  'pwa-recovery-observability': 'production',
  'offline-vs-lazy-loading': 'production',
  'workbox-background-sync': 'production',
  'deeplink-web': 'production',
  'normalize-text-scaling': 'production',
  'ui-kit-design-system-designops': 'production',
  'configuring-application-color-scheme': 'production',
  'view-transitions': 'production',
  'audit-wildberries-a11y': 'production',
  'audit-priorbank-a11y': 'production',
  'audit-a11y-without-wcag': 'production',
  'accessibility-tools-and-quality-gates': 'production',
  'a11y-my-task-crafting': 'production',

  // Thinking — essays + books
  'real-programmers-dont-use-ai': 'thinking',
  'end-of-programming': 'thinking',
  '15-years-in-dev': 'thinking',
  estimation: 'thinking',
  github: 'thinking',
  apple: 'thinking',
  ibm: 'thinking',
  'pragmatic-programmer-book': 'thinking',
  'a11y-ai-future': 'thinking',
  'google-ux-design': 'thinking',

  // Kids Lab
  'vydokh-app': 'kids',
  'alice-microbit': 'kids',
  'microbit-water-sensor': 'kids',
  'umnya-elka-microbit': 'kids',

  // Archive — howto / low product stakes
  'skip-links': 'archive',
  zoom: 'archive',
  braille: 'archive',
  'testing-pyramid': 'archive',
  'tests-developer-should-write': 'archive',
  typescript: 'archive',
  viewport: 'archive',
  'flux-some-things-never-change': 'archive',
  'handwritten-font-loading': 'archive',
};

export function isGardenShelf(value: string | null | undefined): value is GardenShelf {
  return value === 'production' || value === 'thinking' || value === 'kids' || value === 'archive';
}

export function resolveGardenShelf(baseSlug: string, frontmatterShelf?: string): GardenShelf {
  if (isGardenShelf(frontmatterShelf)) {
    return frontmatterShelf;
  }
  return GARDEN_SHELF_BY_BASE_SLUG[baseSlug] ?? 'archive';
}
