'use client';

import { useEffect, useMemo, useRef, useState, memo } from 'react';
import { Repeat } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import NavigationButtons from '@/components/navigation-buttons';

type QueueItem = {
  id: string;
  label: string;
  type:
    | 'task'
    | 'microtask'
    | 'stack'
    | 'webapi'
    | 'promise'
    | 'mutation'
    | 'raf'
    | 'fetch'
    | 'xhr'
    | 'message'
    | 'timeout'
    | 'interval'
    | 'idle';
  color?:
    | 'gray'
    | 'purple'
    | 'indigo'
    | 'emerald'
    | 'teal'
    | 'orange'
    | 'yellow'
    | 'sky'
    | 'lime'
    | 'fuchsia'
    | 'cyan'
    | 'violet';
  canceled?: boolean;
};

export const EventLoopPageClient = memo(function EventLoopPageClient() {
  const { t } = useLanguage();

  // Стабилизируем переводы чтобы избежать лишних перерендеров
  const stableTranslations = useMemo(() => t, [t]);
  const [callStack, setCallStack] = useState<QueueItem[]>([]);
  // Macrotask channels
  const [timersQueue, setTimersQueue] = useState<QueueItem[]>([]); // setTimeout/setInterval
  const [ioQueue, setIoQueue] = useState<QueueItem[]>([]); // IndexedDB, XHR/fetch events
  const [renderQueue, setRenderQueue] = useState<QueueItem[]>([]); // requestAnimationFrame
  const [idleQueue, setIdleQueue] = useState<QueueItem[]>([]); // requestIdleCallback
  // Microtasks
  const [microtaskQueue, setMicrotaskQueue] = useState<QueueItem[]>([]);
  const [isLoopRunning, setIsLoopRunning] = useState(false);
  const [loopSpeed, setLoopSpeed] = useState(1000);
  const loopTimer = useRef<NodeJS.Timeout | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<string | null>(null);
  const idleIdRef = useRef<string | null>(null);
  const abortRef = useRef<{ controller: AbortController | null }>({ controller: null });

  // Counters for executed tasks
  const [executionCounts, setExecutionCounts] = useState({
    callStack: 0,
    microtasks: 0,
    macrotasks: 0,
    timers: 0,
    io: 0,
    render: 0,
    idle: 0,
  });

  // Current phase indicator
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'microtasks' | 'macrotasks' | 'render'>(
    'idle'
  );

  // Refs to avoid stale closures inside setInterval
  const callStackRef = useRef<QueueItem[]>(callStack);
  const timersQueueRef = useRef<QueueItem[]>(timersQueue);
  const ioQueueRef = useRef<QueueItem[]>(ioQueue);
  const renderQueueRef = useRef<QueueItem[]>(renderQueue);
  const idleQueueRef = useRef<QueueItem[]>(idleQueue);
  const microtaskQueueRef = useRef<QueueItem[]>(microtaskQueue);
  const intervalRef = useRef<number>(null);
  // removed webApisRef

  useEffect(() => {
    callStackRef.current = callStack;
  }, [callStack]);
  useEffect(() => {
    timersQueueRef.current = timersQueue;
  }, [timersQueue]);
  useEffect(() => {
    ioQueueRef.current = ioQueue;
  }, [ioQueue]);
  useEffect(() => {
    renderQueueRef.current = renderQueue;
  }, [renderQueue]);
  useEffect(() => {
    idleQueueRef.current = idleQueue;
  }, [idleQueue]);
  useEffect(() => {
    microtaskQueueRef.current = microtaskQueue;
  }, [microtaskQueue]);
  // no webApis

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsLoopRunning(false);
    setCallStack([]);
    setTimersQueue([]);
    setIoQueue([]);
    setRenderQueue([]);
    setIdleQueue([]);
    setMicrotaskQueue([]);
    setExecutionCounts({
      callStack: 0,
      microtasks: 0,
      macrotasks: 0,
      timers: 0,
      io: 0,
      render: 0,
      idle: 0,
    });
    setCurrentPhase('idle');
    // no webApis
    if (loopTimer.current) clearTimeout(loopTimer.current);
    loopTimer.current = null;
    callStackRef.current = [];
    timersQueueRef.current = [];
    ioQueueRef.current = [];
    renderQueueRef.current = [];
    idleQueueRef.current = [];
    microtaskQueueRef.current = [];
    //
  };

  // Enqueue helpers
  const enqueueScript = () => {
    setCallStack((s) => [
      ...s,
      { id: crypto.randomUUID(), label: 'script()', type: 'stack' as const, color: 'gray' },
    ]);
  };
  const enqueueTimeout = () => {
    const id = crypto.randomUUID();
    // schedule a real timeout only to demonstrate cancel; we still enqueue callback immediately for visualization
    timeoutIdRef.current = setTimeout(() => {}, 10000);
    setTimersQueue((q: QueueItem[]) => {
      const next: QueueItem[] = [
        ...q,
        { id, label: 'timeout callback', type: 'task', color: 'purple' },
      ];
      timersQueueRef.current = next;
      return next;
    });
  };
  const clearScheduledTimeout = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
      // visual cancel marker in Timers channel
      setTimersQueue((q) => [
        ...q,
        {
          id: crypto.randomUUID(),
          label: 'timeout canceled',
          type: 'task',
          color: 'purple',
          canceled: true,
        },
      ]);
    }
  };

  const clearScheduledInterval = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setTimersQueue((q) => [
        ...q,
        {
          id: crypto.randomUUID(),
          label: 'interval canceled',
          type: 'task',
          color: 'yellow',
          canceled: true,
        },
      ]);
    }
  };

  const cancelScheduledRaf = () => {
    if (rafIdRef.current) {
      // cancelAnimationFrame simulation
      rafIdRef.current = null;
      setRenderQueue((q) => [
        ...q,
        {
          id: crypto.randomUUID(),
          label: 'rAF canceled',
          type: 'task',
          color: 'fuchsia',
          canceled: true,
        },
      ]);
    }
  };

  const cancelScheduledIdle = () => {
    if (idleIdRef.current) {
      // cancelIdleCallback simulation
      idleIdRef.current = null;
      setIdleQueue((q) => [
        ...q,
        {
          id: crypto.randomUUID(),
          label: 'idle callback canceled',
          type: 'task',
          color: 'lime',
          canceled: true,
        },
      ]);
    }
  };

  const enqueueMessageChannel = () => {
    const id = crypto.randomUUID();
    setIoQueue((q: QueueItem[]) => {
      const next: QueueItem[] = [
        {
          id,
          label: 'MessageChannel callback',
          type: 'task' as const,
          color: 'cyan' as const,
        },
        ...q, // MessageChannel имеет высокий приоритет - добавляем в начало
      ];
      ioQueueRef.current = next;
      return next;
    });
  };

  const enqueueXHR = () => {
    const id = crypto.randomUUID();
    setIoQueue((q: QueueItem[]) => {
      const next: QueueItem[] = [
        ...q,
        {
          id,
          label: 'XMLHttpRequest callback',
          type: 'task' as const,
          color: 'indigo' as const,
        },
      ];
      ioQueueRef.current = next;
      return next;
    });
  };

  const enqueueFetch = () => {
    const id = crypto.randomUUID();
    // create abortable controller for demonstration
    abortRef.current.controller = new AbortController();
    setMicrotaskQueue((m: QueueItem[]) => {
      const next: QueueItem[] = [
        ...m,
        { id, label: 'fetch then()', type: 'microtask', color: 'indigo' },
      ];
      microtaskQueueRef.current = next;
      return next;
    });
  };
  const abortFetch = () => {
    if (abortRef.current.controller) {
      abortRef.current.controller.abort();
      abortRef.current.controller = null;
      // visual cancel marker in Microtask queue
      setMicrotaskQueue((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          label: 'fetch aborted',
          type: 'microtask',
          color: 'indigo',
          canceled: true,
        },
      ]);
    }
  };
  const enqueuePromiseThen = () => {
    const id = crypto.randomUUID();
    setMicrotaskQueue((m: QueueItem[]) => {
      const next: QueueItem[] = [
        ...m,
        { id, label: 'Promise.then', type: 'microtask', color: 'emerald' },
      ];
      microtaskQueueRef.current = next;
      return next;
    });
  };
  const enqueueMicrotask = () => {
    const id = crypto.randomUUID();
    setMicrotaskQueue((m: QueueItem[]) => {
      const next: QueueItem[] = [
        ...m,
        { id, label: 'queueMicrotask', type: 'microtask', color: 'teal' },
      ];
      microtaskQueueRef.current = next;
      return next;
    });
  };
  const enqueueMutationObserver = () => {
    const id = crypto.randomUUID();
    // Simulate async DOM mutation delivery → microtask
    setTimeout(() => {
      setMicrotaskQueue((m: QueueItem[]) => {
        const next: QueueItem[] = [
          ...m,
          { id, label: 'MutationObserver', type: 'microtask', color: 'orange' },
        ];
        microtaskQueueRef.current = next;
        return next;
      });
    }, 300);
  };
  const enqueueInterval = () => {
    if (intervalIdRef.current) return;
    intervalIdRef.current = setInterval(() => {
      setTimersQueue((q: QueueItem[]) => {
        const next: QueueItem[] = [
          ...q,
          { id: crypto.randomUUID(), label: 'interval tick', type: 'task', color: 'yellow' },
        ];
        timersQueueRef.current = next;
        return next;
      });
    }, 1000);
  };
  const stopInterval = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    // nothing else to clean
  };

  const enqueueIndexedDB = () => {
    const id = crypto.randomUUID();
    setMicrotaskQueue((m: QueueItem[]) => {
      const next: QueueItem[] = [
        ...m,
        { id, label: 'IndexedDB success', type: 'microtask', color: 'sky' },
      ];
      microtaskQueueRef.current = next;
      return next;
    });
  };

  const enqueueIntersectionObserver = () => {
    const id = crypto.randomUUID();
    setMicrotaskQueue((m: QueueItem[]) => {
      const next: QueueItem[] = [
        ...m,
        { id, label: 'IntersectionObserver callback', type: 'microtask', color: 'violet' },
      ];
      microtaskQueueRef.current = next;
      return next;
    });
  };

  const enqueueResizeObserver = () => {
    const id = crypto.randomUUID();
    setIoQueue((q: QueueItem[]) => {
      const next: QueueItem[] = [
        {
          id,
          label: 'ResizeObserver callback',
          type: 'task' as const,
          color: 'violet' as const,
        },
        ...q, // ResizeObserver имеет высокий приоритет - добавляем в начало
      ];
      ioQueueRef.current = next;
      return next;
    });
  };

  // DOM addEventListener callback → macrotask (User Interaction / I/O task source)
  const enqueueDomEvent = () => {
    const id = crypto.randomUUID();
    setIoQueue((q: QueueItem[]) => {
      const next: QueueItem[] = [
        ...q,
        { id, label: 'addEventListener callback', type: 'task' as const, color: 'sky' as const },
      ];
      ioQueueRef.current = next;
      return next;
    });
  };

  const enqueueIdleCallback = () => {
    const id = crypto.randomUUID();
    idleIdRef.current = id; // store for cancellation
    setIdleQueue((q: QueueItem[]) => {
      const next: QueueItem[] = [...q, { id, label: 'idle callback', type: 'task', color: 'lime' }];
      idleQueueRef.current = next;
      return next;
    });
  };

  const enqueueRaf = () => {
    const id = crypto.randomUUID();
    rafIdRef.current = id; // store for cancellation
    // rAF should enqueue before paint → model as a task with higher visual hint
    setRenderQueue((q: QueueItem[]) => {
      const next: QueueItem[] = [
        ...q,
        { id, label: 'raf callback', type: 'task', color: 'fuchsia' },
      ];
      renderQueueRef.current = next;
      return next;
    });
  };

  const buttonBase = 'w-fit inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm';

  const startLoop = () => {
    if (isLoopRunning) {
      // Останавливаем цикл
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsLoopRunning(false);
    } else {
      // Запускаем цикл
      setIsLoopRunning(true);
      intervalRef.current = setInterval(() => {
        const btn = document.querySelector('#loopnextstep') as HTMLButtonElement;
        if (btn) {
          btn.click();
        }
      }, loopSpeed) as unknown as number;
    }
  };

  // Stop all running timers/intervals when leaving the page
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (loopTimer.current) {
        clearTimeout(loopTimer.current);
        loopTimer.current = null;
      }
      // Also clear any demo-scheduled handles
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      rafIdRef.current = null;
      idleIdRef.current = null;
      if (abortRef.current.controller) {
        abortRef.current.controller.abort();
        abortRef.current.controller = null;
      }
    };
  }, []);

  const nextStep = () => {
    // Получаем актуальные значения из refs
    const currentCallStack = callStackRef.current;
    const currentMicrotaskQueue = microtaskQueueRef.current;
    const currentRenderQueue = renderQueueRef.current;
    const currentIoQueue = ioQueueRef.current;
    const currentTimersQueue = timersQueueRef.current;
    const currentIdleQueue = idleQueueRef.current;

    // 1) Pop current frame if any
    if (currentCallStack.length > 0) {
      const newCallStack = currentCallStack.slice(1);
      callStackRef.current = newCallStack;
      setCallStack(newCallStack);
      setExecutionCounts((prev) => ({ ...prev, callStack: prev.callStack + 1 }));
      setCurrentPhase('idle');
      return;
    }

    // 2) Drain microtasks first
    if (currentMicrotaskQueue.length > 0) {
      setCurrentPhase('microtasks');
      const item = currentMicrotaskQueue[0];
      const newMicrotaskQueue = currentMicrotaskQueue.slice(1);
      microtaskQueueRef.current = newMicrotaskQueue;
      setMicrotaskQueue(newMicrotaskQueue);
      setExecutionCounts((prev) => ({ ...prev, microtasks: prev.microtasks + 1 }));
      callStackRef.current = [item];
      setCallStack([item]); // Добавляем в Call Stack
      return;
    }

    // 3) Macrotask: round-robin between channels
    setCurrentPhase('macrotasks');

    // order: render → io (high priority) → timers → idle
    if (currentRenderQueue.length > 0) {
      const item = currentRenderQueue[0];
      const newRenderQueue = currentRenderQueue.slice(1);
      renderQueueRef.current = newRenderQueue;
      setRenderQueue(newRenderQueue);
      setExecutionCounts((prev) => ({
        ...prev,
        macrotasks: prev.macrotasks + 1,
        render: prev.render + 1,
      }));
      callStackRef.current = [item];
      setCallStack([item]); // Добавляем в Call Stack
      return;
    }

    // I/O has higher priority than timers
    if (currentIoQueue.length > 0) {
      const item = currentIoQueue[0];
      const newIoQueue = currentIoQueue.slice(1);
      ioQueueRef.current = newIoQueue;
      setIoQueue(newIoQueue);
      setExecutionCounts((prev) => ({
        ...prev,
        macrotasks: prev.macrotasks + 1,
        io: prev.io + 1,
      }));
      callStackRef.current = [item];
      setCallStack([item]); // Добавляем в Call Stack
      return;
    }

    // Then timers
    if (currentTimersQueue.length > 0) {
      const item = currentTimersQueue[0];
      const newTimersQueue = currentTimersQueue.slice(1);
      timersQueueRef.current = newTimersQueue;
      setTimersQueue(newTimersQueue);
      setExecutionCounts((prev) => ({
        ...prev,
        macrotasks: prev.macrotasks + 1,
        timers: prev.timers + 1,
      }));
      callStackRef.current = [item];
      setCallStack([item]); // Добавляем в Call Stack
      return;
    }

    if (currentIdleQueue.length > 0) {
      const item = currentIdleQueue[0];
      const newIdleQueue = currentIdleQueue.slice(1);
      idleQueueRef.current = newIdleQueue;
      setIdleQueue(newIdleQueue);
      setExecutionCounts((prev) => ({
        ...prev,
        macrotasks: prev.macrotasks + 1,
        idle: prev.idle + 1,
      }));
      callStackRef.current = [item];
      setCallStack([item]); // Добавляем в Call Stack
      return;
    }

    setCurrentPhase('idle');
  };

  const colorClasses = (color?: QueueItem['color']) => {
    switch (color) {
      case 'gray':
        return 'bg-gray-50 dark:bg-gray-900/40 border-gray-300 dark:border-gray-700';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800';
      case 'indigo':
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800';
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800';
      case 'teal':
        return 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800';
      case 'orange':
        return 'bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800';
      case 'yellow':
        return 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-800';
      case 'sky':
        return 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800';
      case 'lime':
        return 'bg-lime-50 dark:bg-lime-950/40 border-lime-300 dark:border-lime-800';
      case 'fuchsia':
        return 'bg-fuchsia-50 dark:bg-fuchsia-950/40 border-fuchsia-300 dark:border-fuchsia-800';
      case 'cyan':
        return 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800';
      case 'violet':
        return 'bg-violet-50 dark:bg-violet-950/40 border-violet-300 dark:border-violet-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/40 border-gray-300 dark:border-gray-700';
    }
  };

  const Box = ({ title, items, accent }: { title: string; items: QueueItem[]; accent: string }) => (
    <div
      className={`rounded-xl border p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-${accent}-300 dark:border-${accent}-700 transition-all duration-300 ${
        items.length > 0 ? `ring-2 ring-${accent}-200 dark:ring-${accent}-800` : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold text-${accent}-700 dark:text-${accent}-300`}>
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full text-${accent}-700 dark:text-gray-200`}>
            {items.length}
          </span>
          {items.length > 0 && (
            <div className={`w-2 h-2 rounded-full bg-${accent}-500 animate-pulse`}></div>
          )}
        </div>
      </div>
      <div className="min-h-[40px] grid gap-2">
        {items.map((it, index) => (
          <div
            key={it.id}
            title={it.label}
            className={`px-3 py-2 rounded-md text-sm border shadow-sm transition-all duration-200 ${colorClasses(it.color)} ${
              it.canceled
                ? 'line-through text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40'
                : ''
            } ${
              !it.canceled && callStackRef.current[0]?.id === it.id
                ? 'ring-2 ring-offset-2 ring-blue-400 animate-pulse'
                : ''
            } ${
              index === 0 && !it.canceled
                ? 'ring-1 ring-offset-1 ring-blue-300 dark:ring-blue-700'
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{it.label}</span>
              {index === 0 && !it.canceled && (
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-xs text-gray-400 dark:text-gray-500 italic text-center py-4">
            Empty
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <div className="container mx-auto px-4 md:py-8 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">
              {stableTranslations.eventLoopTitle || 'JavaScript Event Loop'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {stableTranslations.eventLoopDescription ||
                'Interactive visualization of the JavaScript runtime: Call Stack, Web APIs, Task Queue, and Microtask Queue.'}
            </p>
          </div>
          <div className="flex gap-3 pt-3 items-center flex-wrap my-8">
            <button
              onClick={startLoop}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm ${
                isLoopRunning ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
              }`}
            >
              <Repeat className={isLoopRunning ? 'animate-spin' : ''} width={16} height={16} />
              {isLoopRunning
                ? stableTranslations.eventLoopControls?.stopLoop || 'Stop Loop'
                : stableTranslations.eventLoopControls?.startLoop || 'Start Loop'}
            </button>
            <button
              id="loopnextstep"
              onClick={nextStep}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm bg-blue-600 text-white disabled:opacity-50`}
            >
              <Repeat width={16} height={16} />
              {stableTranslations.eventLoopControls?.nextStep || 'Next Step'}
            </button>
            <button
              onClick={reset}
              disabled={isLoopRunning}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm bg-gray-300 dark:bg-gray-600 disabled:opacity-50`}
            >
              {stableTranslations.eventLoopControls?.reset || 'Reset'}
            </button>
            <div className="inline-flex items-center gap-2 text-sm ml-2">
              <span>{stableTranslations.eventLoopControls?.speed || 'Speed'}</span>
              <select
                className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 disabled:opacity-50"
                value={loopSpeed}
                onChange={(e) => {
                  setLoopSpeed(Number(e.target.value));
                }}
                disabled={isLoopRunning}
              >
                <option value={2000}>
                  {stableTranslations.eventLoopControls?.speedSlow || 'Slow'}
                </option>
                <option value={1000}>
                  {stableTranslations.eventLoopControls?.speedNormal || 'Normal'}
                </option>
                <option value={500}>
                  {stableTranslations.eventLoopControls?.speedFast || 'Fast'}
                </option>
              </select>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Box
                title={stableTranslations.eventLoopControls?.callStack || 'Call Stack'}
                items={callStack}
                accent="pink"
              />
              <div className="grid sm:grid-cols-2 gap-6">
                <Box
                  title={stableTranslations.eventLoopControls?.microtaskQueue || 'Microtask Queue'}
                  items={microtaskQueue}
                  accent="emerald"
                />
                <div className="grid gap-6">
                  <Box
                    title={stableTranslations.eventLoopControls?.render || 'Render (rAF)'}
                    items={renderQueue}
                    accent="fuchsia"
                  />
                  <Box
                    title={stableTranslations.eventLoopControls?.timers || 'Timers'}
                    items={timersQueue}
                    accent="purple"
                  />
                  <Box
                    title={stableTranslations.eventLoopControls?.io || 'I/O'}
                    items={ioQueue}
                    accent="sky"
                  />
                  <Box
                    title={stableTranslations.eventLoopControls?.idle || 'Idle'}
                    items={idleQueue}
                    accent="lime"
                  />
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col">
              {/* Execution Statistics */}
              <div className="mb-6 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  {stableTranslations.eventLoopControls?.executionStats || 'Execution Statistics'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="min-w-3 min-h-3 w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-800 dark:text-gray-200">
                      Call Stack: {executionCounts.callStack}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="min-w-3 min-h-3 w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-800 dark:text-gray-200">
                      Microtasks: {executionCounts.microtasks}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="min-w-3 min-h-3 w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-800 dark:text-gray-200">
                      Macrotasks: {executionCounts.macrotasks}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="min-w-3 min-h-3 w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-gray-800 dark:text-gray-200">
                      Timers: {executionCounts.timers}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="min-w-3 min-h-3 w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-gray-800 dark:text-gray-200">
                      I/O: {executionCounts.io}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="min-w-3 min-h-3 w-3 h-3 rounded-full bg-fuchsia-500"></div>
                    <span className="text-gray-800 dark:text-gray-200">
                      Render: {executionCounts.render}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="min-w-3 min-h-3 w-3 h-3 rounded-full bg-lime-500"></div>
                    <span className="text-gray-800 dark:text-gray-200">
                      Idle: {executionCounts.idle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Phase Indicator */}
              <div className="mb-6 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  {stableTranslations.eventLoopControls?.currentPhase || 'Current Phase'}
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                      currentPhase === 'idle'
                        ? 'bg-gray-400'
                        : currentPhase === 'microtasks'
                          ? 'bg-green-500 animate-pulse'
                          : currentPhase === 'macrotasks'
                            ? 'bg-orange-500 animate-pulse'
                            : 'bg-fuchsia-500 animate-pulse'
                    }`}
                  ></div>
                  <span className="text-sm font-medium capitalize">
                    {currentPhase === 'idle'
                      ? stableTranslations.eventLoopControls?.phase?.idle || 'Idle'
                      : currentPhase === 'microtasks'
                        ? stableTranslations.eventLoopControls?.phase?.microtasks ||
                          'Processing Microtasks'
                        : currentPhase === 'macrotasks'
                          ? stableTranslations.eventLoopControls?.phase?.macrotasks ||
                            'Processing Macrotasks'
                          : stableTranslations.eventLoopControls?.phase?.render || 'Render Phase'}
                  </span>
                  {currentPhase !== 'idle' && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scrollable Controls */}
              <div className="flex-1 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="grid gap-3 pr-2">
                  {/* Script execution */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueScript}
                      className={`${buttonBase} bg-gray-200 dark:bg-gray-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 18l6-6-6-6" />
                        <path d="M8 6l-6 6 6 6" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueScript || 'Enqueue Script'}
                    </button>
                  </div>

                  {/* Timers */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueTimeout}
                      className={`${buttonBase} bg-purple-200 dark:bg-purple-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l3 3" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueTimeout || 'Enqueue setTimeout'}
                    </button>
                    <button
                      onClick={clearScheduledTimeout}
                      className={`${buttonBase} bg-purple-100 dark:bg-purple-800`}
                    >
                      {stableTranslations.eventLoopControls?.clearTimeout || 'clearTimeout'}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueInterval}
                      className={`${buttonBase} bg-yellow-200 dark:bg-yellow-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueInterval ||
                        'Enqueue setInterval'}
                    </button>
                    <button
                      onClick={stopInterval}
                      className={`${buttonBase} bg-red-200 dark:bg-red-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="6" y="6" width="12" height="12" />
                      </svg>
                      Stop
                    </button>
                    <button
                      onClick={clearScheduledInterval}
                      className={`${buttonBase} bg-yellow-100 dark:bg-yellow-800`}
                    >
                      {stableTranslations.eventLoopControls?.clearInterval || 'clearInterval'}
                    </button>
                  </div>

                  {/* Network requests */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueFetch}
                      className={`${buttonBase} bg-indigo-200 dark:bg-indigo-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12h18" />
                        <path d="M8 7l-5 5 5 5" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueFetch || 'Enqueue fetch'}
                    </button>
                    <button
                      onClick={abortFetch}
                      className={`${buttonBase} bg-indigo-100 dark:bg-indigo-800`}
                    >
                      {stableTranslations.eventLoopControls?.abortFetch || 'AbortController'}
                    </button>
                  </div>

                  {/* Microtasks */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueuePromiseThen}
                      className={`${buttonBase} bg-emerald-200 dark:bg-emerald-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16v16H4z" />
                        <path d="M8 12h8" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueuePromise ||
                        'Enqueue Promise.then'}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueMicrotask}
                      className={`${buttonBase} bg-teal-200 dark:bg-teal-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8c0 .69.28 1.32.73 1.77.45.45 1.08.73 1.77.73H22a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueMicrotask || 'queueMicrotask'}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueMutationObserver}
                      className={`${buttonBase} bg-orange-200 dark:bg-orange-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3h18v18H3z" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueMutationObserver ||
                        'MutationObserver callback'}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueIndexedDB}
                      className={`${buttonBase} bg-sky-200 dark:bg-sky-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M3 10h18" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueIDB || 'IndexedDB request'}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueIntersectionObserver}
                      className={`${buttonBase} bg-violet-200 dark:bg-violet-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3h18v18H3z" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueIntersectionObserver ||
                        'IntersectionObserver callback'}
                    </button>
                  </div>
                  {/* Network & I/O (Macrotasks) */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueXHR}
                      className={`${buttonBase} bg-indigo-200 dark:bg-indigo-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12h18" />
                        <path d="M8 7l-5 5 5 5" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueXHR || 'XMLHttpRequest'}
                    </button>
                    <button
                      onClick={enqueueDomEvent}
                      className={`${buttonBase} bg-sky-200 dark:bg-sky-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                      </svg>
                      {'addEventListener callback'}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueMessageChannel}
                      className={`${buttonBase} bg-cyan-200 dark:bg-cyan-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12h18" />
                        <path d="M8 7l-5 5 5 5" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueMessageChannel ||
                        'MessageChannel'}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueResizeObserver}
                      className={`${buttonBase} bg-violet-200 dark:bg-violet-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3h18v18H3z" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueResizeObserver ||
                        'ResizeObserver callback'}
                    </button>
                  </div>

                  {/* Render phase */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueRaf}
                      className={`${buttonBase} bg-fuchsia-200 dark:bg-fuchsia-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueRaf || 'requestAnimationFrame'}
                    </button>
                    <button
                      onClick={cancelScheduledRaf}
                      className={`${buttonBase} bg-fuchsia-100 dark:bg-fuchsia-800`}
                    >
                      {stableTranslations.eventLoopControls?.cancelRaf || 'cancelAnimationFrame'}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={enqueueIdleCallback}
                      className={`${buttonBase} bg-lime-200 dark:bg-lime-700`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12h18" />
                        <path d="M12 3v18" />
                      </svg>
                      {stableTranslations.eventLoopControls?.enqueueIdle || 'requestIdleCallback'}
                    </button>
                    <button
                      onClick={cancelScheduledIdle}
                      className={`${buttonBase} bg-lime-100 dark:bg-lime-800`}
                    >
                      {stableTranslations.eventLoopControls?.cancelIdle || 'cancelIdleCallback'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-sm text-gray-600 dark:text-gray-400">
            <p>
              {stableTranslations.eventLoopExplanation ||
                'The animation simulates: placing synchronous code on the Call Stack, scheduling timers and network requests in Web APIs, prioritizing Microtasks (Promise.then) over macrotasks (setTimeout) when the Call Stack is empty, and moving callbacks to the Stack.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
