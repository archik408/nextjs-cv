import { dispatchMicrobitCommand } from './bridge';
import {
  formatMicrobitCommandCatalogForAlice,
  formatMicrobitWelcomeHint,
  MICROBIT_COMMAND_CATALOG,
} from './command-catalog';
import { parseMicrobitCommand } from './commands';
import { createInitialSessionState, normalizeSessionState } from './session';
import type {
  MicrobitCommand,
  MicrobitSessionState,
  MicrobitSimpleAliceCommand,
  ParsedMicrobitCommand,
  YandexAliceButton,
  YandexAliceRequest,
  YandexAliceResponse,
} from './types';
import { MICROBIT_SIMPLE_ALICE_COMMANDS, SKILL_NAME, YANDEX_DIALOGS_VERSION } from './types';

const SIMPLE_RESPONSE: Record<MicrobitSimpleAliceCommand, { text: string; label: string }> = {
  smile: { text: 'Показываю улыбку на Микробит.', label: 'улыбка' },
  sound: { text: 'Издаю звук на Микробит.', label: 'звук' },
  sad: { text: 'Показываю грусть на Микробит.', label: 'грусть' },
  logo: { text: 'Нажимаю логотип на Микробит.', label: 'логотип' },
  clear: { text: 'Очищаю экран Микробит.', label: 'очистка' },
  heart: { text: 'Рисую сердце на Микробит.', label: 'сердце' },
  yes: { text: 'Рисую «да» на Микробит.', label: 'да' },
  no: { text: 'Рисую «нет» на Микробит.', label: 'нет' },
  ping: { text: 'Проверяю связь с Микробит.', label: 'пинг' },
  btn_a: { text: 'Нажимаю кнопку A на Микробит.', label: 'кнопка A' },
  btn_b: { text: 'Нажимаю кнопку B на Микробит.', label: 'кнопка B' },
};

function buildHelpText(): string {
  return [`Я навык «${SKILL_NAME}».`, formatMicrobitCommandCatalogForAlice()].join('\n');
}

function buildSkillButtons(): YandexAliceButton[] {
  const commandButtons: YandexAliceButton[] = MICROBIT_COMMAND_CATALOG.filter(
    (entry) => entry.phrase !== 'помощь' && entry.phrase !== 'пока' && entry.phrase !== 'статус'
  ).map((entry) => ({
    title: entry.buttonTitle,
    payload: { command: entry.phrase },
  }));

  return [
    ...commandButtons,
    { title: 'Статус', payload: { command: 'статус' }, hide: true },
    { title: 'Помощь', payload: { command: 'помощь' }, hide: true },
  ];
}

function formatLastCommand(command: MicrobitCommand): string {
  if (typeof command === 'string') {
    return SIMPLE_RESPONSE[command].label;
  }
  if (command.type === 'text') {
    return `текст «${command.text}»`;
  }
  return `иконка ${command.name}`;
}

function buildBridgeSuffix(status: 'sent' | 'queued' | 'failed'): string {
  if (status === 'sent') {
    return ' Команда отправлена на Микробит.';
  }

  if (status === 'queued') {
    return ' Команда сохранена. Микробит получит её при следующем подключении.';
  }

  return ' Не удалось связаться с Микробит. Попробуйте ещё раз.';
}

async function executeMicrobitCommand(
  command: MicrobitCommand,
  sessionState: MicrobitSessionState
): Promise<MicrobitSessionState> {
  const bridgeStatus = await dispatchMicrobitCommand(command);

  return {
    ...sessionState,
    lastCommand: command,
    lastActionAt: new Date().toISOString(),
    bridgeStatus,
  };
}

function isSimpleAliceAction(
  action: ParsedMicrobitCommand['action']
): action is MicrobitSimpleAliceCommand {
  return (MICROBIT_SIMPLE_ALICE_COMMANDS as readonly string[]).includes(action);
}

async function resolveResponseForCommand(
  command: ParsedMicrobitCommand,
  sessionState: MicrobitSessionState
): Promise<{ text: string; endSession: boolean; nextState: MicrobitSessionState }> {
  switch (command.action) {
    case 'session_start':
      return {
        text: `Привет! Это навык «${SKILL_NAME}».\n${formatMicrobitWelcomeHint()}\n\n${formatMicrobitCommandCatalogForAlice()}`,
        endSession: false,
        nextState: sessionState,
      };

    case 'help':
      return {
        text: buildHelpText(),
        endSession: false,
        nextState: sessionState,
      };

    case 'status': {
      if (!sessionState.lastCommand) {
        return {
          text: 'Микробит ещё не получал команд в этой сессии. Скажите «улыбнись», «сердце» или «помощь».',
          endSession: false,
          nextState: sessionState,
        };
      }

      const statusLabel =
        sessionState.bridgeStatus === 'sent'
          ? 'доставлена'
          : sessionState.bridgeStatus === 'failed'
            ? 'не доставлена'
            : 'ожидает доставки';

      return {
        text: `Последняя команда: ${formatLastCommand(sessionState.lastCommand)}. Статус: ${statusLabel}.`,
        endSession: false,
        nextState: sessionState,
      };
    }

    case 'goodbye':
      return {
        text: 'До встречи! Микробит на связи.',
        endSession: true,
        nextState: sessionState,
      };

    case 'text': {
      if (!command.text) {
        return {
          text: 'Не поняла текст. Скажите, например: «напиши привет».',
          endSession: false,
          nextState: sessionState,
        };
      }
      const nextState = await executeMicrobitCommand(
        { type: 'text', text: command.text },
        sessionState
      );
      return {
        text: `Прокручиваю текст «${command.text}» на Микробит.${buildBridgeSuffix(nextState.bridgeStatus ?? 'queued')}`,
        endSession: false,
        nextState,
      };
    }

    case 'icon': {
      if (!command.iconName) {
        return {
          text: 'Не поняла иконку. Скажите, например: «иконка сердце» или «icon:happy».',
          endSession: false,
          nextState: sessionState,
        };
      }
      const nextState = await executeMicrobitCommand(
        { type: 'icon', name: command.iconName },
        sessionState
      );
      return {
        text: `Рисую иконку ${command.iconName} на Микробит.${buildBridgeSuffix(nextState.bridgeStatus ?? 'queued')}`,
        endSession: false,
        nextState,
      };
    }

    default: {
      if (isSimpleAliceAction(command.action)) {
        const nextState = await executeMicrobitCommand(command.action, sessionState);
        const { text } = SIMPLE_RESPONSE[command.action];
        return {
          text: `${text}${buildBridgeSuffix(nextState.bridgeStatus ?? 'queued')}`,
          endSession: false,
          nextState,
        };
      }

      return {
        text: `Не поняла команду «${command.raw}». Скажите «помощь», чтобы узнать доступные команды.`,
        endSession: false,
        nextState: sessionState,
      };
    }
  }
}

function extractCommand(request: YandexAliceRequest): string {
  if (request.request.type === 'ButtonPressed' && request.request.payload) {
    const payload = request.request.payload;
    const payloadCommand = payload.command;

    if (typeof payloadCommand === 'string' && payloadCommand.trim()) {
      if (payloadCommand === 'text' && typeof payload.text === 'string') {
        return `текст:${payload.text}`;
      }
      if (payloadCommand === 'icon' && typeof payload.icon === 'string') {
        return `иконка:${payload.icon}`;
      }
      return payloadCommand.trim();
    }
  }

  return (request.request.command || request.request.original_utterance || '').trim();
}

export async function handleYandexAliceRequest(
  request: YandexAliceRequest
): Promise<YandexAliceResponse> {
  const sessionState = normalizeSessionState(request.state?.session ?? createInitialSessionState());
  const commandText = extractCommand(request);
  const parsed = parseMicrobitCommand(commandText, request.session.new);
  const { text, endSession, nextState } = await resolveResponseForCommand(parsed, sessionState);

  return {
    version: YANDEX_DIALOGS_VERSION,
    response: {
      text,
      tts: text,
      end_session: endSession,
      buttons: buildSkillButtons(),
    },
    session_state: nextState,
  };
}
