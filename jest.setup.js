import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
    style,
    fill,
    sizes: _sizes,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    priority: _priority,
    unoptimized: _unoptimized,
    ...rest
  }) => {
    const computedStyle = {
      ...(style || {}),
      ...(fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}),
    };

    const role = !alt ? 'presentation' : undefined;
    return (
      <img
        src={typeof src === 'string' ? src : ''}
        alt={alt || ''}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        style={computedStyle}
        role={role}
        {...rest}
      />
    );
  },
}));

// Keep img.src attribute as provided (avoid URL resolution differences in JSDOM)
try {
  Object.defineProperty(window.HTMLImageElement.prototype, 'src', {
    configurable: true,
    get() {
      return this.getAttribute('src') || '';
    },
    set(value) {
      this.setAttribute('src', value);
    },
  });
} catch {}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock TextEncoder and TextDecoder for jsdom environment
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { TextEncoder, TextDecoder } = require('util');
Object.defineProperty(global, 'TextEncoder', {
  writable: true,
  value: TextEncoder,
});
Object.defineProperty(global, 'TextDecoder', {
  writable: true,
  value: TextDecoder,
});

// Mock theme context
jest.mock('@/lib/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock language context
jest.mock('@/lib/use-language', () => ({
  useLanguage: () => ({
    language: 'en',
    setLanguage: jest.fn(),
    t: {
      name: 'Artur Basak',
      role: 'Senior Frontend Engineer • UI/UX Specialist',
      subtitle: 'Building the Web of Tomorrow, Grounded in the Engineering of the Past.',
      garden: 'Digital Garden',
      switchLangToRu: 'Switch language to Russian',
      switchLangToEn: 'Switch language to English',
      switchToLight: 'Switch to light theme',
      switchToDark: 'Switch to dark theme',
      light: 'Light',
      dark: 'Dark',
      experience: 'Experience',
      skills: 'Skills',
      certificates: 'Certificates',
      viewCertificate: 'View Certificate',
      otherCertificatesLabel:
        'Other certificates from LinkedIn Learning, Coursera, Udemy, Frontend Masters, Microsoft, and more',
      otherCertificatesPause: 'Pause certificate carousel',
      otherCertificatesPlay: 'Play certificate carousel',
      otherCertificatesItems: {
        'frontend-masters-interviewing': {
          title: 'Interviewing for Front-End Engineers — Frontend Masters',
          alt: 'Certificate of Completion for Artur Basak: Interviewing for Front-End Engineers from Frontend Masters, completed March 14, 2020',
        },
        'frontend-masters-accessibility-js': {
          title: 'Accessibility in JavaScript Applications — Frontend Masters',
          alt: 'Certificate of Completion for Artur Basak: Accessibility in JavaScript Applications from Frontend Masters, completed March 31, 2020',
        },
        'frontend-masters-typography': {
          title: 'Responsive Web Typography v2 — Frontend Masters',
          alt: 'Certificate of Completion for Artur Basak: Responsive Web Typography v2 from Frontend Masters, completed April 15, 2020',
        },
        'linkedin-managing-developers': {
          title: 'Managing and Leading Developers — LinkedIn Learning',
          alt: 'LinkedIn Learning certificate for Artur Basak: Managing and Leading Developers learning path, completed February 1, 2022',
        },
        'linkedin-a11y-web-design': {
          title: 'Accessibility for Web Design — LinkedIn Learning',
          alt: 'LinkedIn Learning certificate for Artur Basak: Accessibility for Web Design, completed February 8, 2022',
        },
        'linkedin-react-a11y': {
          title: 'React: Accessibility — LinkedIn Learning',
          alt: 'LinkedIn Learning certificate for Artur Basak: React Accessibility, completed January 25, 2022',
        },
        'linkedin-a11y-best-practices': {
          title:
            'Simplifying Web Development with Accessibility Best Practices — LinkedIn Learning',
          alt: 'LinkedIn Learning certificate for Artur Basak: Simplifying Web Development with Accessibility Best Practices, completed February 3, 2022',
        },
        'microsoft-a11y-fundamentals': {
          title: 'Accessibility fundamentals — Microsoft',
          alt: 'Microsoft certificate for Artur Basak: Accessibility fundamentals, completed February 4, 2022',
        },
        'udemy-pwa': {
          title: 'Progressive Web Apps (PWA) — The Complete Guide — Udemy',
          alt: 'Udemy Certificate of Completion for Artur Basak: Progressive Web Apps (PWA) — The Complete Guide, completed May 13, 2024',
        },
        'frontend-masters-last-algorithms': {
          title: "The Last Algorithms Course You'll Need — Frontend Masters",
          alt: "Certificate of Completion for Artur Basak: The Last Algorithms Course You'll Need from Frontend Masters, completed May 17, 2025",
        },
        'frontend-masters-algorithms-js': {
          title: 'A Practical Guide to Algorithms with JavaScript — Frontend Masters',
          alt: 'Certificate of Completion for Artur Basak: A Practical Guide to Algorithms with JavaScript from Frontend Masters, completed February 10, 2025',
        },
        'geekle-react-global': {
          title: 'React Global Online Summit 22.2 — Geekle',
          alt: 'Certificate of Attendance for Artur Basak: React Global Online Summit 22.2 by Geekle, November 8–9, 2022',
        },
        'geekle-architecture': {
          title: "Worldwide Software Architecture Summit '22 — Geekle",
          alt: "Certificate of Attendance for Artur Basak: Worldwide Software Architecture Summit '22 by Geekle, March 1–3, 2022",
        },
        'coursera-scratch': {
          title: 'Introduction to Basic Game Development using Scratch — Coursera',
          alt: 'Coursera Project Certificate for Artur Basak: Introduction to Basic Game Development using Scratch, completed November 29, 2024',
        },
        'frontend-masters-scratch-kids': {
          title: 'Get Kids into Coding with Scratch — Frontend Masters',
          alt: 'Certificate of Completion for Artur Basak: Get Kids into Coding with Scratch from Frontend Masters, completed November 28, 2024',
        },
        'makey-makey-101': {
          title: 'Makey Makey 101 Course',
          alt: 'Certificate of Completion for Artur Basak: Makey Makey 101 Course, completed June 16, 2025',
        },
      },
      contact: 'Contact',
      showMore: 'Show more',
      showLess: 'Show less',
      viewAllExperience: 'View full experience',
      timelineLink: 'Timeline',
      blog: 'Blog',
      toolsAndExperiments: 'Tools & Experiments',
      yandexAliceSkillsTitle: 'Skills for Yandex Station with Alice',
      yandexAliceSkillsToolDescription:
        'Chat with Alice skills in the browser: My Microbit and The Witcher for Matvey.',
      yandexAliceSkillsDescription:
        'Choose a skill in the chat and try the same commands and dialogue available on Yandex Station.',
      yandexAliceChooseSkill: 'Which skill would you like to launch?',
      yandexAliceMicrobitTitle: 'My Microbit',
      yandexAliceMicrobitDescription: 'Send commands to Microbit and receive Alice’s replies.',
      yandexAliceWitcherTitle: 'The Witcher for Matvey',
      yandexAliceWitcherDescription:
        'Choose a witcher school, go hunting, and reply using suggested options or text.',
      yandexAliceChatLabel: 'Text chat with Yandex Station Alice skills',
      yandexAliceAssistantName: 'Alice',
      yandexAliceUserName: 'You',
      yandexAliceResponding: 'Alice is responding',
      yandexAliceResponseOptions: 'Response options',
      yandexAliceSessionEnded: 'The session has ended.',
      yandexAliceNewSession: 'Start a new session',
      yandexAliceChangeSkill: 'Choose another skill',
      yandexAliceMessageLabel: 'Your message',
      yandexAliceMessagePlaceholder: 'Type a message…',
      yandexAliceChooseSkillPlaceholder: 'Choose a skill first',
      yandexAliceSendMessage: 'Send message',
      yandexAliceRestartSession: 'Restart session',
      yandexAliceKeyboardHint: 'Enter — send, Shift+Enter — new line',
      yandexAliceTextModeTitle: 'About text mode',
      yandexAliceTextModeInfo:
        'The page sends messages to the existing skills without changing their Yandex Dialogs protocol.',
      yandexAliceGenericError: 'Could not get a response. Please try again.',
      yandexAliceUnknownResponse: 'The server returned a response in an unknown format.',
      heroAvatarFlipCard: 'Avatar flip card',
      heroGitHubProfile: 'GitHub Profile',
      heroLinkedInProfile: 'LinkedIn Profile',
      heroSendEmail: 'Send Email',
      heroTelegram: 'Telegram',
      testimonialsTitle: 'Testimonials',
      // Image Optimizer translations used in tests
      ioTitle: 'Image Optimizer',
      ioUploadImage: 'Upload Image',
      ioQuality: 'Quality',
      ioResizeBefore: 'Resize before compress',
      ioOutputFormat: 'Output format',
      ioKeep: 'Keep',
      ioPng: 'PNG',
      ioWebP: 'WebP',
      ioAvif: 'AVIF',
      ioOptimizeButton: 'Optimize Image',
      ioOptimizing: 'Optimizing...',
      // OCR heading
      ocrSupportedFormats: 'Supported Formats',
      experiences: [
        {
          role: 'Web Development Lead',
          company: 'X5 Tech',
          period: '2026 - Present',
          listDescription: ['Leading hybrid mobile development'],
        },
        {
          role: 'Senior Software Engineer',
          company: 'IntexSoft',
          period: '2022 - 2026',
          listDescription: ['Client frontend delivery'],
        },
        {
          role: 'Software Engineering Manager',
          company: 'Godel Technologies',
          period: '2021 - 2022',
          listDescription: ['Managed a division'],
        },
        {
          role: 'Senior Web Engineer',
          company: 'Indy',
          period: '2019 - 2021',
          listDescription: ['Design system work'],
        },
      ],
      skillsList: [],
      certificatesList: [],
      testimonials: [],
    },
  }),
}));

// Mock Request for jsdom environment
global.Request = class MockRequest {
  constructor(url) {
    Object.defineProperty(this, 'url', {
      value: url,
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
};

// Mock Response for jsdom environment
global.Response = class MockResponse {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.headers = init?.headers || {};
  }
};

// Mock @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
  pdf: jest.fn(() => ({
    toBuffer: jest.fn(() => Promise.resolve(Buffer.from('mock pdf content'))),
  })),
  render: jest.fn(),
  Document: ({ children }) => children,
  Page: ({ children }) => children,
  Text: ({ children }) => children,
  View: ({ children }) => children,
  Image: ({ children }) => children,
}));
