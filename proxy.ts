import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Additional security headers that can't be set in next.config.ts
  const nonce = generateNonce();

  // Set nonce for inline scripts and styles
  response.headers.set('X-Nonce', nonce);

  // Rate limiting headers (for information)
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', '99');

  // Security headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Prevent caching of API responses
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    // Additional API security
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
  }

  // Block suspicious requests
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [/sqlmap/i, /nikto/i, /nessus/i, /openvas/i, /nmap/i, /masscan/i];

  if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Block requests with suspicious query parameters
  const url = request.nextUrl;
  const suspiciousParams = [
    'union',
    'select',
    'insert',
    'update',
    'delete',
    'drop',
    '<script',
    'javascript:',
    'onload=',
    'onerror=',
    '../',
    '..\\',
    'etc/passwd',
    'boot.ini',
  ];

  const queryString = url.search.toLowerCase();
  if (suspiciousParams.some((param) => queryString.includes(param))) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type') || '';
    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain',
    ];

    if (!allowedTypes.some((type) => contentType.includes(type))) {
      return new NextResponse('Unsupported Media Type', { status: 415 });
    }
  }

  return response;
}

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}

// Configure which paths the proxy runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
