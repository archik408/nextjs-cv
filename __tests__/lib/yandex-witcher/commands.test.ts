import { resolveWeaponChoice } from '@/lib/yandex-witcher/commands';
import type { WitcherEncounter, YandexAliceRequest } from '@/lib/yandex-witcher/types';

const encounter: WitcherEncounter = {
  monsterName: 'Гуль',
  monsterDescription: 'Трупоед с бледной кожей.',
  locationName: 'Кладбище',
  locationPhrase: 'на кладбище',
  options: ['Магический знак Игни', 'Медная булава', 'Бомба «Лунная пыль»'],
  correctOption: 'Магический знак Игни',
  unbeatable: false,
};

const swordEncounter: WitcherEncounter = {
  monsterName: 'Гуль',
  monsterDescription: 'Трупоед с бледной кожей.',
  locationName: 'Кладбище',
  locationPhrase: 'на кладбище',
  options: ['Серебряный меч', 'Медная булава', 'Бомба «Лунная пыль»'],
  correctOption: 'Серебряный меч',
  unbeatable: false,
};

const ambiguousEncounter: WitcherEncounter = {
  monsterName: 'Гуль',
  monsterDescription: 'Трупоед с бледной кожей.',
  locationName: 'Кладбище',
  locationPhrase: 'на кладбище',
  options: ['Серебряный меч', 'Стальной меч', 'Бомба «Лунная пыль»'],
  correctOption: 'Серебряный меч',
  unbeatable: false,
};

function buildRequest(command: string): YandexAliceRequest {
  return {
    meta: { locale: 'ru-RU', timezone: 'UTC' },
    session: {
      message_id: 0,
      session_id: 'commands-test',
      skill_id: 'test-skill',
      application: { application_id: 'test-app' },
      new: false,
    },
    request: {
      command,
      original_utterance: command,
      type: 'SimpleUtterance',
    },
    version: '1.0',
  };
}

function resolve(command: string, target: WitcherEncounter = encounter): string | undefined {
  return resolveWeaponChoice(buildRequest(command), command, target);
}

describe('resolveWeaponChoice', () => {
  it('matches the exact option name', () => {
    expect(resolve('Магический знак Игни')).toBe('Магический знак Игни');
  });

  it('matches option mentioned inside a longer phrase', () => {
    expect(resolve('я выбираю магический знак игни')).toBe('Магический знак Игни');
  });

  it('matches partial option mention', () => {
    expect(resolve('игни')).toBe('Магический знак Игни');
    expect(resolve('лунной пылью')).toBe('Бомба «Лунная пыль»');
  });

  it('matches option in any declension', () => {
    expect(resolve('серебряным мечом', swordEncounter)).toBe('Серебряный меч');
    expect(resolve('сражу медной булавой')).toBe('Медная булава');
    expect(resolve('бомбой самум')).toBeUndefined();
  });

  it('matches cardinal short answers', () => {
    expect(resolve('один')).toBe('Магический знак Игни');
    expect(resolve('два')).toBe('Медная булава');
    expect(resolve('три')).toBe('Бомба «Лунная пыль»');
    expect(resolve('две')).toBe('Медная булава');
  });

  it('matches digit short answers', () => {
    expect(resolve('1')).toBe('Магический знак Игни');
    expect(resolve('2')).toBe('Медная булава');
    expect(resolve('3')).toBe('Бомба «Лунная пыль»');
  });

  it('matches ordinal short answers with extra words', () => {
    expect(resolve('первый')).toBe('Магический знак Игни');
    expect(resolve('первое')).toBe('Магический знак Игни');
    expect(resolve('первым')).toBe('Магический знак Игни');
    expect(resolve('третьим')).toBe('Бомба «Лунная пыль»');
    expect(resolve('первый вариант')).toBe('Магический знак Игни');
    expect(resolve('вариант второй')).toBe('Медная булава');
    expect(resolve('третий ответ')).toBe('Бомба «Лунная пыль»');
    expect(resolve('номер 2')).toBe('Медная булава');
  });

  it('prefers a weapon name over the positional numeral in the same phrase', () => {
    const mixedEncounter: WitcherEncounter = {
      ...encounter,
      options: ['Медная булава', 'Охотничий лук', 'Рыболовный гарпун'],
      correctOption: 'Охотничий лук',
    };

    expect(resolve('один лук', mixedEncounter)).toBe('Охотничий лук');
    expect(resolve('вторую булаву', mixedEncounter)).toBe('Медная булава');
  });

  it('ignores ordinal-looking words that are not ordinals', () => {
    expect(resolve('вторник')).toBeUndefined();
    expect(resolve('вторжение')).toBeUndefined();
  });

  it('ignores politeness words around the weapon name', () => {
    expect(resolve('дай булаву')).toBe('Медная булава');
    expect(resolve('вот эту булаву, пожалуйста')).toBe('Медная булава');
    expect(resolve('этот меч', swordEncounter)).toBe('Серебряный меч');
    expect(resolve('хочу гарпун')).toBeUndefined();
    expect(resolve('я выбираю магический знак игни')).toBe('Магический знак Игни');
  });

  it('returns undefined for unrelated commands', () => {
    expect(resolve('не знаю')).toBeUndefined();
    expect(resolve('что-то странное')).toBeUndefined();
  });

  it('returns undefined when the answer is ambiguous between options', () => {
    expect(resolve('меч', ambiguousEncounter)).toBeUndefined();
    expect(resolve('мечом', ambiguousEncounter)).toBeUndefined();
  });

  it('prefers exact payload weapon for button presses', () => {
    const request = buildRequest('Медная булава');
    request.request.type = 'ButtonPressed';
    request.request.payload = { command: 'Медная булава', weapon: 'Медная булава' };

    expect(resolveWeaponChoice(request, 'Медная булава', encounter)).toBe('Медная булава');
  });

  it('ignores unknown payload weapons', () => {
    const request = buildRequest('игни');
    request.request.type = 'ButtonPressed';
    request.request.payload = { command: 'игни', weapon: 'Ржавая сулица' };

    expect(resolveWeaponChoice(request, 'игни', encounter)).toBe('Магический знак Игни');
  });
});
