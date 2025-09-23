#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require('https');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const http = require('http');

// Security headers to check
const REQUIRED_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-src 'none';",
};

// URLs to check (you can modify these)
const URLs_TO_CHECK = [
  // 'https://your-domain.com', // Uncomment and add your production URL
  // 'http://localhost:3000'     // Uncomment for local testing
];

function checkSecurityHeaders(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const req = client.request(url, { method: 'HEAD' }, (res) => {
      const missingHeaders = [];
      const incorrectHeaders = [];

      // Check each required header
      Object.entries(REQUIRED_HEADERS).forEach(([headerName, expectedValue]) => {
        const actualValue = res.headers[headerName.toLowerCase()];

        if (!actualValue) {
          missingHeaders.push(headerName);
        } else if (actualValue !== expectedValue) {
          incorrectHeaders.push({
            header: headerName,
            expected: expectedValue,
            actual: actualValue,
          });
        }
      });

      resolve({
        url,
        statusCode: res.statusCode,
        missingHeaders,
        incorrectHeaders,
        allHeaders: res.headers,
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout checking ${url}`));
    });

    req.end();
  });
}

async function main() {
  console.log('🔒 Checking security headers...\n');

  let hasErrors = false;

  for (const url of URLs_TO_CHECK) {
    try {
      console.log(`Checking: ${url}`);
      const result = await checkSecurityHeaders(url);

      if (result.missingHeaders.length > 0) {
        console.log(`❌ Missing headers: ${result.missingHeaders.join(', ')}`);
        hasErrors = true;
      }

      if (result.incorrectHeaders.length > 0) {
        console.log('❌ Incorrect headers:');
        result.incorrectHeaders.forEach(({ header, expected, actual }) => {
          console.log(`  ${header}: expected "${expected}", got "${actual}"`);
        });
        hasErrors = true;
      }

      if (result.missingHeaders.length === 0 && result.incorrectHeaders.length === 0) {
        console.log('✅ All security headers are properly configured');
      }

      console.log('');
    } catch (error) {
      console.log(`❌ Error checking ${url}: ${error.message}`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.log('🚨 Security header check failed!');
    process.exit(1);
  } else {
    console.log('✅ Security header check passed!');
    process.exit(0);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { checkSecurityHeaders };
