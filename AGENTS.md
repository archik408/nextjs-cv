## Назначение

Этот файл задаёт стандарты кода, тестов и качества для репозитория. Следуй ему при любой реализации фичи или рефакторинге.

Детали вынесены в `.cursor/rules/*.mdc`. В Cursor они могут подгружаться автоматически; **агенты вне Cursor (Codex, Claude Code и т.п.) обязаны открыть и применить связанные rule-файлы до правок кода**.

---

## Структура и команды

Основные каталоги: `app/` (маршруты), `components/` (UI), `lib/` (логика/хуки), `content/` (контент), `public/` (CDN-статика).

| Действие            | Команда                                      |
| ------------------- | -------------------------------------------- |
| Dev                 | `npm run dev`                                |
| Build               | `npm run build`                              |
| Lint / format check | `npm run lint:check`, `npm run format:check` |
| Type-check          | `npm run type-check`                         |
| Tests (CI)          | `npm run test:ci`                            |
| Tests (local)       | `npm test`                                   |

---

## CodeGraph

- Для поиска по коду, call path, blast radius и перед правками — **сначала** `codegraph_explore`.
- Не дублируй тот же обход через grep/Read/subagent, если codegraph уже вернул нужный исходник.
- Grep/Read — только если codegraph не покрыл вопрос, или для конфигов/доков/ассетов вне индекса.
- Если индекса нет / «not indexed»: обычные инструменты; при необходимости `codegraph init` / `codegraph sync`.

Подробности: [codegraph rules](.cursor/rules/codegraph.mdc).

---

## Обязательные проверки после выполнения работы

1. Линтинг и форматирование: `npm run lint:check`, `npm run format:check` (исправления — `npm run lint` / `npm run format`, затем повтор).
2. Типы: `npm run type-check`.
3. Тесты: `npm run test:ci` (или точечно `npm test -- <path>`, если полный прогон избыточен и затронуты только известные модули).
4. React Doctor: `npx react-doctor@latest` (меньше шума: `--scope changed`).
5. При изменениях routing / серверного `fs` / tracing / `next.config`: `npm run build` и проверка размеров `.nft.json` (см. performance rules).

---

## TypeScript

Соблюдай strict-политику из `tsconfig.json` и [core-standards](.cursor/rules/core-standards.mdc): без `any`; без `// @ts-ignore` / `eslint-disable` без явной причины в комментарии.

---

## Стандарты тестирования

Трофей задаёт **объём** покрытия; типы тестов — **куда** класть проверки:

- много статических и линт-проверок;
- умеренно быстрых модульных тестов (чистая/алгоритмическая логика, не-React);
- больше интеграционных тестов с меньшим количеством моков (UI-флоу, границы данных);
- минимально e2e — только там, где это даёт уникальное покрытие.

Пиши тесты для нетривиальной логики и значимых UI-флоу (не только «сложной» серверной логики).

Colocation: [tests-colocation rules](.cursor/rules/tests-colocation.mdc).

---

## Современные гайды для Web

Для UI/UX и платформенных деталей:

- `npx -y modern-web-guidance@latest search "<request in english>"`

Затем применяй рекомендации к реализации (фокус, ARIA, `prefers-reduced-motion` и т.д.).

---

## Стиль кода

Форматирование и стиль — в [core-standards](.cursor/rules/core-standards.mdc); enforcement — через `format:check` / `lint:check`.

---

## Доступность (WCAG Level AA)

- Новый UI — WCAG Level AA: семантика, клавиатура/фокус, корректный ARIA, `prefers-reduced-motion`.
- Для ключевых секций/страниц — `jest-axe`.

Подробности: [accessibility rules](.cursor/rules/accessibility.mdc).

---

## Безопасность

- Все входы недоверенные: валидируем/санитизируем до использования.
- Не отдаём во фронтенд stack trace и чувствительные серверные ошибки.
- Не ослабляй security headers без документированной причины.

Подробности: [security rules](.cursor/rules/security.mdc).

---

## Стек и архитектура

- Next.js App Router + React (FC/hooks) + TypeScript (strict) + Tailwind CSS.
- По умолчанию серверные компоненты; `use client` — только для state/effects/DOM.
- i18n (EN/RU) — через `LanguageProvider` / `translations.ts`; тема — через `ThemeProvider` и класс `dark` на `html/body`.
- SEO: индексируемый контент, metadata/structured data, стабильные URL.
- **CDN ≠ serverless bundle:** не делай широкий серверный `fs` + `process.cwd()` по `public/` или всему репо; тяжёлое оставляй в CDN. Детали NFT / Functions Storage: [performance rules](.cursor/rules/performance.mdc).

---

## Требования к реализации задач

- Tailwind; две темы (тёмная по умолчанию и светлая) — UI корректен в обеих.
- Палитра в духе текущего дизайна: синий, сиреневый, фиолетовый; контраст достаточный в обеих темах.
- Два языка централизованно (EN/RU), без локального управления языком.
- Упор на производительность и SSR; SEO-обнаруживаемость контента.

---

## Модульные правила (`.cursor/rules`)

Перед правками в соответствующей области открой и примени:

| Область                  | Файл                                                       |
| ------------------------ | ---------------------------------------------------------- |
| CodeGraph                | [codegraph.mdc](.cursor/rules/codegraph.mdc)               |
| Core / стиль / TS        | [core-standards.mdc](.cursor/rules/core-standards.mdc)     |
| Accessibility            | [accessibility.mdc](.cursor/rules/accessibility.mdc)       |
| Security                 | [security.mdc](.cursor/rules/security.mdc)                 |
| i18n и тема              | [i18n-and-theme.mdc](.cursor/rules/i18n-and-theme.mdc)     |
| Производительность / NFT | [performance.mdc](.cursor/rules/performance.mdc)           |
| Colocation тестов        | [tests-colocation.mdc](.cursor/rules/tests-colocation.mdc) |
