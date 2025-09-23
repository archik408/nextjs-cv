# GitHub Actions Setup Guide

Этот документ содержит инструкции по настройке GitHub Actions для автоматического CI/CD, тестирования и проверки безопасности.

## 🚀 Быстрый старт

1. **Скопируйте файлы workflows** в ваш репозиторий:

   ```bash
   cp -r .github/workflows/* .github/workflows/
   ```

2. **Настройте секреты** в настройках репозитория (Settings → Secrets and variables → Actions)

3. **Запустите первый workflow** создав Pull Request

## 📋 Настройка секретов

### Обязательные секреты

#### Для деплоя на Vercel:

- `VERCEL_TOKEN` - токен аутентификации Vercel
- `VERCEL_ORG_ID` - ID организации Vercel
- `VERCEL_PROJECT_ID` - ID проекта Vercel

#### Для деплоя на Netlify:

- `NETLIFY_AUTH_TOKEN` - токен аутентификации Netlify
- `NETLIFY_SITE_ID` - ID сайта Netlify

### Опциональные секреты

#### Уведомления:

- `SLACK_WEBHOOK` - URL webhook для Slack уведомлений
- `CODECOV_TOKEN` - токен для Codecov (покрытие кода)

## 🔧 Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Когда запускается:** Push в main/develop, Pull Requests

**Что делает:**

- ✅ Тестирование на Node.js 18.x и 20.x
- ✅ Проверка TypeScript типов
- ✅ ESLint и Prettier валидация
- ✅ Security audit
- ✅ Запуск тестов с покрытием
- ✅ Проверка сборки
- ✅ Lighthouse performance тесты (только для PR)
- ✅ Trivy security сканирование

### 2. Code Quality (`code-quality.yml`)

**Когда запускается:** Pull Requests, Push в main/develop

**Что делает:**

- ✅ ESLint проверки качества кода
- ✅ Prettier форматирование
- ✅ TypeScript компиляция
- ✅ Security pattern сканирование
- ✅ Отчеты о покрытии тестами
- ✅ Интеграция с Codecov
- ✅ Комментарии с покрытием в PR

### 3. Dependencies Update (`dependencies.yml`)

**Когда запускается:** Еженедельно (понедельник 9:00 UTC), вручную

**Что делает:**

- ✅ Автоматическое обновление зависимостей
- ✅ Security фиксы через npm audit
- ✅ Тестирование после обновления
- ✅ Автоматическое создание PR
- ✅ Безопасный процесс обновления

### 4. Deploy (`deploy.yml`)

**Когда запускается:** Push в main, вручную

**Что делает:**

- ✅ Деплой в production
- ✅ Тестирование перед деплоем
- ✅ Деплой на Vercel/Netlify
- ✅ Slack уведомления
- ✅ Защита окружения

## 🔒 Безопасность

### Автоматические проверки безопасности:

- **npm audit** - сканирование уязвимостей зависимостей
- **Trivy** - сканирование безопасности контейнеров и файловой системы
- **Custom security patterns** - анализ паттернов кода
- **Security headers** - валидация HTTP заголовков безопасности

### Проверяемые security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'; ...`

## 📊 Мониторинг производительности

### Lighthouse CI:

- Performance score: ≥90%
- Accessibility score: ≥90%
- Best practices score: ≥90%
- SEO score: ≥90%

## 🛠 Локальная разработка

Запустите те же проверки локально:

```bash
# Запуск всех проверок качества
npm run lint:check
npm run format:check
npm run type-check
npm run test:ci
npm run security:check
npm run test:security

# Запуск конкретных проверок
npm run test:coverage
npm run security:audit
npm run security:headers
```

## 📈 Статус workflows

Проверьте статус workflows во вкладке Actions вашего репозитория. Все workflows должны пройти успешно перед мержем в main ветку.

## 🐛 Решение проблем

### Частые проблемы:

1. **Ошибки security scan**: Проверьте на наличие захардкоженных секретов, console.log или debugger statements
2. **Ошибки TypeScript**: Запустите `npm run type-check` локально для выявления проблем
3. **Ошибки линтинга**: Запустите `npm run lint:check` и исправьте найденные проблемы
4. **Падающие тесты**: Запустите `npm test` локально для отладки

### Получение помощи:

- Проверьте вкладку Actions для детальных логов
- Просмотрите отчеты security scan
- Убедитесь, что все необходимые секреты настроены
- Проверьте совместимость версий Node.js

## 🔄 Настройка автоматических обновлений

Для настройки автоматических обновлений зависимостей:

1. Убедитесь, что workflow `dependencies.yml` активен
2. Настройте расписание в cron (по умолчанию: каждый понедельник в 9:00 UTC)
3. Проверьте, что у вас есть права на создание PR в репозитории

## 📝 Кастомизация

### Изменение расписания:

Отредактируйте файл `.github/workflows/dependencies.yml`:

```yaml
schedule:
  - cron: '0 9 * * 1' # Понедельник 9:00 UTC
```

### Добавление новых проверок:

Добавьте новые шаги в соответствующие workflows или создайте новый workflow.

### Настройка уведомлений:

Добавьте секреты для Slack, Discord или других сервисов уведомлений.

## ✅ Чек-лист настройки

- [ ] Скопированы файлы workflows
- [ ] Настроены секреты для деплоя
- [ ] Настроены секреты для уведомлений (опционально)
- [ ] Проверен первый запуск workflow
- [ ] Настроены branch protection rules
- [ ] Проверена работа автоматических обновлений
- [ ] Настроены уведомления о статусе

## 🎯 Результат

После настройки у вас будет:

- ✅ Автоматическое тестирование при каждом PR
- ✅ Проверка качества кода
- ✅ Security сканирование
- ✅ Автоматический деплой
- ✅ Мониторинг производительности
- ✅ Автоматические обновления зависимостей
- ✅ Уведомления о статусе
