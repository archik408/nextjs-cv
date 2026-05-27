---
title: "Accessibility: Гайд разработчика"
description: Гайд для разработчика по доступности: WCAG, ARIA, APG, WAI, UI Kit, тестирование, аудит, линтеры, CI/CD, E2E, ИИ.
date: 2026-05-27
tags: [a11y, accessibility, wcag, programming, quality-gates, tools]
---

# WebView | Web Mobile | Web Desktop

## Разработка

### WCAG

Один из основных ориентиров при разработке веб-приложений в части доступности — это стандарт [W3C Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/wcag).

Требования в нём подразделяются на 3 уровня:

- _Level A_ - базовый, очень простой уровень
- _Level AA_ - уровень доступности достаточный для большинства людей с ограничениями
- _Level AAA_ - продвинутый уровень доступности

WCAG Level AA — это тот уровень, который нужно реализовать как baseline (базовый минимум). Он покрывает наибольшую часть критических и распространённых проблем доступности.

Карты для более удобной навигации по конкретным пунктам спецификации относительно уровней:

- [WCAG in Plain English - Code](https://aaardvarkaccessibility.com/wcag-responsibility/code/)
- [WCAG Map](https://www.andrewhick.com/accessibility/wcag-map/)
- [WCAG Notion Explorer](https://wcag-2-point-2-explorer.notion.site/6d8f6cb4081349e99e7bcd85770cca00?v=4f93e67af3c6459593354a480a5db354)

### ARIA

ARIA-атрибуты — это семантическое расширение разметки HTML, позволяющее сделать вёрстку более доступной для ассистивных технологий. Суть и логика подобных расширений описаны в [отдельной спецификации](https://www.w3.org/TR/wai-aria).

При работе с ARIA есть [4 важных правила](https://www.w3.org/TR/using-aria):

1. Главное и первое правило при использовании ARIA: если можно обойтись без ARIA, следует избегать его в пользу правильной семантической разметки. Семантические теги `<button>`, `<a>`, `<label>`, заголовки, списки, таблицы и визуально скрытые текстовые подсказки (например, через класс `.visually-hidden`) гораздо лучше взаимодействуют с ассистивными технологиями, чем ARIA-атрибуты.
2. Не изменяйте исходные семантические параметры, если в этом нет крайней необходимости.
3. Все интерактивные элементы управления ARIA должны быть совместимы с клавиатурой.
4. Не используйте атрибуты `role="presentation"` или `aria-hidden="true"` для элемента, на котором можно сфокусироваться.

### Шаблоны APG

Для сложных компонентов, таких как меню, вкладки, диалоговые окна, аккордеоны, карусели, поля со списком, ползунки и т. д., следуйте устоявшимся [шаблонам разметки из ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns).

### Туториалы WAI

При работе с конкретными компонентами обращайтесь к официальным материалам W3C Web Accessibility Initiative (WAI) — подразделения W3C, которое фокусируется и занимается вопросами доступности:

- [Туториалы по изображениям](https://www.w3.org/WAI/tutorials/images)
- [Туториалы по меню](https://www.w3.org/WAI/tutorials/menus)
- [Структура страницы](https://www.w3.org/WAI/tutorials/page-structure)
- [Таблицы](https://www.w3.org/WAI/tutorials/tables)
- [Формы](https://www.w3.org/WAI/tutorials/forms)
- [Карусели](https://www.w3.org/WAI/tutorials/carousels)

Практические руководства WAI:

- Общие советы по разработке: [WAI Tips](https://www.w3.org/WAI/tips/developing)
- Простые проверки: [WAI Test-Evaluate](https://www.w3.org/WAI/test-evaluate/preliminary)

### Библиотеки компонентов и UI Kit

Лучшим советом в части доступности будет рекомендовать брать уже готовые популярные решения — библиотеки компонентов, в которых уже учтены все нюансы доступности, ARIA-разметки и взаимодействия с ассистивными технологиями / экранными дикторами.

Примеры популярных UI Kit с доступностью из коробки:

- [Chakra UI](https://chakra-ui.com)
- [Radix UI](https://www.radix-ui.com)
- [Material UI](https://mui.com)

Как правило, в таких библиотеках уже учтена работа с фокусом ([Focus Lock](https://www.npmjs.com/package/focus-lock) / [Focus Trap](https://www.npmjs.com/package/focus-trap), Focus Management), правильная семантика и ARIA-атрибуты, а также они протестированы с большинством популярных экранных дикторов. Если разрабатывать свои компоненты, то придётся учитывать все эти механизмы и правила самому, а также самостоятельно тестировать компоненты на экранных дикторах.

Многие из этих библиотек предоставляют специальные компоненты-шаблоны для улучшения доступности. К примеру, в Chakra UI есть компонент [SkipNavLink](https://chakra-ui.com/docs/components/skip-nav) (для пропуска навигации) и [VisuallyHidden](https://chakra-ui.com/docs/components/visually-hidden) (для визуального скрытия текста с сохранением доступности для дикторов).

## Тестирование и Отладка

Инструменты автоматизации и сканирования могут найти только [от 30% до 60% проблем](https://dev.to/chris_devto/your-accessibility-score-is-lying-to-you-5fh2) с доступностью в приложении, поэтому ручного тестирования и отладки никак не избежать.

> С помощью axe-core можно автоматически выявлять в среднем 57% проблем, соответствующих стандартам WCAG. Источник https://github.com/dequelabs/axe-core

Критически важно проверять доступность вручную, используя ассистивные технологии, поскольку только так можно оценить реальный опыт пользователей с ограниченными возможностями.

Обязательно тестируйте с экранными дикторами:

- На мобильных устройствах:
  - Android: TalkBack (предустановлен)
  - iOS: VoiceOver (предустановлен)
- На десктопе:
  - NVDA (Windows) — бесплатный, наиболее популярный в среде тестировщиков
  - JAWS (Windows) — платный, широко распространён в корпоративной среде
  - VoiceOver (macOS) — встроен в систему
- Менее популярные, но также полезные:
  - Orca (Ubuntu / Linux)
  - Narrator (Windows) — встроенный базовый диктор

Популярность различных дикторов согласно [отчету WebAIM можно посмотреть тут](https://webaim.org/projects/screenreadersurvey10/).

### Инструменты аудита

Лучший инструмент аудита доступности на рынке — это _Deque axe_, который можно подключить как [расширение в DevTools](https://www.deque.com/axe/devtools).

В дополнение можно использовать следующие инструменты:

- _[WAVE](https://wave.webaim.org)_ от WebAIM — онлайн-сервис для проверки семантики, структуры контента, порядка табуляции и контраста
- _[Colour Contrast Analyser (CCA)](https://vispero.com/lp/color-contrast-checker)_ от Vispero/TPGi — десктопное приложение, которое позволяет удобно проверить контраст в разных местах
- _[Sim Daltonism](https://apps.apple.com/us/app/sim-daltonism/id693112260?mt=12)_ — приложение для macOS, позволяющее проверить цвет и контраст относительно различных форм цветоаномалий (Альтернативная опция на iOS / macOS: [Настройки → Универсальный доступ → Дисплей и размер текста → Фильтры цветов](https://support.apple.com/en-us/111773))

Альтернативные популярные сканеры доступности:

- _[Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/scoring?hl=ru)_ (секция Accessibility) — встроен в Chrome DevTools
- _[WebHint](https://webhint.io/docs/user-guide/hints/accessibility/)_ (секция Accessibility, под капотом используется тот же Deque axe)

## Статическая типизация

Один из самых дешевых способов автоматизировать проверку доступности на уровне кода — это статическая типизация. Почти все популярные статические анализаторы кода предлагают очень неплохую настройку проверки базовых правил доступности. По крайней мере, уже на этом уровне, можно добиться результата, где ни одна картинка не останется без alt-текста и ни один div/span не пробежит с событием onClick без соответствующей семантической роли.

Ниже список самых популярных линтеров и их настроек для правил по доступности:

- ESLint - [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- Oxlint - [settings-jsx-a11y](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html#settings-jsx-a11y)
- Biomejs - [rules a11y](https://biomejs.dev/linter/javascript/rules/#a11y)

## Тесты и Автоматизация

### CI/CD

Более дорогой и ресурсоемкий вариант автоматизации проверки доступности это внедрить аудит страниц прямо в CI/CD конвейеры. Deque axe и Lighthouse имеют возможность подключения к CI/CD:

- [@axe-core/cli](https://www.npmjs.com/package/@axe-core/cli)
- [lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci)

### Runtime

Прямо в тестовом окружении или локально при разработке можно запустить программно [axe-core](https://github.com/dequelabs/axe-core) и выводить в консоль результаты аудита:

- [@axe-core/react](https://www.npmjs.com/package/@axe-core/react)

```javascript
if (isDevEnv() || isStageEnv()) {
  // Даём приложению время догрузиться после ре-рендеров, чтобы меньше ложных срабатываний axe
  const AXE_DEBOUNCE_MS = 6000;
  void Promise.all([import('@axe-core/react'), import('react-dom')]).then(([axe, ReactDOM]) => {
    axe.default(React, ReactDOM, AXE_DEBOUNCE_MS);
  });
}
```

### E2E Tests

Более прагматичный вариант это внедрить проверку доступности прямо в тесты автоматизации, почти каждый популярный фреймворк тестирования предоставляет API для проверки доступности:

- Playwright
  - [playwright accessibility-testing](https://playwright.dev/docs/accessibility-testing#example-accessibility-tests)
  - [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright)
- Cypress
  - [cypress accessibility-testing](https://docs.cypress.io/app/guides/accessibility-testing)
  - [cypress-axe](https://www.npmjs.com/package/cypress-axe)
  - [wick-a11y](https://www.npmjs.com/package/wick-a11y)
- WebDriver
  - [webdriver accessibility-testing](https://webdriver.io/docs/accessibility-testing/axe-core)
  - [@axe-core/webdriverio](https://www.npmjs.com/package/@axe-core/webdriverio)

### Unit Tests

Независимо от инструмента конфигурирования и старта модульных JavaScript тестов, рекомендуется использовать фреймворк [testing-library](https://testing-library.com), который построен по принципу accessibility-first.

API этого инструмента при тестировании само по себе мотивирует к правильной семантике и разметке, методы вроде `getByLabelText`, `getByRole`, `getByAltText` и т.д. помимо основного модульного теста компонента несут в себе побочный эффект проверки и доступности.

- [Accessibility API](https://testing-library.com/docs/dom-testing-library/api-accessibility/)
- [Queries API](https://testing-library.com/docs/queries/about/#priority)

## ИИ-интеграция и агенты

### AGENTS.md

При работе с ИИ агентами нужно обязательно явно прописать правила кодирования с прицелом на доступность.

Большинство LLM моделей обучаются на открытых данных интернета, где у большой части веб-сайтов имеются огромные проблемы с доступностью. Примеры разделов правил для [AGENTS.md](https://agents.md/) можно посмотреть в [проектах с открытым исходным кодом](https://github.com/search?q=path%3AAGENTS.md+NOT+is%3Afork+NOT+is%3Aarchived+accessibility&type=code&p=2).

Все вышеописанные разделы этого гайда также могут послужить хорошей базой для оформления и описания таких правил.

### Agent Skills

[Умения](https://agentskills.io/) могут быть отдельным мощным инструментом как в реализации доступности в проекте и коде, так и в проверке уже существующей кодовой базы.

Примеры умений:

- [Intopia Accessibility Skill](https://github.com/Intopia/intopia-web-accessibility-skill)

На Google I/O 2026 анонсировали [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance?hl=ru) — открытые гайды и скилл для AI-агентов. Среди прочего там есть accessibility-гайд. Установка одной командой:

```bash
npx modern-web-guidance@latest install
```

Работает с популярными агентами: Vercel AI SDK, Claude Code, Copilot CLI, Antigravity CLI и другими. В Cursor можно затянуть плагином из marketplace.

Пример работы:

```bash
npx modern-web-guidance@latest search "create a dialog modal backdrop"
```

Вывод:

```bash
[{"id":"accessibility","description":"Actionable coding guidelines for building accessible web applications, covering semantic HTML, focus management, forms, media, and testing. Use this skill when auditing or implementing accessibility features, keyboard navigation, or ARIA.","category":"accessibility","tokenCount":7129,"similarity":0.5102}]
```

Выбор гайда:

```bash
npx modern-web-guidance@latest retrieve "accessibility"
```

---

### Связанные заметки

- [[Практический аудит веб-доступности: 5 шагов без фанатизма](/garden/audit-a11y-without-wcag)]
- [[Аудит доступности веб-приложения Приорбанка](/garden/audit-priorbank-a11y)]
- [[Аудит доступности Wildberries. Может ли незрячий пользователь купить Бэтмобиль?](/garden/audit-wildberries-a11y)]
- [[Skip Links — невидимый маркер хорошего вкуса](/garden/skip-links)]
- [[Веб-доступность — это не хайп, а ответственность](/garden/a11y-my-task-crafting)]
- [[Веб и тактильная типографика](/garden/braille)]
- [[Когда функции доступности ломают дизайн, а иногда и саму доступность](/garden/normalize-text-scaling)]
