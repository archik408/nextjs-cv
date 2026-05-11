import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { QrCodeGeneratorPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata({
  ...seoConfigs.tools,
  title: 'QR / Barcode Generator',
  description:
    'Generate QR codes and barcodes (Code128, EAN-13, Data Matrix, and more) right in your browser.',
  path: '/qr-code-generator',
});

export default function QrCodeGeneratorPage() {
  return <QrCodeGeneratorPageClient />;
}
