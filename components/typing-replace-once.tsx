'use client';

import { useEffect, useRef, useState } from 'react';
import { useAnimationPreferences } from '@/lib/use-animation-preferences';

type TypingReplaceOnceProps = {
  prefix: string;
  wrongWord: string;
  finalWord: string;
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  pauseAfterMistakeMs?: number;
  className?: string;
  onComplete?: () => void;
};

type Phase = 'type-mistake' | 'pause' | 'delete' | 'type-final' | 'done';

export default function TypingReplaceOnce({
  prefix,
  wrongWord,
  finalWord,
  typingSpeedMs = 110,
  deletingSpeedMs = 55,
  pauseAfterMistakeMs = 900,
  className,
  onComplete,
}: TypingReplaceOnceProps) {
  const { shouldAnimate, detectionComplete } = useAnimationPreferences();
  const [displayed, setDisplayed] = useState('');
  const finalText = `${prefix}${finalWord}`;
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!detectionComplete) return;

    const mistakeText = `${prefix}${wrongWord}`;

    if (!shouldAnimate) {
      setDisplayed(finalText);
      onCompleteRef.current?.();
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let text = '';
    let phase: Phase = 'type-mistake';

    const schedule = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    const tick = () => {
      if (phase === 'type-mistake') {
        if (text.length < mistakeText.length) {
          text = mistakeText.slice(0, text.length + 1);
          setDisplayed(text);
          schedule(tick, typingSpeedMs - Math.random() * 40);
          return;
        }
        phase = 'pause';
        schedule(tick, pauseAfterMistakeMs);
        return;
      }

      if (phase === 'pause') {
        phase = 'delete';
        schedule(tick, deletingSpeedMs);
        return;
      }

      if (phase === 'delete') {
        if (text.length > prefix.length) {
          text = text.slice(0, -1);
          setDisplayed(text);
          schedule(tick, deletingSpeedMs);
          return;
        }
        phase = 'type-final';
        schedule(tick, typingSpeedMs);
        return;
      }

      if (phase === 'type-final') {
        if (text.length < finalText.length) {
          text = finalText.slice(0, text.length + 1);
          setDisplayed(text);
          if (text.length < finalText.length) {
            schedule(tick, typingSpeedMs - Math.random() * 40);
            return;
          }
        }
        phase = 'done';
        onCompleteRef.current?.();
      }
    };

    setDisplayed('');
    schedule(tick, 120);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [
    prefix,
    wrongWord,
    finalWord,
    finalText,
    typingSpeedMs,
    deletingSpeedMs,
    pauseAfterMistakeMs,
    shouldAnimate,
    detectionComplete,
  ]);

  if (detectionComplete && !shouldAnimate) {
    return (
      <span className={className}>
        <span className="txt-rotate">
          <span className="wrap opacity-100">{finalText}</span>
        </span>
      </span>
    );
  }

  return (
    <span className={className}>
      <span className="txt-rotate">
        <span className={`wrap transition-opacity ${displayed ? 'opacity-100' : 'opacity-0'}`}>
          {displayed}
        </span>
      </span>
    </span>
  );
}
