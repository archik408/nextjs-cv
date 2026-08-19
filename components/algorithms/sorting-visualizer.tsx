'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Shuffle } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { useAnimationPreferences } from '@/lib/hooks/use-animation-preferences';

const BAR_COUNT = 18;
const MIN_BAR_VALUE = 12;
const MAX_BAR_VALUE = 96;

export type SortingStep = {
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number | null;
};

type Props = {
  buildSteps: (source: number[]) => SortingStep[];
  visualizationDescription: string;
};

function generateValues(seed: number, count: number): number[] {
  const range = MAX_BAR_VALUE - MIN_BAR_VALUE + 1;

  return Array.from({ length: count }, (_, index) => {
    const next = Math.sin((seed + 1) * (index + 3) * 12.9898) * 43758.5453;
    const normalized = next - Math.floor(next);
    return MIN_BAR_VALUE + Math.floor(normalized * range);
  });
}

export function SortingVisualizer({ buildSteps, visualizationDescription }: Props) {
  const { t } = useLanguage();
  const { prefersReducedMotion } = useAnimationPreferences();
  const [runId, setRunId] = useState(0);
  const [values, setValues] = useState<number[]>(() => generateValues(0, BAR_COUNT));
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => buildSteps(values), [buildSteps, values]);
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const isCompleted = stepIndex >= steps.length - 1;
  const isPaused = !isRunning && stepIndex > 0 && !isCompleted;

  useEffect(() => {
    setStepIndex(0);
    setIsRunning(false);
  }, [values]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (stepIndex >= steps.length - 1) {
      setIsRunning(false);
      return;
    }

    const delay = prefersReducedMotion ? 120 : 380;
    timerRef.current = window.setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, prefersReducedMotion, stepIndex, steps.length]);

  const statusText = isCompleted
    ? t.algorithmsSortingComplete || 'Sorting complete.'
    : isRunning
      ? t.algorithmsSortingInProgress || 'Sorting in progress.'
      : isPaused
        ? t.algorithmsSortingPaused || 'Sorting paused.'
        : t.algorithmsSortingIdle || 'Press Start to begin sorting.';

  const handleShuffle = () => {
    setIsRunning(false);
    const nextRunId = runId + 1;
    setRunId(nextRunId);
    setValues(generateValues(nextRunId, BAR_COUNT));
  };

  const handleStart = () => {
    setStepIndex(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    if (!isCompleted) {
      setIsRunning(true);
    }
  };

  return (
    <aside className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          {t.algorithmsVisualizationTitle || 'Interactive visualization'}
        </h2>
        <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-400">
          {visualizationDescription}
        </p>
        {prefersReducedMotion && (
          <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            {t.algorithmsReducedMotionHint ||
              'Reduced motion is enabled, so transitions are minimized to make the demo more comfortable.'}
          </p>
        )}
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/60">
          <div className="mb-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-900/60"
              disabled={isRunning}
            >
              <Play className="h-4 w-4" />
              {t.algorithmsStart || 'Start'}
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
              disabled={!isRunning}
            >
              <Pause className="h-4 w-4" />
              {t.algorithmsStop || 'Stop'}
            </button>
            <button
              type="button"
              onClick={handleResume}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
              disabled={isRunning || stepIndex === 0 || isCompleted}
            >
              <RotateCcw className="h-4 w-4" />
              {t.algorithmsResume || 'Continue'}
            </button>
            <button
              type="button"
              onClick={handleShuffle}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              <Shuffle className="h-4 w-4" />
              {t.algorithmsShuffle || 'Shuffle'}
            </button>
          </div>

          <p aria-live="polite" className="text-sm text-gray-600 dark:text-gray-400">
            {statusText}
          </p>
        </div>

        <div
          className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40"
          role="img"
          aria-label={t.algorithmsBarsLabel || 'Vertical bars representing array values'}
        >
          <div className="flex h-72 items-end gap-2 overflow-hidden rounded-xl border border-dashed border-gray-200 bg-linear-to-b from-blue-50 to-transparent px-3 pb-3 pt-6 dark:border-gray-700 dark:from-blue-950/20">
            {currentStep.values.map((value, index) => {
              const isActive = currentStep.activeIndices.includes(index);
              const isSorted = currentStep.sortedIndices.includes(index);
              const isPivot = currentStep.pivotIndex === index;
              const barLabel = `${t.algorithmsBarValue || 'Value'} ${value}`;

              return (
                <div
                  key={`${index}-${runId}`}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className={`w-full rounded-t-xl ${
                      isSorted
                        ? 'bg-emerald-500 dark:bg-emerald-400'
                        : isPivot
                          ? 'bg-fuchsia-500 dark:bg-fuchsia-400'
                          : isActive
                            ? 'bg-amber-500 dark:bg-amber-400'
                            : 'bg-blue-500 dark:bg-blue-400'
                    }`}
                    style={{
                      height: `${value}%`,
                      transition: prefersReducedMotion
                        ? 'none'
                        : 'height 240ms ease, background-color 180ms ease',
                    }}
                    aria-hidden="true"
                    title={barLabel}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/60">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-300">
            {t.algorithmsCurrentArray || 'Current array'}
          </h3>
          <p className="mt-3 break-words font-mono text-sm leading-7 text-gray-700 dark:text-gray-300">
            [{currentStep.values.join(', ')}]
          </p>
        </div>
      </div>
    </aside>
  );
}
