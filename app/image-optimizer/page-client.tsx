'use client';

import React, { useEffect, useRef, useState } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { AlertCircle, Download, Image as ImageIcon, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';

type WasmModule = {
  default: (path?: string) => Promise<unknown>;
  compress_image_quick: (data: Uint8Array, quality: number) => Uint8Array;
  compress_with_options?: (data: Uint8Array, optsJson: string) => Uint8Array;
};

export function ImageOptimizerPageClient() {
  const { t } = useLanguage();
  const [wasm, setWasm] = useState<WasmModule | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [stats, setStats] = useState<{
    original: number;
    optimized: number;
    percent: number;
  } | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const fileRef = useRef<File | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const [aggressivePng] = useState(false);
  const [resizePercent, setResizePercent] = useState(100);
  const [outputFormat] = useState<'Keep' | 'Png' | 'WebP' | 'Avif'>('Keep');
  const [statusText, setStatusText] = useState('');
  const [successText, setSuccessText] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Загружаем ESM-лоадер и wasm прямо из public
        const loaderUrl = '/wasm/image-compressor/image_compressor.js?v=' + Date.now();
        const mod = (await import(/* webpackIgnore: true */ loaderUrl)) as unknown as WasmModule;
        await mod.default('/wasm/image-compressor/image_compressor_bg.wasm?v=' + Date.now());
        setWasm(mod);
        const worker = new Worker('/workers/image-optimizer.worker.js');
        workerRef.current = worker;
        worker.onmessage = (ev: MessageEvent) => {
          const { id, ok, result, error: err, state } = (ev as any).data || {};
          if (id === 'status') {
            if (state === 'started') setStatusText(t.ioOptimizing);
            if (state === 'finished') setStatusText('');
            return;
          }
          if (id !== 'compress') return;
          if (!ok) {
            setIsProcessing(false);
            setError(err || t.ioErrorWorkerFailed);
            return;
          }
          try {
            const out = new Uint8Array(result);
            const mime = detectMime(out);
            const blob = new Blob([out], { type: mime });
            const url = URL.createObjectURL(blob);
            objectUrlsRef.current.push(url);
            setResultUrl(url);
            const original = fileRef.current?.size ?? 0;
            const optimized = out.length;
            const percent = original > 0 ? Math.max(0, (1 - optimized / original) * 100 || 0) : 0;
            setStats({ original, optimized, percent });
            setSuccessText(`${t.ioSaved} ${percent.toFixed(1)}%`);
          } finally {
            setIsProcessing(false);
          }
        };
      } catch (e) {
        console.error(e);
        setError(t.ioErrorLoadWasm);
      }
    };
    // Skip heavy WASM loading during Jest tests
    if (typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID) {
      return;
    }
    load();
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const handleFile = (f: File) => {
    setFile(f);
    fileRef.current = f;
    setError('');
    const url = URL.createObjectURL(f);
    objectUrlsRef.current.push(url);
    setOriginalUrl(url);
    setResultUrl('');
    setStats(null);
    setStatusText('');
    setSuccessText('');
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const readAsUint8 = (f: File) =>
    new Promise<Uint8Array>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(f);
    });

  const detectMime = (bytes: Uint8Array): string => {
    if (bytes.length >= 4) {
      if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg';
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
        return 'image/png';
      // AVIF (ISOBMFF): 'ftyp' at 4..8 and brand 'avif'/'avis' at 8..12
      if (
        bytes.length >= 12 &&
        bytes[4] === 0x66 &&
        bytes[5] === 0x74 &&
        bytes[6] === 0x79 &&
        bytes[7] === 0x70 &&
        ((bytes[8] === 0x61 && bytes[9] === 0x76 && bytes[10] === 0x69 && bytes[11] === 0x66) ||
          (bytes[8] === 0x61 && bytes[9] === 0x76 && bytes[10] === 0x69 && bytes[11] === 0x73))
      )
        return 'image/avif';
      if (
        bytes.length >= 12 &&
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      )
        return 'image/webp';
      if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
      if (bytes[0] === 0x42 && bytes[1] === 0x4d) return 'image/bmp';
    }
    return 'application/octet-stream';
  };

  const onOptimize = async () => {
    if (!file || !wasm) return;
    fileRef.current = file;
    setIsProcessing(true);
    setError('');
    setResultUrl('');
    setStats(null);
    setSuccessText('');
    try {
      const bytes = await readAsUint8(file);

      // Новый API автоматически определяет и сохраняет альфа-канал
      // Упрощаем логику - новый модуль сам решает как обрабатывать прозрачность
      const options = {
        quality,
        resize_percent: resizePercent,
        aggressive_png: aggressivePng,
        output_format: outputFormat, // Передаем строку напрямую
      } as any;

      console.log('Client options:', options);
      if (workerRef.current) {
        workerRef.current.postMessage({ id: 'compress', bytes, options });
      } else {
        let out;
        if (wasm.compress_with_options) {
          try {
            out = (wasm as any).compress_with_options(bytes, JSON.stringify(options)) as Uint8Array;
          } catch (compressError) {
            console.error('Compression error:', compressError);
            console.log('Falling back to simple API');
            out = (wasm as any).compress_image_quick(bytes, quality) as Uint8Array;
          }
        } else {
          out = (wasm as any).compress_image_quick(bytes, quality) as Uint8Array;
        }

        const mime = detectMime(out);
        // @ts-expect-error
        const blob = new Blob([out], { type: mime });
        const url = URL.createObjectURL(blob);
        objectUrlsRef.current.push(url);
        setResultUrl(url);
        const original = (fileRef.current || file).size;
        const optimized = out.length;
        const percent = Math.max(0, (1 - optimized / original) * 100 || 0);
        setStats({ original, optimized, percent });
        setSuccessText(`${t.ioSaved} ${percent.toFixed(1)}%`);
      }
    } catch (e) {
      console.error(e);
      setError(t.ioErrorOptimizationFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    a.target = '_blank';
    a.href = resultUrl;
    a.download = `${file.name.replace(/\.[^.]+$/, '')}.optimized.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

        <div className="flex items-center gap-3 mt-14 mb-2">
          <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">{t.ioTitle}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t.ioDesc}</p>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              🎨 Автоматическое сохранение прозрачности
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            PNG и WebP с альфа-каналом автоматически сохраняют прозрачность при сжатии
          </p>
        </div>

        {!wasm && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg text-sm">
            {t.ioLoadingWasm}
          </div>
        )}

        {statusText && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded text-sm">
            {statusText}
          </div>
        )}

        {successText && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded text-sm font-medium text-green-800 dark:text-green-200">
            {successText}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="io-file">
                {t.ioUploadImage}
              </label>
              <input
                id="io-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={onInputChange}
                disabled={!wasm || isProcessing || !!statusText}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-800 dark:file:text-blue-300 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="io-quality">
                {t.ioQuality}: {quality}%
              </label>
              <input
                id="io-quality"
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="io-resize">
                {t.ioResizeBefore}: {resizePercent}%
              </label>
              <input
                id="io-resize"
                type="range"
                min={10}
                max={100}
                step={5}
                value={resizePercent}
                onChange={(e) => setResizePercent(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/*<div className="flex items-center gap-2">*/}
            {/*  <input*/}
            {/*    id="aggr"*/}
            {/*    type="checkbox"*/}
            {/*    checked={aggressivePng}*/}
            {/*    onChange={(e) => setAggressivePng(e.target.checked)}*/}
            {/*  />*/}
            {/*  <label htmlFor="aggr" className="text-sm">*/}
            {/*    {t.ioAggressivePng}*/}
            {/*  </label>*/}
            {/*</div>*/}

            {/*<div>*/}
            {/*  <label className="block text-sm font-medium mb-2" htmlFor="io-output">{t.ioOutputFormat}</label>*/}
            {/*  <select*/}
            {/*    id="io-output"*/}
            {/*    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-2"*/}
            {/*    value={outputFormat}*/}
            {/*    onChange={(e) => setOutputFormat(e.target.value as any)}*/}
            {/*  >*/}
            {/*    <option value="Keep">{t.ioKeep}</option>*/}
            {/*    <option value="Png">{t.ioPng}</option>*/}
            {/*    <option value="WebP">{t.ioWebP}</option>*/}
            {/*    <option value="Avif">{t.ioAvif}</option>*/}
            {/*  </select>*/}
            {/*</div>*/}

            <button
              onClick={onOptimize}
              disabled={!file || !wasm || isProcessing || !!statusText}
              className="w-fit flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              aria-label={isProcessing ? t.ioOptimizing : t.ioOptimizeButton}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t.ioOptimizing}
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {t.ioOptimizeButton}
                </>
              )}
            </button>

            {stats && (
              <div className="p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-green-700 dark:text-green-300">Original</div>
                    <div className="font-mono">{stats.original} bytes</div>
                  </div>
                  <div>
                    <div className="text-green-700 dark:text-green-300">Optimized</div>
                    <div className="font-mono">{stats.optimized} bytes</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-green-700 dark:text-green-300">Reduction</div>
                    <div className="font-mono">{stats.percent.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="mt-3 text-green-800 dark:text-green-200 font-medium">
                  Saved {stats.percent.toFixed(1)}%
                </div>
              </div>
            )}

            {resultUrl && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
              >
                <Download className="w-4 h-4" /> {t.ioDownloadOptimized}
              </button>
            )}
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Original</label>
              <div
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[240px] flex items-center justify-center"
                style={{
                  backgroundSize: '16px 16px',
                  backgroundImage:
                    'linear-gradient(45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.06) 75%)',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              >
                {originalUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={originalUrl}
                    alt={t.ioOriginal}
                    className="max-h-80 max-w-full object-contain"
                    style={{ backgroundColor: 'transparent' }}
                  />
                ) : (
                  <div className="text-sm text-gray-500">{t.ioNoImageSelected}</div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.ioOptimized}</label>
              <div
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[240px] flex items-center justify-center"
                style={{
                  backgroundSize: '16px 16px',
                  backgroundImage:
                    'linear-gradient(45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.06) 75%)',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              >
                {resultUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resultUrl}
                    alt={t.ioOptimized}
                    className="max-h-80 max-w-full object-contain"
                    style={{ backgroundColor: 'transparent' }}
                  />
                ) : (
                  <div className="text-sm text-gray-500">{t.ioRunToPreview}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
