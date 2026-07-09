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
};

const encounterB: WitcherEncounter = {
  monsterName: 'Гуль',
  monsterDescription: 'Трупоед с бледной кожей.',
  locationName: 'Кладбище',
  locationPhrase: 'на кладбище',
  options: ['Масло против некрофагов', 'Рабочая кирка', 'Золотой фальшион'],
  correctOption: 'Масло против некрофагов',
};

const encounterC: WitcherEncounter = {
  monsterName: 'Сирена',
  monsterDescription: 'Опасный гибрид, заманивающий путников пением.',
  locationName: 'Побережье',
  locationPhrase: 'на побережье',
  options: ['Магический знак Аард', 'Медная булава', 'Сушеная лаванда'],
  correctOption: 'Магический знак Аард',
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
  beforeEach(() => {
    mockedCreateEncounter.mockReset();
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
    expect(response.response.text).toContain(encounterA.monsterName);
    expect(response.response.buttons).toHaveLength(3);
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
  });

  it('loses all lives and moves to game over', async () => {
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
    expect(thirdLoss.response.text).toContain('смертельными');
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
