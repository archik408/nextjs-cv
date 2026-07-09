export const YANDEX_DIALOGS_VERSION = '1.0' as const;

export const WITCHER_SKILL_NAME = 'Ведьмак для Матвея';
export const MAX_LIVES = 3;
export const RECENT_MONSTERS_WINDOW = 10;

export type YandexRequestType = 'SimpleUtterance' | 'ButtonPressed' | 'Show.Pull';

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
    session?: WitcherSessionState;
    user?: Record<string, unknown>;
    application?: Record<string, unknown>;
  };
  version: string;
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
  session_state?: WitcherSessionState;
}

export type WitcherSchool = 'Кота' | 'Волка' | 'Змеи' | 'Грифона' | 'Мантикоры' | 'Медведя';

export const WITCHER_SCHOOLS: readonly WitcherSchool[] = [
  'Кота',
  'Волка',
  'Змеи',
  'Грифона',
  'Мантикоры',
  'Медведя',
];

export interface WitcherMonster {
  name: string;
  description: string;
  location: string[];
  weaknesses: string[];
}

export interface WitcherEncounter {
  monsterName: string;
  monsterDescription: string;
  locationName: string;
  locationPhrase: string;
  options: string[];
  correctOption: string;
}

export interface WitcherSessionState {
  phase: 'choose_school' | 'choose_weapon' | 'game_over';
  lives: number;
  victories: number;
  selectedSchool?: WitcherSchool;
  recentMonsterNames: string[];
  encounter?: WitcherEncounter;
}

export type WitcherAction =
  | 'session_start'
  | 'help'
  | 'goodbye'
  | 'restart'
  | 'choose_school'
  | 'choose_weapon'
  | 'unknown';

export interface ParsedWitcherCommand {
  action: WitcherAction;
  raw: string;
  school?: WitcherSchool;
  weapon?: string;
}
