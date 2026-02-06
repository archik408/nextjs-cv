/**
 * Braille conversion tables and helpers.
 * Mapping based on Russian Braille (Cyrillic) and Latin Braille as per
 * https://ru.wikipedia.org/wiki/Шрифт_Брайля
 * Unicode Braille Patterns: U+2800–U+28FF.
 */

export type BrailleLanguage = 'ru' | 'be' | 'en';

const BRAILLE_CAPITAL = '\u2820'; // ⠠
const BRAILLE_NUMBER = '\u283c'; // ⠼
// const BRAILLE_SPACE = '\u2800'; // ⠀

/** Russian Braille (Cyrillic) — Russia column from Wikipedia */
const RU_TO_BRAILLE: Record<string, string> = {
  А: '⠁',
  Б: '⠃',
  В: '⠺',
  Г: '⠛',
  Д: '⠙',
  Е: '⠑',
  Ё: '⠡',
  Ж: '⠚',
  З: '⠵',
  И: '⠊',
  Й: '⠯',
  К: '⠅',
  Л: '⠇',
  М: '⠍',
  Н: '⠝',
  О: '⠕',
  П: '⠏',
  Р: '⠗',
  С: '⠎',
  Т: '⠞',
  У: '⠥',
  Ф: '⠋',
  Х: '⠓',
  Ц: '⠉',
  Ч: '⠟',
  Ш: '⠱',
  Щ: '⠭',
  Ъ: '⠷',
  Ы: '⠮',
  Ь: '⠾',
  Э: '⠪',
  Ю: '⠳',
  Я: '⠫',
  а: '⠁',
  б: '⠃',
  в: '⠺',
  г: '⠛',
  д: '⠙',
  е: '⠑',
  ё: '⠡',
  ж: '⠚',
  з: '⠵',
  и: '⠊',
  й: '⠯',
  к: '⠅',
  л: '⠇',
  м: '⠍',
  н: '⠝',
  о: '⠕',
  п: '⠏',
  р: '⠗',
  с: '⠎',
  т: '⠞',
  у: '⠥',
  ф: '⠋',
  х: '⠓',
  ц: '⠉',
  ч: '⠟',
  ш: '⠱',
  щ: '⠭',
  ъ: '⠷',
  ы: '⠮',
  ь: '⠾',
  э: '⠪',
  ю: '⠳',
  я: '⠫',
  '.': '⠲',
  ',': '⠂',
  '?': '⠢',
  ';': '⠆',
  '!': '⠖',
  '-': '⠤',
  '–': '⠤',
  '—': '⠤',
  '«': '⠴',
  '»': '⠶',
  '(': '⠐',
  ')': '⠐⠂',
  ' ': ' ',
  '\n': '\n',
};

/** Belarusian: same as Russian + Ў, І (from Wikipedia comparison table) */
const BE_TO_BRAILLE: Record<string, string> = {
  ...RU_TO_BRAILLE,
  Ў: '⠬',
  ў: '⠬',
  І: '⠽',
  і: '⠽',
};

/** Latin (English) Braille — basic 26 letters + digits with number sign */
const EN_LETTER_TO_BRAILLE: Record<string, string> = {
  a: '⠁',
  b: '⠃',
  c: '⠉',
  d: '⠙',
  e: '⠑',
  f: '⠋',
  g: '⠛',
  h: '⠓',
  i: '⠊',
  j: '⠚',
  k: '⠅',
  l: '⠇',
  m: '⠍',
  n: '⠝',
  o: '⠕',
  p: '⠏',
  q: '⠟',
  r: '⠗',
  s: '⠎',
  t: '⠞',
  u: '⠥',
  v: '⠧',
  w: '⠺',
  x: '⠭',
  y: '⠽',
  z: '⠵',
  '1': '⠁',
  '2': '⠃',
  '3': '⠉',
  '4': '⠙',
  '5': '⠑',
  '6': '⠋',
  '7': '⠛',
  '8': '⠓',
  '9': '⠊',
  '0': '⠚',
  '.': '⠲',
  ',': '⠂',
  '?': '⠢',
  ';': '⠆',
  '!': '⠖',
  '-': '⠤',
  '"': '⠴',
  "'": '⠄',
  '(': '⠐',
  ')': '⠐⠂',
  ' ': ' ',
  '\n': '\n',
};

/** Russian/Belarusian: Braille → Cyrillic (single and two-cell; capital sign handled in converter) */
const RU_BRAILLE_TO_CHAR = new Map<string, string>();
for (const [char, braille] of Object.entries(RU_TO_BRAILLE)) {
  if (braille.length >= 1 && char !== ' ' && char !== '\n') RU_BRAILLE_TO_CHAR.set(braille, char);
}
for (const [char, braille] of Object.entries(BE_TO_BRAILLE)) {
  if (braille.length >= 1 && char !== ' ' && char !== '\n') RU_BRAILLE_TO_CHAR.set(braille, char);
}

/** English: Braille cell(s) → letter or digit (capital/number signs handled in converter) */
const EN_BRAILLE_TO_CHAR = new Map<string, string>();
for (const [char, braille] of Object.entries(EN_LETTER_TO_BRAILLE)) {
  if (braille.length >= 1 && char !== ' ' && char !== '\n') EN_BRAILLE_TO_CHAR.set(braille, char);
}

function getToBrailleMap(lang: BrailleLanguage): Record<string, string> {
  switch (lang) {
    case 'en':
      return EN_LETTER_TO_BRAILLE;
    case 'be':
      return BE_TO_BRAILLE;
    default:
      return RU_TO_BRAILLE;
  }
}

/** Check if character is in Unicode Braille block (U+2800..U+28FF) */
function isBrailleChar(c: string): boolean {
  const code = c.codePointAt(0) ?? 0;
  return code >= 0x2800 && code <= 0x28ff;
}

/** Convert plain text to Braille (with capital sign for capitals where applicable) */
export function textToBraille(text: string, lang: BrailleLanguage): string {
  const map = getToBrailleMap(lang);
  const out: string[] = [];

  if (lang === 'en') {
    let numberMode = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const lower = c.toLowerCase();
      const mapped = map[c] ?? map[lower];

      if (c >= '0' && c <= '9') {
        if (!numberMode) {
          out.push(BRAILLE_NUMBER);
          numberMode = true;
        }
        out.push(map[c] ?? c);
      } else {
        numberMode = false;
        if (mapped !== undefined) {
          if (c >= 'A' && c <= 'Z') {
            out.push(BRAILLE_CAPITAL);
            out.push(mapped);
          } else {
            out.push(mapped);
          }
        } else {
          out.push(c);
        }
      }
    }
    return out.join('');
  }

  // Russian / Belarusian: capital before uppercase Cyrillic
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const mapped = map[c];
    if (mapped !== undefined) {
      const isUpper = c !== c.toLowerCase() && c.toLowerCase() !== c;
      if (isUpper && /[А-ЯЁЎІ]/.test(c)) {
        out.push(BRAILLE_CAPITAL);
      }
      out.push(mapped);
    } else {
      out.push(c);
    }
  }
  return out.join('');
}

/** Convert Braille text back to plain text */
export function brailleToText(braille: string, lang: BrailleLanguage): string {
  const map = lang === 'en' ? EN_BRAILLE_TO_CHAR : RU_BRAILLE_TO_CHAR;
  const out: string[] = [];
  let i = 0;
  let capitalNext = false;
  let numberMode = false;

  while (i < braille.length) {
    const c = braille[i];

    if (c === BRAILLE_CAPITAL) {
      capitalNext = true;
      i += 1;
      continue;
    }
    if (lang === 'en' && c === BRAILLE_NUMBER) {
      numberMode = true;
      i += 1;
      continue;
    }

    if (c === ' ' || c === '\n') {
      numberMode = false;
      out.push(c);
      i += 1;
      continue;
    }

    // Try two-cell Braille first (e.g. closing parenthesis ⠐⠂)
    if (isBrailleChar(c) && i + 1 < braille.length) {
      const next = braille[i + 1];
      if (isBrailleChar(next)) {
        const two = c + next;
        const chTwo = map.get(two);
        if (chTwo !== undefined) {
          out.push(capitalNext ? chTwo.toUpperCase() : chTwo);
          capitalNext = false;
          numberMode = false;
          i += 2;
          continue;
        }
      }
    }

    // Single Braille cell (Unicode 2800-28FF)
    if (isBrailleChar(c)) {
      const ch = map.get(c);
      if (ch !== undefined) {
        let outChar = ch;
        if (numberMode && lang === 'en' && ch >= 'a' && ch <= 'j') {
          const digit = '1234567890'['abcdefghij'.indexOf(ch)];
          outChar = digit ?? ch;
        } else {
          numberMode = false;
        }
        if (capitalNext) {
          outChar = outChar.toUpperCase();
          capitalNext = false;
        }
        out.push(outChar);
      } else {
        out.push(c);
      }
      i += 1;
      continue;
    }

    out.push(c);
    capitalNext = false;
    numberMode = false;
    i += 1;
  }

  return out.join('');
}
