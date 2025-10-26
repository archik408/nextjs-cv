'use client';

import React, { useEffect, useRef } from 'react';
import { useAnimationPreferences } from '@/lib/use-animation-preferences';

interface AnimatedAboutTextProps {
  html: string;
  className?: string;
}

export function AnimatedAboutText({ html, className = '' }: AnimatedAboutTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { shouldAnimate } = useAnimationPreferences();

  useEffect(() => {
    if (!containerRef.current) return;

    // Небольшая задержка для того, чтобы HTML был отрендерен
    const timer = setTimeout(() => {
      try {
        if (!containerRef.current) return;

        // Находим все элементы с подчеркиваниями
        const doubleUnderlines = containerRef.current.querySelectorAll('.text-double-underline');
        const singleUnderlines = containerRef.current.querySelectorAll('.text-single-underline');

        // Создаем Intersection Observer для анимации
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry, index) => {
              if (entry.isIntersecting) {
                const element = entry.target as HTMLElement;
                const underlineImg = element.querySelector(
                  '.double-underline, .single-underline'
                ) as HTMLElement;

                if (underlineImg) {
                  // Добавляем задержку для последовательного появления
                  setTimeout(() => {
                    underlineImg.style.transform = 'scaleX(1)';
                  }, index * 200); // 200ms задержка между каждым подчеркиванием
                }
              }
            });
          },
          {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px',
          }
        );

        // Наблюдаем за всеми элементами с подчеркиваниями
        [...doubleUnderlines, ...singleUnderlines].forEach((element) => {
          const underlineImg = element.querySelector(
            '.double-underline, .single-underline'
          ) as HTMLElement;
          if (underlineImg) {
            // Устанавливаем начальное состояние
            if (shouldAnimate) {
              underlineImg.style.transform = 'scaleX(0)';
              underlineImg.style.transformOrigin = 'left';
              underlineImg.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
              underlineImg.style.transform = 'scaleX(1)';
            }
            observer.observe(element);
          }
        });

        // Сохраняем observer для cleanup
        (containerRef.current as any).__observer = observer;
      } catch (error) {
        console.warn('Error setting up underline animation:', error);
      }
    }, 100); // 100ms задержка

    return () => {
      clearTimeout(timer);
      if (containerRef.current && (containerRef.current as any).__observer) {
        (containerRef.current as any).__observer.disconnect();
      }
    };
  }, [html, shouldAnimate]);

  return (
    <div
      ref={containerRef}
      className={`text-gray-700 dark:text-gray-300 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
