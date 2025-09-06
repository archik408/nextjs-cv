import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import CodeBlock from '@/components/code-block';
import ArticleTitle from '@/components/article-title';
import { StructuredData, createArticleSchema } from '@/components/structured-data';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Настройка Workbox Background Sync для совместимости с iOS и Android WebView',
  description:
    'Практический гайд: как доотправлять запросы оффлайн надёжно на iOS/Safari и Android WebView. Решение проблем с Service Worker и IndexedDB.',
  keywords:
    'Workbox, Background Sync, Service Worker, PWA, iOS Safari, Android WebView, IndexedDB, Offline',
  path: '/blog/workbox-background-sync',
  type: 'article',
  publishedTime: '2025-06-05T00:00:00.000Z',
  author: 'Artur Basak',
  locale: 'ru',
});

export default function ArticleWorkboxBackgroundSync() {
  const articleSchema = createArticleSchema({
    title: 'Настройка Workbox Background Sync для совместимости с iOS и Android WebView',
    description:
      'Практический гайд: как доотправлять запросы оффлайн надёжно на iOS/Safari и Android WebView. Решение проблем с Service Worker и IndexedDB.',
    url: 'https://arturbasak.dev/blog/workbox-background-sync',
    publishedTime: '2025-06-05T00:00:00.000Z',
    author: 'Artur Basak',
  });

  return (
    <>
      <StructuredData data={articleSchema} />
      <article className="py-10 md:py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <span>На главную</span>
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <span>К списку статей</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
            </div>
          </nav>

          <ArticleTitle text="Настройка Workbox Background Sync для совместимости с iOS и Android WebView" />

          {/* Article metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <span>5 июня 2025</span>
            <span>•</span>
            <span>Artur Basak</span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Важность надежной обработки запросов в оффлайн-режиме невозможно переоценить, особенно
            для приложений, которые должны функционировать и в отсутствии интернет-соединения.{' '}
            <a
              href="https://developer.chrome.com/docs/workbox?hl=ru"
              target="_blank"
              rel="noopener noreferrer"
            >
              Workbox
            </a>{' '}
            - это мощный инструмент для управления{' '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"
              target="_blank"
              rel="noopener noreferrer"
            >
              Service Worker
            </a>{' '}
            в браузерах, он как раз призван решать подобную задачу при помощи соответствующего
            плагина, но поддержка{' '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API"
              target="_blank"
              rel="noopener noreferrer"
            >
              Background Sync API
            </a>{' '}
            не универсальна. В этой статье я покажу, как расширить Workbox, чтобы Background Sync
            корректно работал даже на платформе iOS/Safari, которая не поддерживает Sync Manager, и
            на старых версиях Android WebView (Chromium).
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            Понимание ограничений нативного Background Sync API
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Background Sync API позволяет приложениям завершать сетевые задачи, которые были
            прерваны в оффлайне, как только устройство восстанавливает подключение, при помощи
            события
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://caniuse.com/mdn-api_syncevent"
            >
              SyncEvent
            </a>
            . Тем не менее, существуют два ключевых ограничения: API не поддерживается в браузере
            Safari и может быть отключен в Android WebView (к примеру, на уровне настроек браузера,
            в этом случае клиент получает ошибку <i>UnknownError: Background Sync is disabled)</i>.
            Таким образом, нам необходимо обеспечить альтернативный способ обработки подобных задач.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            Использование Workbox Background Sync
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Workbox предоставляет плагин Background Sync, который можно настроить для различных
            сценариев обработки запросов. Мое решение значительно расширяет функционал Workbox
            Background Sync и делает его кроссбраузерным. Не хочется писать велосипед с нуля,
            гораздо удобнее переиспользовать все то, что уже есть в коробке плагина Workbox в части
            готовых интерфейсов и его работы с IndexedDB для сохранения копий запросов.
          </p>

          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
            &quot;Болтовня ничего не стоит. Покажите мне код.&ldquo; Линус Торвальдс
          </blockquote>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Ниже инициализация фонового синхронизатора с заданными параметрами в файле
            ServiceWorker, а также сам код расширения плагина Workbox Background Sync, который
            повторяет запросы с интервалом и растит его экспоненциально в случае отката (так
            называемая{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://advancedweb.hu/how-to-implement-an-exponential-backoff-retry-strategy-in-javascript/"
            >
              стратегия Exponential Backoff Retry
            </a>
            ):
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">service-worker.js</h3>
          <CodeBlock
            code={`// service-worker.js

backgroundSyncInit(self, {
  queueName: 'OfflineRequests', // Имя очереди для хранения запросов в IndexedDB
  maxRetentionTime: 24 * 60, // Максимальное время хранения запросов в очереди (24 часа)
  urls: SYNC_URLS, // Список URL для синхронизации
});`}
            language="javascript"
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">backgroundSyncInit.ts</h3>
          <CodeBlock
            language="typescript"
            code={`// backgroundSyncInit.ts

import { updateAccessToken } from './accessToken'; // Импорт функций для работы с токенами
import { FALLBACK_SYNC_EVENT, REFRESH_TOKEN_EVENT } from './events'; // Импорт событий для синхронизации
import initBackgroundSyncQueue from './initBackgroundSyncQueue'; // Импорт функции инициализации очереди

// Само собой, нас интересует исключительно отправка данных, которая утеряна,
// поэтому запросу на получение данных (GET, OPTIONS и т.д.) исключаем
const HTTP_CHANGE_VERBS = ['POST', 'PUT', 'PATCH', 'DELETE']; // HTTP методы, которые требуют синхронизации

interface IParams {
  queueName: string; // Имя очереди
  maxRetentionTime?: number; // Максимальное время хранения запросов
  urls: Array<string>; // URL для синхронизации
  statuses: Array<number>; // Статусы HTTP, которые считаются ошибочными
}

// Функция инициализации фоновой синхронизации
const backgroundSyncInit = (
  self,
  { queueName, maxRetentionTime, urls, excludeUrls, statuses = [] }: IParams,
) => {
  const { queue, onQueueSync, handleRequest } = createQueue(self, {
    queueName,
    maxRetentionTime,
    badStatuses: statuses,
  });

  // Обработчик событий для перехвата запросов
  self.addEventListener('fetch', (event) => {
    // Проверяем, является ли запрос подходящим для обработки
    if (
      !HTTP_CHANGE_VERBS.includes(event.request.method) ||
      !urls.find((url) => event.request.url.includes(url))
    ) {
      return; // Если нет, выходим из функции
    }
    event.respondWith(handleRequest(event)); // Обрабатываем запрос
  });

  // Обработчик сообщений от клиентов, фактически это и есть альтернатива SyncEvent
  self.addEventListener('message', async (event) => {
    // Обработка события для фоновой синхронизации (fallback) на iOS и некоторых Android WebView
    if (event?.data?.type === FALLBACK_SYNC_EVENT) {
      updateAccessToken(event?.data?.token); // Обновляем данные доступа, так как токен мог "протухнуть"
      await onQueueSync({ queue }); // Запускаем синхронизацию очереди
    }

    // Обработка события обновления токена
    if (event?.data?.type === REFRESH_TOKEN_EVENT) {
      updateAccessToken(event?.data?.token); // Обновляем данные доступа
    }
  });
};

export default backgroundSyncInit;`}
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">createQueue.ts</h3>
          <CodeBlock
            language="typescript"
            code={`// createQueue.ts

import { Queue } from 'workbox-background-sync'; // Импорт класса очереди
import { getFriendlyURL } from 'workbox-core/_private/getFriendlyURL';
import { WorkboxError } from 'workbox-core/_private/WorkboxError';
import { sleep } from 'utils/timers';

import {
  getAccessToken,
  requestAccessToken,
  updateAccessToken,
} from './accessToken'; // Импорт функций для работы с токенами
import { logInfo, logError } from './logger'; // Импорт функций для логирования

// Чтобы не DDoS-ить сервис, количество попыток конечно и происходит с определенным интервалом
const MIN_BACKOFF_DEPTH = 4; // Минимальная глубина отката
const MAX_BACKOFF_DEPTH = 10; // Максимальная глубина отката (максимум 6 попыток)

interface IParams {
  queueName: string; // Имя очереди
  maxRetentionTime: number; // Максимальное время хранения запросов
  badStatuses: Array<number>; // Ошибочные статусы - можно прокинуть статусы отличные от 5xx, если WAF маскирует ошибки
}

interface IEntryMeta {
  userId: string; // Идентификатор пользователя
  isFromError: boolean; // Флаг, указывающий на ошибку
  backOffDepth?: number; // Глубина отката
}

interface IEntry {
  request: Request; // Запрос
  metadata: IEntryMeta; // Метаданные запроса
}

// Мьютекс для предотвращения одновременной обработки очереди
const mutex = { blocked: false };

// Проверка, должен ли запрос быть повторен
const hasBadStatusAndShouldBeRepeated = (
  response,
  badStatuses = [],
  metadata?,
) => {
  const hasNoStatus = !response.status; // Проверка на отсутствие статуса
  const hasBadStatus = badStatuses.includes(response.status); // Проверка на ошибочный статус
  const isServerError = response.status >= 500; // Проверка на серверную ошибку
  const isReachedRepeatLimit =
    metadata?.backOffDepth && metadata?.backOffDepth >= MAX_BACKOFF_DEPTH; // Проверка на достижение лимита повторов
  return (
    (hasNoStatus || hasBadStatus || isServerError) && !isReachedRepeatLimit
  ); // Возвращаем true, если запрос должен быть повторен
};

// Функция инициализации очереди фоновой синхронизации
const createQueue = (
  self,
  { queueName, maxRetentionTime, badStatuses }: IParams,
) => {
  // Обработка элемента очереди
  const handleQueueEntry = async (queue, entry) => {
    const { userId: accountId, authorization } = getAccessToken(); // Получаем данные доступа
    const { request, metadata } = entry; // Извлекаем запрос и метаданные
    const { userId: requestUserId, isFromError, backOffDepth } = metadata || {}; // Извлекаем метаданные

    // Проверка на соответствие идентификаторов пользователя, так как одним устройством может пользоваться несколько аккаунтов
    if (requestUserId && requestUserId !== accountId) {
      await queue.unshiftRequest(entry); // Возвращаем запрос в очередь
      logError(\`Looks like this is request from another user account: accountId=\${accountId}, requestUserId=\${requestUserId}\`);
      throw new WorkboxError('queue-replay-failed', { name: queueName }); // Генерируем ошибку
    }

    // Обработка ошибок
    if (isFromError) {
      const depth = backOffDepth || 1; // Получаем глубину отката
      await sleep(2 ** depth * 10); // Задержка перед повтором
    }

    try {
      const clonedRequest = request.clone(); // Клонируем запрос
      if (authorization && clonedRequest.headers) {
        clonedRequest.headers.authorization = authorization; // Устанавливаем заголовок авторизации, так как токен мог "протухнуть"
      }
      const response = await fetch(clonedRequest); // Выполняем запрос

      // Проверка на ошибочный статус, если повтор завершился плохо, то возвращаем в очередь, но с новыми метаданными
      if (hasBadStatusAndShouldBeRepeated(response, badStatuses, metadata)) {
        await queue.unshiftRequest({
          request: clonedRequest,
          metadata: {
            ...(metadata || {}),
            isFromError: true,
            backOffDepth: (backOffDepth || MIN_BACKOFF_DEPTH) + 1, // Увеличиваем глубину отката
          },
        });
      }

      logInfo(\`Request for '\${getFriendlyURL(entry.request.url)}' has been replayed in queue '\${queueName}'\`);
    } catch (error) {
      // Если произошла ошибка, возвращаем запрос в очередь
      await queue.unshiftRequest(entry);
      logError(\`Request for '\${getFriendlyURL(entry.request.url)}' failed to replay, putting it back in queue '\${queueName}'\`, error);
      throw new WorkboxError('queue-replay-failed', { name: queueName });
    }
  };

  // Функция синхронизации очереди
  const onQueueSync = async ({ queue }) => {
    if (mutex.blocked) {
      logInfo('Looks like queue already in process right now, it should be finished before start again'); // Логируем, если очередь уже обрабатывается
      return; // Выходим из функции
    }
    if (!queue) {
      throw new WorkboxError('Cant find Queue instance', { name: queueName }); // Генерируем ошибку, если очередь не найдена
    }
    let isTokenRefreshed = false; // Флаг обновления токена
    let entry; // Переменная для хранения текущей записи в очереди
    mutex.blocked = true; // Устанавливаем мьютекс в заблокированное состояние
    try {
      while ((entry = await queue.shiftRequest())) { // Извлекаем записи из очереди
        // Пытаемся получить токен доступа только если очередь не пуста
        if (!isTokenRefreshed) {
          await requestAccessToken(self); // Запрашиваем данные доступа
          isTokenRefreshed = true; // Устанавливаем флаг обновления токена
        }
        await handleQueueEntry(queue, entry); // Обрабатываем запись очереди
      }
    } finally {
      mutex.blocked = false; // Разблокируем мьютекс после завершения обработки
    }
    logInfo(\`All requests in queue '\${queueName}' have successfully replayed; the queue is now empty!\`); // Логируем успешное завершение обработки очереди
  };

  // Создаем новую очередь с заданными параметрами
  const queue = new Queue(queueName, {
    maxRetentionTime,
    onSync: onQueueSync,
    forceSyncFallback: true, // Включаем режим резервного синхронизатора
  });

  return {
    queue,
    onQueueSync,
    handleRequest: async (event) => {
      const requestHeaders = new Headers(event.request?.headers); // Клонируем заголовки запроса
      updateAccessToken(requestHeaders?.get('Authorization')); // Обновляем данные доступа
      const accessData = getAccessToken(); // Получаем обновленные данные доступа
      logInfo('Request:', event.request);

      const { url, method, referrer, referrerPolicy, mode, credentials } = event.request; // Извлекаем параметры запроса

      const requestURL = new URL(url); // Создаем новый объект URL
      const body = await event.request.clone().arrayBuffer(); // Клонируем тело запроса

      const entry: IEntry = {
        request: new Request(requestURL.toString(), { // Создаем новый запрос
          method,
          headers: requestHeaders,
          body,
          mode,
          referrer,
          referrerPolicy,
          credentials,
        }),
        metadata: { userId: accessData.userId, isFromError: false }, // Устанавливаем метаданные
      };
      try {
        const response = await fetch(event.request.clone()); // Выполняем оригинальный запрос

        // Проверка на ошибочный статус
        if (hasBadStatusAndShouldBeRepeated(response, badStatuses)) {
          entry.metadata.isFromError = true; // Устанавливаем флаг ошибки
          entry.metadata.backOffDepth = MIN_BACKOFF_DEPTH; // Устанавливаем глубину отката
          await queue.pushRequest(entry); // Добавляем запись в очередь
        }

        return response; // Возвращаем ответ
      } catch (error) {
        // Если произошла ошибка, добавляем запись в очередь
        await queue.pushRequest(entry);
        throw error; // Прокидываем ошибку дальше
      }
    },
  };
};

export default createQueue;`}
          />
          <h3 className="text-xl font-semibold mt-6 mb-2">
            Триггер через online - альтернатива SyncManager
          </h3>
          <p>
            Триггером к началу работы очереди, вместо SyncManager может послужить более старое и
            стабильное API, которая дает понять, что наше приложение вернулось в online:
          </p>
          <CodeBlock
            code={`window.addEventListener('online', () => {
  navigator?.serviceWorker?.controller?.postMessage({
    type: 'FALLBACK_SYNC_EVENT',
  });
});`}
            language="javascript"
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">Перехват изменяющих запросов в SW</h3>
          <CodeBlock
            code={`self.addEventListener('fetch', (event) => {
  const changeVerbs = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!changeVerbs.includes(event.request.method)) return;
  event.respondWith(handleRequest(event));
});`}
            language="javascript"
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">Основные акценты реализации</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
            <li>
              Я реализую кастомное событие <b>FALLBACK_SYNC_EVENT</b>, которое по факту заменяет
              нативное событие SyncEvent.
            </li>
            <li>
              <b>handleRequest</b> метод обеспечивает клонирование запроса и соответствующую
              повторную отправку на сервер.
            </li>
            <li>
              <b>hasBadStatusAndShouldBeRepeated</b> функция проверяет статус ответа и определяет,
              требует ли запрос повторной попытки или новой отправки в очередь.
            </li>
            <li>
              Метаданные запроса хранят информацию об интервале, через который запрос нужно
              повторить, а также о том, пришел ли этот запрос после ошибочного повтора или впервые в
              очередь.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">Fallback‑синхронизация очереди в SW</h3>
          <CodeBlock
            code={`self.addEventListener('message', async (event) => {
  if (event?.data?.type === 'FALLBACK_SYNC_EVENT') {
    await onQueueSync({ queue });
  }
});`}
            language="javascript"
          />

          <h2 className="text-2xl font-semibold mt-8 mb-3">Практические советы</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
            <li>Не кладите в очередь GET/OPTIONS — они не меняют состояние.</li>
            <li>Обновляйте access token перед пакетной доотправкой, чтобы избежать 401/403.</li>
            <li>Логируйте причины отказов (5xx/429/сеть) и метрики повторов.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-3">Итоги</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Расширение возможности Workbox Background Sync для поддержки всех платформ, включая iOS
            и частичные реализации Android WebView, требует немало кода. Тем не менее, этот код
            легко масштабируем и готов для обработки нестандартных ошибок и ограничений, он дает
            определенную гибкость. А самое главное, что мы все также остаемся в связке с Workbox, и
            в случае более широкой поддержки Background Synchronization API можно легко откатиться
            на оригинальный плагин без собственных расширений.
          </p>
        </div>
      </article>
    </>
  );
}
