/** Pure helpers for garden filtering and shelf persistence. Safe to use in client (no Node deps). */

import {
  GARDEN_SHELF_STORAGE_KEY,
  isGardenShelf,
  type GardenShelf,
} from '@/constants/garden-shelves';

type NoteWithShelf = { shelf: GardenShelf };

/** Filters notes that belong to the given garden shelf. */
export function filterNotesByShelf<T extends NoteWithShelf>(notes: T[], shelf: GardenShelf): T[] {
  return notes.filter((n) => n.shelf === shelf);
}

/** Reads the last selected garden shelf from localStorage, or null if missing/invalid. */
export function readStoredGardenShelf(): GardenShelf | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(GARDEN_SHELF_STORAGE_KEY);
    return isGardenShelf(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Persists the selected garden shelf to localStorage. */
export function writeStoredGardenShelf(shelf: GardenShelf): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(GARDEN_SHELF_STORAGE_KEY, shelf);
  } catch {
    // Ignore quota / private-mode errors
  }
}
