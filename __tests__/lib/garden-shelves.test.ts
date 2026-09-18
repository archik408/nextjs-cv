import {
  DEFAULT_GARDEN_SHELF,
  isGardenShelf,
  resolveGardenShelf,
} from '@/constants/garden-shelves';

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
