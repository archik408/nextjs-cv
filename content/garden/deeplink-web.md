---
title: Переход по DeepLink из Web
description: Deeplink с fallback на App Store
date: 2025-09-23
tags: [javascript, mobile, pwa]
---

## Deeplink с fallback на App Store

Мобильные приложения используют кастомные URL-схемы (`myapp://screen?tab=home`), которые работают как deeplink'и. Проблема: в браузере нельзя проверить, установлено ли приложение.

## Решение

Пытаемся открыть приложение и отслеживаем изменение видимости страницы:

```javascript
const deepLink = `myapp://myscreen?tab=home`;
const appStoreLink = `https://onelink.to/myapp`;

const openAppStore = () => {
  window.location.href = appStoreLink;
};

const checkAppOpened = () => {
  const timeoutId = setTimeout(() => {
    // Если через 2.5с страница всё ещё видна - приложение не установлено
    if (document.visibilityState !== 'hidden') {
      openAppStore();
    }
  }, 2500);

  // Отслеживаем скрытие страницы (приложение открылось)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(timeoutId);
    }
  });
};

// Запускаем процесс
window.location.href = deepLink;
checkAppOpened();
```

Как это работает

- Пытаемся открыть приложение через deeplink
- Если приложение установлено - страница скрывается, таймер сбрасывается
- Если через 2.5 секунды страница видна - редиректим в App Store/Google Play

---

### Связанные заметки

- [[View Transitions в React — рабочий инструмент, который уже год в продакшене](/garden/view-transitions)]
- [[Настройка Workbox Background Sync для совместимости с iOS и Android WebView](/garden/workbox-background-sync)]
- [[Вычисление видимой части viewport](/garden/viewport)]
- [[Конфликт оффлайн функциональности и ленивой подгрузки](/garden/offline-vs-lazy-loading)]
- [[Улучшение просмотра изображений](/garden/zoom)]
