'use client';

import { useEffect, useMemo, useState } from 'react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSwitcher } from '@/components/language-switcher';
import NavigationButtons from '@/components/navigation-buttons';
import { Copy, Check, Image as ImageIcon, Link2, Boxes } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';

export function ImagePlaceholderClient() {
  const { t } = useLanguage();
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [illustration, setIllustration] = useState(true);
  const [collection, setCollection] = useState('');
  const [collections, setCollections] = useState<Array<{ value: string; label: string }>>([]);
  const [useOriginal, setUseOriginal] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    // Only attach width/height when not using original size for illustrations
    params.set('t', String(Date.now()));

    if (!(useOriginal && illustration)) {
      params.set('w', String(width));
      params.set('h', String(height));
    }
    params.set('illustration', illustration ? '1' : '0');
    if (collection) params.set('collection', collection);
    if (useOriginal && illustration) params.set('original', '1');
    return `/api/image-placeholder?${params.toString()}`;
  }, [width, height, illustration, collection, useOriginal]);

  useEffect(() => {
    let aborted = false;
    fetch('/api/image-placeholder/collections')
      .then((r) => r.json())
      .then((data) => {
        if (!aborted && data?.collections)
          setCollections(data.collections as Array<{ value: string; label: string }>);
      })
      .catch(() => void 0);
    return () => {
      aborted = true;
    };
  }, []);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(location.origin + url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" />
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">{t.imgPhTitle || 'Image Placeholder'}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t.imgPhDesc ||
              'Generate placeholder image URLs with custom width/height. Return a gray box with size text or a random illustration from public/image-placeholders.'}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Boxes className="w-5 h-5" /> {t.imgPhParamsTitle || 'Parameters'}
              </h2>
              <div className="space-y-3">
                <label className="block text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {t.imgPhWidth || 'Width (px)'}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={4000}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {t.imgPhHeight || 'Height (px)'}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={4000}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2"
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={illustration}
                    onChange={(e) => setIllustration(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>{t.imgPhShowIllustration || 'Show illustration (if available)'}</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useOriginal}
                    onChange={(e) => setUseOriginal(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>
                    {t.imgPhUseOriginal || 'Use original image size (ignore width/height)'}
                  </span>
                </label>
                <label className="block text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {t.imgPhCollectionLabel || 'Collection (optional)'}
                  </span>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2"
                  >
                    <option value="">{t.imgPhCollectionAny || '— Any —'}</option>
                    {collections.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5" /> {t.imgPhLink || 'Link'}
              </h2>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={url}
                  className="flex-1 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm"
                />
                <button
                  onClick={copyUrl}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t.imgPhCopied || 'Copied' : t.imgPhCopy || 'Copy'}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t.imgPhCopiedFullUrlNote || 'Full URL will include your domain (origin).'}
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold mb-4">{t.imgPhPreviewTitle || 'Preview'}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="preview"
              className="max-w-full rounded border border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
