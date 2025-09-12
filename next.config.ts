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

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://cdn.jsdelivr.net", // Next.js requires unsafe-eval and unsafe-inline for dev
              "worker-src 'self' blob: https://cdn.jsdelivr.net", // Allow Web Workers from blob URLs and CDN
              "style-src 'self' 'unsafe-inline'", // Required for styled-jsx and CSS-in-JS
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https: data:",
              "media-src 'self' https:",
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
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
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
    ];
  },

  // Remove X-Powered-By header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Ensure serverless functions don't bundle these modules so their data files are available at runtime
  serverExternalPackages: ['svgo', 'css-tree', 'csso'],
};

export default nextConfig;
