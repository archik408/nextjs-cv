/** Pure helpers for tags/filtering. Safe to use in client (no Node deps). */

type NoteWithTags = { frontmatter: { tags?: string[] } };

/** Returns unique tags from notes, sorted alphabetically. */
export function getAllTagsFromNotes<T extends NoteWithTags>(notes: T[]): string[] {
  const set = new Set<string>();
  for (const note of notes) {
    for (const tag of note.frontmatter.tags ?? []) {
      if (tag.trim()) set.add(tag.trim());
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Filters notes that have the given tag (case-sensitive). */
export function filterNotesByTag<T extends NoteWithTags>(notes: T[], tag: string): T[] {
  return notes.filter((n) => n.frontmatter.tags && n.frontmatter.tags.includes(tag));
}
