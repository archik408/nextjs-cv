import { parseWebChatTurnRequest, simulateWebChatTurn } from '@/lib/yandex-chat/web-adapter';

describe('Yandex web chat adapter', () => {
  it('accepts a valid web chat turn', () => {
    expect(
      parseWebChatTurnRequest({
        command: 'помощь',
        sessionId: 'web-session_123',
        messageId: 1,
        isNew: false,
        payload: { command: 'помощь' },
        sessionState: { bridgeStatus: 'queued' },
      })
    ).toEqual({
      command: 'помощь',
      sessionId: 'web-session_123',
      messageId: 1,
      isNew: false,
      payload: { command: 'помощь' },
      sessionState: { bridgeStatus: 'queued' },
    });
  });

  it.each([
    null,
    {},
    { command: '', sessionId: '../invalid', messageId: 0, isNew: true },
    { command: '', sessionId: 'valid', messageId: -1, isNew: true },
    { command: '', sessionId: 'valid', messageId: 0, isNew: 'yes' },
  ])('rejects an invalid web chat turn: %p', (body) => {
    expect(parseWebChatTurnRequest(body)).toBeNull();
  });

  it('starts the hub handler through the unchanged Alice protocol', async () => {
    const response = await simulateWebChatTurn('yandex-hub', {
      command: '',
      sessionId: 'adapter-test-session',
      messageId: 0,
      isNew: true,
    });

    expect(response.text).toContain('Мой Микробит');
    expect(response.endSession).toBe(false);
    expect(response.buttons.map((button) => button.title)).toEqual([
      'Улыбнись',
      'Грусти',
      'Сердце',
      'Очисти',
      'Издай звук',
      'Логотип',
      'Да',
      'Нет',
      'Нажми А',
      'Нажми Б',
      'Пинг',
      'Помощь',
    ]);
  });
});
