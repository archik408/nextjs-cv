type Post = {
  title: string;
  excerpt: string;
  href: string;
  image: string;
  source: string;
  date: string; // ISO or readable
  author?: string; // Optional author field
};

export const posts: Post[] = [
  {
    title: 'Реальная эффективность Brotli',
    excerpt: 'Экспериментально оцениваем пользу Brotli для продакшн‑проектов.',
    href: 'https://medium.com/@arturbasak/%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F-%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D1%81%D1%82%D1%8C-brotli-9ff6edeb5abf',
    image: '/icons/medium.png',
    source: 'Medium',
    date: '2020-11-23',
  },
  {
    title: 'How To Configure Application Color Schemes With CSS Custom Properties',
    excerpt:
      'A practical approach to splitting colors into palette, functional and component levels with CSS Custom Properties.',
    href: 'https://www.smashingmagazine.com/2020/08/application-color-schemes-css-custom-properties/',
    image: '/icons/smashingmagazine.png',
    source: 'Smashing Magazine',
    date: '2020-08-11',
  },
  {
    title: 'UI Kit, Design System, DesignOps',
    excerpt: 'Что важно в индустриальном подходе к дизайну интерфейсов и разработке.',
    href: 'https://medium.com/better-programming/ui-kit-design-system-designops-e4a60e5dd277',
    image: '/icons/betterprogramming.png',
    source: 'Better Programming',
    date: '2020-06-15',
  },
  {
    title: 'Оптимизируем загрузку рукописного шрифта',
    excerpt:
      'Как эффективно подключить кастомный рукописный шрифт и не потерять в производительности.',
    href: 'https://medium.com/@arturbasak/%D0%BE%D0%BF%D1%82%D0%B8%D0%BC%D0%B8%D0%B7%D0%B8%D1%80%D1%83%D0%B5%D0%BC-%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D1%83-%D1%80%D1%83%D0%BA%D0%BE%D0%BF%D0%B8%D1%81%D0%BD%D0%BE%D0%B3%D0%BE-%D1%88%D1%80%D0%B8%D1%84%D1%82%D0%B0-258fb9bee001',
    image: '/icons/medium.png',
    source: 'Medium',
    date: '2020-05-12',
  },
  {
    title: '5 Tips To Improve Your UI Development Environment',
    excerpt: 'Практические советы для ускорения и стабилизации UI‑разработки.',
    href: 'https://medium.com/better-programming/5-tips-to-help-improve-your-ui-development-environment-6ceda3827618',
    image: '/icons/betterprogramming.png',
    source: 'Better Programming',
    date: '2020-03-31',
  },
  {
    title: 'A Visual Tutorial On Every Type Of Test You Can Write',
    excerpt: 'Наглядный гайд по видам тестов и когда их применять.',
    href: 'https://medium.com/better-programming/a-visual-tutorial-on-every-type-of-test-you-can-write-ec9b83edcf35',
    image: '/icons/betterprogramming.png',
    source: 'Better Programming',
    date: '2020-03-24',
  },
  {
    title: 'GrodnoVR — мой опыт с ReactVR',
    excerpt: 'История о первом и последнем опыте с ReactVR.',
    href: 'https://medium.com/@arturbasak/grodnovr-my-first-and-last-experience-with-reactvr-7ac156fc1a70',
    image: '/icons/medium.png',
    source: 'Medium',
    date: '2018-11-13',
  },
  {
    title: 'Flux: Some Things Never Change',
    excerpt: 'О принципах Flux и почему они до сих пор актуальны.',
    href: 'https://medium.com/@arturbasak/flux-some-things-never-change-46ad8820e92c',
    image: '/icons/medium.png',
    source: 'Medium',
    date: '2018-02-14',
  },
  {
    title: 'Знай свой инструмент: Event Loop в libuv',
    excerpt:
      'Знай свой инструмент — твердят все вокруг и все равно доверяют. Доверяют модулю, доверяют фреймворку, доверяют чужому примеру. Излюбленный вопрос на собеседованиях по Node.js — это устройство Event Loop.',
    href: 'https://habr.com/ru/articles/336498/',
    image: '/icons/habr.png',
    source: 'Habr',
    date: '2017-08-28',
  },
  {
    title: 'Тесты, которые должен писать разработчик',
    excerpt: 'Какие тесты действительно важны на проекте и почему.',
    href: 'https://medium.com/@arturbasak/%D1%82%D0%B5%D1%81%D1%82%D1%8B-%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D1%8B%D0%B5-%D0%B4%D0%BE%D0%BB%D0%B6%D0%B5%D0%BD-%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%87%D0%B8%D0%BA-a04cab35f45b',
    image: '/icons/medium.png',
    source: 'Medium',
    date: '2017-07-19',
  },
  {
    title: 'Human-Computer Interaction',
    excerpt:
      'This document summarizes technologies related to human-computer interaction including computer vision, face detection, face recognition, thought detection, barcode reading, and Bluetooth. It provides links to resources on OpenCV, Point Cloud Library, Node OpenCV, tracking.js, CCV, Visage, Haar-like features, Viola-Jones algorithm, WebRTC, getUserMedia, Neurosky brain-computer interface, Bluetooth Low Energy including AltBeacon, iBeacon, and Eddystone, Noble and Bluetooth Serial Port Node.js modules, and Web Bluetooth. It also lists some example applications built with Angular2 that incorporate computer vision and QR code reading functionality.',
    href: 'https://www.slideshare.net/slideshow/js-amp-hci-2017ppt/77153125',
    image: '/icons/slideshare.png',
    source: 'Slideshare',
    date: '2017',
  },
  {
    title: 'Dev Guide to the Internet of Things (IoT)',
    excerpt:
      'The document provides an overview of developing for the Internet of Things using the IBM stack. It introduces various hardware components like Raspberry Pi and sensors that can be used to build IoT devices. It also shares links to software tools and platforms like Node-RED, Bluemix, and Fritzing that are useful for prototyping and developing IoT applications. The goal is to share knowledge from a course on IoT development with the team.',
    href: 'https://www.slideshare.net/slideshow/dev-guide-to-the-iot-ibm-stack/74148969',
    image: '/icons/slideshare.png',
    source: 'Slideshare',
    date: '2017',
  },
  {
    title: 'CI, CD, CT, Deploy, IaaS, DevOps, Stage',
    excerpt: 'По следам своего свежего опыта с AWS и Jenkins',
    href: 'https://www.slideshare.net/slideshow/ci-cd-ct-deploy-iaas-devops-stage/74660514',
    image: '/icons/slideshare.png',
    source: 'Slideshare',
    date: '2016',
  },
  {
    title: 'Experience with hapi.js',
    excerpt:
      "Walmart is investing heavily in open source software development. The presentation discusses Walmart's use of open source technologies like Node.js, NPM, and modules to build server-side applications and APIs. Key aspects include routing, plugins, and leveraging existing open source packages.",
    href: 'https://www.slideshare.net/slideshow/hapi-2016/77153062',
    image: '/icons/slideshare.png',
    source: 'Slideshare',
    date: '2016',
  },
];
