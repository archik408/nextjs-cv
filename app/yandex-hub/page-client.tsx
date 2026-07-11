'use client';

import { YandexAliceChat } from '@/components/yandex-alice-chat';

export function YandexHubPageClient() {
  return (
    <YandexAliceChat
      skill="yandex-hub"
      title="Мой Микробит"
      description="Текстовый режим навыка Яндекс Станции для управления Микробитом"
      startText="Начните диалог, чтобы отправлять команды Микробиту текстом и видеть ответы Алисы."
      infoText="Страница передаёт сообщения существующему навыку «Мой Микробит» без изменения его протокола. Можно выбрать готовую команду или написать свою."
      accent="blue"
    />
  );
}
