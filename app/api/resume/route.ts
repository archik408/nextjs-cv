import React from 'react';
import { NextRequest } from 'next/server';
import { DocumentProps, renderToBuffer } from '@react-pdf/renderer';
import { ResumeDocument } from '@/lib/pdf/ResumeDocument';
import { ELanguage } from '@/constants/enums';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const langParam = (searchParams.get('lang') || ELanguage.en) as keyof typeof ELanguage | string;
  const lang = ((ELanguage as Record<string, string>)[langParam] ?? ELanguage.en) as ELanguage;

  const element = React.createElement(ResumeDocument, { lang });
  const pdfBuffer = await renderToBuffer(element as unknown as React.ReactElement<DocumentProps>);

  return new Response(pdfBuffer as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Artur_Basak_Resume_${lang}.pdf"`,
    },
  });
}
