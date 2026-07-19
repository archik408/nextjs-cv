export interface OtherCertificate {
  id: string;
  src: string;
}

/**
 * Secondary / shorter-form certificates shown in the homepage carousel.
 * Alt texts and modal titles live in translations (keyed by `id`).
 */
export const OTHER_CERTIFICATES: readonly OtherCertificate[] = [
  {
    id: 'frontend-masters-interviewing',
    src: '/certificates/other/frontend-masters-interviewing-frontend-engineers.webp',
  },
  {
    id: 'frontend-masters-accessibility-js',
    src: '/certificates/other/frontend-masters-accessibility-javascript.webp',
  },
  {
    id: 'frontend-masters-typography',
    src: '/certificates/other/frontend-masters-responsive-web-typography.webp',
  },
  {
    id: 'linkedin-managing-developers',
    src: '/certificates/other/linkedin-managing-leading-developers.webp',
  },
  {
    id: 'linkedin-a11y-web-design',
    src: '/certificates/other/linkedin-accessibility-web-design.webp',
  },
  {
    id: 'linkedin-react-a11y',
    src: '/certificates/other/linkedin-react-accessibility.webp',
  },
  {
    id: 'linkedin-a11y-best-practices',
    src: '/certificates/other/linkedin-accessibility-best-practices.webp',
  },
  {
    id: 'microsoft-a11y-fundamentals',
    src: '/certificates/other/microsoft-accessibility-fundamentals.webp',
  },
  {
    id: 'udemy-pwa',
    src: '/certificates/other/udemy-progressive-web-apps.webp',
  },
  {
    id: 'frontend-masters-last-algorithms',
    src: '/certificates/other/frontend-masters-last-algorithms-course.webp',
  },
  {
    id: 'frontend-masters-algorithms-js',
    src: '/certificates/other/frontend-masters-algorithms-javascript.webp',
  },
  {
    id: 'geekle-react-global',
    src: '/certificates/other/geekle-react-global-summit-22.webp',
  },
  {
    id: 'geekle-architecture',
    src: '/certificates/other/geekle-software-architecture-summit-22.webp',
  },
  {
    id: 'coursera-scratch',
    src: '/certificates/other/coursera-scratch-game-development.webp',
  },
  {
    id: 'frontend-masters-scratch-kids',
    src: '/certificates/other/frontend-masters-scratch-kids-coding.webp',
  },
  {
    id: 'makey-makey-101',
    src: '/certificates/other/makey-makey-101.webp',
  },
] as const;
