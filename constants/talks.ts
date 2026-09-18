export type TalkResourceKind = 'pdf' | 'article';

export type TalkResource = {
  url: string;
  kind: TalkResourceKind;
};

export type Talk = {
  id: string;
  title: { en: string; ru: string };
  event: string;
  coverSrc: string;
  coverAlt: { en: string; ru: string };
  videoUrl: string;
  resources?: TalkResource[];
};

/**
 * Homepage Talks — conference talks with video covers + slides/article links.
 * Order: newest first.
 */
export const TALKS: Talk[] = [
  {
    id: 'mystery-shopper-x5',
    title: {
      en: 'The Secret Life of Photos in the X5 Mystery Shopper Club',
      ru: 'Секретная жизнь фотографий в Клубе Тайных Покупателей X5',
    },
    event: 'MoscowJS 70 (2026)',
    coverSrc: '/talks/mystery-shopper-x5.webp',
    coverAlt: {
      en: 'Talk cover: The Secret Life of Photos in the X5 Mystery Shopper Club',
      ru: 'Обложка доклада: Секретная жизнь фотографий в Клубе Тайных Покупателей X5',
    },
    videoUrl: 'https://youtu.be/7Yingac_9zI',
    resources: [{ url: '/docs/mystery-shopper-offline-x5.pdf', kind: 'pdf' }],
  },
  {
    id: 'legacy-testing',
    title: {
      en: 'Test Automation Strategy for a Legacy System',
      ru: 'Стратегия автоматического тестирования на JavaScript',
    },
    event: "GroCon'19 (2019)",
    coverSrc: '/talks/legacy-testing.webp',
    coverAlt: {
      en: 'Talk cover: Test Automation Strategy for a Legacy System',
      ru: 'Обложка доклада: Стратегия автоматического тестирования на JavaScript',
    },
    videoUrl: 'https://www.youtube.com/watch?v=qBVf-Qi6yaY',
    resources: [{ url: '/docs/legacy-testing-strategy-grocon19.pdf', kind: 'pdf' }],
  },
  {
    id: 'web-accessibility',
    title: {
      en: 'Web Accessibility. What Is It and How?',
      ru: 'Доступность веб-интерфейсов. Что это и как?',
    },
    event: 'instinctools Meetup (2018)',
    coverSrc: '/talks/web-accessibility.webp',
    coverAlt: {
      en: 'Talk cover: Web Accessibility. What Is It and How?',
      ru: 'Обложка доклада: Доступность веб-интерфейсов. Что это и как?',
    },
    videoUrl: 'https://www.youtube.com/watch?v=f0GYECeDCU4',
    resources: [{ url: '/docs/web-accessibility-talk.pdf', kind: 'pdf' }],
  },
  {
    id: 'grodnovr',
    title: {
      en: 'GrodnoVR — My First and Last Experience with ReactVR',
      ru: 'GrodnoVR — мой первый и последний опыт с ReactVR',
    },
    event: "GroCon'18 (2018)",
    coverSrc: '/talks/grodnovr.webp',
    coverAlt: {
      en: 'Talk cover: GrodnoVR — My First and Last Experience with ReactVR',
      ru: 'Обложка доклада: GrodnoVR — мой первый и последний опыт с ReactVR',
    },
    videoUrl: 'https://www.youtube.com/watch?v=geX1fQYScQU&t=317s',
    resources: [
      { url: '/docs/grodnovr-grocon18.pdf', kind: 'pdf' },
      {
        url: 'https://medium.com/@arturbasak/grodnovr-my-first-and-last-experience-with-reactvr-7ac156fc1a70',
        kind: 'article',
      },
    ],
  },
];
