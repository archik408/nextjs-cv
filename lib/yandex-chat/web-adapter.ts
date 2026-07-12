import { handleYandexAliceRequest } from '@/lib/yandex-hub/handler';
import type {
  MicrobitSessionState,
  YandexAliceButton as HubButton,
  YandexAliceRequest as HubRequest,
} from '@/lib/yandex-hub/types';
import { YANDEX_DIALOGS_VERSION as HUB_PROTOCOL_VERSION } from '@/lib/yandex-hub/types';
import { handleYandexWitcherRequest } from '@/lib/yandex-witcher/handler';
import type {
  WitcherSessionState,
  YandexAliceButton as WitcherButton,
  YandexAliceRequest as WitcherRequest,
} from '@/lib/yandex-witcher/types';
import { YANDEX_DIALOGS_VERSION as WITCHER_PROTOCOL_VERSION } from '@/lib/yandex-witcher/types';

export interface WebChatTurnRequest {
  command: string;
  sessionId: string;
  messageId: number;
  isNew: boolean;
  payload?: Record<string, unknown>;
  sessionState?: unknown;
}

export interface WebChatTurnResponse {
  text: string;
  buttons: Array<HubButton | WitcherButton>;
  endSession: boolean;
  sessionState?: MicrobitSessionState | WitcherSessionState;
}

export type WebChatSkill = 'yandex-hub' | 'yandex-witcher';

const MAX_COMMAND_LENGTH = 1000;
const MAX_SESSION_ID_LENGTH = 128;
const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseWebChatTurnRequest(body: unknown): WebChatTurnRequest | null {
  if (!isRecord(body)) {
    return null;
  }

  const { command, sessionId, messageId, isNew, payload, sessionState } = body;
  if (
    typeof command !== 'string' ||
    command.length > MAX_COMMAND_LENGTH ||
    typeof sessionId !== 'string' ||
    sessionId.length === 0 ||
    sessionId.length > MAX_SESSION_ID_LENGTH ||
    !SESSION_ID_PATTERN.test(sessionId) ||
    typeof messageId !== 'number' ||
    !Number.isSafeInteger(messageId) ||
    messageId < 0 ||
    typeof isNew !== 'boolean' ||
    (payload !== undefined && !isRecord(payload)) ||
    (sessionState !== undefined && !isRecord(sessionState))
  ) {
    return null;
  }

  return {
    command,
    sessionId,
    messageId,
    isNew,
    ...(payload ? { payload } : {}),
    ...(sessionState ? { sessionState } : {}),
  };
}

function buildRequestBase(input: WebChatTurnRequest, skillId: string) {
  const command = input.command.trim();

  return {
    meta: {
      locale: 'ru-RU',
      timezone: 'UTC',
      client_id: 'web-text-simulator',
    },
    session: {
      message_id: input.messageId,
      session_id: input.sessionId,
      skill_id: skillId,
      application: {
        application_id: 'web-text-simulator',
      },
      new: input.isNew,
    },
    request: {
      command,
      original_utterance: command,
      type: input.payload ? ('ButtonPressed' as const) : ('SimpleUtterance' as const),
      nlu: {
        tokens: command ? command.toLocaleLowerCase('ru-RU').split(/\s+/u) : [],
        entities: [],
      },
      ...(input.payload ? { payload: input.payload } : {}),
    },
  };
}

export async function simulateWebChatTurn(
  skill: WebChatSkill,
  input: WebChatTurnRequest
): Promise<WebChatTurnResponse> {
  if (skill === 'yandex-hub') {
    const request: HubRequest = {
      ...buildRequestBase(input, process.env.YANDEX_HUB_SKILL_ID ?? 'web-yandex-hub'),
      version: HUB_PROTOCOL_VERSION,
      ...(input.sessionState
        ? { state: { session: input.sessionState as MicrobitSessionState } }
        : {}),
    };
    const result = await handleYandexAliceRequest(request);

    return {
      text: result.response.text,
      buttons: result.response.buttons ?? [],
      endSession: result.response.end_session,
      sessionState: result.session_state,
    };
  }

  const request: WitcherRequest = {
    ...buildRequestBase(input, process.env.YANDEX_WITCHER_SKILL_ID ?? 'web-yandex-witcher'),
    version: WITCHER_PROTOCOL_VERSION,
    ...(input.sessionState
      ? { state: { session: input.sessionState as WitcherSessionState } }
      : {}),
  };
  const result = await handleYandexWitcherRequest(request);

  return {
    text: result.response.text,
    buttons: result.response.buttons ?? [],
    endSession: result.response.end_session,
    sessionState: result.session_state,
  };
}
