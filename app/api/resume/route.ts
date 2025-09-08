import React from 'react';
import { NextRequest } from 'next/server';
import { DocumentProps, renderToBuffer } from '@react-pdf/renderer';
import { ResumeDocument } from '@/lib/pdf/ResumeDocument';
import { ELanguage } from '@/constants/enums';
import { secureHeaders, sanitizeInput, RateLimiter } from '@/lib/security';

// Rate limiter for resume downloads
const rateLimiter = new RateLimiter(60000, 10); // 10 requests per minute

export async function GET(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP =
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    if (!rateLimiter.isAllowed(clientIP)) {
      return new Response('Too Many Requests', {
        status: 429,
        headers: {
          ...secureHeaders,
          'Retry-After': '60',
        },
      });
    }

    // Validate and sanitize language parameter
    const { searchParams } = new URL(req.url);
    const langParam = sanitizeInput(searchParams.get('lang') || ELanguage.en);

    // Validate language parameter against allowed values
    const allowedLanguages = Object.values(ELanguage);
    const lang = allowedLanguages.includes(langParam as ELanguage)
      ? (langParam as ELanguage)
      : ELanguage.en;

    // Validate filename to prevent path traversal
    const filename = `Artur_Basak_Resume_${lang}.pdf`;
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      return new Response('Invalid filename', {
        status: 400,
        headers: secureHeaders,
      });
    }

    // Generate PDF
    const element = React.createElement(ResumeDocument, { lang });
    const pdfBuffer = await renderToBuffer(element as unknown as React.ReactElement<DocumentProps>);

    // Validate PDF buffer
    if (!pdfBuffer || pdfBuffer.byteLength === 0) {
      return new Response('Failed to generate PDF', {
        status: 500,
        headers: secureHeaders,
      });
    }

    return new Response(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        ...secureHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
        // Additional security headers for file downloads
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Resume generation error:', error);

    return new Response('Internal Server Error', {
      status: 500,
      headers: secureHeaders,
    });
  }
}
