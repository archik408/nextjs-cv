import type { ParsedMicrobitCommand } from './types';

const SMILE_KEYWORDS = [
  'улыбнись',
  'улыбка',
  'улыбайся',
  'покажи улыбку',
  'смайл',
  'смайлик',
  'улыбнулся',
];

const SOUND_KEYWORDS = [
  'звук',
  'издай звук',
  'пищи',
  'писк',
  'бип',
  'сигнал',
  'сигналь',
  'издай сигнал',
  'музыка',
  'играй',
];

const STATUS_KEYWORDS = ['статус', 'состояние', 'что последнее', 'что делал'];
const HELP_KEYWORDS = ['помощь', 'помоги', 'что ты умеешь', 'что умеешь', 'команды'];
const GOODBYE_KEYWORDS = ['пока', 'до свидания', 'выход', 'закройся', 'хватит', 'стоп'];

function includesKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function parseMicrobitCommand(
  command: string,
  isNewSession: boolean
): ParsedMicrobitCommand {
  const raw = command.trim();
  const normalized = raw.toLowerCase().replace(/ё/g, 'е');

  if (!normalized) {
    return { action: isNewSession ? 'session_start' : 'unknown', raw };
  }

  if (includesKeyword(normalized, GOODBYE_KEYWORDS)) {
    return { action: 'goodbye', raw };
  }

  if (includesKeyword(normalized, HELP_KEYWORDS)) {
    return { action: 'help', raw };
  }

  if (includesKeyword(normalized, STATUS_KEYWORDS)) {
    return { action: 'status', raw };
  }

  if (includesKeyword(normalized, SMILE_KEYWORDS)) {
    return { action: 'smile', raw };
  }

  if (includesKeyword(normalized, SOUND_KEYWORDS)) {
    return { action: 'sound', raw };
  }

  return { action: 'unknown', raw };
}
