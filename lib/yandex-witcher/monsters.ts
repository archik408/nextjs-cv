import monstersData from '@/data/witcher-monsters.json';
import { RECENT_MONSTERS_WINDOW, UNBEATABLE_ENCOUNTER_CHANCE } from './types';
import type { WitcherEncounter, WitcherMonster } from './types';

const NEUTRAL_WEAPONS = [
  'Золотой фальшион',
  'Медная булава',
  'Рабочая кирка',
  'Охотничий лук',
  'Рыболовный гарпун',
  'Отвар из помидоров',
  'Яблочный сок',
  'Сушеная лаванда',
  'Трава вербена',
  'Корни мандрагоры',
  'Золотая секира',
  'Красная пика',
  'Изумрудный эспонтон',
  'Проклятый стилет',
  'Лунная гвизарма',
  'Штормовой арбалет',
  'Морозный моргенштерн',
  'Медвежий шестопёр',
  'Гномья алебарда',
  'Древний бердыш',
  'Ведьмина боевая коса',
  'Кровавый чекан',
  'Ржавая сулица',
  'Ледяной клевец',
  'Северный протазан',
];

const LOCATION_PHRASES: Record<string, string> = {
  лес: 'в лесу',
  болото: 'на болоте',
  'поле боя': 'на поле боя',
  горы: 'в горах',
  пещера: 'в пещере',
  руины: 'в руинах',
  деревня: 'в деревне',
  город: 'в городе',
  замок: 'в замке',
  кладбище: 'на кладбище',
  море: 'в море',
  озеро: 'на озере',
  река: 'у реки',
  побережье: 'на побережье',
  равнины: 'на равнинах',
  поля: 'в полях',
  тундра: 'в тундре',
  острова: 'на островах',
  подземелье: 'в подземелье',
  чаща: 'в чаще',
  скалы: 'у скал',
  мост: 'на мосту',
  пустыня: 'в пустыне',
  север: 'на севере',
  дорога: 'у дороги',
  дом: 'в доме',
  ферма: 'на ферме',
  хижина: 'в хижине',
  лаборатория: 'в лаборатории',
  колодец: 'у колодца',
  кабак: 'в кабаке',
  таверна: 'в таверне',
  перекресток: 'на перекрёстке',
  шахта: 'в шахте',
  снег: 'в снегах',
  мельница: 'у мельницы',
  'ночной лес': 'в ночном лесу',
  вулкан: 'у вулкана',
  арена: 'на арене',
  топи: 'в топях',
  канализация: 'в канализации',
};

let monstersPromise: Promise<WitcherMonster[]> | null = null;

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/ё/g, 'е').trim();
}

function isMonsterValid(monster: unknown): monster is WitcherMonster {
  if (!monster || typeof monster !== 'object') {
    return false;
  }

  const candidate = monster as Partial<WitcherMonster>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    Array.isArray(candidate.location) &&
    candidate.location.length > 0 &&
    candidate.location.every((location) => typeof location === 'string') &&
    Array.isArray(candidate.weaknesses) &&
    candidate.weaknesses.length > 0 &&
    candidate.weaknesses.every((weakness) => typeof weakness === 'string') &&
    (candidate.unbeatable === undefined || typeof candidate.unbeatable === 'boolean')
  );
}

async function loadFromModule(): Promise<WitcherMonster[]> {
  const parsed = monstersData as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error('Bestiary JSON must be an array');
  }

  const monsters = parsed.filter(isMonsterValid);
  if (monsters.length === 0) {
    throw new Error('Bestiary has no valid monsters');
  }

  return monsters;
}

export async function loadWitcherMonsters(): Promise<WitcherMonster[]> {
  if (!monstersPromise) {
    monstersPromise = loadFromModule();
  }

  return monstersPromise;
}

function randomItem<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildLocationPhrase(locationName: string): string {
  const normalized = normalizeText(locationName);
  const phrase = LOCATION_PHRASES[normalized];
  if (phrase) {
    return phrase;
  }

  return `в местности ${locationName}`;
}

function buildIncorrectOptions(
  monsters: WitcherMonster[],
  monster: WitcherMonster,
  correctOption: string
): string[] {
  const ownWeaknesses = new Set(monster.weaknesses.map((value) => normalizeText(value)));
  const pool = new Set<string>(NEUTRAL_WEAPONS);

  for (const candidateMonster of monsters) {
    // Placeholder weaknesses of easter-egg monsters must not leak into real fights.
    if (candidateMonster.unbeatable === true) {
      continue;
    }
    for (const weakness of candidateMonster.weaknesses) {
      const normalized = normalizeText(weakness);
      if (normalized === normalizeText(correctOption) || ownWeaknesses.has(normalized)) {
        continue;
      }
      pool.add(weakness);
    }
  }

  return shuffle([...pool]).slice(0, 2);
}

function buildUnbeatableEncounter(monster: WitcherMonster): WitcherEncounter {
  const options = shuffle(NEUTRAL_WEAPONS).slice(0, 3);
  const locationName = randomItem(monster.location);

  return {
    monsterName: monster.name,
    monsterDescription: monster.description,
    locationName,
    locationPhrase: buildLocationPhrase(locationName),
    options,
    // Placeholder: no option can win, the handler short-circuits on unbeatable.
    correctOption: options[0],
    unbeatable: true,
  };
}

export async function createEncounter(recentMonsterNames: string[]): Promise<WitcherEncounter> {
  const monsters = await loadWitcherMonsters();
  const recentSet = new Set(recentMonsterNames.map((name) => normalizeText(name)));

  const eligibleMonsters = monsters.filter(
    (monster) => !recentSet.has(normalizeText(monster.name))
  );
  const sourcePool = eligibleMonsters.length > 0 ? eligibleMonsters : monsters;
  const beatablePool = sourcePool.filter((monster) => monster.unbeatable !== true);

  // Rare easter egg: no weapon from the three options can win this fight.
  if (beatablePool.length > 0 && Math.random() < UNBEATABLE_ENCOUNTER_CHANCE) {
    const unbeatable = monsters.find((monster) => monster.unbeatable === true);
    if (unbeatable) {
      return buildUnbeatableEncounter(unbeatable);
    }
  }

  const monster = randomItem(beatablePool.length > 0 ? beatablePool : sourcePool);

  const locationName = randomItem(monster.location);
  const locationPhrase = buildLocationPhrase(locationName);
  const correctOption = randomItem(monster.weaknesses);
  const incorrectOptions = buildIncorrectOptions(monsters, monster, correctOption);
  const options = shuffle([correctOption, ...incorrectOptions]);

  return {
    monsterName: monster.name,
    monsterDescription: monster.description,
    locationName,
    locationPhrase,
    options,
    correctOption,
    unbeatable: false,
  };
}

export function pushRecentMonster(recentMonsterNames: string[], monsterName: string): string[] {
  const next = [...recentMonsterNames, monsterName];
  return next.slice(-RECENT_MONSTERS_WINDOW);
}
