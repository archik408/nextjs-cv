'use client';

import { YandexAliceChat } from '@/components/yandex-alice-chat';

export function YandexWitcherPageClient() {
  return (
    <YandexAliceChat
      skill="yandex-witcher"
      title="Ведьмак для Матвея"
      description="Текстовая версия приключения для Яндекс Станции"
      startText="Начните сессию, выберите школу ведьмаков и отвечайте Алисе готовыми вариантами или своим текстом."
      infoText="Страница воспроизводит обычный диалог с навыком «Ведьмак для Матвея»: сохраняет состояние охоты, жизни и победы в пределах текущей сессии."
      accent="purple"
    />
  );
}
