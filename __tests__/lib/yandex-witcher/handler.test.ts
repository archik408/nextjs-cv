import { handleYandexWitcherRequest } from '@/lib/yandex-witcher/handler';
import { createEncounter } from '@/lib/yandex-witcher/monsters';
import type { WitcherEncounter, YandexAliceRequest } from '@/lib/yandex-witcher/types';

jest.mock('@/lib/yandex-witcher/monsters', () => {
  const actual = jest.requireActual('@/lib/yandex-witcher/monsters');
  return {
    ...actual,
    createEncounter: jest.fn(),
  };
});

const mockedCreateEncounter = createEncounter as jest.MockedFunction<typeof createEncounter>;

const encounterA: WitcherEncounter = {
  monsterName: 'Леший',
  monsterDescription: 'Древний дух леса с оленьим черепом.',
  locationName: 'Лес',
  locationPhrase: 'в лесу',
  options: ['Магический знак Игни', 'Охотничий лук', 'Яблочный сок'],
  correctOption: 'Магический знак Игни',
  unbeatable: false,
};

const encounterB: WitcherEncounter = {
  monsterName: 'Гуль',
  monsterDescription: 'Трупоед с бледной кожей.',
  locationName: 'Кладбище',
  locationPhrase: 'на кладбище',
  options: ['Масло против трупоедов', 'Рабочая кирка', 'Золотой фальшион'],
  correctOption: 'Масло против трупоедов',
  unbeatable: false,
};

const encounterC: WitcherEncounter = {
  monsterName: 'Сирена',
  monsterDescription: 'Опасный гибрид, заманивающий путников пением.',
  locationName: 'Побережье',
  locationPhrase: 'на побережье',
  options: ['Магический знак Аард', 'Медная булава', 'Сушеная лаванда'],
  correctOption: 'Магический знак Аард',
  unbeatable: false,
};

const gaunterEncounter: WitcherEncounter = {
  monsterName: "Гюнтер о'Дим",
  monsterDescription: 'Учтивый торговец стеклом, коллекционирующий души.',
  locationName: 'Дорога',
  locationPhrase: 'у дороги',
  options: ['Золотая секира', 'Красная пика', 'Изумрудный эспонтон'],
  correctOption: 'Золотая секира',
  unbeatable: true,
};

const baseRequest: YandexAliceRequest = {
  meta: {
    locale: 'ru-RU',
    timezone: 'UTC',
  },
  session: {
    message_id: 0,
    session_id: 'test-session',
    skill_id: 'test-skill',
    application: {
      application_id: 'test-app',
    },
    new: true,
  },
  request: {
    command: '',
    original_utterance: '',
    type: 'SimpleUtterance',
  },
  version: '1.0',
};

type RequestOverrides = Omit<Partial<YandexAliceRequest>, 'session' | 'request'> & {
  session?: Partial<YandexAliceRequest['session']>;
  request?: Partial<YandexAliceRequest['request']>;
};

function requestWithOverrides(overrides: RequestOverrides): YandexAliceRequest {
  return {
    ...baseRequest,
    ...overrides,
    session: {
      ...baseRequest.session,
      ...(overrides.session ?? {}),
    },
    request: {
      ...baseRequest.request,
      ...(overrides.request ?? {}),
    },
  };
}

describe('yandex-witcher skill handler', () => {
  let randomSpy: jest.SpyInstance;

  beforeEach(() => {
    mockedCreateEncounter.mockReset();
    randomSpy = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it('asks to choose witcher school on session start', async () => {
    const response = await handleYandexWitcherRequest(baseRequest);

    expect(response.version).toBe('1.0');
    expect(response.response.text).toContain('Выбери школу');
    expect(response.response.end_session).toBe(false);
    expect(response.session_state?.phase).toBe('choose_school');
    expect(response.response.buttons).toHaveLength(6);
  });

  it('starts first battle after school selection', async () => {
    mockedCreateEncounter.mockResolvedValueOnce(encounterA);

    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 1 },
        request: { command: 'Волка', original_utterance: 'Волка' },
      })
    );

    expect(response.session_state?.selectedSchool).toBe('Волка');
    expect(response.session_state?.phase).toBe('choose_weapon');
    expect(response.response.text).toContain('Ты ведьмак школы Волка.');
    expect(response.response.text).toContain('У тебя 3 жизни.');
    expect(response.response.text).toContain(
      `Выбери, чем сразить чудовище: ${encounterA.options.join(', ')}.`
    );
    expect(response.response.text).toContain(encounterA.monsterName);
    expect(response.response.buttons).toHaveLength(3);
  });

  it('accepts different phrasing for school selection', async () => {
    const variants: Array<{ utterance: string; expectedSchool: string }> = [
      { utterance: 'медведь', expectedSchool: 'Медведя' },
      { utterance: 'медведя', expectedSchool: 'Медведя' },
      { utterance: 'школа медведя', expectedSchool: 'Медведя' },
      { utterance: 'школу медведя', expectedSchool: 'Медведя' },
      { utterance: 'школа медведь', expectedSchool: 'Медведя' },
      { utterance: 'волк', expectedSchool: 'Волка' },
      { utterance: 'школу грифона', expectedSchool: 'Грифона' },
      { utterance: 'мантикора', expectedSchool: 'Мантикоры' },
      { utterance: 'школа змея', expectedSchool: 'Змеи' },
      { utterance: 'школа кот', expectedSchool: 'Кота' },
    ];

    for (const [index, variant] of variants.entries()) {
      mockedCreateEncounter.mockResolvedValueOnce(encounterA);
      const response = await handleYandexWitcherRequest(
        requestWithOverrides({
          session: { new: false, message_id: 50 + index, session_id: `school-variant-${index}` },
          request: { command: variant.utterance, original_utterance: variant.utterance },
        })
      );

      expect(response.session_state?.selectedSchool).toBe(variant.expectedSchool);
      expect(response.session_state?.phase).toBe('choose_weapon');
    }
  });

  it('wins fight and starts new encounter', async () => {
    mockedCreateEncounter.mockResolvedValueOnce(encounterB);

    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 2 },
        state: {
          session: {
            phase: 'choose_weapon',
            lives: 3,
            victories: 0,
            selectedSchool: 'Кота',
            recentMonsterNames: [],
            collectedRewards: [],
            encounter: encounterA,
          },
        },
        request: {
          command: encounterA.correctOption,
          original_utterance: encounterA.correctOption,
        },
      })
    );

    expect(response.session_state?.victories).toBe(1);
    expect(response.session_state?.lives).toBe(3);
    expect(response.session_state?.recentMonsterNames).toContain(encounterA.monsterName);
    expect(response.session_state?.encounter?.monsterName).toBe(encounterB.monsterName);
    expect(response.session_state?.collectedRewards).toHaveLength(1);
    expect(response.response.text).toContain('Наград собрано: 1.');
  });

  it('wins fight with a short numeric answer', async () => {
    mockedCreateEncounter.mockResolvedValueOnce(encounterA);

    const first = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 20, session_id: 'short-answer' },
        request: { command: 'Кота', original_utterance: 'Кота' },
      })
    );
    expect(first.session_state?.encounter?.monsterName).toBe('Леший');
    mockedCreateEncounter.mockResolvedValueOnce(encounterB);
    const second = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 21, session_id: 'short-answer' },
        state: { session: first.session_state },
        request: { command: 'первый вариант', original_utterance: 'первый вариант' },
      })
    );

    expect(second.session_state?.victories).toBe(1);
    expect(second.response.text).toContain('Отлично, ты победил существо Леший');
  });

  it('wins fight with a declined weapon name', async () => {
    mockedCreateEncounter.mockResolvedValueOnce(encounterB);

    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 22 },
        state: {
          session: {
            phase: 'choose_weapon',
            lives: 3,
            victories: 0,
            selectedSchool: 'Кота',
            recentMonsterNames: [],
            collectedRewards: [],
            encounter: encounterA,
          },
        },
        request: { command: 'магическим знаком игни', original_utterance: 'Магический знак Игни' },
      })
    );

    expect(response.session_state?.victories).toBe(1);
  });

  it('asks again when the weapon answer is ambiguous', async () => {
    const ambiguousEncounter: WitcherEncounter = {
      ...encounterA,
      options: ['Серебряный меч', 'Стальной меч', 'Яблочный сок'],
      correctOption: 'Серебряный меч',
    };

    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 23 },
        state: {
          session: {
            phase: 'choose_weapon',
            lives: 3,
            victories: 0,
            selectedSchool: 'Кота',
            recentMonsterNames: [],
            collectedRewards: [],
            encounter: ambiguousEncounter,
          },
        },
        request: { command: 'меч', original_utterance: 'меч' },
      })
    );

    expect(response.session_state?.lives).toBe(3);
    expect(response.response.text).toContain('Нужно выбрать один из трёх вариантов');
  });

  it('loses all lives and moves to game over with reward tally', async () => {
    mockedCreateEncounter.mockResolvedValueOnce(encounterB).mockResolvedValueOnce(encounterC);

    const firstLoss = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 3 },
        state: {
          session: {
            phase: 'choose_weapon',
            lives: 3,
            victories: 0,
            selectedSchool: 'Медведя',
            recentMonsterNames: [],
            collectedRewards: ['мешочек оренов'],
            encounter: encounterA,
          },
        },
        request: {
          command: 'Яблочный сок',
          original_utterance: 'Яблочный сок',
        },
      })
    );

    expect(firstLoss.session_state?.lives).toBe(2);
    expect(firstLoss.session_state?.phase).toBe('choose_weapon');
    expect(firstLoss.session_state?.encounter?.monsterName).toBe(encounterB.monsterName);

    const secondLoss = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 4 },
        state: { session: firstLoss.session_state },
        request: {
          command: 'Рабочая кирка',
          original_utterance: 'Рабочая кирка',
        },
      })
    );

    expect(secondLoss.session_state?.lives).toBe(1);
    expect(secondLoss.session_state?.phase).toBe('choose_weapon');
    expect(secondLoss.session_state?.encounter?.monsterName).toBe(encounterC.monsterName);

    const thirdLoss = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 5 },
        state: { session: secondLoss.session_state },
        request: {
          command: 'Сушеная лаванда',
          original_utterance: 'Сушеная лаванда',
        },
      })
    );

    expect(thirdLoss.session_state?.lives).toBe(0);
    expect(thirdLoss.session_state?.phase).toBe('game_over');
    expect(thirdLoss.response.text).toContain('Поход завершён');
    expect(thirdLoss.response.text).toContain('мешочек оренов');
  });

  it('shows reward statistics on demand', async () => {
    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 7 },
        state: {
          session: {
            phase: 'choose_weapon',
            lives: 2,
            victories: 3,
            selectedSchool: 'Кота',
            recentMonsterNames: [],
            collectedRewards: ['мешочек оренов', 'ведьмачий трофей', 'мешочек оренов'],
            encounter: encounterA,
          },
        },
        request: { command: 'статистика', original_utterance: 'статистика' },
      })
    );

    expect(response.response.text).toContain('Побед: 3.');
    expect(response.response.text).toContain('Наград собрано: 3.');
    expect(response.response.text).toContain('мешочек оренов ×2');
    expect(response.session_state?.phase).toBe('choose_weapon');
  });

  it('offers restart button for stats in game over phase', async () => {
    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 25 },
        state: {
          session: {
            phase: 'game_over',
            lives: 0,
            victories: 2,
            selectedSchool: 'Кота',
            recentMonsterNames: [],
            collectedRewards: ['мешочек оренов'],
          },
        },
        request: { command: 'награды', original_utterance: 'награды' },
      })
    );

    expect(response.response.text).toContain('Наград собрано: 1.');
    expect(response.response.buttons?.[0]?.title).toBe('Заново');
    expect(response.session_state?.phase).toBe('game_over');
  });

  it('caps collected rewards history at the limit', async () => {
    randomSpy.mockReturnValue(0.5);
    const fullRewards = Array.from({ length: 100 }, () => 'мешочек оренов');

    mockedCreateEncounter.mockResolvedValueOnce(encounterB);
    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 24 },
        state: {
          session: {
            phase: 'choose_weapon',
            lives: 3,
            victories: 99,
            selectedSchool: 'Кота',
            recentMonsterNames: [],
            collectedRewards: fullRewards,
            encounter: encounterA,
          },
        },
        request: {
          command: encounterA.correctOption,
          original_utterance: encounterA.correctOption,
        },
      })
    );

    expect(response.session_state?.collectedRewards).toHaveLength(100);
    expect(response.session_state?.collectedRewards[0]).toBe('мешочек оренов');
    expect(response.session_state?.collectedRewards[99]).not.toBe('мешочек оренов');
  });

  it('always loses a life against the unbeatable monster', async () => {
    mockedCreateEncounter.mockResolvedValueOnce(encounterB);

    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 8 },
        state: {
          session: {
            phase: 'choose_weapon',
            lives: 3,
            victories: 2,
            selectedSchool: 'Грифона',
            recentMonsterNames: [],
            collectedRewards: ['гвинт-карта из таверны'],
            encounter: gaunterEncounter,
          },
        },
        request: { command: 'Золотая секира', original_utterance: 'Золотая секира' },
      })
    );

    expect(response.session_state?.lives).toBe(2);
    expect(response.session_state?.victories).toBe(2);
    expect(response.response.text).toContain('бессильно любое оружие');
    expect(response.session_state?.encounter?.monsterName).toBe(encounterB.monsterName);
  });

  it('ends the run against the unbeatable monster on the last life', async () => {
    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 9 },
        state: {
          session: {
            phase: 'choose_weapon',
            lives: 1,
            victories: 5,
            selectedSchool: 'Грифона',
            recentMonsterNames: [],
            collectedRewards: ['мешочек оренов'],
            encounter: gaunterEncounter,
          },
        },
        request: { command: 'второй', original_utterance: 'второй' },
      })
    );

    expect(response.session_state?.lives).toBe(0);
    expect(response.session_state?.phase).toBe('game_over');
    expect(response.response.text).toContain("Гюнтер о'Дим");
    expect(response.response.text).toContain('Поход завершён');
  });

  it('restarts game after game over', async () => {
    const response = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 6 },
        state: {
          session: {
            phase: 'game_over',
            lives: 0,
            victories: 4,
            selectedSchool: 'Грифона',
            recentMonsterNames: ['Леший'],
            collectedRewards: ['мешочек оренов'],
          },
        },
        request: {
          command: 'заново',
          original_utterance: 'заново',
        },
      })
    );

    expect(response.session_state?.phase).toBe('choose_school');
    expect(response.session_state?.lives).toBe(3);
    expect(response.session_state?.collectedRewards).toEqual([]);
    expect(response.response.text).toContain('Новый контракт');
  });

  it('keeps progress without incoming state.session', async () => {
    mockedCreateEncounter.mockResolvedValueOnce(encounterA).mockResolvedValueOnce(encounterB);

    const schoolResponse = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 10, session_id: 'persisted-session' },
        request: { command: 'Кота', original_utterance: 'Кота' },
      })
    );

    expect(schoolResponse.session_state?.phase).toBe('choose_weapon');
    expect(schoolResponse.session_state?.encounter?.monsterName).toBe(encounterA.monsterName);

    const fightResponse = await handleYandexWitcherRequest(
      requestWithOverrides({
        session: { new: false, message_id: 11, session_id: 'persisted-session' },
        request: {
          command: 'яблочный сок',
          original_utterance: 'Яблочный сок',
        },
      })
    );

    expect(fightResponse.response.text).toContain('Неверный выбор');
    expect(fightResponse.session_state?.phase).toBe('choose_weapon');
    expect(fightResponse.session_state?.lives).toBe(2);
    expect(fightResponse.session_state?.encounter?.monsterName).toBe(encounterB.monsterName);
  });
});
