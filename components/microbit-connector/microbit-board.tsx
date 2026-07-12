'use client';

import { useCallback, useEffect, useRef } from 'react';
import { parseBoardAction, type MicrobitBoardAction } from '@/lib/microbit-connector/protocol';

export type { MicrobitBoardAction } from '@/lib/microbit-connector/protocol';

type MicrobitBoardProps = {
  connected: boolean;
  onAction: (action: MicrobitBoardAction) => void;
  labels: {
    buttonA: string;
    buttonB: string;
    reset: string;
    display: string;
    speaker: string;
    logo: string;
    disconnectedHint: string;
  };
};

type LabelKey = keyof MicrobitBoardProps['labels'];

const LABEL_KEYS = new Set<LabelKey>(['buttonA', 'buttonB', 'reset', 'display', 'speaker', 'logo']);

export function MicrobitBoard({ connected, onAction, labels }: MicrobitBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onActionRef = useRef(onAction);
  const labelsRef = useRef(labels);

  onActionRef.current = onAction;
  labelsRef.current = labels;

  const wireHotspots = useCallback((root: ParentNode, interactive: boolean) => {
    const svg = root.querySelector('svg');
    if (!svg) return;

    svg.classList.toggle('microbit-board--disabled', !interactive);
    svg.setAttribute('role', 'img');
    svg.setAttribute(
      'aria-label',
      interactive ? 'BBC micro:bit v2 board' : labelsRef.current.disconnectedHint
    );

    root.querySelectorAll<SVGElement>('[data-microbit-action]').forEach((element) => {
      element.classList.toggle('microbit-interactive', interactive);

      const labelKey = element.getAttribute('data-microbit-label');
      const ariaLabel =
        labelKey && LABEL_KEYS.has(labelKey as LabelKey)
          ? labelsRef.current[labelKey as LabelKey]
          : null;

      if (interactive && ariaLabel) {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        element.setAttribute('aria-label', ariaLabel);
      } else {
        element.removeAttribute('role');
        element.removeAttribute('tabindex');
        element.removeAttribute('aria-label');
      }
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.dataset.loaded === 'true') return;

    let cancelled = false;

    fetch('/microbit-board.svg')
      .then((response) => response.text())
      .then((svgMarkup) => {
        if (cancelled) return;
        container.innerHTML = svgMarkup;
        container.dataset.loaded = 'true';

        const svg = container.querySelector('svg');
        if (svg) {
          svg.classList.add('h-auto', 'w-full', 'drop-shadow-xl');
        }

        wireHotspots(container, connected);
      })
      .catch(() => {
        if (!cancelled) {
          container.textContent = labelsRef.current.disconnectedHint;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [wireHotspots]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.dataset.loaded !== 'true') return;
    wireHotspots(container, connected);
  }, [connected, labels, wireHotspots]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleActivate = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return;

      const hotspot = target.closest<SVGElement>('[data-microbit-action]');
      if (!hotspot?.classList.contains('microbit-interactive')) return;

      const action = parseBoardAction(hotspot.getAttribute('data-microbit-action') ?? '');
      if (action) {
        onActionRef.current(action);
      }
    };

    const handleClick = (event: MouseEvent) => {
      handleActivate(event.target);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      const hotspot =
        event.target instanceof Element
          ? event.target.closest<SVGElement>('[data-microbit-action]')
          : null;

      if (!hotspot?.classList.contains('microbit-interactive')) return;

      event.preventDefault();
      handleActivate(hotspot);
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('click', handleClick);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div
        ref={containerRef}
        className={`relative w-full transition-[filter,opacity] duration-300 ${
          connected ? '' : 'pointer-events-none grayscale opacity-55'
        }`}
        aria-hidden={!connected}
      />

      {!connected && (
        <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
          {labels.disconnectedHint}
        </p>
      )}
    </div>
  );
}
