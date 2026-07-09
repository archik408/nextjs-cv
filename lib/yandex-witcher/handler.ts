import { extractCommandText, parseWitcherCommand, resolveWeaponChoice } from './commands';
import { createEncounter, pushRecentMonster } from './monsters';
import { createInitialWitcherSessionState, normalizeWitcherSessionState } from './session';
import { MAX_LIVES, WITCHER_SCHOOLS, WITCHER_SKILL_NAME, YANDEX_DIALOGS_VERSION } from './types';
import type {
  ParsedWitcherCommand,
  WitcherSchool,
  WitcherSessionState,
  YandexAliceButton,
  YandexAliceRequest,
  YandexAliceResponse,
} from './types';

const VICTORY_REWARDS = [
  'мешочек оренов',
  'редкий алхимический рецепт',
  'ведьмачий трофей',
  'новое зелье для мутагенов',
  'карту с тайником мастера',
];

const runtimeSessionStore = new Map<string, WitcherSessionState>();

function randomItem<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function buildSchoolButtons(): YandexAliceButton[] {
  return WITCHER_SCHOOLS.map((school) => ({
    title: school,
    payload: { command: school },
  }));
}

function buildWeaponButtons(options: string[]): YandexAliceButton[] {
  return options.map((option) => ({
    title: option,
    payload: { command: option, weapon: option },
  }));
}

function buildHelpText(): string {
  return [
    `Вы в навыке «${WITCHER_SKILL_NAME}». Давайте начнем охоту на монстров.`,
    'Сначала выберите школу ведьмаков: Кота, Волка, Змеи, Грифона, Мантикоры или Медведя.',
    'В каждом бою выбирайте одно из трёх оружий или средств против чудовища.',
    `У вас ${MAX_LIVES} жизни. Ошибка в выборе оружия отнимает жизнь.`,
    'Когда жизни закончатся, скажите «заново», чтобы начать новую охоту на монстров.',
  ].join(' ');
}

async function startBattle(state: WitcherSessionState): Promise<WitcherSessionState> {
  const encounter = await createEncounter(state.recentMonsterNames);
  return {
    ...state,
    phase: 'choose_weapon',
    encounter,
  };
}

function buildEncounterText(state: WitcherSessionState): string {
  if (!state.encounter) {
    return 'Я не смогла найти чудовище. Попробуйте ещё раз.';
  }

  return [
    `Ты ведьмак школы ${state.selectedSchool}.`,
    `Ты оказался ${state.encounter.locationPhrase}.`,
    `Перед тобой ${state.encounter.monsterName}: ${state.encounter.monsterDescription}`,
    `Выбери, чем сразить чудовище. У тебя ${state.lives} жизни.`,
  ].join(' ');
}

async function resolveSchoolSelection(
  state: WitcherSessionState,
  school: WitcherSchool
): Promise<{ nextState: WitcherSessionState; text: string; buttons: YandexAliceButton[] }> {
  const withSchool: WitcherSessionState = {
    ...createInitialWitcherSessionState(),
    selectedSchool: school,
  };

  const battleState = await startBattle(withSchool);
  return {
    nextState: battleState,
    text: `Добро пожаловать в мир Ведьмака! Ты выбрал школу ${school}. ${buildEncounterText(battleState)}`,
    buttons: battleState.encounter
      ? buildWeaponButtons(battleState.encounter.options)
      : buildSchoolButtons(),
  };
}

async function resolveCorrectAnswer(
  state: WitcherSessionState
): Promise<{ nextState: WitcherSessionState; text: string; buttons: YandexAliceButton[] }> {
  if (!state.encounter) {
    const fallback = await startBattle(state);
    return {
      nextState: fallback,
      text: buildEncounterText(fallback),
      buttons: fallback.encounter
        ? buildWeaponButtons(fallback.encounter.options)
        : buildSchoolButtons(),
    };
  }

  const reward = randomItem(VICTORY_REWARDS);
  const updatedState: WitcherSessionState = {
    ...state,
    victories: state.victories + 1,
    recentMonsterNames: pushRecentMonster(state.recentMonsterNames, state.encounter.monsterName),
    encounter: undefined,
  };

  const nextState = await startBattle(updatedState);
  return {
    nextState,
    text: `Отлично, ты победил существо ${state.encounter.monsterName}. Награда: ${reward}. Начинаем новый контракт. Побед: ${nextState.victories}. ${buildEncounterText(nextState)}`,
    buttons: nextState.encounter
      ? buildWeaponButtons(nextState.encounter.options)
      : buildSchoolButtons(),
  };
}

async function resolveWrongAnswer(
  state: WitcherSessionState
): Promise<{ nextState: WitcherSessionState; text: string; buttons: YandexAliceButton[] }> {
  if (!state.encounter) {
    const fallback = await startBattle(state);
    return {
      nextState: fallback,
      text: buildEncounterText(fallback),
      buttons: fallback.encounter
        ? buildWeaponButtons(fallback.encounter.options)
        : buildSchoolButtons(),
    };
  }

  const lives = Math.max(0, state.lives - 1);
  const updatedState: WitcherSessionState = {
    ...state,
    lives,
    recentMonsterNames: pushRecentMonster(state.recentMonsterNames, state.encounter.monsterName),
    encounter: undefined,
  };

  if (lives <= 0) {
    return {
      nextState: {
        ...updatedState,
        phase: 'game_over',
      },
      text: `Схватка проиграна. Тебя доставили в лазарет, но раны оказались смертельными. Поход завершён. Побед за этот забег: ${state.victories}. Скажи «заново», чтобы начать новую игру.`,
      buttons: [{ title: 'Заново', payload: { command: 'заново' } }],
    };
  }

  const nextState = await startBattle(updatedState);
  return {
    nextState,
    text: `Неверный выбор. Тебя ранили и отвезли в лазарет замка ведьмаков. Осталось жизней: ${lives}. Начинаем новый контракт. ${buildEncounterText(nextState)}`,
    buttons: nextState.encounter
      ? buildWeaponButtons(nextState.encounter.options)
      : buildSchoolButtons(),
  };
}

async function resolveByPhase(
  request: YandexAliceRequest,
  parsed: ParsedWitcherCommand,
  state: WitcherSessionState
): Promise<{
  text: string;
  buttons: YandexAliceButton[];
  nextState: WitcherSessionState;
  endSession: boolean;
}> {
  if (parsed.action === 'goodbye') {
    return {
      text: 'Слава на Пути. Возвращайся, когда будешь готов к новой охоте.',
      buttons: [],
      nextState: state,
      endSession: true,
    };
  }

  if (parsed.action === 'help') {
    const buttons =
      state.phase === 'choose_weapon' && state.encounter
        ? buildWeaponButtons(state.encounter.options)
        : buildSchoolButtons();
    return {
      text: buildHelpText(),
      buttons,
      nextState: state,
      endSession: false,
    };
  }

  if (
    parsed.action === 'restart' ||
    (state.phase === 'game_over' && parsed.action === 'session_start')
  ) {
    const initialState = createInitialWitcherSessionState();
    return {
      text: `Новый контракт начинается. Выбери школу: ${WITCHER_SCHOOLS.join(', ')}.`,
      buttons: buildSchoolButtons(),
      nextState: initialState,
      endSession: false,
    };
  }

  if (state.phase === 'game_over') {
    return {
      text: 'Поход завершён. Скажи «заново», чтобы начать новую игру ведьмака.',
      buttons: [{ title: 'Заново', payload: { command: 'заново' } }],
      nextState: state,
      endSession: false,
    };
  }

  if (state.phase === 'choose_school') {
    if (parsed.action !== 'choose_school' || !parsed.school) {
      return {
        text: `Добро пожаловать в мир Ведьмака! Выбери школу ведьмаков: ${WITCHER_SCHOOLS.join(', ')}.`,
        buttons: buildSchoolButtons(),
        nextState: state,
        endSession: false,
      };
    }

    const selection = await resolveSchoolSelection(state, parsed.school);
    return {
      text: selection.text,
      buttons: selection.buttons,
      nextState: selection.nextState,
      endSession: false,
    };
  }

  if (!state.encounter) {
    const restored = await startBattle(state);
    return {
      text: buildEncounterText(restored),
      buttons: restored.encounter
        ? buildWeaponButtons(restored.encounter.options)
        : buildSchoolButtons(),
      nextState: restored,
      endSession: false,
    };
  }

  const commandText = extractCommandText(request);
  const chosenWeapon = resolveWeaponChoice(request, commandText, state.encounter);
  if (!chosenWeapon) {
    return {
      text: `Нужно выбрать один из трёх вариантов оружия. ${buildEncounterText(state)}`,
      buttons: buildWeaponButtons(state.encounter.options),
      nextState: state,
      endSession: false,
    };
  }

  if (chosenWeapon === state.encounter.correctOption) {
    const resolved = await resolveCorrectAnswer(state);
    return {
      text: resolved.text,
      buttons: resolved.buttons,
      nextState: resolved.nextState,
      endSession: false,
    };
  }

  const resolved = await resolveWrongAnswer(state);
  return {
    text: resolved.text,
    buttons: resolved.buttons,
    nextState: resolved.nextState,
    endSession: false,
  };
}

export async function handleYandexWitcherRequest(
  request: YandexAliceRequest
): Promise<YandexAliceResponse> {
  const sessionId = request.session.session_id;
  if (request.session.new) {
    runtimeSessionStore.delete(sessionId);
  }

  const fallbackStoredState = runtimeSessionStore.get(sessionId);
  const state = normalizeWitcherSessionState(
    request.state?.session ?? fallbackStoredState ?? createInitialWitcherSessionState()
  );
  const commandText = extractCommandText(request);
  const parsed = parseWitcherCommand(commandText, request.session.new);

  const { text, buttons, nextState, endSession } = await resolveByPhase(request, parsed, state);

  if (endSession) {
    runtimeSessionStore.delete(sessionId);
  } else {
    runtimeSessionStore.set(sessionId, nextState);
  }

  return {
    version: YANDEX_DIALOGS_VERSION,
    response: {
      text,
      tts: text,
      end_session: endSession,
      buttons,
    },
    session_state: nextState,
  };
}
