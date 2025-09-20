import '@testing-library/jest-dom';

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
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt="" />;
  },
}));

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
      experience: 'Experience',
      skills: 'Skills',
      certificates: 'Certificates',
      contact: 'Contact',
      showMore: 'Show more',
      showLess: 'Show less',
      blog: 'Blog',
      toolsAndExperiments: 'Tools & Experiments',
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
