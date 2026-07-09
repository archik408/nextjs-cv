import { MAX_LIVES, WITCHER_SCHOOLS } from './types';
import type { WitcherEncounter, WitcherSchool, WitcherSessionState } from './types';

function normalizeSchool(value: unknown): WitcherSchool | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  return WITCHER_SCHOOLS.find((school) => school === value);
}

function normalizeEncounter(encounter: unknown): WitcherEncounter | undefined {
  if (!encounter || typeof encounter !== 'object') {
    return undefined;
  }

  const candidate = encounter as Partial<WitcherEncounter>;
  if (
    typeof candidate.monsterName !== 'string' ||
    typeof candidate.monsterDescription !== 'string' ||
    typeof candidate.locationName !== 'string' ||
    typeof candidate.locationPhrase !== 'string' ||
    !Array.isArray(candidate.options) ||
    candidate.options.length !== 3 ||
    !candidate.options.every((option) => typeof option === 'string') ||
    typeof candidate.correctOption !== 'string'
  ) {
    return undefined;
  }

  return {
    monsterName: candidate.monsterName,
    monsterDescription: candidate.monsterDescription,
    locationName: candidate.locationName,
    locationPhrase: candidate.locationPhrase,
    options: candidate.options,
    correctOption: candidate.correctOption,
  };
}

export function createInitialWitcherSessionState(): WitcherSessionState {
  return {
    phase: 'choose_school',
    lives: MAX_LIVES,
    victories: 0,
    recentMonsterNames: [],
  };
}

export function normalizeWitcherSessionState(state: unknown): WitcherSessionState {
  if (!state || typeof state !== 'object') {
    return createInitialWitcherSessionState();
  }

  const candidate = state as Partial<WitcherSessionState>;
  const normalizedLives =
    typeof candidate.lives === 'number' && Number.isInteger(candidate.lives)
      ? Math.min(Math.max(candidate.lives, 0), MAX_LIVES)
      : MAX_LIVES;
  const normalizedVictories =
    typeof candidate.victories === 'number' &&
    Number.isInteger(candidate.victories) &&
    candidate.victories >= 0
      ? candidate.victories
      : 0;
  const recentMonsterNames = Array.isArray(candidate.recentMonsterNames)
    ? candidate.recentMonsterNames
        .filter((name): name is string => typeof name === 'string')
        .slice(-10)
    : [];

  const normalizedPhase =
    candidate.phase === 'choose_school' ||
    candidate.phase === 'choose_weapon' ||
    candidate.phase === 'game_over'
      ? candidate.phase
      : 'choose_school';

  return {
    phase: normalizedPhase,
    lives: normalizedLives,
    victories: normalizedVictories,
    selectedSchool: normalizeSchool(candidate.selectedSchool),
    recentMonsterNames,
    encounter: normalizeEncounter(candidate.encounter),
  };
}
