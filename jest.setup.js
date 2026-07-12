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
      contact: 'Contact',
      showMore: 'Show more',
      showLess: 'Show less',
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
      experiences: [],
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
