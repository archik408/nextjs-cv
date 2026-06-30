export const YANDEX_DIALOGS_VERSION = '1.0' as const;

export const SKILL_NAME = 'Мой microbit';

export type YandexRequestType = 'SimpleUtterance' | 'ButtonPressed' | 'Show.Pull';

export type MicrobitCommand = 'smile' | 'sound';

export interface YandexAliceRequest {
  meta: {
    locale: string;
    timezone: string;
    client_id?: string;
    interfaces?: Record<string, object>;
  };
  session: {
    message_id: number;
    session_id: string;
    skill_id: string;
    user_id?: string;
    user?: {
      user_id: string;
      access_token?: string;
    };
    application: {
      application_id: string;
    };
    new: boolean;
  };
  request: {
    command: string;
    original_utterance: string;
    type: YandexRequestType;
    nlu?: {
      tokens: string[];
      entities: unknown[];
      intents?: Record<string, unknown>;
    };
    payload?: Record<string, unknown>;
    markup?: {
      dangerous_context?: boolean;
    };
  };
  state?: {
    session?: MicrobitSessionState;
    user?: Record<string, unknown>;
    application?: Record<string, unknown>;
  };
  version: string;
}

export interface MicrobitSessionState {
  lastCommand?: MicrobitCommand;
  lastActionAt?: string;
  bridgeStatus?: 'sent' | 'queued' | 'failed';
}

export interface YandexAliceButton {
  title: string;
  payload?: Record<string, unknown>;
  hide?: boolean;
}

export interface YandexAliceResponse {
  version: typeof YANDEX_DIALOGS_VERSION;
  response: {
    text: string;
    tts: string;
    end_session: boolean;
    buttons?: YandexAliceButton[];
  };
  session_state?: MicrobitSessionState;
}

export type MicrobitAction =
  | 'session_start'
  | 'smile'
  | 'sound'
  | 'status'
  | 'help'
  | 'goodbye'
  | 'unknown';

export interface ParsedMicrobitCommand {
  action: MicrobitAction;
  raw: string;
}
