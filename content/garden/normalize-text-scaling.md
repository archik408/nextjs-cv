---
title: Когда функции доступности ломают дизайн, а иногда и саму доступность
description: Системное увеличение шрифта в WebView, измерение масштаба через эталонный элемент и компромисс textScaleManager с data-original-text-size.
date: 2026-05-12
tags: [accessibility, frontend, web, ux, design, webview, mobile, android]
---

Во всех современных ОС есть функция системного увеличения шрифта через настройки. В Android, iOS, macOS и Windows это обязательная базовая опция, которая невероятно важна для людей с плохим или ограниченным зрением.

![Настройки macOS, где можно изменить размер шрифта](/garden/normalize-text-scaling/settings.webp)

Сама ОС и нативные приложения адаптированы под изменение таких настроек, но с браузером и вебом интереснее: с одной стороны, у веба есть свои механизмы работы со шрифтом — через стили мы можем задавать размеры и верстать в относительных единицах, чтобы адаптировать вёрстку под размер шрифта и его изменения.

По умолчанию стандартный размер шрифта на уровне ОС — это 16px, что соответствует 1rem и тождественно 1em, если на уровне контейнера не переопределено другого.  
Если мы переопределяем размеры текста в разных контейнерах при помощи rem/em, то когда системные настройки ОС меняют базовый размер шрифта, наши размеры адаптируются тоже. Адаптируется и вёрстка, если отступы, внутренние поля и размеры элементов вместе с контейнерами заданы тоже в относительных единицах. Это такая цельная, правильная картинка.

К слову, в своё время именно о такой правильной, адаптивной и доступной вёрстке я узнал из книги Леа Веру «Секреты CSS. Идеальные решения ежедневных задач».

Но что если на уровне стилей в браузере шрифт жёстко зашит в пикселях, а не в rem/em? Эта ситуация наиболее часто встречается в реальной дикой природе веба. Что ОС и браузеру делать с системными настройками? Игнорировать? Или принудительно увеличивать шрифт, игнорируя стили? Это палка о двух концах.

С одной стороны, то, что рисуется в браузере, само несёт ответственность за размеры и отображение — такой принцип веба, это абстракция на ОС со своим управлением, с возможностью строить свой интерфейс с нуля, непохожий на нативный.

Концептуально правильно не вмешиваться. Но на практике я столкнулся с тем, что внутри гибридного мобильного приложения на Android нативные размеры шрифта влияют на отображение размеров шрифта внутри WebView, при этом игнорируя даже жёстко заданные в пикселях размеры из CSS. Причём это влияние на уровне рендеринга: это не какой-то ещё один слой user-agent styles с флагами `!important` или отдельный слой стилей.

Вы видите увеличенный шрифт 24px, идёте в код CSS, а там 16px, и ничего другого вы не найдёте. Как получить реальный размер, к которому модифицировала сама ОС?
Ответ один: только через `getComputedStyle()`, и никак по-другому.

Хорошо ли это? Сложно сказать. Вроде бы есть консистентность между интерфейсом ОС и вебом, но с другой стороны, если вёрстка сделана в пикселях, много фиксированных вещей,
то всё жёстко поползёт и начнёт накладываться друг на друга. Некоторые элементы вовсе скроются за краем экрана — и тогда какой толк, что шрифт увеличен и хорошо читаем:
человеку недоступны элементы управления, он не может взаимодействовать с интерфейсом.

Пример текущего сайта на мобильном устройстве: ссылки-иконки спрятались за текстом и не кликабельны, увеличенный текст спрятался за рамки карточек, теперь его нельзя прочитать.
![Поломанный UI текущего веб-сайта после увеличения шрифта](/garden/normalize-text-scaling/broke-layout.webp)

Ситуация неприятная: нельзя взять и одним махом поменять весь дизайн или перевёрстать всё в относительных единицах.

Доступность — это не всегда просто топорно внедрить какую-то функцию для людей с ограничениями. Помню, похожая ситуация была с браузером Samsung Internet, который умел насильно переключать веб-сайт в тёмную тему, сам занимаясь инверсией не только цвета фона и текста, но даже изображений. У сайтов, которые не были к этому готовы, результат иногда получался жутким.

![Схема правильной конструкции скатов для колясочников](/garden/normalize-text-scaling/wheelchair.webp)

Всё это напоминает ту картинку, где скат для колясочников есть, но поручней нет, а угол и длина пути такие, что человек может улететь вниз, перевернувшись на раз.

Возможно, ситуация в скором времени изменится с введением мета-тэга `text-scale`, который при значении `scale` должен как раз применять масштабирование текста с учетом системных настроек ОС.

В [спецификации приведен понятный пример](<(https://drafts.csswg.org/css-fonts-5/#text-scale-meta)>), который показывает, что масштабируются только `rem` и `em` (относительно корневого элемента), а `px` — нет:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="text-scale" content="scale" />
  </head>
  <body>
    <!-- Этот текст будет масштабироваться системными настройками -->
    <div style="font-size: 1rem;">Текст следует настройкам ОС и браузера.</div>
    <!-- Этот текст НЕ будет масштабироваться -->
    <div style="font-size: 20px;">
      А этот текст НЕ следует настройкам.
      <div style="font-size: 1rem;">А вот вложенный — будет!</div>
    </div>
  </body>
</html>
```

Но сейчас, на практике, тэг имеет слабую поддержку, а `px` фактически масштабируются на Android WebView.

Что делать? Сейчас мы можем создать невидимый эталонный элемент текста и вычислить разницу масштаба:

```typescript
export const BASE_FONT_SIZE = 16; // 1 rem

const testHiddenElement = document.createElement('p');
testHiddenElement.style.cssText = `
  position: absolute;
  opacity: 0;
  pointer-events: none;
  font-size: ${BASE_FONT_SIZE}px;
  left: -9999px;
  top: -9999px;
`;
testHiddenElement.textContent = 'Test text scale';

document.body.appendChild(testHiddenElement);

// Ждём следующего кадра, чтобы стили применились
await new Promise((resolve) => requestAnimationFrame(resolve));

const computedStyle = window.getComputedStyle(testHiddenElement);
const computedSize = parseFloat(computedStyle.fontSize);

const scale = computedSize / BASE_FONT_SIZE;
```

Зная разницу, мы могли бы принудительно вернуть все размеры на свои места, используя флаг `important`. Но хочется компромисса: всегда за счёт отступов и полей есть возможность увеличить текстовый контент. Просто эмпирически нужно подобрать верное значение, в отдельных местах, возможно, придётся адаптировать даже точечно. То есть мы оставим увеличение текста, но в рамках разумного относительно нашего дизайна.

```typescript
/**
 * Допустимый масштаб текста, полученный эмпирически,
 * при котором наша вёрстка не ползёт сильно и не блокирует элементы
 */
export const MAX_TEXT_ZOOM = 1.3;
export const MIN_TEXT_ZOOM = 1;
```

При этом мы можем также жёстко ограничить уменьшение текста. Однако, помимо системного шрифта и его настроек, есть много внешних плагинов, которые перебивают оригинальный размер через inline styles и `!important`.

С этим тоже хочется что-то сделать, и тут сложнее: придётся перебрать доступные CSS-правила.

```typescript
function getOriginalFontSize(element: HTMLElement) {
  const result = {
    inlineFontSize: BASE_FONT_SIZE,
    fontSize: BASE_FONT_SIZE,
    important: false,
  };
  const sheets = document.styleSheets;

  if (element.style.fontSize) {
    result.inlineFontSize = parseFloat(element.style.fontSize);
  }

  for (let i = 0; i < sheets.length; i++) {
    try {
      const rules = sheets[i].cssRules;
      for (const rule of rules) {
        const cssRule = rule as CSSStyleRule;
        if (
          cssRule.selectorText &&
          element.matches(cssRule.selectorText) &&
          cssRule.style.getPropertyPriority('font-size') === 'important'
        ) {
          result.fontSize = parseFloat(cssRule.style.getPropertyValue('font-size'));
          result.important = true;
          return result;
        }
      }
    } catch (_e) {
      // cross-origin stylesheet — пропускаем
    }
  }

  return result;
}
```

Теперь мы можем зафиксировать чёткие границы нормализации:

```typescript
class TextScaleManager {
  scale = MIN_TEXT_ZOOM;
  multiplier = MIN_TEXT_ZOOM;
  isInitialized = false;
  isUnavailableUIScaling = false;
  isScaledByExternalStyles = false;

  async init(): Promise<void> {
    // … измерение scale через testHiddenElement …

    if (scale !== 1) {
      const originalFontSize = getOriginalFontSize(testHiddenElement);
      this.isScaledByExternalStyles =
        originalFontSize.inlineFontSize !== BASE_FONT_SIZE ||
        (originalFontSize.important && originalFontSize.fontSize !== BASE_FONT_SIZE);

      const minScale = this.isScaledByExternalStyles ? MIN_TEXT_ZOOM : scale;
      const maxScale = scale > MAX_TEXT_ZOOM ? MAX_TEXT_ZOOM : scale;
      this.setScale(scale < MIN_TEXT_ZOOM ? minScale : maxScale);
      this.isUnavailableUIScaling = scale < MIN_TEXT_ZOOM || scale > MAX_TEXT_ZOOM;
    }
  }

  setScale(newScale: number): void {
    this.scale = newScale;
    // Переопределено через системные настройки устройства (не стилями!) — поэтому уменьшаем искомый размер шрифта
    this.multiplier = this.isScaledByExternalStyles ? this.scale : 1 / this.scale;

    const clampedScale = Math.max(MIN_TEXT_ZOOM, Math.min(this.scale, MAX_TEXT_ZOOM));

    // Единственный источник правды по масштабу текста
    document.documentElement.style.setProperty('--text-scale', clampedScale.toString());
    document.documentElement.style.setProperty(
      '--text-scale-multiplier',
      this.multiplier.toString()
    );
  }
}
```

Итак, мы всё вычислили, но что с этим делать? На самом деле нам нужен механизм наблюдения и нормализации отдельных элементов — но каких?

Полный обход всех контентных тегов может быть неэффективен. Где-то текст может быть зашит в `div`/`span`, и самое главное: как узнать оригинальный размер до изменения? Ведь не везде будет `BASE_FONT_SIZE`.

Интересным решением может быть разметка текстовых элементов для нормализации data-атрибутами:

```tsx
const { variant: variantKey, ...restProps } = props;

const fontSize = useMemo(() => {
  const variant = variantKey && TextVariant[variantKey];
  const fontSizeValue = variant?.fontSize ?? TextVariant['body-regular'].fontSize;

  return parseFloat(fontSizeValue);
}, [variantKey]);

<Text as="p" {...restProps} variant={variantKey} data-original-text-size={fontSize} />;
```

Теперь можно реализовать в проекте отдельный механизм контроля масштабирования текста в runtime (`textScaleManager`) как защиту layout в WebView.

```typescript
private normalizeElement(element: HTMLElement): void {
  const original = element.dataset.originalTextSize;

  if (!this.isUnavailableUIScaling || !original) {
    return;
  }

  const originalSize = parseFloat(original);

  if (!originalSize || Number.isNaN(originalSize)) {
    return;
  }

  const fontSize = `${originalSize * this.multiplier}px`;

  element.style.setProperty('font-size', fontSize, 'important');

  const children = element.querySelectorAll<HTMLElement>('*');
  children.forEach((child) => {
    child.style.setProperty('font-size', fontSize, 'important');
  });
}

normalizeDocument(root?: Document | HTMLElement): void {
  if (!this.isUnavailableUIScaling) {
    return;
  }

  const targetRoot = root ?? document;
  const elements = targetRoot.querySelectorAll<HTMLElement>('[data-original-text-size]');

  elements.forEach((element) => {
    this.normalizeElement(element);
  });
}
```

Плюс функции наблюдения за DOM и изменениями.

```typescript
startDomObserver(): void {
  if (!this.isUnavailableUIScaling || this.observer) {
    return;
  }

  this.normalizeDocument(document);

  this.observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }

        if (node.dataset.originalTextSize) {
          this.normalizeElement(node);
        }

        const descendants = node.querySelectorAll<HTMLElement>('[data-original-text-size]');
        descendants.forEach((element) => {
          this.normalizeElement(element);
        });
      });
    });
  });

  this.observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

stopDomObserver(): void {
  if (this.observer) {
    this.observer.disconnect();
    this.observer = null;
  }
}
```

В приложениях наблюдатель подключается после `init()`, чтобы подхватывать динамически добавляемый контент.

```typescript
await textScaleManager.init();
if (isAndroid()) {
  textScaleManager.startDomObserver();
}
```

## Выводы

Системное масштабирование шрифта в WebView на Android может обходить ожидаемую модель «px в CSS = px на экране», поэтому единственный надёжный способ узнать фактический масштаб — сравнить `getComputedStyle` с эталоном в `16px`.

Моя личная статистика на проекте с миллионной аудиторией говорит, что у 20% пользователей базовый масштаб в настройках изменен с 1 на другое значение. Справедливости ради, это не все люди с ограничением зрения, практика показала, что некоторые Android-устройства по-умолчанию в заводских настройках ставят масштаб 1.1, поэтому устройства попадают в выборку, ведь дизайн даже в одно деление может где-то поползти.

> Примерно 36% Android и 38% iOS пользователей меняют значение масштаба шрифта в системных настройках на отличное от значения по умолчанию. Google I/O 2026

Дальше разумный путь — не отменять доступность целиком, а ограничить диапазон (`MIN`/`MAX`), выставить CSS-переменные для остальной вёрстки и точечно компенсировать только помеченные узлы, когда масштаб выходит за допустимые пределы и ломает раскладку.

Разметка `data-original-text-size` связывает дизайн-систему (числовой размер варианта) с runtime: менеджер знает «задуманный» размер до вмешательства ОС и может перезаписать его через `!important`, не сканируя всё дерево. `MutationObserver` закрывает сценарии с подгружаемым UI без лишних проходов по всему документу при каждом кадре.

Это компромисс: мы признаём ограничения пиксельной вёрстки и гибрида, но оставляем пользователю увеличенный текст в пределах, которые ещё не скрывают кнопки за краем экрана.

**Идеальнее по-прежнему строить интерфейс на относительных единицах и осознанной типографике — тогда меньше поводов для такого страховочного слоя.**

---

### Связанные заметки

- [[Skip Links — невидимый маркер хорошего вкуса](/garden/skip-links)]
- [[Практический аудит веб-доступности: 5 шагов без фанатизма](/garden/audit-a11y-without-wcag)]
- [[Аудит доступности веб-приложения Приорбанка](/garden/audit-priorbank-a11y)]
- [[Аудит доступности Wildberries. Может ли незрячий пользователь купить Бэтмобиль?](/garden/audit-wildberries-a11y)]
- [[Веб и тактильная типографика](/garden/braille)]
