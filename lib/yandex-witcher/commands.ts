import { WITCHER_SCHOOLS } from './types';
import type {
  ParsedWitcherCommand,
  WitcherEncounter,
  WitcherSchool,
  YandexAliceRequest,
} from './types';

const HELP_KEYWORDS = ['помощь', 'помоги', 'что ты умеешь', 'правила', 'подсказка'];
const GOODBYE_KEYWORDS = ['пока', 'выход', 'завершить', 'закрой', 'стоп'];
const RESTART_KEYWORDS = ['заново', 'сначала', 'новая игра', 'начать игру', 'рестарт'];

const SCHOOL_ALIASES: Record<WitcherSchool, string[]> = {
  Кота: ['кота', 'школа кота', 'кот'],
  Волка: ['волка', 'школа волка', 'волк'],
  Змеи: ['змеи', 'школа змеи', 'змея'],
  Грифона: ['грифона', 'школа грифона', 'грифон'],
  Мантикоры: ['мантикоры', 'школа мантикоры', 'мантикора'],
  Медведя: ['медведя', 'школа медведя', 'медведь'],
};

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/ё/g, 'е').trim();
}

function includesKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function detectSchool(command: string): WitcherSchool | undefined {
  const normalized = normalizeText(command);

  for (const school of WITCHER_SCHOOLS) {
    const aliases = SCHOOL_ALIASES[school];
    if (aliases.some((alias) => normalized.includes(alias))) {
      return school;
    }
  }

  return undefined;
}

function resolvePayloadCommand(request: YandexAliceRequest): string | undefined {
  if (request.request.type !== 'ButtonPressed' || !request.request.payload) {
    return undefined;
  }

  const payloadCommand = request.request.payload.command;
  if (typeof payloadCommand === 'string' && payloadCommand.trim()) {
    return payloadCommand.trim();
  }

  return undefined;
}

export function extractCommandText(request: YandexAliceRequest): string {
  const payload = resolvePayloadCommand(request);
  if (payload) {
    return payload;
  }

  return (request.request.command || request.request.original_utterance || '').trim();
}

export function resolveWeaponChoice(
  request: YandexAliceRequest,
  command: string,
  encounter: WitcherEncounter
): string | undefined {
  if (request.request.type === 'ButtonPressed' && request.request.payload) {
    const payloadWeapon = request.request.payload.weapon;
    if (
      typeof payloadWeapon === 'string' &&
      encounter.options.some((option) => normalizeText(option) === normalizeText(payloadWeapon))
    ) {
      return encounter.options.find(
        (option) => normalizeText(option) === normalizeText(payloadWeapon)
      );
    }
  }

  const normalizedCommand = normalizeText(command);
  if (!normalizedCommand) {
    return undefined;
  }

  return encounter.options.find((option) => {
    const normalizedOption = normalizeText(option);
    return normalizedCommand === normalizedOption || normalizedCommand.includes(normalizedOption);
  });
}

export function parseWitcherCommand(command: string, isNewSession: boolean): ParsedWitcherCommand {
  const raw = command.trim();
  const normalized = normalizeText(raw);

  if (!normalized) {
    return { action: isNewSession ? 'session_start' : 'unknown', raw };
  }

  if (includesKeyword(normalized, GOODBYE_KEYWORDS)) {
    return { action: 'goodbye', raw };
  }

  if (includesKeyword(normalized, HELP_KEYWORDS)) {
    return { action: 'help', raw };
  }

  if (includesKeyword(normalized, RESTART_KEYWORDS)) {
    return { action: 'restart', raw };
  }

  const school = detectSchool(normalized);
  if (school) {
    return { action: 'choose_school', raw, school };
  }

  return { action: 'choose_weapon', raw, weapon: raw };
}
