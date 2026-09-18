/** Pure helpers for garden filtering. Safe to use in client (no Node deps). */

import type { GardenShelf } from '@/constants/garden-shelves';

type NoteWithShelf = { shelf: GardenShelf };

/** Filters notes that belong to the given garden shelf. */
export function filterNotesByShelf<T extends NoteWithShelf>(notes: T[], shelf: GardenShelf): T[] {
  return notes.filter((n) => n.shelf === shelf);
}
