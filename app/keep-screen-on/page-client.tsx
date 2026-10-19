'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { useLanguage } from '@/lib/hooks/use-language';
import { useScreenWakeLock } from '@/lib/hooks/use-screen-wake-lock';
import {
  MAX_CUSTOM_MINUTES,
  MIN_CUSTOM_MINUTES,
  formatElapsed,
  presetToMinutes,
  type DurationPreset,
} from '@/lib/keep-screen-on';
import {
  BatteryLow,
  Eye,
  ExternalLink,
  Lock,
  MonitorSmartphone,
  Power,
  TriangleAlert,
} from 'lucide-react';

type PresetLabelKey =
  | 'keepScreenOnNoLimit'
  | 'keepScreenOn15m'
  | 'keepScreenOn30m'
  | 'keepScreenOn1h'
  | 'keepScreenOn2h'
  | 'keepScreenOnCustom';

const PRESETS: { id: DurationPreset; labelKey: PresetLabelKey }[] = [
  { id: 'no-limit', labelKey: 'keepScreenOnNoLimit' },
  { id: '15m', labelKey: 'keepScreenOn15m' },
  { id: '30m', labelKey: 'keepScreenOn30m' },
  { id: '1h', labelKey: 'keepScreenOn1h' },
  { id: '2h', labelKey: 'keepScreenOn2h' },
  { id: 'custom', labelKey: 'keepScreenOnCustom' },
];

type StatusKind = 'idle' | 'active' | 'suspended' | 'timer-done' | 'error';

const STATUS_DOT_CLASSES: Record<StatusKind, string> = {
  idle: 'bg-gray-400',
  active: 'bg-green-500',
  suspended: 'bg-yellow-500',
  'timer-done': 'bg-blue-500',
  error: 'bg-red-500',
};

export function KeepScreenOnPageClient() {
  const { t } = useLanguage();
  const { isWakeLockSupported, isActive, isSuspended, method, error, activate, deactivate } =
    useScreenWakeLock();

  const [preset, setPreset] = useState<DurationPreset>('no-limit');
  const [customMinutes, setCustomMinutes] = useState('30');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const [timerFinished, setTimerFinished] = useState(false);

  const durationMinutes = useMemo(
    () => presetToMinutes(preset, Number(customMinutes)),
    [preset, customMinutes]
  );
  const durationMs = durationMinutes !== null ? durationMinutes * 60_000 : null;

  useEffect(() => {
    if (!isActive || startedAt === null) return;

    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (durationMs !== null && current - startedAt >= durationMs) {
        deactivate();
        setStartedAt(null);
        setTimerFinished(true);
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 500);
    return () => window.clearInterval(intervalId);
  }, [isActive, startedAt, durationMs, deactivate]);

  const handleToggle = useCallback(() => {
    if (isActive) {
      deactivate();
      setStartedAt(null);
      setTimerFinished(false);
      return;
    }
    setTimerFinished(false);
    setStartedAt(Date.now());
    setNow(Date.now());
    void activate();
  }, [isActive, activate, deactivate]);

  const elapsedMs = startedAt !== null ? Math.max(0, now - startedAt) : 0;
  const remainingMs = durationMs !== null ? Math.max(0, durationMs - elapsedMs) : null;

  let statusKind: StatusKind = 'idle';
  if (error) {
    statusKind = 'error';
  } else if (isActive && isSuspended) {
    statusKind = 'suspended';
  } else if (isActive) {
    statusKind = 'active';
  } else if (timerFinished) {
    statusKind = 'timer-done';
  }

  const statusText =
    statusKind === 'error'
      ? error === 'request-failed'
        ? t.keepScreenOnErrorRequest
        : t.keepScreenOnErrorAutoplay
      : statusKind === 'suspended'
        ? t.keepScreenOnStatusSuspended
        : statusKind === 'active'
          ? t.keepScreenOnStatusActive
          : statusKind === 'timer-done'
            ? t.keepScreenOnStatusTimerDone
            : t.keepScreenOnStatusIdle;

  const notes = [
    { icon: Eye, text: t.keepScreenOnNoteTab },
    { icon: BatteryLow, text: t.keepScreenOnNoteBattery },
    { icon: Lock, text: t.keepScreenOnNoteLock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400">
              <MonitorSmartphone className="w-6 h-6" aria-hidden />
            </div>
            <h1 className="text-3xl font-bold" id="main-content">
              {t.keepScreenOnTitle}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{t.keepScreenOnDesc}</p>

          {!isWakeLockSupported && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              <TriangleAlert className="w-5 h-5 mt-0.5 shrink-0" aria-hidden />
              <p className="text-sm">{t.keepScreenOnUnsupported}</p>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div
              role="group"
              aria-label={t.keepScreenOnDuration}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {PRESETS.map(({ id, labelKey }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={preset === id}
                  disabled={isActive}
                  onClick={() => setPreset(id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                    preset === id
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-indigo-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-400'
                  }`}
                >
                  {t[labelKey]}
                </button>
              ))}
            </div>

            {preset === 'custom' && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <label
                  htmlFor="keep-screen-on-custom-minutes"
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {t.keepScreenOnCustomMinutes}
                </label>
                <input
                  id="keep-screen-on-custom-minutes"
                  type="number"
                  min={MIN_CUSTOM_MINUTES}
                  max={MAX_CUSTOM_MINUTES}
                  value={customMinutes}
                  disabled={isActive}
                  onChange={(event) => setCustomMinutes(event.target.value)}
                  className="w-28 rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </div>
            )}

            <div className="mt-6 flex flex-col items-center gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
              <span className="relative inline-flex">
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-green-500 opacity-60 animate-ping motion-reduce:animate-none"
                  />
                )}
                <button
                  type="button"
                  onClick={handleToggle}
                  aria-pressed={isActive}
                  aria-label={isActive ? t.keepScreenOnStop : t.keepScreenOnStart}
                  className={`relative flex h-28 w-28 items-center justify-center rounded-full text-white shadow-lg transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                    isActive
                      ? 'bg-green-600 hover:bg-green-500'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  <Power className="w-12 h-12" aria-hidden />
                </button>
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isActive ? t.keepScreenOnHintActive : t.keepScreenOnHintIdle}
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2 border-t border-gray-200 pt-6 dark:border-gray-700">
              <div
                role="timer"
                aria-label={t.keepScreenOnElapsed}
                className="font-mono text-5xl tabular-nums tracking-tight"
              >
                {formatElapsed(elapsedMs)}
              </div>
              {isActive && remainingMs !== null && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.keepScreenOnRemaining}: {formatElapsed(remainingMs)}
                </p>
              )}
              <p
                aria-live="polite"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span
                  aria-hidden
                  className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT_CLASSES[statusKind]}`}
                />
                {statusText}
              </p>
              {isActive && method && (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {t.keepScreenOnMethod}:{' '}
                  {method === 'wake-lock'
                    ? t.keepScreenOnMethodWakeLock
                    : t.keepScreenOnMethodVideo}
                </span>
              )}
            </div>
          </div>

          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {notes.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                <Icon className="mb-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden />
                {text}
              </li>
            ))}
          </ul>

          <section aria-labelledby="keep-screen-on-how" className="mt-8">
            <h2 id="keep-screen-on-how" className="mb-4 text-2xl font-semibold">
              {t.keepScreenOnHowTitle}
            </h2>
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <p className="text-sm leading-relaxed">{t.keepScreenOnHowText1}</p>
              <p className="text-sm leading-relaxed">{t.keepScreenOnHowText2}</p>
              <p className="text-sm leading-relaxed">{t.keepScreenOnNativeIntro}</p>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <strong>macOS:</strong>{' '}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] text-indigo-700 dark:bg-gray-900 dark:text-indigo-300">
                    caffeinate
                  </code>{' '}
                  — {t.keepScreenOnNativeMacos}
                </li>
                <li>
                  <strong>Linux:</strong>{' '}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] text-indigo-700 dark:bg-gray-900 dark:text-indigo-300">
                    systemd-inhibit
                  </code>{' '}
                  — {t.keepScreenOnNativeLinux}
                </li>
                <li>
                  <strong>Windows:</strong>{' '}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] text-indigo-700 dark:bg-gray-900 dark:text-indigo-300">
                    PowerToys Awake
                  </code>{' '}
                  — {t.keepScreenOnNativeWindows}
                </li>
              </ul>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {t.keepScreenOnMdnLink}
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
