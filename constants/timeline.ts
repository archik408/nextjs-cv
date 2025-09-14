export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  image?: string;
  category: 'career' | 'technology';
}

export const timelineData: TimelineEvent[] = [
  // Career milestones (left side)
  {
    year: 1991,
    title: 'Рождение',
    description: '4 августа 1991 года родился в г. Барановичи, Беларусь',
    category: 'career',
    image: '/back-bg.jpg',
  },
  {
    year: 1998,
    title: 'Гимназия №1 г. Барановичи',
    description:
      'Пошел в первый класс гимназии №1 г. Барановичи, где учился в физико-математическом классе',
    category: 'career',
    image: '/timeline/gimnasium.png',
  },
  {
    year: 1999,
    title: 'Первое знакомство с компьютером',
    description:
      'Впервые увидел и сел за компьютер у крестного на работе, играл в сапера на Windows 95',
    category: 'career',
    image: '/timeline/saper.jpg',
  },
  {
    year: 2000,
    title: 'Приставка Dendy',
    description: 'Появилась приставка Dendy, которая привила любовь к 8-битным играм на всю жизнь',
    category: 'career',
    image: '/timeline/mario.png',
  },
  {
    year: 2002,
    title: 'Первый код',
    description:
      'Попал в кабинет информатики в школе и написал свой первый код на Turbo Pascal 7.0 с модулями CRT и GRAPH',
    category: 'career',
    image: '/timeline/pascal.jpg',
  },
  {
    year: 2003,
    title: 'Первый домашний компьютер',
    description:
      'Мама купила Intel Pentium III с Window 2000 и появилась возможность программировать дома',
    category: 'career',
    image: '/timeline/windows-2000.jpg',
  },
  {
    year: 2005,
    title: 'Городская олимпиада г. Барановичи',
    description: 'Принял участие в городской олимпиаде по информатике и занял второе место',
    category: 'career',
    image: '/timeline/baranovichi.png',
  },
  {
    year: 2006,
    title: 'Московская олимпиада ОСО-2006',
    description:
      'Под руководством учителя информатики Шевченко Т.Г. участвовал в составе команды на Московской олимпиаде ОСО-2006',
    category: 'career',
    image: '/timeline/oco-2006.jpeg',
  },
  {
    year: 2007,
    title: 'Поступление в колледж г. Гродно',
    description:
      'Поступил в Технологический Колледж ГрГУ на специальность "Программное обеспечение информационных технологий"',
    category: 'career',
    image: '/timeline/grodno.png',
  },
  {
    year: 2008,
    title: 'Первый веб-сайт',
    description:
      'Разработал несколько веб-сайтов на PHP и Zend Framework для нескольких организаций и колледжа',
    category: 'career',
    image: '/timeline/zend.png',
  },
  {
    year: 2008,
    title: 'Победа в олимпиаде',
    description: 'Занял первое место во внутриколледжной олимпиаде по информатике',
    category: 'career',
    image: '/timeline/1-pace.jpeg',
  },
  {
    year: 2008,
    title: 'VI научная конференция г. Гродно',
    description:
      'Принял участие в VI научной конференции со своей программой по симуляции полярной системы координат',
    category: 'career',
    image: '/timeline/science.jpeg',
  },
  {
    year: 2009,
    title: 'Borland C++',
    description:
      'Пересел с Borland Pascal на Borland C++, который останестся моим основным инструментом до конца учебы',
    category: 'career',
    image: '/timeline/borland.png',
  },
  {
    year: 2009,
    title: 'Первый ноутбук',
    description: 'Мне подарили мой первый ноутбук для учебы Toshiba Sitelite A300D 213',
    category: 'career',
    image: '/timeline/toshiba.jpg',
  },
  {
    year: 2010,
    title: 'QA тестировщик в instinctools',
    description:
      'Во время практики устроился на позицию QA тестировщика в компанию instinctools EE Labs',
    category: 'career',
    image: '/timeline/itools.jpeg',
  },
  {
    year: 2011,
    title: 'Выпуск из колледжа и диплом',
    description:
      'Выпуск из колледжа, защита дипломного проекта (багтрекер), написанного на Java и Eclipse RCP/SWT',
    category: 'career',
    image: '/timeline/diplom.png',
  },
  {
    year: 2011,
    title: 'Первые автотесты',
    description:
      'Начал писать первые тесты по автоматизации на Java и Selenium RC для проекта DitaWorks',
    category: 'career',
    image: '/timeline/selenium.png',
  },
  {
    year: 2012,
    title: 'Переход в разработку на Java',
    description:
      'Перевелся в отдел разработки, где попал на проект Daimler, работая с Java, jQuery и Selenium',
    category: 'career',
    image: '/timeline/java.png',
  },
  {
    year: 2012,
    title: 'BIRT для Evonic AG',
    description:
      'Разработка функционала BIRT (Business Intelligence and Reporting Tools) для Evonic AG на Eclipse RAP',
    category: 'career',
    image: '/timeline/eclipse.png',
  },
  {
    year: 2013,
    title: 'Sibur Holdings - ExtJS & Documentum',
    description:
      'Разработка электронного документооборота для Sibur Holdings на платформе EMC Documentum и ExtJS',
    category: 'career',
    image: '/timeline/extjs.png',
  },
  {
    year: 2014,
    title: 'ExtJS для немецкой нотариальной палаты',
    description: 'Разрабатывал ПО для немецкой нотариальной палаты на фреймворке ExtJS и Java',
    category: 'career',
    image: '/timeline/extjs.png',
  },
  {
    year: 2015,
    title: 'CRM система SMART',
    description:
      'Разработка внутренней CRM системы SMART для instinctools EE Labs на Java и Angular.js',
    category: 'career',
    image: '/timeline/angular.png',
  },
  {
    year: 2015,
    title: 'Уход в JavaScript',
    description:
      'Полностью сосредоточился на JavaScript-стэке и попал на проект Penton Media, где разрабатывал приложение Equipmentwatch на Ember.js и Node.js',
    category: 'career',
    image: '/timeline/ember.png',
  },
  {
    year: 2015,
    title: 'Стартап True Impact',
    description:
      'Разработка UI на Angular.js для стартапа True Impact, который занимается анализом и аналитикой грантов, благотворительных инвестиций и волонтерской деятельности',
    category: 'career',
    image: '/timeline/angular.png',
  },
  {
    year: 2016,
    title: 'Женитьба на Катерине',
    description: 'Женился на своей жене Катерине',
    category: 'career',
    image: '/timeline/wife.png',
  },
  {
    year: 2016,
    title: 'Первый Macbook',
    description: 'Приобрел себе Macbook Air и с этого момента полностью пересел на MacOS',
    category: 'career',
    image: '/timeline/macbook-air.png',
  },
  {
    year: 2016,
    title: 'Руководитель группы разработчиков',
    description:
      'Стал руководителем группы разработчиков в instinctools EE Labs и перешел на React.js стэк',
    category: 'career',
    image: '/timeline/group-lead.jpeg',
  },
  {
    year: 2016,
    title: 'Топ-3 бизнес-консалтинг',
    description: 'Разработка ряда проектов для топ-3 в мире бизнес-консалтинга на React.js стэке',
    category: 'career',
    image: '/timeline/react.png',
  },
  {
    year: 2017,
    title: 'Рождение дочери Полины',
    description: 'Родилась дочь Полина',
    category: 'career',
    image: '/timeline/daughter.png',
  },
  {
    year: 2018,
    title: 'Выступление на GROCON-18',
    description:
      'Выступил на конференции GROCON-18, где рассказал про свой пет-проект GrodnoVR, опыт с ReactVR и виртуальной реальностью',
    category: 'career',
    image: '/timeline/grocon-18.png',
  },
  {
    year: 2018,
    title: 'Blockchain стартап Lition Energy',
    description:
      'Разрабатывал веб-приложение для немецкого blockchain стартапа Lition Energy, которые создают платформу для покупки зеленой энергии',
    category: 'career',
    image: '/timeline/lition.png',
  },
  {
    year: 2019,
    title: 'MacBook Pro Intel i9',
    description: 'Пересел на MacBook Pro Intel i9',
    category: 'career',
    image: '/timeline/macbook-i9.png',
  },
  {
    year: 2019,
    title: 'Рождение сына Матвея',
    description: 'Родился сын Матвей',
    category: 'career',
    image: '/timeline/son.png',
  },
  {
    year: 2019,
    title: 'CSS-Minsk-JS',
    description: 'Посетил уникальную для Минска конференции CSS-Minsk-JS',
    category: 'career',
    image: '/timeline/minskjs.png',
  },
  {
    year: 2019,
    title: 'Выступление на GROCON-19',
    description: 'Выступил на конференции GROCON-19, где рассказал про Lition Energy',
    category: 'career',
    image: '/timeline/grocon-19.jpeg',
  },
  {
    year: 2019,
    title: 'Переход в Tispr',
    description:
      'Спустя 9 лет ушел из instinctools EE Labs и начал работу в американском стартапе Tispr в роли React.js разработчика',
    category: 'career',
    image: '/timeline/tispr.jpeg',
  },
  {
    year: 2020,
    title: 'Ребрендинг Tispr в Indy',
    description:
      'Реализовал ребрендинг стартапа Tispr в Indy, применив современный подход темизации с CSS Custom Properties и SSR на Next.js',
    category: 'career',
    image: '/timeline/indy.jpeg',
  },
  {
    year: 2020,
    title: 'Статья в Smashing Magazine',
    description: 'Вышла моя статья о CSS Custom Properties на портале Smashing Magazine',
    category: 'career',
    image: '/timeline/smashing.png',
  },
  {
    year: 2021,
    title: 'Godel Technologies',
    description:
      'Перешел в компанию Godel Technologies на позицию менеджера и начал вести корпоративный JS подкаст и канал о веб-доступности',
    category: 'career',
    image: '/timeline/godel.jpeg',
  },
  {
    year: 2022,
    title: 'IntexSoft',
    description: 'Перешел в компанию IntexSoft на позицию ведущего разработчика',
    category: 'career',
    image: '/timeline/intexsoft.png',
  },
  {
    year: 2022,
    title: 'PWA для X5 Group',
    description:
      'Начал разработку PWA приложения "Клуб Тайных Покупателей" для X5 Group ритейлера с миллионной аудиторией',
    category: 'career',
    image: '/timeline/mystery-shopper.png',
  },
  {
    year: 2023,
    title: 'Митапы в IntexSoft',
    description:
      'Провел несколько митапов внутри IntexSoft о нюансах разработки архитектуры гибридных мобильных приложений',
    category: 'career',
    image: '/timeline/meetup.png',
  },
  {
    year: 2024,
    title: 'Программирование с детьми',
    description:
      'Начал программировать со своими детьми на Scratch и Blockly, рассказывать про историю компьютеров и программирования',
    category: 'career',
    image: '/scratch.jpg',
  },
  {
    year: 2025,
    title: 'Выступление в X5 Group',
    description:
      'Выступил на митапе в X5 Group, рассказал о специфике разработки PWA для оффлайн, IndexedDB и Workbox',
    category: 'career',
    image: '/timeline/x5-meetup.png',
  },
  {
    year: 2025,
    title: 'MacBook Pro M4',
    description: 'Пересел на MacBook Pro M4',
    category: 'career',
    image: '/timeline/macbook-m4.png',
  },

  // Technology milestones (right side)
  {
    year: 1993,
    title: 'Mosaic Browser',
    description:
      'Первый популярный графический веб-браузер, который сделал интернет доступным для масс',
    category: 'technology',
    image: '/timeline/mosaic.png',
  },
  {
    year: 1995,
    title: 'Opera Browser',
    description: 'Первый релиз браузера Opera от норвежской компании Opera Software',
    category: 'technology',
    image: '/timeline/opera.png',
  },
  {
    year: 1995,
    title: 'JavaScript',
    description: 'Брендан Эйк создал JavaScript за 10 дней для браузера Netscape Navigator',
    category: 'technology',
    image: '/timeline/js.png',
  },
  {
    year: 1996,
    title: 'CSS 1.0',
    description:
      'W3C принял первую спецификацию CSS, позволившую отделить содержание от оформления веб-страниц',
    category: 'technology',
    image: '/timeline/w3c.png',
  },
  {
    year: 1997,
    title: 'EcmaScript Standard',
    description:
      'Ecma International опубликовал первую спецификацию ECMAScript (ECMA-262), стандартизировав JavaScript',
    category: 'technology',
    image: '/timeline/es.png',
  },
  {
    year: 1998,
    title: 'CSS 2.0',
    description:
      'Выпущена спецификация CSS 2.0, которая добавила поддержку позиционирования и медиа-запросов',
    category: 'technology',
    image: '/timeline/w3c.png',
  },
  {
    year: 1998,
    title: 'Браузерные войны',
    description:
      'Начало интенсивной конкуренции между Internet Explorer и Netscape Navigator за доминирование на рынке',
    category: 'technology',
    image: '/timeline/ie.png',
  },
  {
    year: 2000,
    title: 'XMLHttpRequest',
    description:
      'Microsoft создала XMLHttpRequest для Outlook Web Access, что стало основой для AJAX',
    category: 'technology',
    image: '/timeline/ajax.png',
  },
  {
    year: 2003,
    title: 'WordPress',
    description: 'Мэтт Малленвег и Майк Литтл создали WordPress как форк b2/cafelog',
    category: 'technology',
    image: '/timeline/wordpress.png',
  },
  {
    year: 2004,
    title: 'Eclipse RAP/SWT',
    description:
      'Eclipse представил RAP (Rich Ajax Platform) и SWT (Standard Widget Toolkit) для веб-приложений',
    category: 'technology',
    image: '/timeline/eclipse.png',
  },
  {
    year: 2004,
    title: 'Gmail',
    description:
      'Google запустил Gmail с революционным подходом к веб-почте и 1 ГБ свободного места',
    category: 'technology',
    image: '/timeline/gmail.png',
  },
  {
    year: 2005,
    title: 'AJAX',
    description: 'Джесси Джеймс Гарретт ввел термин AJAX, что изменило подход к веб-разработке',
    category: 'technology',
    image: '/timeline/ajax.png',
  },
  {
    year: 2005,
    title: 'Opera Mini',
    description:
      'Первый мобильный браузер Opera Mini для Java-телефонов с серверным сжатием данных',
    category: 'technology',
    image: '/timeline/opera.png',
  },
  {
    year: 2006,
    title: 'jQuery',
    description: 'Джон Резиг выпустил jQuery, который упростил работу с DOM и AJAX',
    category: 'technology',
    image: '/timeline/jquery.png',
  },
  {
    year: 2006,
    title: 'Google Web Toolkit (GWT)',
    description:
      'Google представил GWT - инструмент для разработки веб-приложений на Java с компиляцией в JavaScript',
    category: 'technology',
    image: '/timeline/gwt.png',
  },
  {
    year: 2007,
    title: 'iPhone с Safari',
    description:
      'Apple представила первый iPhone с мобильным браузером Safari, революционизировав мобильный веб',
    category: 'technology',
    image: '/timeline/apple.png',
  },
  {
    year: 2007,
    title: 'ExtJS',
    description:
      'Sencha выпустила ExtJS - JavaScript фреймворк для создания богатых веб-приложений с компонентами',
    category: 'technology',
    image: '/timeline/extjs.png',
  },
  {
    year: 2008,
    title: 'Google Chrome',
    description:
      'Google выпустил браузер Chrome с движком V8, который значительно ускорил JavaScript',
    category: 'technology',
    image: '/timeline/chrome.png',
  },
  {
    year: 2008,
    title: 'V8 JavaScript Engine',
    description:
      'Google представил движок V8, который революционизировал производительность JavaScript',
    category: 'technology',
    image: '/timeline/v8.png',
  },
  {
    year: 2010,
    title: 'Firefox 4.0',
    description: 'Mozilla выпустил Firefox 4.0 с улучшенным движком Gecko и поддержкой WebGL',
    category: 'technology',
    image: '/timeline/ff.png',
  },
  {
    year: 2011,
    title: 'Internet Explorer 9',
    description: 'Microsoft выпустил IE9 с поддержкой HTML5, CSS3 и аппаратным ускорением',
    category: 'technology',
    image: '/timeline/ie.png',
  },
  {
    year: 2012,
    title: 'Safari 6.0',
    description: 'Apple выпустил Safari 6.0 с движком WebKit и поддержкой новых веб-стандартов',
    category: 'technology',
    image: '/timeline/safari.png',
  },
  {
    year: 2013,
    title: 'Blink Engine',
    description:
      'Google создал Blink - форк WebKit для Chrome, положив начало новой эре браузерных движков',
    category: 'technology',
    image: '/timeline/chrome.png',
  },
  {
    year: 2015,
    title: 'Microsoft Edge',
    description: 'Microsoft выпустил Edge с движком EdgeHTML, заменив Internet Explorer',
    category: 'technology',
    image: '/timeline/edge.png',
  },
  {
    year: 2018,
    title: 'Firefox Quantum',
    description:
      'Mozilla выпустил Firefox Quantum с новым движком Servo, значительно улучшив производительность',
    category: 'technology',
    image: '/timeline/ff.png',
  },
  {
    year: 2020,
    title: 'Microsoft Edge на Chromium',
    description: 'Microsoft перевел Edge на движок Chromium, объединив экосистему браузеров',
    category: 'technology',
    image: '/timeline/edge.png',
  },
  {
    year: 2009,
    title: 'Node.js',
    description: 'Райан Даль создал Node.js, позволив использовать JavaScript на сервере',
    category: 'technology',
    image: '/timeline/nodejs.png',
  },
  {
    year: 2009,
    title: 'HTML5',
    description: 'W3C начал работу над HTML5, который принес семантические элементы и новые API',
    category: 'technology',
    image: '/timeline/html.png',
  },
  {
    year: 2009,
    title: 'HTML5 Canvas',
    description:
      'HTML5 Canvas API стал доступен, позволив создавать 2D графику и анимации прямо в браузере',
    category: 'technology',
    image: '/timeline/html.png',
  },
  {
    year: 2009,
    title: 'JSON',
    description:
      'JSON стал стандартом RFC 7159, заменив XML как основной формат обмена данными в веб',
    category: 'technology',
    image: '/timeline/json.png',
  },
  {
    year: 2010,
    title: 'Backbone.js',
    description: 'Джереми Ашкенас создал Backbone.js, один из первых JavaScript MVC фреймворков',
    category: 'technology',
    image: '/timeline/backbone.png',
  },
  {
    year: 2010,
    title: 'CSS3',
    description:
      'Началось активное развитие CSS3 с новыми возможностями: градиенты, тени, анимации',
    category: 'technology',
    image: '/timeline/css.png',
  },
  {
    year: 2011,
    title: 'AngularJS',
    description: 'Google выпустил AngularJS, который ввел концепцию двусторонней привязки данных',
    category: 'technology',
    image: '/timeline/angular.png',
  },
  {
    year: 2011,
    title: 'Ember.js',
    description: 'Yehuda Katz и Tom Dale создали Ember.js как преемника SproutCore',
    category: 'technology',
    image: '/timeline/ember.png',
  },
  {
    year: 2012,
    title: 'TypeScript',
    description: 'Microsoft выпустил TypeScript - типизированную версию JavaScript',
    category: 'technology',
    image: '/timeline/ts.png',
  },
  {
    year: 2012,
    title: 'JavaScript - самый популярный язык',
    description:
      'JavaScript стал самым популярным языком программирования по версии GitHub и Stack Overflow',
    category: 'technology',
    image: '/timeline/js.png',
  },
  {
    year: 2013,
    title: 'React',
    description: 'Facebook выпустил React - библиотеку для создания пользовательских интерфейсов',
    category: 'technology',
    image: '/timeline/react.png',
  },
  {
    year: 2013,
    title: 'Netflix BFF Pattern',
    description:
      'Netflix представил архитектурный паттерн Backend for Frontend для оптимизации взаимодействия между фронтендом и бэкендом',
    category: 'technology',
    image: '/timeline/netflix.png',
  },
  {
    year: 2013,
    title: 'Web Components',
    description:
      'W3C начал работу над Web Components - стандартом для создания переиспользуемых компонентов',
    category: 'technology',
    image: '/timeline/webcomponents.png',
  },
  {
    year: 2014,
    title: 'Vue.js',
    description: 'Эван Ю создал Vue.js - прогрессивный JavaScript фреймворк',
    category: 'technology',
    image: '/timeline/vue.png',
  },
  {
    year: 2014,
    title: 'WebAssembly',
    description: 'Началась работа над WebAssembly - бинарным форматом для веб-приложений',
    category: 'technology',
    image: '/timeline/ws.png',
  },
  {
    year: 2015,
    title: 'ES6 (ES2015)',
    description:
      'Выпущен ES6 с классами, стрелочными функциями, модулями и многими другими возможностями',
    category: 'technology',
    image: '/timeline/es.png',
  },
  {
    year: 2015,
    title: 'Service Workers',
    description: 'Google представил Service Workers для создания офлайн-приложений',
    category: 'technology',
    image: '/timeline/pwa.png',
  },
  {
    year: 2016,
    title: 'Progressive Web Apps',
    description: 'Google ввел концепцию PWA - веб-приложений, работающих как нативные',
    category: 'technology',
    image: '/timeline/pwa.png',
  },
  {
    year: 2016,
    title: 'Webpack 2',
    description: 'Выпущен Webpack 2 с улучшенной производительностью и поддержкой ES6 модулей',
    category: 'technology',
    image: '/timeline/webpack.png',
  },
  {
    year: 2017,
    title: 'CSS Grid',
    description: 'Поддержка CSS Grid Layout стала доступна во всех основных браузерах',
    category: 'technology',
    image: '/timeline/css.png',
  },
  {
    year: 2017,
    title: 'Смерть Flash',
    description:
      'Adobe объявила о прекращении поддержки Flash Player к 2020 году, окончательно похоронив эпоху Flash/ActionScript',
    category: 'technology',
    image: '/timeline/flash.png',
  },
  {
    year: 2017,
    title: 'WebAssembly 1.0',
    description: 'Выпущена первая стабильная версия WebAssembly',
    category: 'technology',
    image: '/timeline/ws.png',
  },
  {
    year: 2018,
    title: 'CSS Custom Properties',
    description: 'CSS Custom Properties (CSS Variables) получили широкую поддержку браузеров',
    category: 'technology',
    image: '/timeline/css.png',
  },
  {
    year: 2018,
    title: 'Web Components v1',
    description: 'Выпущена стабильная версия Web Components с Custom Elements и Shadow DOM',
    category: 'technology',
    image: '/timeline/webcomponents.png',
  },
  {
    year: 2019,
    title: 'Deno Runtime',
    description:
      'Райан Даль представил Deno - современную альтернативу Node.js с TypeScript из коробки',
    category: 'technology',
    image: '/timeline/deno.png',
  },
  {
    year: 2020,
    title: 'CSS Logical Properties',
    description: 'Поддержка CSS Logical Properties для интернационализации',
    category: 'technology',
    image: '/timeline/css.png',
  },
  {
    year: 2020,
    title: 'Web Vitals',
    description:
      'Google представил Core Web Vitals - метрики для измерения пользовательского опыта',
    category: 'technology',
    image: '/timeline/chrome.png',
  },
  {
    year: 2021,
    title: 'CSS Cascade Layers',
    description: 'Выпущена спецификация CSS Cascade Layers для лучшего контроля каскада',
    category: 'technology',
    image: '/timeline/css.png',
  },
  {
    year: 2021,
    title: 'WebGPU',
    description: 'Началась работа над WebGPU - новым API для графики и вычислений',
    category: 'technology',
    image: '/timeline/webgpu.png',
  },
  {
    year: 2022,
    title: 'CSS Container Queries',
    description: 'Container Queries получили поддержку в основных браузерах',
    category: 'technology',
    image: '/timeline/css.png',
  },
  {
    year: 2022,
    title: 'CSS Cascade Layers',
    description: 'CSS Cascade Layers стали доступны во всех современных браузерах',
    category: 'technology',
    image: '/timeline/css.png',
  },
  {
    year: 2023,
    title: 'Vite 5.0',
    description:
      'Выпущен Vite 5.0 - быстрый сборщик модулей, ставший популярной альтернативой Webpack',
    category: 'technology',
    image: '/timeline/vite.png',
  },
  {
    year: 2024,
    title: 'WebAssembly 2.0',
    description:
      'WebAssembly 2.0 получил широкую поддержку браузеров, революционизировав высокопроизводительные веб-приложения',
    category: 'technology',
    image: '/timeline/ws.png',
  },
  {
    year: 2025,
    title: 'AI в веб-разработке',
    description:
      'Искусственный интеллект и машинное обучение стали активно интегрироваться в веб-приложения для персонализации и автоматизации',
    category: 'technology',
    image: '/timeline/openai.png',
  },
];

// Sort timeline data by year and alternate between career and technology events
export const sortedTimelineData = (() => {
  // First, sort by year
  const sortedByYear = timelineData.sort((a, b) => a.year - b.year);

  // Group events by year
  const eventsByYear: { [year: number]: TimelineEvent[] } = {};
  sortedByYear.forEach((event) => {
    if (!eventsByYear[event.year]) {
      eventsByYear[event.year] = [];
    }
    eventsByYear[event.year].push(event);
  });

  // Interleave events within each year (career and technology alternate)
  const result: TimelineEvent[] = [];
  const sortedYears = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => a - b);

  sortedYears.forEach((year) => {
    const yearEvents = eventsByYear[year];
    const careerEvents = yearEvents.filter((e) => e.category === 'career');
    const techEvents = yearEvents.filter((e) => e.category === 'technology');

    // Alternate between career and technology events
    const maxLength = Math.max(careerEvents.length, techEvents.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < careerEvents.length) {
        result.push(careerEvents[i]);
      }
      if (i < techEvents.length) {
        result.push(techEvents[i]);
      }
    }
  });

  // Debug: log events after 2019
  const eventsAfter2019 = result.filter((event) => event.year > 2019);
  console.log(
    'Events after 2019:',
    eventsAfter2019.length,
    eventsAfter2019.map((e) => `${e.year} - ${e.title}`)
  );

  return result;
})();
