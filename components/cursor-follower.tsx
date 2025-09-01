'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const useCursorFollower = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(null);

  const updatePosition = useCallback((x: number, y: number) => {
    if (!elementRef.current) return;

    elementRef.current.style.top = `${y}px`;
    elementRef.current.style.left = `${x}px`;
  }, []);

  const handleMouseMove = useCallback(
    (e: { clientX: number; clientY: number; target?: EventTarget | null }) => {
      if (!elementRef.current) return;

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        updatePosition(e.clientX, e.clientY);
      });

      const el = (e as unknown as MouseEvent).target as Element | null;
      const isInteractive = !!el?.closest(
        'a,button,[role="button"],input,textarea,select,label,summary,details'
      );
      if (isInteractive) {
        elementRef.current.classList.add('pulse');
        elementRef.current.style.transform = 'translate3d(-50%, -50%, 0) scale(2)';
      } else {
        elementRef.current.classList.remove('pulse');
        elementRef.current.style.transform = 'translate3d(-50%, -50%, 0)';
      }
    },
    [updatePosition]
  );

  useEffect(() => {
    const options = { passive: true };
    document.addEventListener('mousemove', handleMouseMove, options);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleMouseMove]);

  return elementRef;
};

export const CursorFollower = () => {
  const cursorRef = useCursorFollower();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
.pulse {
  animation: pulse-animation 1s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(77, 136, 255, 0.5);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(77, 136, 255, 0);
  }

  100% {
    box-shadow: 0 0 0 2px rgba(77, 136, 255, 0);
  }
}`,
        }}
      ></style>

      <div
        ref={cursorRef}
        style={{
          background: 'rgb(202,255,126)',
          border: '1px solid rgb(202,255,126)',
          position: 'fixed',
          borderRadius: '420px',
          height: '24px',
          width: '24px',
          mixBlendMode: 'exclusion',
          pointerEvents: 'none',
          transform: 'translate3d(-50%, -50%, 0)',
          zIndex: 9999,
          willChange: 'transform, width, height',
          transition: 'transform 0.2s ease-out',
        }}
      ></div>
    </>
  );
};
