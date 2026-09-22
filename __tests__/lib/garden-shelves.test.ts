import {
  DEFAULT_GARDEN_SHELF,
  GARDEN_SHELF_STORAGE_KEY,
  isGardenShelf,
  resolveGardenShelf,
} from '@/constants/garden-shelves';
import { readStoredGardenShelf, writeStoredGardenShelf } from '@/lib/garden-utils';

describe('garden shelves', () => {
  it('defaults to production', () => {
    expect(DEFAULT_GARDEN_SHELF).toBe('production');
  });

  it('resolves known base slugs', () => {
    expect(resolveGardenShelf('workbox-background-sync')).toBe('production');
    expect(resolveGardenShelf('real-programmers-dont-use-ai')).toBe('thinking');
    expect(resolveGardenShelf('alice-microbit')).toBe('kids');
    expect(resolveGardenShelf('skip-links')).toBe('archive');
  });

  it('falls back to archive for unknown slugs', () => {
    expect(resolveGardenShelf('totally-unknown-note')).toBe('archive');
  });

  it('allows frontmatter shelf override', () => {
    expect(resolveGardenShelf('skip-links', 'thinking')).toBe('thinking');
    expect(resolveGardenShelf('alice-microbit', 'not-a-shelf')).toBe('kids');
  });

  it('validates shelf ids', () => {
    expect(isGardenShelf('production')).toBe(true);
    expect(isGardenShelf('lab')).toBe(false);
  });
});

describe('garden shelf localStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns null when nothing is stored', () => {
    expect(readStoredGardenShelf()).toBeNull();
  });

  it('persists and reads a valid shelf', () => {
    writeStoredGardenShelf('kids');
    expect(window.localStorage.getItem(GARDEN_SHELF_STORAGE_KEY)).toBe('kids');
    expect(readStoredGardenShelf()).toBe('kids');
  });

  it('ignores invalid stored values', () => {
    window.localStorage.setItem(GARDEN_SHELF_STORAGE_KEY, 'lab');
    expect(readStoredGardenShelf()).toBeNull();
  });
});
