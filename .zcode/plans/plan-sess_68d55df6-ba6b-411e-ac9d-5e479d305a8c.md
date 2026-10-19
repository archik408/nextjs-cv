# Новый инструмент /keep-screen-on (анти-сон экрана)

Маршрут: **`/keep-screen-on`** (короткий, совпадает с поисковым запросом и референсом keep-screen-on.com).

## Функциональная спецификация

**Основной механизм — Screen Wake Lock API:**

- Фичдетект `'wakeLock' in navigator`; запрос `navigator.wakeLock.request('screen')` при активации.
- Слушать `release` у sentinel — обновлять статус (лок снят браузером при уходе таба в фон).
- `visibilitychange`: когда таб снова виден и лок должен быть активен, но снят — переперезапросить (браузер сам снимает лок со скрытым табом).
- `deactivate()`: release + очистка таймеров/листенеров; cleanup на unmount.

**Fallback без Wake Lock API (Firefox и старые Safari):**

- Скрытый зацикленный muted `<video playsInline loop>` с крошечным silent-audio WebM в data URI (константа извлекается из MIT-licensed nosleep.js при реализации; запасной вариант — сгенерировать ffmpeg). Видео рендерится только пока fallback активен (`position:fixed; 1×1px; opacity:0; aria-hidden`), с пустым `<track>` на случай axe.
- Если `video.play()` отклонён (autoplay policy) — показывать ошибку, не ломаться.

**Таймер (как на референсе):**

- Пресеты: No limit / 15m / 30m / 1h / 2h / Custom (число минут 1–1440, валидация).
- Счётчик прошедшего времени HH:MM:SS (`role="timer"`, tabular-nums) + остаток, если выбран таймер; авто-остановка по истечении со статусом «Таймер завершён».

**Статусы/индикация:** idle / active / error; бейдж активного метода («Screen Wake Lock API» / «Video fallback»); баннер «API не поддерживается — будет использован видео-fallback»; ошибки запроса лока.

**UI** по паттернам репозитория (gradien-фон, `NavigationButtons levelUp="tools"`, карточка `bg-white dark:bg-gray-800`, иконка-чип у h1 `id="main-content"`): большая круглая power-кнопка (`aria-pressed`), ряд pill-пресетов (кнопки с `aria-pressed`, custom раскрывает input), карточка со статусом/временем, 3 примечания (таба должна быть видима; расход батареи; ручная блокировка ОС побеждает), компактная секция «How it works» с упоминанием кейса AI-агента в loop-режиме и ссылкой на MDN. Пульсация активной кнопки — с уважением `prefers-reduced-motion`. Обе темы, контраст AA, палитра синий/индиго.

## Файлы

**Новые:**

1. `lib/hooks/use-screen-wake-lock.ts` — хук: `isWakeLockSupported`, `isActive`, `method` ('wake-lock' | 'video-fallback' | null), `error`, `activate()`, `deactivate()`; sentinel-реф, video-реф, visibilitychange, константа WebM data URI. Типы WakeLock уже в lib.dom — своих деклараций не нужно.
2. `app/keep-screen-on/page.tsx` — metadata через новый `seoConfigs.keepScreenOn`.
3. `app/keep-screen-on/page-client.tsx` — UI + логика таймера/elapsed (useEffect + interval).

**Изменяемые:** 4. `lib/seo.ts` — пресет `keepScreenOn` (title/description/keywords/path). 5. `lib/translations.ts` — ~25 ключей `keepScreenOn*` в EN и RU (title, desc, toolDesc для карточки хаба, activate/deactivate, статусы, метод, пресеты таймера, custom-минуты, unsupported, error, timerDone, 3 примечания, how-it-works). Паритет EN/RU обязателен (тест `translations.test.ts`). 6. `app/tools/page-client.tsx` — запись в `commodityTools` (икона `MonitorSmartphone`, status ready, цвет blue) + импорт иконки. 7. `app/sitemap.ts` — `{ path: '/keep-screen-on', changeFrequency: 'monthly', priority: 0.45 }`. 8. `lib/llms-txt.ts` — запись в массив `TOOLS`.

**Тесты:** 9. `__tests__/lib/use-screen-wake-lock.test.ts(x)` — мок `navigator.wakeLock` с fake sentinel: запрос/релиз, reacquire по visibilitychange, выбор video-fallback при отсутствии API (мок play()), обработка отказа play. Чистые хелперы (форматирование времени, парсинг минут) — там же. 10. `__tests__/a11y/tools-pages.a11y.test.tsx` — axe-кейс для `KeepScreenOnPageClient` (idle-рендер; jsdom без wakeLock → ветка unsupported, видео не рендерится).

## Проверки после реализации

`npm run lint:check`, `npm run format:check` (исправления + повтор), `npm run type-check`, `npm run test:ci`, `npx react-doctor@latest --scope changed`, и т.к. меняется routing — `npm run build` с проверкой размеров `.nft.json` (по AGENTS.md).

## Вне скоупа

Полный маркетинговый контент референса (15 FAQ, гайды по устройствам, таблица сравнения методов) — вместо него компактная how-it-works секция; fullscreen-кнопка (на референсе лишь совет).
