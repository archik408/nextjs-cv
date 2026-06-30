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
    'Скажите «улыбнись» — micro:bit покажет улыбку.',
    'Скажите «издай звук» или «пищи» — micro:bit подаст сигнал.',
    'Также доступны команды «статус» и «пока».',
  ].join(' ');
}

function formatLastCommand(command: MicrobitCommand): string {
  return command === 'smile' ? 'улыбка' : 'звук';
}

function buildBridgeSuffix(status: 'sent' | 'queued' | 'failed'): string {
  if (status === 'sent') {
    return ' Команда отправлена на micro:bit.';
  }

  if (status === 'queued') {
    return ' Команда сохранена. micro:bit получит её при следующем подключении.';
  }

  return ' Не удалось связаться с micro:bit. Попробуйте ещё раз.';
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
        text: `Привет! Это навык «${SKILL_NAME}». Скажите «улыбнись» или «издай звук».`,
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
          text: 'micro:bit ещё не получал команд в этой сессии. Скажите «улыбнись» или «пищи».',
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
        text: 'До встречи! micro:bit на связи.',
        endSession: true,
        nextState: sessionState,
      };

    case 'smile': {
      const nextState = await executeMicrobitCommand('smile', sessionState);
      return {
        text: `Показываю улыбку на micro:bit.${buildBridgeSuffix(nextState.bridgeStatus ?? 'queued')}`,
        endSession: false,
        nextState,
      };
    }

    case 'sound': {
      const nextState = await executeMicrobitCommand('sound', sessionState);
      return {
        text: `Издаю звук на micro:bit.${buildBridgeSuffix(nextState.bridgeStatus ?? 'queued')}`,
        endSession: false,
        nextState,
      };
    }

    case 'unknown':
    default:
      return {
        text: `Не поняла команду «${command.raw}». Скажите «улыбнись», «пищи» или «помощь».`,
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
        { title: 'Помощь', payload: { command: 'помощь' }, hide: true },
      ],
    },
    session_state: nextState,
  };
}
