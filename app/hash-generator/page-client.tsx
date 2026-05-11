'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/hooks/use-language';
import { AlertCircle, Check, Clipboard, Hash as HashIcon, Loader2 } from 'lucide-react';

type HashAlgorithmId = 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' | 'shake128' | 'sha3_256';

type OutputFormat = 'hex' | 'base64';
type HexCase = 'lower' | 'upper';

const ALGORITHMS: { id: HashAlgorithmId; label: string }[] = [
  { id: 'sha1', label: 'SHA-1' },
  { id: 'sha256', label: 'SHA-256 (SHA-2)' },
  { id: 'sha384', label: 'SHA-384 (SHA-2)' },
  { id: 'sha512', label: 'SHA-512 (SHA-2)' },
  { id: 'md5', label: 'MD5' },
  { id: 'shake128', label: 'SHAKE128' },
  { id: 'sha3_256', label: 'SHA3-256' },
];

const WEBCRYPTO_MAP: Partial<Record<HashAlgorithmId, AlgorithmIdentifier>> = {
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha384: 'SHA-384',
  sha512: 'SHA-512',
};

function bytesToHex(bytes: Uint8Array, hexCase: HexCase): string {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return hexCase === 'upper' ? hex.toUpperCase() : hex;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function arrayBufferToUint8Array(buf: ArrayBuffer): Uint8Array {
  return new Uint8Array(buf);
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // ignore and fallback
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

async function hashWebCrypto(input: string, algo: AlgorithmIdentifier): Promise<Uint8Array> {
  if (!globalThis.crypto?.subtle?.digest) throw new Error('WebCryptoSubtleUnavailable');
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest(algo, data);
  return arrayBufferToUint8Array(digest);
}

async function hmacWebCrypto(
  input: string,
  key: string,
  hashAlgo: AlgorithmIdentifier
): Promise<Uint8Array> {
  if (!globalThis.crypto?.subtle?.importKey || !globalThis.crypto?.subtle?.sign) {
    throw new Error('WebCryptoSubtleUnavailable');
  }
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: hashAlgo },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(input));
  return arrayBufferToUint8Array(sig);
}

async function hashWithLibraries(
  algorithm: Exclude<HashAlgorithmId, keyof typeof WEBCRYPTO_MAP>,
  input: string
) {
  if (algorithm === 'md5') {
    const mod = await import('spark-md5');
    // spark-md5 returns hex by default; raw hash can be obtained from ArrayBuffer API
    const buf = new TextEncoder().encode(input).buffer;
    const raw = mod.default.ArrayBuffer.hash(buf, true) as unknown as string;
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i) & 0xff;
    return bytes;
  }

  const mod = await import('js-sha3');

  if (algorithm === 'sha3_256') {
    const buf = mod.sha3_256.arrayBuffer(input);
    return arrayBufferToUint8Array(buf);
  }

  if (algorithm === 'shake128') {
    // 256-bit output by default for a compact UX
    const buf = mod.shake128.arrayBuffer(input, 256);
    return arrayBufferToUint8Array(buf);
  }

  // Exhaustive check
  const _never: never = algorithm;
  throw new Error(`UnsupportedAlgorithm:${String(_never)}`);
}

async function computeHashBytes(algorithm: HashAlgorithmId, input: string): Promise<Uint8Array> {
  const wc = WEBCRYPTO_MAP[algorithm];
  if (wc) return hashWebCrypto(input, wc);
  return hashWithLibraries(
    algorithm as Exclude<HashAlgorithmId, keyof typeof WEBCRYPTO_MAP>,
    input
  );
}

async function computeHmacBytes(
  algorithm: HashAlgorithmId,
  input: string,
  key: string
): Promise<Uint8Array> {
  const wc = WEBCRYPTO_MAP[algorithm];
  if (!wc) throw new Error('HmacNotSupportedForAlgorithm');
  return hmacWebCrypto(input, key, wc);
}

type HashGenI18n = {
  hashGenErrorUnavailable?: string;
  hashGenErrorHmacUnavailable?: string;
  hashGenErrorHmacKeyRequired?: string;
};

function getFriendlyHashErrorMessage(t: HashGenI18n, err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message || '';

    // WebCrypto common cases
    if (msg === 'WebCryptoSubtleUnavailable') {
      return t.hashGenErrorUnavailable || 'This algorithm is not available in your browser.';
    }
    if (/NotSupportedError/i.test(msg) || /OperationError/i.test(msg)) {
      return t.hashGenErrorUnavailable || 'This algorithm is not available in your browser.';
    }
    if (/UnsupportedAlgorithm/i.test(msg)) {
      return t.hashGenErrorUnavailable || 'This algorithm is not available in your browser.';
    }
    if (msg === 'HmacNotSupportedForAlgorithm') {
      return (
        t.hashGenErrorHmacUnavailable ||
        'HMAC is not available for the selected algorithm in this tool.'
      );
    }
  }

  return t.hashGenErrorUnavailable || 'This algorithm is not available in your browser.';
}

export function HashGeneratorPageClient() {
  const { t } = useLanguage();

  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithmId>('sha512');
  const [format, setFormat] = useState<OutputFormat>('hex');
  const [hexCase, setHexCase] = useState<HexCase>('lower');
  const [hmacEnabled, setHmacEnabled] = useState(false);
  const [hmacKey, setHmacKey] = useState('');

  const [hash, setHash] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'generating' | 'generated'>('idle');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const debounceMs = 220;
  const lastRequestId = useRef(0);

  const canUseBase64 = useMemo(() => format === 'base64', [format]);

  const computed = useMemo(() => {
    // Keep stable derived strings in memo if we later need them
    return { algorithm, format, hexCase, hmacEnabled, hmacKey };
  }, [algorithm, format, hexCase, hmacEnabled, hmacKey]);

  useEffect(() => {
    const requestId = ++lastRequestId.current;

    const trimmed = text;
    if (!trimmed) {
      setHash('');
      setError('');
      setStatus('idle');
      return;
    }

    if (computed.hmacEnabled && !computed.hmacKey) {
      setHash('');
      setError(t.hashGenErrorHmacKeyRequired || 'HMAC key is required.');
      setStatus('idle');
      return;
    }

    setStatus('generating');
    setError('');

    const timer = window.setTimeout(() => {
      (async () => {
        try {
          const bytes = computed.hmacEnabled
            ? await computeHmacBytes(computed.algorithm, trimmed, computed.hmacKey)
            : await computeHashBytes(computed.algorithm, trimmed);
          if (lastRequestId.current !== requestId) return;

          const out =
            computed.format === 'base64'
              ? bytesToBase64(bytes)
              : bytesToHex(bytes, computed.hexCase);

          setHash(out);
          setStatus('generated');
        } catch (e) {
          if (lastRequestId.current !== requestId) return;
          setHash('');
          setStatus('idle');
          setError(getFriendlyHashErrorMessage(t, e));
        }
      })();
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [
    computed.algorithm,
    computed.format,
    computed.hexCase,
    computed.hmacEnabled,
    computed.hmacKey,
    t.hashGenErrorHmacKeyRequired,
    t.hashGenErrorUnavailable,
    text,
  ]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const onCopy = async () => {
    if (!hash) return;
    const ok = await copyToClipboard(hash);
    setCopied(ok);
    if (!ok) setError(t.hashGenErrorCopy || 'Failed to copy.');
  };

  const showHexCase = format === 'hex';
  const showFormatHint = canUseBase64 && algorithm === 'md5';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400">
              <HashIcon className="w-6 h-6" aria-hidden />
            </div>
            <h1 className="text-3xl font-bold">{t.hashGenTitle || 'Hash Generator'}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t.hashGenDesc ||
              'Generate hashes locally in your browser. Uses Web Crypto API when available and falls back to lightweight libraries for other algorithms.'}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-5">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.hashGenInputLabel || 'Input'}
                </span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.hashGenInputPlaceholder || 'Enter any text...'}
                  className="w-full min-h-32 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.hashGenAlgorithmLabel || 'Algorithm'}
                  </span>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as HashAlgorithmId)}
                    className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {ALGORITHMS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t.hashGenAlgorithmHint ||
                      'SHA-1/SHA-2 use Web Crypto API. MD5/SHA3/SHAKE are computed via dynamic imports.'}
                  </p>
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.hashGenFormatLabel || 'Output format'}
                  </span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                    className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="hex">{t.hashGenFormatHex || 'Hex'}</option>
                    <option value="base64">{t.hashGenFormatBase64 || 'Base64'}</option>
                  </select>
                  {showFormatHint && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t.hashGenFormatMd5Note ||
                        'Note: MD5 is produced via a library and encoded from raw bytes for Base64.'}
                    </p>
                  )}
                </label>
              </div>

              {showHexCase && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.hashGenHexCaseLabel || 'Hex case'}
                    </span>
                    <select
                      value={hexCase}
                      onChange={(e) => setHexCase(e.target.value as HexCase)}
                      className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="lower">{t.hashGenHexLower || 'lowercase'}</option>
                      <option value="upper">{t.hashGenHexUpper || 'UPPERCASE'}</option>
                    </select>
                  </label>
                </div>
              )}

              <div className="space-y-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={hmacEnabled}
                    onChange={(e) => setHmacEnabled(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>{t.hashGenHmacEnable || 'Enable HMAC'}</span>
                </label>

                {hmacEnabled && (
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.hashGenHmacKeyLabel || 'Secret key'}
                    </span>
                    <input
                      value={hmacKey}
                      onChange={(e) => setHmacKey(e.target.value)}
                      placeholder={t.hashGenHmacKeyPlaceholder || 'Enter secret key...'}
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t.hashGenHmacHint ||
                        'HMAC is supported for SHA-1 and SHA-2 algorithms via Web Crypto API.'}
                    </p>
                  </label>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle
                    className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                    aria-hidden
                  />
                  <span className="text-red-700 dark:text-red-300 text-sm">
                    {t.hashGenErrorFriendlyPrefix || 'Error'}: {error}
                  </span>
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold">{t.hashGenOutputTitle || 'Result'}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  {status === 'generating' && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                      <span>{t.hashGenStatusGenerating || 'Generating…'}</span>
                    </>
                  )}
                  {status === 'generated' && (
                    <>
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden />
                      <span>{t.hashGenStatusGenerated || 'Generated'}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 min-h-[220px]">
                <label className="sr-only" htmlFor="hash-output">
                  {t.hashGenOutputLabel || 'Hash output'}
                </label>
                <textarea
                  id="hash-output"
                  readOnly
                  value={hash}
                  placeholder={t.hashGenOutputPlaceholder || 'Your hash will appear here…'}
                  className="w-full h-[180px] rounded-md bg-transparent border border-transparent text-gray-900 dark:text-white focus:outline-none resize-none font-mono text-sm"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onCopy}
                  disabled={!hash}
                  className="w-fit inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Clipboard className="w-4 h-4" aria-hidden />
                  {copied ? t.hashGenCopied || 'Copied' : t.hashGenCopy || 'Copy'}
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {t.hashGenPerfHint ||
                  'Tip: hashing is debounced to keep typing responsive on large inputs.'}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
