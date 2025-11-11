'use client';

import { useEffect } from 'react';

export interface UseFocusTrapOptions {
  isActive: boolean;
  initialFocusSelector?: string;
}

export function useFocusTrap(
  container: React.RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions
) {
  const { isActive, initialFocusSelector } = options;

  useEffect(() => {
    if (!isActive) return;
    const el = container.current;
    if (!el) return;

    // Try to focus specified initial element or first focusable
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const tryFocusInitial = () => {
      if (initialFocusSelector) {
        const target = el.querySelector(initialFocusSelector) as HTMLElement | null;
        if (target) {
          target.focus();
          return true;
        }
      }
      const first = el.querySelector(focusableSelectors) as HTMLElement | null;
      if (first) {
        first.focus();
        return true;
      }
      return false;
    };

    // Defer to next tick to ensure modal content is in DOM
    setTimeout(() => {
      tryFocusInitial();
    }, 0);

    const getFocusableElements = (): HTMLElement[] => {
      return Array.from(el.querySelectorAll(focusableSelectors)) as HTMLElement[];
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
        return;
      }
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (!el.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (!el.contains(e.target as Node)) {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [container, isActive, initialFocusSelector]);
}
