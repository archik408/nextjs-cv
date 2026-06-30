import { parseMicrobitCommand } from '@/lib/yandex-hub/commands';
import { handleYandexAliceRequest } from '@/lib/yandex-hub/handler';
import type { YandexAliceRequest } from '@/lib/yandex-hub/types';

const baseRequest: YandexAliceRequest = {
  meta: {
    locale: 'ru-RU',
    timezone: 'UTC',
    client_id: 'ru.yandex.searchplugin/7.16 (none none; android 4.4.2)',
    interfaces: {
      screen: {},
      payments: {},
      account_linking: {},
    },
  },
  session: {
    message_id: 0,
    session_id: '4427f1a8-7705-404e-9a5d-8e9d07cf87a7',
    skill_id: '7ee45112-44eb-49bd-a78d-754368697a50',
    user: {
      user_id: '620E1CD22DC512E1EB2EB3667A15DF2F928D47B6F956E82FB0099EF1E67D282A',
    },
    application: {
      application_id: '451086D32C4E6CE02A479025DE555B7CC5F7BE1F6825A7E95F2BC7374193724B',
    },
    user_id: '451086D32C4E6CE02A479025DE555B7CC5F7BE1F6825A7E95F2BC7374193724B',
    new: true,
  },
  request: {
    command: '',
    original_utterance: '',
    nlu: {
      tokens: [],
      entities: [],
      intents: {},
    },
    markup: {
      dangerous_context: false,
    },
    type: 'SimpleUtterance',
  },
  version: '1.0',
};

describe('yandex-hub microbit skill', () => {
  it('parses smile command', () => {
    expect(parseMicrobitCommand('улыбнись', false)).toEqual({
      action: 'smile',
      raw: 'улыбнись',
    });
  });

  it('parses sound command', () => {
    expect(parseMicrobitCommand('издай звук', false)).toEqual({
      action: 'sound',
      raw: 'издай звук',
    });
  });

  it('responds to new session with microbit welcome', async () => {
    const response = await handleYandexAliceRequest(baseRequest);

    expect(response.version).toBe('1.0');
    expect(response.response.text).toContain('Мой Микробит');
    expect(response.response.end_session).toBe(false);
  });

  it('queues smile command when bridge is not configured', async () => {
    const response = await handleYandexAliceRequest({
      ...baseRequest,
      session: { ...baseRequest.session, new: false, message_id: 1 },
      request: {
        ...baseRequest.request,
        command: 'улыбнись',
        original_utterance: 'улыбнись',
      },
    });

    expect(response.response.text).toContain('улыбку');
    expect(response.session_state?.lastCommand).toBe('smile');
    expect(response.session_state?.bridgeStatus).toBe('queued');
  });

  it('returns status with last command', async () => {
    const smile = await handleYandexAliceRequest({
      ...baseRequest,
      session: { ...baseRequest.session, new: false, message_id: 1 },
      request: {
        ...baseRequest.request,
        command: 'пищи',
        original_utterance: 'пищи',
      },
    });

    const status = await handleYandexAliceRequest({
      ...baseRequest,
      session: { ...baseRequest.session, new: false, message_id: 2 },
      state: { session: smile.session_state },
      request: {
        ...baseRequest.request,
        command: 'статус',
        original_utterance: 'статус',
      },
    });

    expect(status.response.text).toContain('звук');
  });
});
