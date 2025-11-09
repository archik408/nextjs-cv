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
        'a,button,[role="button"],summary,details,.prose-garden img'
      );
      const isDisabled =
        el?.ariaDisabled ||
        el?.hasAttribute('disabled') ||
        (el?.hasAttribute('data-disabled') && el?.getAttribute('data-disabled') === 'true');
      // Check if we're over text content
      const isTextContent =
        el?.nodeType === Node.TEXT_NODE ||
        (el?.tagName &&
          [
            'P',
            'H1',
            'H2',
            'H3',
            'H4',
            'H5',
            'H6',
            'SPAN',
            'LI',
            'TD',
            'TH',
            'FIGCAPTION',
            'CAPTION',
            'BLOCKQUOTE',
            'PRE',
            'CODE',
            'INPUT',
            'TEXTAREA',
            'SELECT',
            'LABEL',
          ].includes(el.tagName));
      if (isDisabled) {
        elementRef.current.classList.add('disabled');
        elementRef.current.style.transform = 'translate3d(-50%, -50%, 0) scale(2)';
        elementRef.current.style.width = '24px';
        elementRef.current.style.height = '24px';
      } else if (isInteractive) {
        // Interactive elements - round cursor with pulse
        elementRef.current.classList.remove('text-cursor', 'disabled');
        elementRef.current.classList.add('pulse');
        elementRef.current.classList.remove('text-cursor');
        elementRef.current.style.transform = 'translate3d(-50%, -50%, 0) scale(2)';
        elementRef.current.style.width = '24px';
        elementRef.current.style.height = '24px';
        elementRef.current.style.borderRadius = '420px';
      } else if (isTextContent && !isInteractive) {
        // Text content - thin cursor
        elementRef.current.classList.remove('pulse', 'disabled');
        elementRef.current.classList.add('text-cursor');
        elementRef.current.style.transform = 'translate3d(-50%, -50%, 0)';
        elementRef.current.style.width = '4px';
        elementRef.current.style.height = '20px';
        elementRef.current.style.borderRadius = '10px';
      } else {
        // Default - round cursor
        elementRef.current.classList.remove('pulse', 'text-cursor', 'disabled');
        elementRef.current.style.transform = 'translate3d(-50%, -50%, 0)';
        elementRef.current.style.width = '24px';
        elementRef.current.style.height = '24px';
        elementRef.current.style.borderRadius = '420px';
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
  position: relative;
  animation: pulse-animation 1s infinite;
}

.disabled {
  clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
}

.pulse::after {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  content: '';
  width: 90%;
  height: 90%;
  border-radius: 100%;
  background: black;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 252, 77, 0.5);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(255, 252, 77, 0);
  }

  100% {
    box-shadow: 0 0 0 2px rgba(255, 252, 77, 0);
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
          willChange: 'transform, width, height, border-radius',
          transition:
            'transform 0.2s ease-out, width 0.3s ease-out, height 0.3s ease-out, border-radius 0.3s ease-out',
        }}
      ></div>
    </>
  );
};
