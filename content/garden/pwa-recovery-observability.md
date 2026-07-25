---
title: Recovery и observability для PWA/WebView после сбоя загрузки
description: Что делать, когда code splitting и Service Worker встречаются с новым деплоем — static fallback до React, аккуратный reload при битых чанках и ранняя диагностика offline-shell
date: 2026-07-05
tags: [pwa, service-worker, offline, vite, observability, recovery, webview, mobile]
---

Самая неприятная ошибка в PWA с ленивой подгрузкой — не падение внутри React. Это белый экран ещё до того, как приложение успело сказать хоть слово. Entry-скрипт не доехал, динамический `import()` получил 404 по старому hash, Service Worker отдал устаревший `index.html` — и пользователь смотрит в пустоту. В Sentry тишина: до вашего `ErrorBoundary` дело просто не дошло.

С code splitting и hashed-чанками это не редкость, а ожидаемый сценарий после релиза. Особенно в WebView, где вкладка может жить сутками. Ниже — три слоя, которые я собираю вокруг такого приложения:

- Fallback, который работает без бандла;
- Механизм, который ловит version skew уже внутри приложения;
- Телеметрия и диагностика SW, без которой recovery превращается в шаманство и магию.

## Сначала — страница, которая умеет упасть красиво

Пока не загрузился JS-бандл, из вашего React-стека не поможет ничего. Поэтому минимальный «спасательный круг» живёт прямо в `index.html`: inline-стили, простой текст и крошечный скрипт без зависимостей.

Два обработчика обычно хватает. Первый — `onerror` на entry-скрипт `<script type="module">`: офлайн, сеть, VPN, CDN, битый URL.

Второй — короткий таймер (у меня эмпирически около трёх секунд) на пустой `#root`. Если за это время React так и не примонтировался, считаем старт проваленным. Глобальный `window.onerror` на все скрипты я сознательно не вешаю: в WebView слишком много чужого шума.

Поведение простое. Несколько раз пробуем обычный `reload`. Если лимит исчерпан — показываем статичный экран с понятным текстом и действием «закрыть / повторить». Счётчик попыток кладём в `sessionStorage` под нейтральным ключом вроде `boot-retry-count` и **тем же ключом** пользуемся в JS-recovery ниже. Иначе HTML и бандл будут крутить reload независимо друг от друга, и пользователь получит карусель обновлений вместо одного осмысленного цикла.

```html
<main id="boot-fallback" hidden aria-live="polite">
  <h1>Не удалось загрузить приложение</h1>
  <p>Проверьте соединение и попробуйте ещё раз.</p>
  <button type="button" id="boot-fallback-close">Закрыть</button>
</main>

<div id="root"></div>
<script type="module" src="/assets/index.js" onerror="window.__bootFail?.()"></script>
```

```js
(function () {
  const RETRY_KEY = 'boot-retry-count';
  const MAX_TRIES = 3;
  const WAIT_MS = 3000;

  function tries() {
    try {
      return Number(sessionStorage.getItem(RETRY_KEY) || 0);
    } catch {
      return 0;
    }
  }

  function fail() {
    if (tries() < MAX_TRIES) {
      try {
        sessionStorage.setItem(RETRY_KEY, String(tries() + 1));
      } catch {}
      location.reload();
      return;
    }
    document.getElementById('boot-fallback')?.removeAttribute('hidden');
  }

  window.__bootFail = fail;

  setTimeout(() => {
    const root = document.getElementById('root');
    if (root && !root.firstChild) fail();
  }, WAIT_MS);

  // Успешный mount — обнуляем счётчик, чтобы следующий визит начинался с чистого листа
  const root = document.getElementById('root');
  if (root && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      if (!root.firstChild) return;
      try {
        sessionStorage.removeItem(RETRY_KEY);
      } catch {}
      document.getElementById('boot-fallback')?.setAttribute('hidden', '');
      observer.disconnect();
    });
    observer.observe(root, { childList: true });
  }
})();
```

В мобильном WebView кнопку «Закрыть» обычно вешают на deeplink оболочки приложения. Конкретная схема зависит от контейнера — в статью её тащить незачем; важно лишь, что это действие тоже живёт в HTML, а не в бандле, который как раз не загрузился.

## Потом — recovery, когда React уже жив, а чанк — нет

Классика после деплоя: shell поднялся, пользователь кликнул в ленивый маршрут, а нужного `chunks/Feature-abcd.js` на CDN уже нет. Vite шлёт `vite:preloadError`, промис `import()` падает с текстом вроде `Failed to fetch dynamically imported module`, иногда сыпется preload CSS.

Тут уже можно работать из бандла. Идея та же, что у static fallback, только умнее:

1. Первая попытка — мягкий `location.reload()`. Часто хватает, если просто гонка кэша.
2. Если не получилось, то следующий шаг — проверить, достижим ли origin / CDN (не путать с `navigator.onLine`, нужно сделать реальную пробу по сети), и только тогда cache-bust: форсировать свежий документ через query-параметр вроде `?fresh=timestamp`.
3. Если сети нет — снова мягкий reload и **никакой** массовой чистки `CacheStorage`. Снести кэш «на всякий случай» — лучший способ сломать офлайн человеку, у которого как раз сейчас плохой сигнал.

Интересный момент, что для cache-bust в Firefox `location.reload()` был введен флаг [forceget](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload#forceget), но больше он нигде не поддерживается, поэтому `location.replace()` с параметром это целевое решение.

```ts
const RETRY_KEY = 'boot-retry-count';
const FRESH_PARAM = 'fresh';
const MAX_TRIES = 3;

const CHUNK_HINTS = [
  'Failed to fetch dynamically imported module',
  'Importing a module script failed',
  'ChunkLoadError',
  'Unable to preload CSS for',
];

function looksLikeChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return CHUNK_HINTS.some((hint) => message.includes(hint));
}

async function originLooksReachable(): Promise<boolean> {
  if (!navigator.onLine) return false;

  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 3000);

  try {
    await fetch('/__connectivity-check__', {
      cache: 'no-store',
      signal: ctrl.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

function reloadWithFreshShell(): void {
  const url = new URL(location.href);
  url.searchParams.set(FRESH_PARAM, String(Date.now()));
  location.replace(url.toString());
}

async function recover(): Promise<boolean> {
  const next = tries() + 1;
  if (next > MAX_TRIES) return false;
  bumpTries(next);

  if (next === 1) {
    location.reload();
    return true;
  }

  if (await originLooksReachable()) reloadWithFreshShell();
  else location.reload();
  return true;
}
```

Два нюанса, которые я выучил болезненно.

Первый: на [`vite:preloadError`](https://vite.dev/guide/build#load-error-handling) **не** вызывайте `preventDefault`. В Vite это приводит к вторичным падениям вида «cannot read property `default` of undefined» — модуль как будто «проглотили», а потребители всё равно ждут экспорт. Пусть ошибка живёт своей жизнью, а recovery просто инициирует перезагрузку.

Второй: Service Worker обязан понимать ваш cache-bust параметр. Если navigate-handler всегда отдаёт `index.html` из precache, `?fresh=…` ничего не свежит. Параметр нужно исключить и из `ignoreURLParametersMatching` (чтобы precache не склеивал его с обычным URL), и из SPA-fallback navigate:

```js
precacheAndRoute(self.__WB_MANIFEST, {
  // любые query, кроме fresh — как обычно; fresh должен менять ключ матчинга
  ignoreURLParametersMatching: [/^(?!fresh$).+/],
});

registerRoute(({ request, url }) => {
  if (request.mode !== 'navigate') return false;
  if (url.searchParams.has('fresh')) return false; // идём в сеть за новым shell
  return true;
}, createHandlerBoundToURL('/index.html'));
```

Пробу origin/CDN лучше оформить отдельным NetworkOnly-маршрутом в SW: короткий путь вроде `/__connectivity-check__`, без кэша. `navigator.onLine` оставляем лишь как предохранитель «точно offline — не надо агрессивничать».

В `ErrorBoundary` на время recovery показывайте лоадер, а не экран ошибки, и не пишите это в Sentry как crash: reload. Иначе дашборд забьётся ложными падениями в момент каждого деплоя.

## И отдельно — чтобы видеть, что SW вообще на месте

Recovery без наблюдаемости лечит симптомы, которые вы не замечаете. Самый полезный «датчик», который я добавляю после регистрации SW: через несколько секунд после старта (не сразу — иначе ложные срабатывания на cold start) проверить две вещи.

Есть ли `navigator.serviceWorker.controller`? Если страница уже не первый заход, а контроллера нет — пользователь, скорее всего, живёт без offline-оболочки, даже если «вроде PWA».

Лежит ли в Cache Storage документ shell, например `/index.html`? Precache мог не установиться, манифест мог отфильтроваться, квота могла выкинуть запись.

```ts
window.setTimeout(async () => {
  const controlled = Boolean(navigator.serviceWorker?.controller);

  if (!controlled) {
    reportWarning('sw-missing-controller', { online: navigator.onLine });
  }

  if (!('caches' in window)) return;

  try {
    const shell = await caches.match('/index.html', { ignoreSearch: true });
    if (!shell) {
      reportWarning('sw-missing-offline-shell', { controlled });
    }
  } catch (error) {
    reportWarning('sw-cache-check-failed', { error });
  }
}, 5_000);
```

К ошибкам warmup ленивых маршрутов и к фейлам регистрации SW полезно прикладывать тот же контекст: есть ли controller, online ли устройство, какой pathname, какая попытка recovery. Тогда в логах видно разницу между «сеть умерла», «SW ещё не перехватил страницу» и «на CDN уже другая версия».

Важно дополнить, что таймаут 5 секунд это эмпирическое время полученное от ваших пользователей и оно прямопропорционально тому, что мы кладем в precache. Если в manifest будет все приложение и все чанки, то SW возьмет под контроль страницу и через 10, и через 15 секунд.

Регистрацию SW я оборачиваю в небольшой retry с экспоненциальной паузой и логирую только финальный провал. Промежуточные попытки — нормальная жизнь мобильной сети, не инцидент.

## Как это складывается в одну историю

Сначала падает или зависает вход — отвечает HTML, ещё до React. Потом приложение живёт, но спотыкается о отсутствующий чанк после релиза — отвечает runtime recovery и бережный cache-bust shell. Параллельно раз в сессию вы смотрите, не «отвалился» ли Service Worker и не исчез ли offline-shell из кэша.

Ни один из слоёв не заменяет кэширование критических чанков из [заметки про offline и lazy loading](/garden/offline-vs-lazy-loading). Они про другое: что происходит, когда идеальный сценарий уже сломался. Без них PWA выглядит надёжной на демо и хрупкой на следующий день после выкладки.

---

### Связанные заметки

- [[Конфликт оффлайн функциональности и ленивой подгрузки](/garden/offline-vs-lazy-loading)]
- [[Настройка Workbox Background Sync для совместимости с iOS и Android WebView](/garden/workbox-background-sync)]
- [[Переход по DeepLink из Web](/garden/deeplink-web)]
- [[Вычисление видимой части viewport](/garden/viewport)]
- [[View Transitions в React — рабочий инструмент, который уже год в продакшене](/garden/view-transitions)]
