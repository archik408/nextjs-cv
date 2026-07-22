import { dispatchMicrobitCommand } from './bridge';
import { parseMicrobitCommand } from './commands';
import { createInitialSessionState, normalizeSessionState } from './session';
import type {
  MicrobitCommand,
  MicrobitSessionState,
  ParsedMicrobitCommand,
  YandexAliceRequest,
  YandexAliceResponse,
} from './types';
import { SKILL_NAME, YANDEX_DIALOGS_VERSION } from './types';

function buildHelpText(): string {
  return [
    `Я навык «${SKILL_NAME}».`,
    'Скажите «улыбнись» — Микробит покажет улыбку.',
    'Скажите «издай звук» или «пищи» — Микробит подаст сигнал.',
    'Скажите «грусти» — Микробит покажет грустное лицо.',
    'Также доступны команды «статус» и «пока».',
  ].join(' ');
}

function formatLastCommand(command: MicrobitCommand): string {
  if (command === 'smile') {
    return 'улыбка';
  }
  if (command === 'sound') {
    return 'звук';
  }
  return 'грусть';
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

async function resolveResponseForCommand(
  command: ParsedMicrobitCommand,
  sessionState: MicrobitSessionState
): Promise<{ text: string; endSession: boolean; nextState: MicrobitSessionState }> {
  switch (command.action) {
    case 'session_start':
      return {
        text: `Привет! Это навык «${SKILL_NAME}». Скажите «улыбнись», «издай звук» или «грусти».`,
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
          text: 'Микробит ещё не получал команд в этой сессии. Скажите «улыбнись», «пищи» или «грусти».',
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

    case 'smile': {
      const nextState = await executeMicrobitCommand('smile', sessionState);
      return {
        text: `Показываю улыбку на Микробит.${buildBridgeSuffix(nextState.bridgeStatus ?? 'queued')}`,
        endSession: false,
        nextState,
      };
    }

    case 'sound': {
      const nextState = await executeMicrobitCommand('sound', sessionState);
      return {
        text: `Издаю звук на Микробит.${buildBridgeSuffix(nextState.bridgeStatus ?? 'queued')}`,
        endSession: false,
        nextState,
      };
    }

    case 'sad': {
      const nextState = await executeMicrobitCommand('sad', sessionState);
      return {
        text: `Показываю грусть на Микробит.${buildBridgeSuffix(nextState.bridgeStatus ?? 'queued')}`,
        endSession: false,
        nextState,
      };
    }

    case 'unknown':
    default:
      return {
        text: `Не поняла команду «${command.raw}». Скажите «улыбнись», «пищи», «грусти» или «помощь».`,
        endSession: false,
        nextState: sessionState,
      };
  }
}

function extractCommand(request: YandexAliceRequest): string {
  if (request.request.type === 'ButtonPressed' && request.request.payload) {
    const payloadCommand = request.request.payload.command;
    if (typeof payloadCommand === 'string' && payloadCommand.trim()) {
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
      buttons: [
        { title: 'Улыбнись', payload: { command: 'улыбнись' } },
        { title: 'Издай звук', payload: { command: 'издай звук' } },
        { title: 'Грусти', payload: { command: 'грусти' } },
        { title: 'Помощь', payload: { command: 'помощь' }, hide: true },
      ],
    },
    session_state: nextState,
  };
}
