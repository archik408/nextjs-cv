'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedTextProps {
  text: string;
  className?: string;
  onComplete?: VoidFunction;
}

export function AnimatedText({ text, className = '', onComplete }: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !text) return;

    const container = containerRef.current;

    if (!container) return;

    // Небольшая задержка для правильной инициализации
    const timer = setTimeout(() => {
      const chars = container.querySelectorAll('.char');

      if (chars.length === 0) return;
      gsap.set(chars, {
        opacity: 0,
        yPercent: 'random([-150, 150])',
        xPercent: 'random([-150, 150])',
      });
      gsap.set(container, { opacity: 1 });

      const tween = gsap.to(chars, {
        duration: 0.8,
        opacity: 1,
        yPercent: 0,
        xPercent: 0,
        stagger: {
          from: 'random',
          amount: 0.6,
        },
        ease: 'power3.out',
        onComplete,
      });

      return () => {
        tween.kill();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [text]);
  const chars = text.split('').map((char, index) => (
    <span key={index} className="char">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
  return (
    <span ref={containerRef} className={`animated-text w-full flex wrap items-center ${className}`}>
      {chars}
    </span>
  );
}
