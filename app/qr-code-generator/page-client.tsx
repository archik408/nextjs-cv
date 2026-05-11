'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/hooks/use-language';
import { AlertCircle, Download, QrCode } from 'lucide-react';
import bwipjs from 'bwip-js';

type BarcodeOption = { bcid: string; label: string };

const COMMON_TYPES: BarcodeOption[] = [
  { bcid: 'qrcode', label: 'QR Code (qrcode)' },
  { bcid: 'code128', label: 'Code 128 (code128)' },
  { bcid: 'code39', label: 'Code 39 (code39)' },
  { bcid: 'ean13', label: 'EAN-13 (ean13)' },
  { bcid: 'upca', label: 'UPC-A (upca)' },
  { bcid: 'upce', label: 'UPC-E (upce)' },
  { bcid: 'datamatrix', label: 'Data Matrix (datamatrix)' },
  { bcid: 'pdf417', label: 'PDF417 (pdf417)' },
  { bcid: 'azteccode', label: 'Aztec (azteccode)' },
];

const bwip = bwipjs as unknown as {
  toCanvas: (canvas: HTMLCanvasElement, opts: Record<string, unknown>) => void;
};

export function QrCodeGeneratorPageClient() {
  const { t } = useLanguage();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [text, setText] = useState('https://arturbasak.dev');
  const [selectedType, setSelectedType] = useState<string>(COMMON_TYPES[0]?.bcid ?? 'qrcode');
  const [customType, setCustomType] = useState('');
  const [useCustomType, setUseCustomType] = useState(false);
  const [scale, setScale] = useState<number>(12);
  const [height, setHeight] = useState<number>(18);
  const [includeText, setIncludeText] = useState(false);
  const [error, setError] = useState<string>('');

  const bcid = useMemo(() => {
    const raw = useCustomType ? customType : selectedType;
    return raw.trim().toLowerCase();
  }, [customType, selectedType, useCustomType]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const trimmed = text.trim();
    if (!trimmed) {
      setError('');
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }

    try {
      setError('');
      bwip.toCanvas(canvasRef.current, {
        bcid,
        text: trimmed,
        scale,
        height,
        includetext: includeText,
        textxalign: 'center',
        backgroundcolor: 'FFFFFF',
      });
    } catch (e) {
      setError(
        t.qrGenErrorInvalidType ||
          (e instanceof Error ? e.message : 'Failed to generate barcode. Check barcode type.')
      );
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [bcid, height, includeText, scale, t.qrGenErrorInvalidType, text]);

  const onDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    // If generation failed or has not run yet, canvas may be empty (0x0).
    if (!canvas.width || !canvas.height) {
      setError(t.qrGenErrorDownload || 'Failed to download image.');
      return;
    }

    try {
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) {
        // Fallback for older environments
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const url = URL.createObjectURL(blob);
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (!opened) {
        // Popup blocker fallback
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Delay revoke so the new tab has time to load the blob URL.
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      setError(t.qrGenErrorDownload || 'Failed to download image.');
      console.error(e);
    }
  };

  const canDownload = !!text.trim() && !error;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400">
              <QrCode className="w-6 h-6" aria-hidden />
            </div>
            <h1 className="text-3xl font-bold">{t.qrGenTitle || 'QR / Barcode Generator'}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t.qrGenDesc ||
              'Generate QR codes and barcodes (Code128, EAN-13, Data Matrix, and more) right in your browser.'}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-5">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.qrGenInputLabel || 'Text'}
                </span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.qrGenInputPlaceholder || 'Enter text or URL...'}
                  className="w-full min-h-28 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.qrGenTypeLabel || 'Barcode type'}
                  </span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    disabled={useCustomType}
                    className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60"
                  >
                    {COMMON_TYPES.map((opt) => (
                      <option key={opt.bcid} value={opt.bcid}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t.qrGenSupportedTypesHint ||
                      'You can use any bwip-js type (e.g. code11, code93, itf14, etc.) using Custom type.'}
                  </p>
                </label>

                <div className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.qrGenCustomTypeLabel || 'Custom type (bcid)'}
                    </span>
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={useCustomType}
                        onChange={(e) => setUseCustomType(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span>{t.qrGenUseCustom || 'Use'}</span>
                    </label>
                  </div>
                  <input
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    disabled={!useCustomType}
                    placeholder="qrcode"
                    className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <a
                      className="underline hover:no-underline"
                      href="https://github.com/metafloor/bwip-js#supported-barcode-types"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.qrGenSupportedTypesLink || 'Supported barcode types'}
                    </a>
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.qrGenScaleLabel || 'Scale'}: {scale}
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.qrGenHeightLabel || 'Height'}: {height}
                  </span>
                  <input
                    type="range"
                    min={4}
                    max={40}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t.qrGenHeightHint || 'Some 2D codes ignore height.'}
                  </p>
                </label>
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={includeText}
                  onChange={(e) => setIncludeText(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>{t.qrGenIncludeText || 'Show human-readable text (if supported)'}</span>
              </label>

              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={onDownload}
                disabled={!canDownload}
                className="w-fit flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden />
                {t.qrGenDownload || 'Download PNG'}
              </button>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-3">{t.qrGenPreview || 'Preview'}</h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-[280px]">
                <canvas ref={canvasRef} className="max-w-full h-auto" />
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {t.qrGenPreviewHint ||
                  'Tip: download uses a white background for best compatibility when printing/scanning.'}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
