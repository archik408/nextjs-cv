import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.zubry.by',
      },
    ],
  },

  // MoveNet-only edge AI does not need @mediapipe/pose; stub it so Turbopack
  // does not fail on that package's non-ESM browser bundle.
  turbopack: {
    resolveAlias: {
      '@mediapipe/pose': './lib/edge-ai/mediapipe-pose-stub.ts',
    },
  },

  // Turbopack has built-in WebAssembly support, no webpack config needed
  // For production builds, WebAssembly is handled automatically

  // Security headers
  async headers() {
    return [
      // Help agents discover the curated AI index (llmstxt.org)
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '</llms.txt>; rel="describedby"',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://cdn.jsdelivr.net https://va.vercel-scripts.com", // Next.js requires unsafe-eval and unsafe-inline for dev
              "worker-src 'self' blob: https://cdn.jsdelivr.net", // Allow Web Workers from blob URLs and CDN
              "style-src 'self' 'unsafe-inline'", // Required for styled-jsx and CSS-in-JS
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https: data: wss: wss://*.pusher.com wss://ws-*.pusher.com https://*.pusher.com https://sockjs-*.pusher.com",
              // blob: for getUserMedia / MediaStream consumers
              "media-src 'self' https: blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Content Type Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Frame Options
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy — camera/mic enabled for same-origin Edge AI tools only
          {
            key: 'Permissions-Policy',
            value: [
              'camera=(self)',
              'microphone=(self)',
              'geolocation=()',
              'interest-cohort=()',
              'payment=()',
              'usb=()',
            ].join(', '),
          },
          // Strict Transport Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Cross-Origin Embedder Policy
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          // Cross-Origin Opener Policy
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          // Cross-Origin Resource Policy
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          // Remove Server header
          {
            key: 'Server',
            value: '',
          },
          // Remove X-Powered-By header
          {
            key: 'X-Powered-By',
            value: '',
          },
        ],
      },
      // WASM files headers
      {
        source: '/wasm/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },

  // Remove X-Powered-By header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Ensure serverless functions don't bundle these modules so their data files are available at runtime
  serverExternalPackages: ['svgo', 'css-tree', 'csso'],

  // TensorFlow.js and face-api ship ESM that needs transpilation in the Next bundle
  transpilePackages: [
    '@tensorflow/tfjs-core',
    '@tensorflow/tfjs-converter',
    '@tensorflow/tfjs-backend-webgl',
    '@tensorflow/tfjs-backend-webgpu',
    '@tensorflow-models/pose-detection',
    '@vladmandic/face-api',
  ],

  // process.cwd() + fs in garden / image-placeholder over-traces public/ (~120 MB of
  // videos, PDFs, WASM) into every serverless Function. Keep those as CDN static only.
  // Note: excludes run after includes — do not glob-exclude all of public/ or
  // image-placeholders Includes would be removed again.
  outputFileTracingExcludes: {
    '/*': [
      './public/garden/**/*',
      './public/docs/**/*',
      './public/wasm/**/*',
      './public/audit/**/*',
      './public/timeline/**/*',
      './public/certificates/**/*',
      './coverage/**/*',
      './TESTING.md',
      './tsconfig.tsbuildinfo',
      './package-lock.json',
    ],
  },

  // Narrow includes for routes that intentionally read from disk at runtime
  outputFileTracingIncludes: {
    '/': ['./content/garden/**/*'],
    '/garden': ['./content/garden/**/*'],
    '/garden/*': ['./content/garden/**/*'],
    '/sitemap.xml': ['./content/garden/**/*'],
    '/garden/rss.xml': ['./content/garden/**/*'],
    '/llms.txt': ['./content/garden/**/*'],
    '/api/image-placeholder': ['./public/image-placeholders/**/*'],
    '/api/image-placeholder/collections': ['./public/image-placeholders/**/*'],
  },
};

export default nextConfig;
