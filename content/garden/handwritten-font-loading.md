---
title: Оптимизируем загрузку рукописного шрифта
description: Несколько советов по ускорению загрузки скриптовой гарнитуры на реальном примере электронной подписи в Tispr.
date: 2020-05-12
tags: [typography, frontend, css, javascript, performance, seedling]
---

![Августовский канал. Шлюз Домбровка. Фото Артур Басак](/garden/handwritten-font-loading/cover.webp)

_Августовский канал. Шлюз Домбровка. Фото Артур Басак_

Рукописная гарнитура или скрипт — это, как правило, семейство шрифтов, выполненных от руки или имитирующих рукописный текст. Почему оптимизируем именно скрипт? За счет своей специфики, такие гарнитуры очень сильно отличаются друг от друга.

Скажем, если вы используете шрифт без засечек, с засечками или моноширинный, то подмена шрифта по умолчанию на загружаемый не будет столь заметна, как в случае со скриптами. Именно поэтому такие проблемы, как [FOUC, FOIT и т.д.](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) тут стоят очень остро. Как же можно исправить эту ситуацию?

На платформе [Tispr](https://tispr.com/) есть возможность заключать контракты с электронной подписью. Для подписи используется гарнитура [Brownie](https://ifonts.xyz/brownie-font-family.html).

![Образец гарнитуры Brownie Script](/garden/handwritten-font-loading/brownie-specimen.webp)

_Образец гарнитуры Brownie Script_

Ниже, пару конкретных шагов, которые были предприняты на проекте для оптимизации загрузки шрифта подписи в [релизе контрактов версии 1.3](https://www.tispr.com/tools/contracts).

![Электронная подпись контракта на платформе Tispr](/garden/handwritten-font-loading/tispr-signature.webp)

_Электронная подпись контракта на платформе Tispr_

## Шрифт по умолчанию

Древнейшая практика в веб-типографике это указание семейства шрифтов по умолчанию. Раньше это не давало каких-то ощутимых бенефитов, пока шрифт загружался, контент вообще не рендерился (Flash of Invisible Text / FOIT). Теперь, вместе со свойством [font-display](https://developer.mozilla.org/ru/docs/Web/CSS/@font-face/font-display), мы можем не блокировать отображение и показать текст пользователю сразу. Необходимый шрифт загрузится и произойдет подмена.

![Пока загружается Brownie, мы не видим вообще текста (Flash of Invisible Text / FOIT), font-display: block](/garden/handwritten-font-loading/foit-block.webp)

_Пока загружается Brownie, мы не видим вообще текста (Flash of Invisible Text / FOIT), font-display: block_

В случае, если загрузка оборвется или файл шрифта будет отсутствовать на сервере, то текст так и останется видимым на странице со шрифтом по умолчанию.

Изначально в проекте у подписи контракта не было семейства шрифтов по умолчанию, следовательно оно наследовалось от элементов по иерархии выше в CSS, а это, в свою очередь, общая для платформы гарнитура [TT Norms](https://typetype.org/ru/fonts/norms). Т.е. визуально понять, что это электронная подпись контракта было крайне сложно.

```css
.signature {
  font-family: 'Brownie';
}
```

![Пока загружается Brownie, мы видим TT Norms, font-display: swap](/garden/handwritten-font-loading/swap-ttnorms.webp)

_Пока загружается Brownie, мы видим TT Norms, font-display: swap_

Наравне с [serif, sans-serif и monospace](https://www.w3.org/Style/Examples/007/fonts.en.html) в CSS есть возможность указать [семейство шрифтов](https://developer.mozilla.org/ru/docs/Web/CSS/font-family) OC по умолчанию для курсивного текста — cursive (на платформе MacOS это будет гарнитура [Apple Chancery](https://en.wikipedia.org/wiki/List_of_Apple_typefaces#/media/File:Apple_Chancery.jpg), на Windows и Ubuntu — [Comic Sans MS](https://ru.wikipedia.org/wiki/Comic_Sans)).

```css
.signature {
  font-family: 'Brownie', cursive;
}
```

![Пока загружается Brownie, мы видим cursive (Apple Chancery), font-display: swap](/garden/handwritten-font-loading/swap-cursive.webp)

_Пока загружается Brownie, мы видим cursive (Apple Chancery), font-display: swap_

Это, как минимум, уже визуально отличит текст подписи от общего текста платформы, хотя, как я уже упомянул выше, разница между Brownie и cursive кардинальная, поэтому нам надо максимально быстро подгрузить шрифт, иначе подмена будет очень заметна (Flash of Unstyled Content / FOUC).

## Формат шрифта

Первый шаг к быстрой загрузке шрифта — это его формат. В свойстве [src](https://developer.mozilla.org/ru/docs/Web/CSS/@font-face/src) секции [font-face](https://developer.mozilla.org/ru/docs/Web/CSS/@font-face) крайне важно указать форматы в верном порядке, иначе браузер загрузит первый попавшийся формат, который сможет распознать.

Изначально, в проекте порядок для Brownie был такой:

```css
@font-face {
  font-family: Brownie;
  font-display: swap;
  src:
    url(/static/media/brownie.eot) format('embedded-opentype'),
    url(/static/media/brownie.ttf) format('truetype'),
    url(/static/media/brownie.woff) format('woff'),
    url(/static/media/brownie.woff2) format('woff2');
}
```

Т.е. для большинства браузеров загружался формат [TrueType](https://ru.wikipedia.org/wiki/TrueType). Для справки: [WOFF2](https://ru.wikipedia.org/wiki/Web_Open_Font_Format) не просто новее [TTF](https://ru.wikipedia.org/wiki/TrueType) и позволяет конфигурировать такие штуки, как лигатуры и т.д., он еще и значительно меньше весит:

- Brownie [WOFF2](https://ru.wikipedia.org/wiki/Web_Open_Font_Format) — 38.6 KB
- Brownie [WOFF](https://ru.wikipedia.org/wiki/Web_Open_Font_Format) — 51.5 KB
- Brownie [TTF](https://ru.wikipedia.org/wiki/TrueType) — 94 KB
- Brownie [EOT](https://ru.wikipedia.org/wiki/Embedded_OpenType) — 94.3 KB

Если мы поднимем WOFF2 выше, то первым делом браузер попытается загрузить его ([EOT](https://ru.wikipedia.org/wiki/Embedded_OpenType) должен остаться первым, так как только его поддерживают старые версии IE, остальные браузеры его проигнорируют). В случае отсутствия поддержки этого формата, начнется попытка загрузки следующего в списке.

```css
@font-face {
  font-family: Brownie;
  font-display: swap;
  src:
    url(/static/media/brownie.eot) format('embedded-opentype'),
    url(/static/media/brownie.woff2) format('woff2'),
    url(/static/media/brownie.woff) format('woff'),
    url(/static/media/brownie.ttf) format('truetype');
}
```

WOFF2 намного быстрее скачать, чем TTF, но все же нам надо что-то скачать. В условиях плохого интернета, переключение стилей текста все еще будет заметно. Идеально было бы вообще избежать загрузки при открытии модального окна с подписью. Идеально было бы, если бы к этому моменту шрифт уже был загружен в кэш.

## Предварительная загрузка ссылок

[Предварительная загрузка ссылок (Link prefetching)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ) или [предварительная загрузка контента (Preloading content)](https://developer.mozilla.org/ru/docs/Web/HTML/Preloading_content) это относительно новый механизм встроенный в браузеры, который позволяет указать перечень необходимых для загрузки ресурсов веб-приложения. Браузер попытается загрузить ресурсы, когда начнется время его простоя (idle). Механизм призван улучшить производительность веб-сайтов и ускорить рендеринг веб-страниц.

Файл шрифта, по сути, тоже является ресурсом, и мы могли бы пометить его, как необходимый для предзагрузки.

```html
<link rel="preload" href="/static/media/brownie.woff2" as="font" type="font/woff2" />
```

Почему preload, а не prefetch? Директива preload новее и она [поддерживается в Safari и Chrome](https://caniuse.com/#search=preload) — это целевые браузеры платформы Tispr. К сожалению, директива не поддерживается Firefox. С prefetch все [наоборот](https://caniuse.com/#search=prefetch) — она не поддерживается в Safari. Еще один ключевой момент это то, что директива prefetch носит рекомендательный характер для браузера, preload — добровольно принудительный. Если проще, то preload подходит для ресурсов, которые нужны здесь и сейчас, prefetch — для ресурсов страниц, которые мы откроем позже.

Почему нельзя использовать обе директивы сразу? Это было бы ок, в случае, если бы наши целевые браузеры были только Firefox и Safari, но в случае с Chrome, который поддерживает обе директивы, предзагрузка шрифта произойдет дважды.

Если вы используете React.js (как раз то, на чем построен Tispr UI), то компонент [react-helmet](https://github.com/nfl/react-helmet) позволяет очень удобно конфигурировать секцию [head](https://developer.mozilla.org/ru/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML) документа HTML из любого места в JSX коде. Важно также предзагружать именно тот формат, который в нашем списке первый, т.е. WOFF2 и там и там, в противном случае можно получить двойную загрузку с разными форматами.

```js
import React, { PureComponent, Fragment } from 'react';
import Helmet from 'react-helmet';
// ...other imports
import brownieScriptTypeface from './fonts/brownieScript.woff2';
import styles from './style.scss';
class EditContract extends PureComponent {
// ...other methods
render () {
    const { contract } = this.props;

    return (
      <div className={ styles.edit }>
        <Helmet>
          <link rel="preload" href={ brownieScriptTypeface } as="font" type="font/woff2" />
        </Helmet>
// ...other code
```

Также очень удобно покрыть функционал react-helmet модульными тестами:

```js
const helmet = Helmet.peek();
expect(helmet.linkTags).toEqual([
  { rel: 'preload', href: brownieScriptTypeface, as: 'font', type: 'font/woff2' },
]);
```

## CSS Font Loading API

CSS Font Loading API — это вариант для браузеров, которые не поддерживают preload. В целом, в рамках этого API нам доступно два интерфейса — [FontFace](https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace) и [FontFaceSet](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet).

Первый, является эквивалентом CSS правилу [font-face](https://developer.mozilla.org/ru/docs/Web/CSS/@font-face) и позволяет загрузить определенный шрифт с указанными параметрами. Второй, позволяет работать с уже описанным набором шрифтов. Благодаря этим интерфейсам мы можем добиться лучшего покрытия браузеров. CSS Font Loading API гораздо [лучше поддерживается](https://caniuse.com/#search=FontFace%20API%3A%20load), чем директивы предварительной загрузки ресурсов.

Ключевой момент, все трюки связанные с предзагрузкой надо выполнить в компоненте страницы, после ее открытия и до загрузки модального окна с электронной подписью.

[FontFaceSet.load()](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/load) в нашем случае подойдет лучше, так как наша гарнитура уже имеет соответствующее font-face правило в CSS коде.

```js
// Font Utils
const isFontFaceSupported = window.FontFace;
const isFontFaceSetSupported = document.fonts;
const rem = '16px';

export function preloadTypeface (typeface, hasCSSRule, options) {
  if (hasCSSRule) {
    if (isFontFaceSetSupported) {
      const fontStyle = `${rem} ${typeface}`;
      if (!document.fonts.check(fontStyle)) {
        document.fonts.load(fontStyle).then(f => f);
      }
    }
  } else {
    if (isFontFaceSupported && isFontFaceSetSupported) {
      const { path, ...other } = options || {};
      const font = new window.FontFace(typeface, `url(${path})`, other);
      font.load().then(fontFace => document.fonts.add(fontFace));
    }
  }
}

// React Component
import React, { PureComponent, Fragment } from 'react';
import { preloadTypeface } from 'web-client/src/lib/utils/font';
// ...other imports
import brownieScriptTypeface from './fonts/brownieScript.woff2';
import styles from './style.scss';
class EditContract extends PureComponent {
componentDidMount () {
    preloadTypeface('Brownie', true);
  }
// ...other code
```

Есть еще один трюк, который помогает оптимизировать загрузку шрифта. Скажем, если бы гарнитура использовалась только для пары слов или даже букв (например для буквицы), то мы могли бы нарезать шрифт на отдельные глифы и загрузить только необходимые нам.

Подобную практику я как-то применял на своем собственном веб-сайте [zubry.by](https://zubry.by/), когда для заголовков использовал рукописную гарнитуру [MarckScript](https://fonts.google.com/specimen/Marck+Script). У Google Fonts API есть возможность нарезки шрифта по средствам параметра text в URL:

```html
<link
  href="https://fonts.googleapis.com/css?family=Marck+Script&display=swap&text=КонвертыМаркиОткрыткиПосткарты"
  rel="stylesheet"
/>
```

![zubry.by — заголовок страницы «Марки», гарнитура MarckScript](/garden/handwritten-font-loading/zubry-marck.webp)

_zubry.by — заголовок страницы «Марки», гарнитура MarckScript_

В подходах описанных выше, нет ничего сверхъестественного. Они давно известны и просты в своем использовании. При этом, эти трюки кардинально улучшают пользовательский опыт взаимодействия.

Артур Басак, 2020
