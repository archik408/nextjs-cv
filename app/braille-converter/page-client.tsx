'use client';

import { useState, useCallback, useMemo } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { Copy, Check, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { textToBraille, brailleToText, type BrailleLanguage } from '@/lib/braille';

type Direction = 'toBraille' | 'fromBraille';

const LANGUAGE_OPTIONS: { value: BrailleLanguage; labelEn: string }[] = [
  { value: 'ru', labelEn: 'Russian' },
  { value: 'be', labelEn: 'Belarusian' },
  { value: 'en', labelEn: 'English' },
];

export function BrailleConverterClient() {
  const { t } = useLanguage();
  const [language, setLanguage] = useState<BrailleLanguage>('ru');
  const [direction, setDirection] = useState<Direction>('toBraille');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return '';
    try {
      if (direction === 'toBraille') {
        return textToBraille(input, language);
      }
      return brailleToText(input, language);
    } catch {
      return '';
    }
  }, [input, direction, language]);

  const copyOutput = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const inputLabel =
    direction === 'toBraille'
      ? (t.brailleInputText ?? 'Text')
      : (t.brailleInputBraille ?? 'Braille');
  const outputLabel =
    direction === 'toBraille'
      ? (t.brailleOutputBraille ?? 'Braille')
      : (t.brailleOutputText ?? 'Text');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-6 h-6" aria-hidden />
            </div>
            <h1 className="text-3xl font-bold" id="main-content">
              {t.brailleConverterTitle ?? 'Braille Converter'}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t.brailleConverterDesc ??
              'Convert text to Braille and back. Supports Russian, Belarusian, and English.'}
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.brailleLanguage ?? 'Language'}
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as BrailleLanguage)}
                  className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  aria-label={t.brailleLanguage ?? 'Language'}
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value === 'ru'
                        ? (t.brailleLangRussian ?? opt.labelEn)
                        : opt.value === 'be'
                          ? (t.brailleLangBelarusian ?? opt.labelEn)
                          : (t.brailleLangEnglish ?? opt.labelEn)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.brailleDirection ?? 'Direction'}
                </span>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as Direction)}
                  className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  aria-label={t.brailleDirection ?? 'Direction'}
                >
                  <option value="toBraille">{t.brailleToBraille ?? 'Text → Braille'}</option>
                  <option value="fromBraille">{t.brailleFromBraille ?? 'Braille → Text'}</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {inputLabel}
              </span>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  direction === 'toBraille'
                    ? (t.braillePlaceholderText ?? 'Enter text...')
                    : (t.braillePlaceholderBraille ?? 'Paste Braille (e.g. ⠠⠗⠥⠎⠎⠅⠊⠯)...')
                }
                rows={4}
                className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-lg"
                aria-label={inputLabel}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between mb-1">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {outputLabel}
                </span>
                {output && (
                  <button
                    type="button"
                    onClick={copyOutput}
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden />
                        {t.brailleCopied ?? 'Copied'}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden />
                        {t.brailleCopy ?? 'Copy'}
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={output}
                rows={4}
                className="w-full rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white font-mono text-lg"
                aria-label={outputLabel}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
