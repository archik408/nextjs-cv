---
title: Вычисление видимой части viewport
description: Полноценный скролл при открытой клавиатуре на мобильных устройствах
date: 2025-09-23
tags: [mobile, pwa, react, keyboard, viewport]
---

## Полноценный скролл при открытой клавиатуре на мобильных устройствах

В мобильном вебе нативная клавиатура обычно перекрывает часть контента, предполагая временный характер ввода. Но иногда нужно сохранить всю область контента доступной для скролла даже с открытой клавиатурой.

## Решение

Используем `visualViewport` API для отслеживания реальной высоты видимой области:

```javascript
import { useEffect, useState } from 'react';

const useVisualViewportHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    const newHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    setHeight(newHeight);
  };

  useEffect(() => {
    const viewport = window.visualViewport || window;
    handleResize();

    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, []);

  return height;
};
```

Как использовать

```javascript
const Component = () => {
  const viewportHeight = useVisualViewportHeight();

  return (
    <div style={{ height: viewportHeight, overflowY: 'auto' }}>
      {/* Контент будет скроллиться в пределах видимой области */}
    </div>
  );
};
```

_Особенности_

- visualViewport.height возвращает высоту области, не занятой клавиатурой
- Fallback на window.innerHeight для браузеров без поддержки visualViewport
- Автоматическое обновление при появлении/скрытии клавиатуры
- Протестировано на сотнях тысяч пользователей Android/iOS

_Преимущества_

- Контент остается доступным для взаимодействия
- Плавная адаптация под разные размеры клавиатуры
- Кросс-браузерная совместимость

---

### Связанные заметки

- [[View Transitions в React — рабочий инструмент, который уже год в продакшене](/garden/view-transitions)]
- [[Настройка Workbox Background Sync для совместимости с iOS и Android WebView](/garden/workbox-background-sync)]
- [[Переход по DeepLink из Web](/garden/deeplink-web)]
- [[Конфликт оффлайн функциональности и ленивой подгрузки](/garden/offline-vs-lazy-loading)]
- [[Улучшение просмотра изображений](/garden/zoom)]
