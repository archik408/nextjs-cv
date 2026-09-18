'use client';

import { useCallback, useMemo, type MouseEventHandler } from 'react';

type TiltHandlers = {
  onMouseMove: MouseEventHandler<HTMLElement>;
  onMouseEnter: MouseEventHandler<HTMLElement>;
  onMouseLeave: MouseEventHandler<HTMLElement>;
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useTiltCard(): TiltHandlers {
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const onMouseMove = useCallback<MouseEventHandler<HTMLElement>>(
    (e) => {
      if (reducedMotion) return;

      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const dx = px * 2 - 1;
      const dy = py * 2 - 1;
      const maxTiltDeg = 8;
      const rotateY = dx * maxTiltDeg;
      const rotateX = -dy * maxTiltDeg;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
      const intensity = Math.min(0.5, 0.12 + (Math.abs(dx) + Math.abs(dy)) * 0.2);
      card.style.setProperty('--glare-o', `${intensity.toFixed(3)}`);
      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
      card.style.setProperty('--glare-rot', `${(angleDeg + 90).toFixed(1)}deg`);
    },
    [reducedMotion]
  );

  const onMouseEnter = useCallback<MouseEventHandler<HTMLElement>>(
    (e) => {
      if (reducedMotion) return;
      e.currentTarget.style.transition = 'transform 150ms ease-out';
    },
    [reducedMotion]
  );

  const onMouseLeave = useCallback<MouseEventHandler<HTMLElement>>((e) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 200ms ease-in';
    card.style.transform = '';
    card.style.setProperty('--glare-o', '0');
  }, []);

  return { onMouseMove, onMouseEnter, onMouseLeave };
}
