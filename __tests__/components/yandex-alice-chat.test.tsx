import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YandexAliceChat } from '@/components/yandex-alice-chat';

jest.mock('@/components/navigation-buttons', () => ({
  __esModule: true,
  default: () => null,
}));

const originalFetch = global.fetch;

describe('YandexAliceChat', () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('starts a session and sends a button payload', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          text: 'Выберите команду',
          buttons: [{ title: 'Улыбнись', payload: { command: 'улыбнись' } }],
          endSession: false,
          sessionState: {},
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          text: 'Показываю улыбку',
          buttons: [],
          endSession: false,
          sessionState: { lastCommand: 'smile' },
        }),
      });
    global.fetch = fetchMock;
    const user = userEvent.setup();

    render(<YandexAliceChat />);
    await user.click(screen.getByRole('button', { name: /Мой Микробит/ }));

    expect(await screen.findByText('Выберите команду')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/yandex-chat/yandex-hub', expect.any(Object));
    const firstRequest = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(firstRequest).toMatchObject({
      command: '',
      messageId: 0,
      isNew: true,
    });

    await user.click(screen.getByRole('button', { name: 'Улыбнись' }));
    expect(await screen.findByText('Показываю улыбку')).toBeInTheDocument();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const secondRequest = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(secondRequest).toMatchObject({
      command: 'Улыбнись',
      messageId: 1,
      isNew: false,
      payload: { command: 'улыбнись' },
      sessionState: {},
    });
  });

  it('starts the selected Witcher skill through its existing web API slug', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'Выберите школу',
        buttons: [],
        endSession: false,
        sessionState: {},
      }),
    });
    global.fetch = fetchMock;
    const user = userEvent.setup();

    render(<YandexAliceChat />);
    await user.click(screen.getByRole('button', { name: /Ведьмак для Матвея/ }));

    expect(await screen.findByText('Выберите школу')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/yandex-chat/yandex-witcher', expect.any(Object));
  });
});
