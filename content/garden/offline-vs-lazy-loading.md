---
title: Конфликт оффлайн функциональности и ленивой подгрузки
description: Когда нужно организовать работу в offline, то такое нефункциональное требование к веб-приложению порождает конфликт с механизмом оптимизации загрузки бандла путем разбиения его на чанки и последующей ленивой подгрузкой
date: 2025-09-30
tags: [pwa, mobile, offline, react, webpack, optimization]
---

## Проблема

При разработке веб-приложений с поддержкой offline-работы возникает конфликт между:

- **Функциональным требованием**: возможность работы приложения без интернет-соединения
- **Механизмом оптимизации**: разбиение бандла на чанки с ленивой подгрузкой

Ленивая загрузка предполагает, что неиспользуемые части приложения загружаются по мере необходимости, но в оффлайн-режиме это становится невозможным.

## Компромиссное решение

Четкое разделение чанков на две категории:

### 1. Критические для оффлайн-работы

Должны быть загружены после первого посещения приложения

### 2. Не-критические

Могут загружаться лениво, ими можно пожертвовать в оффлайн-режиме

## Реализация

Создаем отдельный файл для группировки критических чанков:

```typescript
// offline-critical-chunk.ts
import React from 'react';

const RegistrationPage = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/RegistrationPage')
);

const MainPage = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/MainPage')
);

const SendingSuccess = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/SendingSuccess')
);

const SendingTask = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/SendingTask')
);

const TaskPreview = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/TaskPreview')
);

const TaskStart = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/TaskStart')
);

export { RegistrationPage, MainPage, TaskPreview, TaskStart, SendingTask, SendingSuccess };
```

Использование в роутинге:

```jsx
// routes.ts
import {
  RegistrationPage,
  MainPage,
  TaskPreview,
  TaskStart,
  SendingTask,
  SendingSuccess,
} from './offline-critical-chunk';

// Не-критические страницы (ленивая загрузка)
const HistoryPage = React.lazy(() => import('pages/HistoryPage'));
const MapPage = React.lazy(() => import('pages/MapPage'));
const ProfilePage = React.lazy(() => import('pages/ProfilePage'));
const ReferralPage = React.lazy(() => import('pages/ReferralPage'));
const RatingPage = React.lazy(() => import('pages/RatingPage'));

// Пример роута для критической страницы
<Route
  path={Routes.REGISTRATION}
  element={
    <ErrorBoundary>
      <AuthWrapper>
        <Suspense fallback={<Loader />}>
          <RegistrationPage />
        </Suspense>
      </AuthWrapper>
    </ErrorBoundary>
  }
/>;
```

## Критерии выбора критических чанков

- Основной функционал: страницы, без которых приложение не может выполнять свою основную задачу
- Первоочередные сценарии: действия, которые пользователь вероятнее всего будет выполнять в оффлайне
- Минимальный набор: чем меньше критических чанков, тем лучше для первоначальной загрузки

## Вывод

Баланс между производительностью и оффлайн-функциональностью достигается через осознанное разделение кода на критический и не-критический, с явным указанием webpack какие чанки должны быть сгруппированы вместе для оффлайн-доступности.
