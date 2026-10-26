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
const STATS_KEYWORDS = ['статистика', 'статистику', 'трофеи', 'трофей', 'наград'];

const SCHOOL_ALIASES: Record<WitcherSchool, string[]> = {
  Кота: ['кот', 'кота', 'школа кота', 'школа кот', 'школу кота', 'школу кот'],
  Волка: ['волк', 'волка', 'школа волка', 'школа волк', 'школу волка', 'школу волк'],
  Змеи: ['змея', 'змеи', 'школа змеи', 'школа змея', 'школу змеи', 'школу змея'],
  Грифона: ['грифон', 'грифона', 'школа грифона', 'школа грифон', 'школу грифона', 'школу грифон'],
  Мантикоры: [
    'мантикора',
    'мантикоры',
    'школа мантикоры',
    'школа мантикора',
    'школу мантикоры',
    'школу мантикора',
  ],
  Медведя: [
    'медведь',
    'медведя',
    'школа медведя',
    'школа медведь',
    'школу медведя',
    'школу медведь',
  ],
};

// Short answers: cardinal numbers, ordinals and digits for the three options.
// Exact tokens cover undeclinable forms, stems cover the rest of declensions.
const CARDINAL_EXACT_TOKENS: ReadonlyArray<{ tokens: ReadonlySet<string>; index: number }> = [
  { tokens: new Set(['1', 'один', 'одна', 'одно', 'одну']), index: 0 },
  { tokens: new Set(['2', 'два', 'две', 'двух', 'двум', 'двумя']), index: 1 },
  { tokens: new Set(['3', 'три', 'трех', 'трёх', 'трем', 'трём', 'тремя']), index: 2 },
];

const NUMERAL_STEMS: ReadonlyArray<{ stems: ReadonlyArray<string>; index: number }> = [
  { stems: ['перв', 'одн'], index: 0 },
  { stems: ['втор'], index: 1 },
  { stems: ['трет'], index: 2 },
];

// Politeness words and particles that carry no weapon meaning. Exact tokens
// cover undeclinable words that the stemmer cannot shorten enough.
const FILLER_EXACT_TOKENS = new Set([
  'это',
  'этот',
  'эта',
  'эти',
  'эту',
  'этой',
  'этим',
  'этого',
  'этому',
  'этими',
  'вот',
  'ка',
  'дайте',
  'пожалуйста',
]);

const FILLER_STEMS = [
  'дай',
  'давай',
  'давайт',
  'выбира',
  'выбер',
  'возьм',
  'хоч',
  'сраж',
  'бей',
  'использ',
  'примен',
  'атак',
  'можно',
  'буд',
  'надо',
  'нужн',
  'мое',
  'моим',
  'же',
  'ли',
  'я',
];

// Frequent Russian endings: stripping them lets "булавой" match "Медная булава".
const RUSSIAN_ENDINGS = [
  'иями',
  'ями',
  'ами',
  'иях',
  'ях',
  'ах',
  'ого',
  'его',
  'ому',
  'ему',
  'ыми',
  'ими',
  'ым',
  'им',
  'ов',
  'ев',
  'ой',
  'ей',
  'ый',
  'ий',
  'ая',
  'яя',
  'ое',
  'ее',
  'ые',
  'ие',
  'ом',
  'ем',
  'ам',
  'ям',
  'у',
  'ю',
  'а',
  'я',
  'ы',
  'и',
  'о',
  'е',
  'ь',
];

const MIN_PARTIAL_COMMAND_LENGTH = 3;
// Prefix matching is only allowed for stems long enough to avoid unrelated
// words ("знаю" must not match "знак").
const MIN_STEM_LENGTH_FOR_PREFIX = 4;
const MIN_COMMAND_COVERAGE = 0.5;

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/ё/g, 'е').trim();
}

function normalizeForOptionMatch(value: string): string {
  return normalizeText(value)
    .replace(/[«»"']/g, '')
    .replace(/[.,!?;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

function stemToken(token: string): string {
  let stem = token;

  let stripped = true;
  while (stripped) {
    stripped = false;
    for (const ending of RUSSIAN_ENDINGS) {
      if (stem.length - ending.length >= 3 && stem.endsWith(ending)) {
        stem = stem.slice(0, -ending.length);
        stripped = true;
        break;
      }
    }
  }

  return stem;
}

function tokenize(value: string): string[] {
  return value.split(' ').filter(Boolean);
}

function stemsOverlap(commandStem: string, optionStem: string): boolean {
  if (commandStem === optionStem) {
    return true;
  }

  const shorterLength = Math.min(commandStem.length, optionStem.length);
  if (shorterLength < MIN_STEM_LENGTH_FOR_PREFIX) {
    return false;
  }

  return commandStem.startsWith(optionStem) || optionStem.startsWith(commandStem);
}

function isFillerStem(stem: string): boolean {
  return FILLER_STEMS.some((filler) => stemsOverlap(stem, filler));
}

interface ScoredOption {
  option: string;
  commandCoverage: number;
  score: number;
}

function scoreOption(commandStems: string[], option: string): ScoredOption {
  const optionStems = tokenize(normalizeForOptionMatch(option)).map(stemToken);

  const matchedCommandStems = commandStems.filter((commandStem) =>
    optionStems.some((optionStem) => stemsOverlap(commandStem, optionStem))
  );
  const commandCoverage = matchedCommandStems.length / commandStems.length;
  const score = optionStems
    .filter((optionStem) =>
      commandStems.some((commandStem) => stemsOverlap(commandStem, optionStem))
    )
    .reduce((total, optionStem) => total + optionStem.length, 0);

  return { option, commandCoverage, score };
}

function numeralIndexForToken(token: string): number | undefined {
  const stem = stemToken(token);

  for (const { stems, index } of NUMERAL_STEMS) {
    if (stems.includes(stem)) {
      return index;
    }
  }

  for (const { tokens, index } of CARDINAL_EXACT_TOKENS) {
    if (tokens.has(token)) {
      return index;
    }
  }

  return undefined;
}

function resolveOptionByOrdinal(tokens: string[], options: string[]): string | undefined {
  for (const token of tokens) {
    const index = numeralIndexForToken(token);
    if (index !== undefined && index < options.length) {
      return options[index];
    }
  }
  return undefined;
}

function resolveOptionByText(normalizedCommand: string, options: string[]): string | undefined {
  const matches = options.filter((option) => {
    const normalizedOption = normalizeForOptionMatch(option);
    if (normalizedCommand === normalizedOption || normalizedCommand.includes(normalizedOption)) {
      return true;
    }
    return (
      normalizedOption.includes(normalizedCommand) &&
      normalizedCommand.length >= MIN_PARTIAL_COMMAND_LENGTH
    );
  });

  if (matches.length === 1) {
    return matches[0];
  }

  return undefined;
}

function resolveOptionByStems(normalizedCommand: string, options: string[]): string | undefined {
  const commandStems = tokenize(normalizedCommand)
    .filter((token) => !FILLER_EXACT_TOKENS.has(token))
    .map(stemToken)
    .filter((stem) => !isFillerStem(stem));
  if (commandStems.length === 0) {
    return undefined;
  }

  const candidates = options
    .map((option) => scoreOption(commandStems, option))
    .filter((entry) => entry.commandCoverage > MIN_COMMAND_COVERAGE && entry.score > 0)
    .sort((left, right) => right.score - left.score);

  const best = candidates[0];
  if (!best) {
    return undefined;
  }

  if (candidates.some((entry) => entry !== best && entry.score === best.score)) {
    return undefined;
  }

  return best.option;
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
      encounter.options.some(
        (option) => normalizeForOptionMatch(option) === normalizeForOptionMatch(payloadWeapon)
      )
    ) {
      return encounter.options.find(
        (option) => normalizeForOptionMatch(option) === normalizeForOptionMatch(payloadWeapon)
      );
    }
  }

  const normalizedCommand = normalizeForOptionMatch(command);
  if (!normalizedCommand) {
    return undefined;
  }

  // When the answer mixes a numeral with a weapon name ("один лук", "вторую
  // пику"), the named weapon wins over the positional shortcut.
  const tokens = tokenize(normalizedCommand);
  const hasNumeral = tokens.some((token) => numeralIndexForToken(token) !== undefined);
  if (hasNumeral) {
    const remainder = tokens.filter((token) => numeralIndexForToken(token) === undefined).join(' ');

    if (remainder) {
      const byWeaponName =
        resolveOptionByText(remainder, encounter.options) ??
        resolveOptionByStems(remainder, encounter.options);
      if (byWeaponName) {
        return byWeaponName;
      }
    }

    return resolveOptionByOrdinal(tokens, encounter.options);
  }

  return (
    resolveOptionByText(normalizedCommand, encounter.options) ??
    resolveOptionByStems(normalizedCommand, encounter.options)
  );
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

  if (includesKeyword(normalized, STATS_KEYWORDS)) {
    return { action: 'stats', raw };
  }

  const school = detectSchool(normalized);
  if (school) {
    return { action: 'choose_school', raw, school };
  }

  return { action: 'choose_weapon', raw, weapon: raw };
}
