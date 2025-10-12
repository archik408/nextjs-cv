'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';

export function BackToTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(() => {
    const y = window.scrollY || document.documentElement.scrollTop;
    setVisible(y > 300);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const scrollToTop = () => {
    try {
      // Use View Transitions if available for nicer effect
      if (document.startViewTransition) {
        document.startViewTransition(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        return;
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t?.toTop || 'To the top'}
      title={t?.toTop || 'To the top'}
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all duration-300 ease-in-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
