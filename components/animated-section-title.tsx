'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatedText } from '@/components/animated-text';
import { useAnimationPreferences } from '@/lib/use-animation-preferences';

interface AnimatedSectionTitleProps {
  text: string;
  wrapperClassName?: string;
  withoutMargin?: boolean;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  id?: string;
}

export function AnimatedSectionTitle({
  text,
  className = '',
  wrapperClassName = '',
  threshold = 0.3,
  withoutMargin,
  rootMargin = '0px 0px -50px 0px',
  id,
}: AnimatedSectionTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { shouldAnimate } = useAnimationPreferences();

  // Intersection Observer для отслеживания появления заголовка
  useEffect(() => {
    // Если анимации отключены, сразу показываем текст
    if (!shouldAnimate) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, [threshold, rootMargin, shouldAnimate]);

  return (
    <h2
      ref={titleRef}
      id={id}
      className={`text-3xl font-bold ${withoutMargin ? 'm-0' : 'mb-8'} ${wrapperClassName}`}
    >
      {isVisible ? (
        shouldAnimate ? (
          <AnimatedText text={text} className={`opacity-0 ${className}`} />
        ) : (
          <span className={className}>{text}</span>
        )
      ) : (
        <span className="opacity-0">{text}</span>
      )}
    </h2>
  );
}
