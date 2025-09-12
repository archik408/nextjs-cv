'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface ViewTransitionsProps {
  children: React.ReactNode;
}

declare global {
  interface Document {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    startViewTransition?: (callback: () => void | Promise<void>) => {
      finished: Promise<void>;
      ready: Promise<void>;
      updateCallbackDone: Promise<void>;
    };
  }
}

export function ViewTransitions({ children }: ViewTransitionsProps) {
  const router = useRouter();
  const isNavigatingRef = useRef(false);
  const supportsViewTransitionsRef = useRef(false);

  useEffect(() => {
    supportsViewTransitionsRef.current = 'startViewTransition' in document;

    if (!supportsViewTransitionsRef.current) {
      console.warn('View Transitions API not supported, using fallback');
      return;
    }

    const prefetchInternal = (href: string) => {
      try {
        if (
          href &&
          !href.startsWith('http') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:') &&
          !href.includes('/resume')
        ) {
          router.prefetch?.(href);
        }
      } catch {}
    };

    // Prefetch visible internal links shortly after mount
    setTimeout(() => {
      const links = Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[];
      links.forEach((a) => {
        const href = a.getAttribute('href') || '';
        prefetchInternal(href);
        a.addEventListener('mouseenter', () => prefetchInternal(href), { once: true });
      });
    }, 150);

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.includes('#') ||
        href.includes('/resume') ||
        link.target === '_blank' ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      if (isNavigatingRef.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      isNavigatingRef.current = true;
      link.classList.add('transitioning');

      if (supportsViewTransitionsRef.current && document.startViewTransition) {
        document
          .startViewTransition(() => {
            return new Promise((resolve) => {
              prefetchInternal(href);
              router.push(href);
              setTimeout(resolve, 50);
            });
          })
          .finished.finally(() => {
            isNavigatingRef.current = false;
            link.classList.remove('transitioning');
          });
      } else {
        setTimeout(() => {
          prefetchInternal(href);
          router.push(href);
          isNavigatingRef.current = false;
          link.classList.remove('transitioning');
        }, 80);
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [router]);

  return <>{children}</>;
}
