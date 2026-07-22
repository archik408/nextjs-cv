import { MicrobitIconName, PROTOCOL_ICON_NAMES } from '@/lib/microbit-connector/protocol';
import type { MicrobitAction, ParsedMicrobitCommand } from './types';

const MAX_TEXT_LENGTH = 48;

const SMILE_KEYWORDS = [
  'улыбнись',
  'улыбка',
  'улыбайся',
  'покажи улыбку',
  'смайл',
  'смайлик',
  'улыбнулся',
];

const SOUND_KEYWORDS = ['издай звук', 'издай сигнал', 'пищи', 'писк', 'бип', 'сигналь', 'beep'];

const SAD_KEYWORDS = [
  'грусти',
  'грусть',
  'печаль',
  'печалься',
  'расстройся',
  'расстроился',
  'покажи грусть',
  'грустное лицо',
  'sad',
];

const LOGO_KEYWORDS = ['нажми логотип', 'нажать логотип', 'логотип', 'logo'];

const CLEAR_KEYWORDS = ['очисти экран', 'очистить экран', 'очисти', 'очистить', 'clear'];

const HEART_KEYWORDS = ['нарисуй сердце', 'покажи сердце', 'сердце', 'heart'];

const YES_KEYWORDS = ['нарисуй да', 'покажи да', 'нарисуй ок', 'покажи ок', 'галочка', 'yes'];

const NO_KEYWORDS = ['нарисуй нет', 'покажи нет', 'крестик', 'no'];

const PING_KEYWORDS = ['проверка связи', 'пинг', 'ping'];

const BTN_A_KEYWORDS = [
  'нажми кнопку а',
  'нажать кнопку а',
  'нажми а',
  'нажать а',
  'кнопка а',
  'кнопка a',
  'btn_a',
  'button a',
];

const BTN_B_KEYWORDS = [
  'нажми кнопку б',
  'нажать кнопку б',
  'нажми б',
  'нажать б',
  'кнопка б',
  'кнопка b',
  'btn_b',
  'button b',
];

const STATUS_KEYWORDS = ['статус', 'состояние', 'что последнее', 'что делал'];
const HELP_KEYWORDS = ['помощь', 'помоги', 'что ты умеешь', 'что умеешь', 'команды'];
const GOODBYE_KEYWORDS = ['пока', 'до свидания', 'выход', 'закройся', 'хватит', 'стоп'];

const ICON_ALIASES: Record<string, MicrobitIconName> = {
  happy: MicrobitIconName.Happy,
  sad: MicrobitIconName.Sad,
  heart: MicrobitIconName.Heart,
  yes: MicrobitIconName.Yes,
  no: MicrobitIconName.No,
  surprised: MicrobitIconName.Surprised,
  asleep: MicrobitIconName.Asleep,
  arrow_up: MicrobitIconName.ArrowUp,
  arrow_down: MicrobitIconName.ArrowDown,
  arrow_left: MicrobitIconName.ArrowLeft,
  arrow_right: MicrobitIconName.ArrowRight,
  улыбка: MicrobitIconName.Happy,
  счастливый: MicrobitIconName.Happy,
  грусть: MicrobitIconName.Sad,
  сердце: MicrobitIconName.Heart,
  да: MicrobitIconName.Yes,
  ок: MicrobitIconName.Yes,
  нет: MicrobitIconName.No,
  удивление: MicrobitIconName.Surprised,
  удивленный: MicrobitIconName.Surprised,
  сон: MicrobitIconName.Asleep,
  спит: MicrobitIconName.Asleep,
  вверх: MicrobitIconName.ArrowUp,
  вниз: MicrobitIconName.ArrowDown,
  влево: MicrobitIconName.ArrowLeft,
  вправо: MicrobitIconName.ArrowRight,
};

function includesKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function sanitizeTextPayload(value: string): string | null {
  const sanitized = value
    .replace(/[\r\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!sanitized) {
    return null;
  }
  return sanitized.slice(0, MAX_TEXT_LENGTH);
}

export function resolveIconName(rawName: string): MicrobitIconName | null {
  const normalized = rawName.trim().toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, '_');
  if (!normalized) {
    return null;
  }

  if (ICON_ALIASES[normalized]) {
    return ICON_ALIASES[normalized];
  }

  if ((PROTOCOL_ICON_NAMES as string[]).includes(normalized)) {
    return normalized as MicrobitIconName;
  }

  return null;
}

function parseTextCommand(normalized: string, raw: string): ParsedMicrobitCommand | null {
  const prefixed = normalized.match(/^(?:text|текст)\s*:\s*(.+)$/);
  if (prefixed?.[1]) {
    const text = sanitizeTextPayload(prefixed[1]);
    if (!text) {
      return { action: 'unknown', raw };
    }
    return { action: 'text', raw, text };
  }

  const spoken = normalized.match(/^(?:напиши|прокрути|покажи текст|текст)\s+(.+)$/);
  if (spoken?.[1]) {
    const text = sanitizeTextPayload(spoken[1]);
    if (!text) {
      return { action: 'unknown', raw };
    }
    return { action: 'text', raw, text };
  }

  return null;
}

function parseIconCommand(normalized: string, raw: string): ParsedMicrobitCommand | null {
  const prefixed = normalized.match(/^(?:icon|иконка)\s*:\s*(.+)$/);
  if (prefixed?.[1]) {
    const iconName = resolveIconName(prefixed[1]);
    if (!iconName) {
      return { action: 'unknown', raw };
    }
    return { action: 'icon', raw, iconName };
  }

  const spoken = normalized.match(/^(?:нарисуй иконку|покажи иконку|иконка)\s+(.+)$/);
  if (spoken?.[1]) {
    const iconName = resolveIconName(spoken[1]);
    if (!iconName) {
      return { action: 'unknown', raw };
    }
    return { action: 'icon', raw, iconName };
  }

  return null;
}

const UART_TOKEN_ACTIONS: Record<string, MicrobitAction> = {
  smile: 'smile',
  beep: 'sound',
  sad: 'sad',
  logo: 'logo',
  clear: 'clear',
  heart: 'heart',
  yes: 'yes',
  no: 'no',
  ping: 'ping',
  btn_a: 'btn_a',
  btn_b: 'btn_b',
};

const KEYWORD_ACTIONS: Array<{ action: MicrobitAction; keywords: string[] }> = [
  { action: 'smile', keywords: SMILE_KEYWORDS },
  { action: 'sound', keywords: SOUND_KEYWORDS },
  { action: 'sad', keywords: SAD_KEYWORDS },
  { action: 'logo', keywords: LOGO_KEYWORDS },
  { action: 'clear', keywords: CLEAR_KEYWORDS },
  { action: 'heart', keywords: HEART_KEYWORDS },
  { action: 'yes', keywords: YES_KEYWORDS },
  { action: 'no', keywords: NO_KEYWORDS },
  { action: 'ping', keywords: PING_KEYWORDS },
  { action: 'btn_a', keywords: BTN_A_KEYWORDS },
  { action: 'btn_b', keywords: BTN_B_KEYWORDS },
];

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

  const textCommand = parseTextCommand(normalized, raw);
  if (textCommand) {
    return textCommand;
  }

  const iconCommand = parseIconCommand(normalized, raw);
  if (iconCommand) {
    return iconCommand;
  }

  // Exact UART protocol tokens: SMILE, BEEP, BTN_A, …
  if (UART_TOKEN_ACTIONS[normalized]) {
    return { action: UART_TOKEN_ACTIONS[normalized], raw };
  }

  for (const entry of KEYWORD_ACTIONS) {
    if (includesKeyword(normalized, entry.keywords)) {
      return { action: entry.action, raw };
    }
  }

  // Fallback short sound keyword (avoid matching inside "текст")
  if (normalized === 'звук' || normalized === 'сигнал' || normalized === 'музыка') {
    return { action: 'sound', raw };
  }

  return { action: 'unknown', raw };
}

/** Catalog entry for Alice help text and suggestion buttons. */
export type MicrobitCommandCatalogEntry = {
  phrase: string;
  buttonTitle: string;
  uart: string;
  description: string;
};

export const MICROBIT_COMMAND_CATALOG: readonly MicrobitCommandCatalogEntry[] = [
  {
    phrase: 'улыбнись',
    buttonTitle: 'Улыбнись',
    uart: 'SMILE',
    description: 'улыбка',
  },
  { phrase: 'грусти', buttonTitle: 'Грусти', uart: 'SAD', description: 'грустное лицо' },
  {
    phrase: 'издай звук',
    buttonTitle: 'Издай звук',
    uart: 'BEEP',
    description: 'короткий сигнал',
  },
  { phrase: 'логотип', buttonTitle: 'Логотип', uart: 'LOGO', description: 'нажатие логотипа' },
  { phrase: 'очисти', buttonTitle: 'Очисти', uart: 'CLEAR', description: 'очистить экран' },
  { phrase: 'сердце', buttonTitle: 'Сердце', uart: 'HEART', description: 'нарисовать сердце' },
  {
    phrase: 'нарисуй да',
    buttonTitle: 'Нарисуй да',
    uart: 'YES',
    description: 'иконка «да»',
  },
  {
    phrase: 'нарисуй нет',
    buttonTitle: 'Нарисуй нет',
    uart: 'NO',
    description: 'иконка «нет»',
  },
  { phrase: 'пинг', buttonTitle: 'Пинг', uart: 'PING', description: 'проверка связи' },
  { phrase: 'нажми а', buttonTitle: 'Нажми А', uart: 'BTN_A', description: 'кнопка A' },
  { phrase: 'нажми б', buttonTitle: 'Нажми Б', uart: 'BTN_B', description: 'кнопка B' },
  {
    phrase: 'напиши привет',
    buttonTitle: 'Напиши привет',
    uart: 'TEXT:привет',
    description: 'прокрутка текста',
  },
  {
    phrase: 'иконка сердце',
    buttonTitle: 'Иконка сердце',
    uart: 'ICON:heart',
    description: 'именованная иконка (happy, sad, heart, yes, no, …)',
  },
  {
    phrase: 'статус',
    buttonTitle: 'Статус',
    uart: '—',
    description: 'последняя команда и статус доставки',
  },
  { phrase: 'помощь', buttonTitle: 'Помощь', uart: '—', description: 'список всех команд' },
  { phrase: 'пока', buttonTitle: 'Пока', uart: '—', description: 'завершить сессию' },
] as const;

export function formatMicrobitCommandCatalogForAlice(): string {
  const lines = MICROBIT_COMMAND_CATALOG.map(
    (entry) =>
      `«${entry.phrase}» → ${
        entry.uart === '—' ? entry.description : `${entry.uart} (${entry.description})`
      }`
  );
  return [
    'Доступные команды навыка «Мой Микробит»:',
    ...lines,
    'Также можно сказать UART-токен напрямую: SMILE, BEEP, SAD, LOGO, CLEAR, HEART, YES, NO, PING, BTN_A, BTN_B, текст:…, icon:….',
  ].join('\n');
}

export function formatMicrobitWelcomeHint(): string {
  return 'Скажите «помощь», чтобы услышать полный список команд, или выберите кнопку ниже.';
}
