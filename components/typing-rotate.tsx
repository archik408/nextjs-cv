'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimationPreferences } from '@/lib/use-animation-preferences';

interface TypingRotateProps {
  texts: string[] | string;
  periodMs?: number;
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  className?: string;
  /** Fixed prefix that is always visible; only the rest is typed/deleted */
  fixedPrefix?: string;
  /** Pause duration after deleting text (ms) */
  pauseAfterDeleteMs?: number;
  /** Pause duration after completing typing (ms) */
  pauseAfterCompleteMs?: number;
}

export default function TypingRotate({
  texts,
  typingSpeedMs = 120,
  deletingSpeedMs = 60,
  className,
  fixedPrefix = '',
  pauseAfterDeleteMs = 800,
  pauseAfterCompleteMs = 1200,
}: TypingRotateProps) {
  const toRotate = useMemo(() => (Array.isArray(texts) ? texts : [texts]), [texts]);
  const [loopNum, setLoopNum] = useState(0);
  const [txt, setTxt] = useState('');
  const { shouldAnimate } = useAnimationPreferences();
  const [isDeleting, setIsDeleting] = useState(false);
  const tickTimeout = useRef<NodeJS.Timeout | null>(null);
  const txtRef = useRef('');
  const isDeletingRef = useRef(false);

  useEffect(() => {
    // Если анимации отключены, не запускаем логику анимации
    if (!shouldAnimate) {
      setTxt(`${fixedPrefix}${toRotate[0]}`);
      return;
    }

    const i = loopNum % toRotate.length;
    const fullTxt = toRotate[i];
    const visibleBase = fixedPrefix && fullTxt.startsWith(fixedPrefix) ? fixedPrefix : fixedPrefix;
    const variablePart = fullTxt.startsWith(fixedPrefix)
      ? fullTxt.slice(fixedPrefix.length)
      : fullTxt;

    const handleTick = () => {
      const currentVariable = txtRef.current.startsWith(visibleBase)
        ? txtRef.current.slice(visibleBase.length)
        : txtRef.current;
      const nextVariable = isDeletingRef.current
        ? variablePart.substring(0, currentVariable.length - 1)
        : variablePart.substring(0, currentVariable.length + 1);
      const nextTxt = `${visibleBase}${nextVariable}`;
      txtRef.current = nextTxt;
      setTxt(nextTxt);

      let delta = typingSpeedMs - Math.random() * 60;
      if (isDeletingRef.current) delta = deletingSpeedMs;

      if (!isDeletingRef.current && nextVariable === variablePart) {
        // Пауза после завершения печати
        delta = pauseAfterCompleteMs;
        isDeletingRef.current = true;
        setIsDeleting(true);
      } else if (isDeletingRef.current && nextVariable === '') {
        // Пауза после стирания
        isDeletingRef.current = false;
        setIsDeleting(false);
        setLoopNum((n) => n + 1);
        delta = pauseAfterDeleteMs;
      }

      tickTimeout.current = setTimeout(handleTick, delta);
    };

    tickTimeout.current = setTimeout(handleTick, 100);
    return () => {
      if (tickTimeout.current) clearTimeout(tickTimeout.current);
    };
  }, [
    toRotate,
    loopNum,
    typingSpeedMs,
    deletingSpeedMs,
    pauseAfterDeleteMs,
    pauseAfterCompleteMs,
    fixedPrefix,
    shouldAnimate,
  ]);

  // Отдельный useEffect для отслеживания изменений isDeleting
  useEffect(() => {
    // Этот useEffect нужен только для того, чтобы React знал об изменениях isDeleting
    // Логика анимации остается в основном useEffect
  }, [isDeleting]);

  // Если анимации отключены, показываем статический текст
  if (!shouldAnimate) {
    return (
      <span className={className} aria-live="polite">
        <span className="txt-rotate">
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{toRotate[0]}</span>
        </span>
      </span>
    );
  }

  return (
    <span className={className} aria-live="polite">
      <span className="txt-rotate">
        <span
          className={`wrap transition-opacity ${txt?.length ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
        >
          {txt}
        </span>
      </span>
    </span>
  );
}
