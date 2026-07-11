import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YandexAliceChat } from '@/components/yandex-alice-chat';

jest.mock('@/components/navigation-buttons', () => ({
  __esModule: true,
  default: () => null,
}));

const chatProps = {
  skill: 'yandex-hub' as const,
  title: 'Мой Микробит',
  description: 'Описание',
  startText: 'Начните диалог',
  infoText: 'Информация',
  accent: 'blue' as const,
};

describe('YandexAliceChat', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts a session and sends a button payload', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            text: 'Выберите команду',
            buttons: [{ title: 'Улыбнись', payload: { command: 'улыбнись' } }],
            endSession: false,
            sessionState: {},
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            text: 'Показываю улыбку',
            buttons: [],
            endSession: false,
            sessionState: { lastCommand: 'smile' },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );
    const user = userEvent.setup();

    render(<YandexAliceChat {...chatProps} />);
    await user.click(screen.getByRole('button', { name: 'Начать сессию' }));

    expect(await screen.findByText('Выберите команду')).toBeInTheDocument();
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
});
