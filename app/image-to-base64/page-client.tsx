'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/hooks/use-language';
import { Check, Clipboard, ImageIcon, Upload } from 'lucide-react';

type OutputFormat = 'dataUri' | 'css' | 'html';

type ImageMeta = {
  dataUrl: string;
  mimeType: string;
  fileName: string;
  width: number;
  height: number;
};

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', 'true');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function loadImageMeta(file: File): Promise<ImageMeta> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const mimeMatch = /^data:([^;]+);base64,/.exec(dataUrl);
        resolve({
          dataUrl,
          mimeType: mimeMatch?.[1] ?? (file.type || 'image/png'),
          fileName: file.name,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = () => reject(new Error('ImageLoadFailed'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('FileReadFailed'));
    reader.readAsDataURL(file);
  });
}

function buildOutput(meta: ImageMeta, format: OutputFormat): string {
  const { dataUrl, width, height } = meta;

  switch (format) {
    case 'dataUri':
      return dataUrl;
    case 'css':
      return `.image {\n  width: ${width}px;\n  height: ${height}px;\n  background-position: 0px 0px;\n  background-repeat: no-repeat;\n  background-image: url('${dataUrl}');\n}`;
    case 'html':
      return `<img width="${width}" height="${height}" alt="" src="${dataUrl}">`;
  }
}

function getTabLabel(format: OutputFormat, mimeType: string): string {
  switch (format) {
    case 'dataUri':
      return `data:${mimeType};base64`;
    case 'css':
      return '.class {background: ...}';
    case 'html':
      return '<img src="...">';
  }
}

const FORMATS: OutputFormat[] = ['dataUri', 'css', 'html'];

export function ImageToBase64PageClient() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('dataUri');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const output = useMemo(() => {
    if (!imageMeta) return '';
    return buildOutput(imageMeta, outputFormat);
  }, [imageMeta, outputFormat]);

  const lineCount = useMemo(() => {
    if (!output) return 1;
    return output.split('\n').length;
  }, [output]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const processFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setError(t.imgB64ErrorInvalidType || 'Please select a valid image file.');
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const meta = await loadImageMeta(file);
        setImageMeta(meta);
        setOutputFormat('dataUri');
      } catch {
        setError(t.imgB64ErrorLoad || 'Failed to load the image. Please try another file.');
        setImageMeta(null);
      } finally {
        setIsLoading(false);
      }
    },
    [t.imgB64ErrorInvalidType, t.imgB64ErrorLoad]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void processFile(event.target.files?.[0]);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    void processFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearImage = () => {
    setImageMeta(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    setCopied(ok);
    if (!ok) setError(t.imgB64ErrorCopy || 'Failed to copy to clipboard.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-orange-600 dark:text-orange-400">
              <ImageIcon className="w-6 h-6" aria-hidden />
            </div>
            <h1 className="text-3xl font-bold">{t.imgB64Title || 'Image to Base64'}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t.imgB64Desc ||
              'Upload an image file, then choose a ready-made code snippet for use on your site.'}
          </p>

          {/* Upload zone */}
          <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <label
              htmlFor="img-b64-upload"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                  : 'border-orange-300 dark:border-orange-600/70 hover:border-orange-400 dark:hover:border-orange-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="img-b64-upload"
                aria-label={t.imgB64UploadAria || 'Upload image'}
              />

              {imageMeta ? (
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-400">
                    {t.imgB64SelectedFile || 'Selected file:'}{' '}
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      {imageMeta.fileName}
                    </span>
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageMeta.dataUrl}
                    alt={imageMeta.fileName}
                    className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {imageMeta.width} × {imageMeta.height} px
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t.imgB64Clear || 'Clear'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" aria-hidden />
                  <p className="text-gray-600 dark:text-gray-400">
                    {t.imgB64UploadText || 'Drag and drop an image or click to select'}
                  </p>
                  <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors">
                    {t.imgB64SelectImage || 'Select Image'}
                  </span>
                </div>
              )}

              {isLoading && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {t.imgB64Loading || 'Loading…'}
                </p>
              )}
            </label>

            {error && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </section>

          {/* Output */}
          {imageMeta && (
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Format tabs */}
              <div
                className="flex border-b border-gray-200 dark:border-gray-700"
                role="tablist"
                aria-label={t.imgB64FormatTabsAria || 'Output format'}
              >
                {FORMATS.map((format) => {
                  const isActive = outputFormat === format;
                  return (
                    <button
                      key={format}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setOutputFormat(format)}
                      className={`flex-1 px-3 py-3 text-xs sm:text-sm font-mono border-r last:border-r-0 border-gray-200 dark:border-gray-700 transition-colors ${
                        isActive
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-gray-900 dark:text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      {getTabLabel(format, imageMeta.mimeType)}
                    </button>
                  );
                })}
              </div>

              {/* Code block */}
              <div className="relative">
                <button
                  type="button"
                  onClick={onCopy}
                  disabled={!output}
                  className="absolute top-3 right-3 z-10 p-2 rounded-md bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  aria-label={copied ? t.imgB64Copied || 'Copied' : t.imgB64Copy || 'Copy'}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden />
                  ) : (
                    <Clipboard className="w-4 h-4" aria-hidden />
                  )}
                </button>

                <div className="flex overflow-hidden">
                  <div
                    className="flex-shrink-0 py-4 pl-4 pr-3 text-right select-none border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
                    aria-hidden
                  >
                    {Array.from({ length: lineCount }, (_, i) => (
                      <div
                        key={i}
                        className="font-mono text-xs sm:text-sm leading-6 text-gray-400 dark:text-gray-500"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <pre className="flex-1 overflow-x-auto p-4 pr-14 font-mono text-xs sm:text-sm leading-6 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900">
                    <code>{output}</code>
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* Info */}
          <section className="mt-8 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2 text-orange-800 dark:text-orange-200">
              {t.imgB64InfoTitle || 'How it works'}
            </h2>
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              {(
                t.imgB64InfoList || [
                  'Conversion happens entirely in your browser — nothing is uploaded to a server.',
                  'Choose Data URI for inline use, CSS for background-image, or HTML for an img tag.',
                  'Supports JPG, PNG, GIF, WebP, SVG, and other common image formats.',
                ]
              ).map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
