import {
  BONUS_ARTIFACTS_REQUIRED,
  MAX_LIVES,
  MAX_LIVES_LIMIT,
  RECENT_MONSTERS_WINDOW,
  REWARDS_HISTORY_LIMIT,
  WITCHER_SCHOOLS,
} from './types';
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
    unbeatable: candidate.unbeatable === true,
  };
}

export function createInitialWitcherSessionState(): WitcherSessionState {
  return {
    phase: 'choose_school',
    lives: MAX_LIVES,
    victories: 0,
    recentMonsterNames: [],
    collectedRewards: [],
    artifactsCount: 0,
  };
}

export function normalizeWitcherSessionState(state: unknown): WitcherSessionState {
  if (!state || typeof state !== 'object') {
    return createInitialWitcherSessionState();
  }

  const candidate = state as Partial<WitcherSessionState>;
  const normalizedLives =
    typeof candidate.lives === 'number' && Number.isInteger(candidate.lives)
      ? Math.min(Math.max(candidate.lives, 0), MAX_LIVES_LIMIT)
      : MAX_LIVES;
  const normalizedVictories =
    typeof candidate.victories === 'number' &&
    Number.isInteger(candidate.victories) &&
    candidate.victories >= 0
      ? candidate.victories
      : 0;
  // A full streak of 10 never persists: it converts into a bonus life immediately.
  const normalizedArtifactsCount =
    typeof candidate.artifactsCount === 'number' &&
    Number.isInteger(candidate.artifactsCount) &&
    candidate.artifactsCount >= 0
      ? Math.min(candidate.artifactsCount, BONUS_ARTIFACTS_REQUIRED - 1)
      : 0;
  const recentMonsterNames = Array.isArray(candidate.recentMonsterNames)
    ? candidate.recentMonsterNames
        .filter((name): name is string => typeof name === 'string')
        .slice(-RECENT_MONSTERS_WINDOW)
    : [];
  const collectedRewards = Array.isArray(candidate.collectedRewards)
    ? candidate.collectedRewards
        .filter((reward): reward is string => typeof reward === 'string')
        .slice(-REWARDS_HISTORY_LIMIT)
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
    collectedRewards,
    artifactsCount: normalizedArtifactsCount,
  };
}
