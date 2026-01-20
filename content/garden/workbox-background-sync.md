---
title: Настройка Workbox Background Sync для совместимости с iOS и Android WebView
description: Практический гайд - как доотправлять запросы оффлайн надёжно на iOS/Safari и Android WebView. Решение проблем с Service Worker и IndexedDB.
date: 2025-06-05
tags: [pwa, service-worker, workbox, offline, ios, android, seedling]
---

Важность надежной обработки запросов в оффлайн-режиме невозможно переоценить, особенно для приложений, которые должны функционировать и в отсутствии интернет-соединения. [Workbox](https://developer.chrome.com/docs/workbox?hl=ru) - это мощный инструмент для управления [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) в браузерах, он как раз призван решать подобную задачу при помощи соответствующего плагина, но поддержка [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) не универсальна. В этой статье я покажу, как расширить Workbox, чтобы Background Sync корректно работал даже на платформе iOS/Safari, которая не поддерживает Sync Manager, и на старых версиях Android WebView (Chromium).

## Понимание ограничений нативного Background Sync API

Background Sync API позволяет приложениям завершать сетевые задачи, которые были прерваны в оффлайне, как только устройство восстанавливает подключение, при помощи события [SyncEvent](https://caniuse.com/mdn-api_syncevent). Тем не менее, существуют два ключевых ограничения: API не поддерживается в браузере Safari и может быть отключен в Android WebView (к примеру, на уровне настроек браузера, в этом случае клиент получает ошибку _UnknownError: Background Sync is disabled_). Таким образом, нам необходимо обеспечить альтернативный способ обработки подобных задач.

## Использование Workbox Background Sync

Workbox предоставляет плагин Background Sync, который можно настроить для различных сценариев обработки запросов. Мое решение значительно расширяет функционал Workbox Background Sync и делает его кроссбраузерным. Не хочется писать велосипед с нуля, гораздо удобнее переиспользовать все то, что уже есть в коробке плагина Workbox в части готовых интерфейсов и его работы с IndexedDB для сохранения копий запросов.

> "Болтовня ничего не стоит. Покажите мне код." Линус Торвальдс

Ниже инициализация фонового синхронизатора с заданными параметрами в файле ServiceWorker, а также сам код расширения плагина Workbox Background Sync, который повторяет запросы с интервалом и растит его экспоненциально в случае отката (так называемая [стратегия Exponential Backoff Retry](https://advancedweb.hu/how-to-implement-an-exponential-backoff-retry-strategy-in-javascript/)):

### service-worker.js

```javascript
// service-worker.js

backgroundSyncInit(self, {
  queueName: 'OfflineRequests', // Имя очереди для хранения запросов в IndexedDB
  maxRetentionTime: 24 * 60, // Максимальное время хранения запросов в очереди (24 часа)
  urls: SYNC_URLS, // Список URL для синхронизации
});
```

### backgroundSyncInit.ts

```typescript
// backgroundSyncInit.ts

import { updateAccessToken } from './accessToken';
import { FALLBACK_SYNC_EVENT, REFRESH_TOKEN_EVENT } from './events';
import initBackgroundSyncQueue from './initBackgroundSyncQueue';

// Само собой, нас интересует исключительно отправка данных, которая утеряна,
// поэтому запросу на получение данных (GET, OPTIONS и т.д.) исключаем
const HTTP_CHANGE_VERBS = ['POST', 'PUT', 'PATCH', 'DELETE'];

interface IParams {
  queueName: string;
  maxRetentionTime?: number;
  urls: Array<string>;
  statuses: Array<number>;
}

const backgroundSyncInit = (
  self,
  { queueName, maxRetentionTime, urls, excludeUrls, statuses = [] }: IParams
) => {
  const { queue, onQueueSync, handleRequest } = createQueue(self, {
    queueName,
    maxRetentionTime,
    badStatuses: statuses,
  });

  self.addEventListener('fetch', (event) => {
    if (
      !HTTP_CHANGE_VERBS.includes(event.request.method) ||
      !urls.find((url) => event.request.url.includes(url))
    ) {
      return;
    }
    event.respondWith(handleRequest(event));
  });

  self.addEventListener('message', async (event) => {
    if (event?.data?.type === FALLBACK_SYNC_EVENT) {
      updateAccessToken(event?.data?.token);
      await onQueueSync({ queue });
    }

    if (event?.data?.type === REFRESH_TOKEN_EVENT) {
      updateAccessToken(event?.data?.token);
    }
  });
};

export default backgroundSyncInit;
```

### createQueue.ts

Основная логика с мьютексом для предотвращения одновременной обработки очереди, проверкой статусов и стратегией Exponential Backoff:

```typescript
const MIN_BACKOFF_DEPTH = 4;
const MAX_BACKOFF_DEPTH = 10;

const hasBadStatusAndShouldBeRepeated = (response, badStatuses = [], metadata?) => {
  const hasNoStatus = !response.status;
  const hasBadStatus = badStatuses.includes(response.status);
  const isServerError = response.status >= 500;
  const isReachedRepeatLimit =
    metadata?.backOffDepth && metadata?.backOffDepth >= MAX_BACKOFF_DEPTH;
  return (hasNoStatus || hasBadStatus || isServerError) && !isReachedRepeatLimit;
};
```

### Триггер через online - альтернатива SyncManager

Триггером к началу работы очереди, вместо SyncManager может послужить более старое и стабильное API, которая дает понять, что наше приложение вернулось в online:

```javascript
window.addEventListener('online', () => {
  navigator?.serviceWorker?.controller?.postMessage({
    type: 'FALLBACK_SYNC_EVENT',
  });
});
```

### Перехват изменяющих запросов в SW

```javascript
self.addEventListener('fetch', (event) => {
  const changeVerbs = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!changeVerbs.includes(event.request.method)) return;
  event.respondWith(handleRequest(event));
});
```

## Основные акценты реализации

- Я реализую кастомное событие **FALLBACK_SYNC_EVENT**, которое по факту заменяет нативное событие SyncEvent.
- **handleRequest** метод обеспечивает клонирование запроса и соответствующую повторную отправку на сервер.
- **hasBadStatusAndShouldBeRepeated** функция проверяет статус ответа и определяет, требует ли запрос повторной попытки или новой отправки в очередь.
- Метаданные запроса хранят информацию об интервале, через который запрос нужно повторить, а также о том, пришел ли этот запрос после ошибочного повтора или впервые в очередь.

## Практические советы

- Не кладите в очередь GET/OPTIONS — они не меняют состояние.
- Обновляйте access token перед пакетной доотправкой, чтобы избежать 401/403.
- Логируйте причины отказов (5xx/429/сеть) и метрики повторов.

## Итоги

Расширение возможности Workbox Background Sync для поддержки всех платформ, включая iOS и частичные реализации Android WebView, требует немало кода. Тем не менее, этот код легко масштабируем и готов для обработки нестандартных ошибок и ограничений, он дает определенную гибкость. А самое главное, что мы все также остаемся в связке с Workbox, и в случае более широкой поддержки Background Synchronization API можно легко откатиться на оригинальный плагин без собственных расширений.

---

### Связанные заметки

- [[View Transitions в React — рабочий инструмент, который уже год в продакшене](/garden/view-transitions)]
- [[Вычисление видимой части viewport](/garden/viewport)]
- [[Переход по DeepLink из Web](/garden/deeplink-web)]
- [[Конфликт оффлайн функциональности и ленивой подгрузки](/garden/offline-vs-lazy-loading)]
- [[Улучшение просмотра изображений](/garden/zoom)]
