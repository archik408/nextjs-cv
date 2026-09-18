'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { EdgeAiCapabilityPanel } from '@/components/edge-ai/capability-panel';
import { detectEdgeAiCapabilities, type EdgeAiCapabilities } from '@/lib/edge-ai/capabilities';
import { useLanguage } from '@/lib/hooks/use-language';
import { ELanguage } from '@/constants/enums';
import { Loader2, Mic, Square } from 'lucide-react';

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export function SpeechRecognitionPageClient() {
  const { t, language } = useLanguage();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldRunRef = useRef(false);

  const [caps, setCaps] = useState<EdgeAiCapabilities | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCaps(detectEdgeAiCapabilities());
  }, []);

  const stop = useCallback(() => {
    shouldRunRef.current = false;
    const rec = recognitionRef.current;
    if (rec) {
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.stop();
      } catch {
        try {
          rec.abort();
        } catch {
          // ignore
        }
      }
    }
    recognitionRef.current = null;
    setIsRunning(false);
    setIsStarting(false);
    setInterimText('');
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = useCallback(() => {
    if (!caps?.canRunSpeech) return;
    setError(null);
    setIsStarting(true);

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError(t.speechRecognitionUnsupported);
      setIsStarting(false);
      return;
    }

    try {
      const recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === ELanguage.ru ? 'ru-RU' : 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        let finals = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result[0]?.transcript ?? '';
          if (result.isFinal) finals += transcript;
          else interim += transcript;
        }
        if (finals) {
          setFinalText((prev) =>
            `${prev}${prev && !prev.endsWith(' ') ? ' ' : ''}${finals}`.trimStart()
          );
        }
        setInterimText(interim);
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setError(t.edgeAiErrorMicPermission);
          stop();
          return;
        }
        if (event.error === 'aborted' || event.error === 'no-speech') return;
        setError(t.speechRecognitionError);
      };

      recognition.onend = () => {
        if (shouldRunRef.current) {
          try {
            recognition.start();
          } catch {
            stop();
          }
        } else {
          setIsRunning(false);
        }
      };

      recognitionRef.current = recognition;
      shouldRunRef.current = true;
      recognition.start();
      setIsRunning(true);
    } catch {
      setError(t.speechRecognitionError);
      stop();
    } finally {
      setIsStarting(false);
    }
  }, [caps, language, stop, t]);

  const clearTranscript = useCallback(() => {
    setFinalText('');
    setInterimText('');
  }, []);

  const capabilityLabels = {
    title: t.edgeAiCapsTitle,
    unsupported: t.speechRecognitionUnsupported,
    webgpu: t.edgeAiCapWebgpu,
    webnn: t.edgeAiCapWebnn,
    webgl: t.edgeAiCapWebgl,
    camera: t.edgeAiCapCamera,
    microphone: t.edgeAiCapMicrophone,
    speechRecognition: t.edgeAiCapSpeech,
  };

  const displayText = [finalText, interimText].filter(Boolean).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.speechRecognitionTitle}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t.speechRecognitionDesc}</p>
          </header>

          {caps && (
            <EdgeAiCapabilityPanel
              capabilities={caps}
              labels={capabilityLabels}
              keys={['speechRecognition', 'microphone']}
              canRun={caps.canRunSpeech}
            />
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {!isRunning ? (
                <button
                  type="button"
                  onClick={start}
                  disabled={!caps?.canRunSpeech || isStarting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  {isStarting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Mic className="h-4 w-4" aria-hidden />
                  )}
                  {t.speechRecognitionStart}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stop}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <Square className="h-4 w-4" aria-hidden />
                  {t.speechRecognitionStop}
                </button>
              )}
              <button
                type="button"
                onClick={clearTranscript}
                className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                {t.speechRecognitionClear}
              </button>
              {isRunning && (
                <span
                  className="inline-flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300"
                  role="status"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
                  {t.speechRecognitionListening}
                </span>
              )}
            </div>

            <div
              className="min-h-40 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 text-base leading-relaxed"
              aria-live="polite"
              aria-relevant="additions text"
            >
              {displayText ? (
                <>
                  <span>{finalText}</span>
                  {interimText && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {finalText ? ' ' : ''}
                      {interimText}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">
                  {t.speechRecognitionPlaceholder}
                </span>
              )}
            </div>

            {error && (
              <p className="mt-3 text-sm text-rose-600 dark:text-rose-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <section
            role="region"
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:p-5 text-sm text-gray-600 dark:text-gray-400"
            aria-labelledby="speech-privacy-title"
          >
            <h2
              id="speech-privacy-title"
              className="font-semibold text-gray-900 dark:text-white mb-2"
            >
              {t.edgeAiPrivacyTitle}
            </h2>
            <p>{t.speechRecognitionPrivacy}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
