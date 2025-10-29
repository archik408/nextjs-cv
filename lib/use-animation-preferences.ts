'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface AnimationPreferences {
  prefersReducedMotion: boolean;
  isLowEndDevice: boolean;
  isSlowConnection: boolean;
  shouldAnimate: boolean;
  detectionComplete: boolean; // Новое поле для состояния загрузки
}

const DEFAULT_PREFERENCES: AnimationPreferences = {
  prefersReducedMotion: false,
  isLowEndDevice: false,
  isSlowConnection: false,
  shouldAnimate: false,
  detectionComplete: false,
};

const WEBGL_STORAGE_KEY = 'webgl-performance-v1';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 дней

interface WebGLCachedData {
  isOptimized: boolean;
  timestamp: number;
  userAgent: string; // Для валидации устройства
}

export function useAnimationPreferences(): AnimationPreferences {
  const [preferences, setPreferences] = useState<AnimationPreferences>(DEFAULT_PREFERENCES);
  const isInitialMount = useRef(true);

  const motionMediaQuery = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)');
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isInitialMount.current) {
      return;
    }

    isInitialMount.current = false;

    const updatePreferences = async () => {
      try {
        const quickPref = await getQuickPreferences();
        setPreferences((prev) => ({ ...prev, ...quickPref }));

        const fullPref = await getFullPreferences();
        setPreferences(fullPref);
      } catch (error) {
        console.warn('Animation preferences detection failed:', error);
        setPreferences({ ...DEFAULT_PREFERENCES, detectionComplete: true });
      }
    };

    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(updatePreferences, { priority: 'background' });
    } else if ('requestIdleCallback' in window) {
      window.requestIdleCallback(updatePreferences, { timeout: 2000 });
    } else {
      setTimeout(updatePreferences, 100);
    }

    const handleMotionChange = () => {
      const prefersReducedMotion = motionMediaQuery?.matches || false;
      setPreferences((prev) => ({
        ...prev,
        prefersReducedMotion,
        shouldAnimate: !prefersReducedMotion && !prev.isLowEndDevice && !prev.isSlowConnection,
      }));
    };

    const handleConnectionChange = () => {
      const isSlowConnection = safelyCheckSlowConnection();
      setPreferences((prev) => ({
        ...prev,
        isSlowConnection,
        shouldAnimate: !prev.prefersReducedMotion && !prev.isLowEndDevice && !isSlowConnection,
      }));
    };

    let connectionCleanup: (() => void) | undefined;

    try {
      motionMediaQuery?.addEventListener('change', handleMotionChange);

      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener('change', handleConnectionChange);
        connectionCleanup = () => connection.removeEventListener('change', handleConnectionChange);
      }
    } catch (error) {
      console.warn('Failed to setup listeners:', error);
    }

    return () => {
      try {
        motionMediaQuery?.removeEventListener('change', handleMotionChange);
        connectionCleanup?.();
      } catch (error) {
        console.warn('Cleanup error:', error);
      }
    };
  }, [motionMediaQuery]);

  return preferences;
}

async function getQuickPreferences(): Promise<Partial<AnimationPreferences>> {
  const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
  const isSlowConnection = safelyCheckSlowConnection();

  return {
    prefersReducedMotion,
    isSlowConnection,
    shouldAnimate: !prefersReducedMotion && !isSlowConnection,
    detectionComplete: false,
  };
}

async function getFullPreferences(): Promise<AnimationPreferences> {
  const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
  const isSlowConnection = safelyCheckSlowConnection();
  const isLowEndDevice = await safelyCheckLowEndDevice();

  const shouldAnimate = !prefersReducedMotion && !isLowEndDevice && !isSlowConnection;

  return {
    prefersReducedMotion,
    isLowEndDevice,
    isSlowConnection,
    shouldAnimate,
    detectionComplete: true,
  };
}

function getCachedWebGLResult(): boolean | null {
  try {
    const cached = localStorage.getItem(WEBGL_STORAGE_KEY);
    if (!cached) return null;

    const data: WebGLCachedData = JSON.parse(cached);

    // Проверяем валидность кеша
    const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
    const isDifferentDevice = data.userAgent !== navigator.userAgent;

    if (isExpired || isDifferentDevice) {
      localStorage.removeItem(WEBGL_STORAGE_KEY);
      return null;
    }

    return data.isOptimized;
  } catch {
    return null;
  }
}

function cacheWebGLResult(isOptimized: boolean): void {
  try {
    const cacheData: WebGLCachedData = {
      isOptimized,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };
    localStorage.setItem(WEBGL_STORAGE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache WebGL result:', error);
  }
}

async function safelyCheckLowEndDevice(): Promise<boolean> {
  try {
    const cores = navigator.hardwareConcurrency || 4;
    if (cores <= 2) {
      return true;
    }

    // User agent эвристики для известно слабых устройств
    const userAgent = navigator.userAgent.toLowerCase();
    const weakDevicePatterns = [
      /android 4\.|android 5\./,
      /iphone os [5-9]_/,
      /windows phone/,
      /blackberry/,
    ];

    if (weakDevicePatterns.some((pattern) => pattern.test(userAgent))) {
      return true;
    }

    const isLowBattery = await checkBatteryLevel();
    if (isLowBattery) {
      return true;
    }

    return !(await isWebGLPerformanceOptimized());
  } catch {
    return false;
  }
}

async function isWebGLPerformanceOptimized(): Promise<boolean> {
  // Сначала проверяем кэш
  const cachedResult = getCachedWebGLResult();
  if (cachedResult !== null) {
    return cachedResult;
  }

  return new Promise((resolve) => {
    // Пропускаем тест если страница не видна
    if (document.hidden) {
      const result = true;
      cacheWebGLResult(result);
      resolve(result);
      return;
    }

    const timeout = setTimeout(() => {
      const result = true;
      cacheWebGLResult(result);
      resolve(result);
    }, 200);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const gl = canvas.getContext('webgl', {
        antialias: false,
        depth: false,
        stencil: false,
        alpha: false,
        powerPreference: 'high-performance',
      });

      if (!gl) {
        clearTimeout(timeout);
        const result = true; // Если WebGL недоступен, не блокируем анимации
        cacheWebGLResult(result);
        resolve(result);
        return;
      }

      const startTime = performance.now();
      const testFrame = () => {
        try {
          for (let i = 0; i < 50; i++) {
            gl.clear(gl.COLOR_BUFFER_BIT);
          }

          const duration = performance.now() - startTime;
          clearTimeout(timeout);

          const result = duration < 8;
          cacheWebGLResult(result);
          resolve(result);
        } catch {
          clearTimeout(timeout);
          const result = true;
          cacheWebGLResult(result);
          resolve(result);
        }
      };

      requestAnimationFrame(testFrame);
    } catch {
      clearTimeout(timeout);
      const result = true;
      cacheWebGLResult(result);
      resolve(result);
    }
  });
}

async function checkBatteryLevel(): Promise<boolean> {
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      // Если батарея меньше 20% и не заряжается, экономим энергию
      return battery?.level < 0.2 && !battery?.charging;
    }
  } catch {
    // API не поддерживается или заблокирован
  }
  return false;
}

function safelyCheckSlowConnection(): boolean {
  try {
    if (!navigator.onLine) return true;

    const connection = (navigator as any).connection;
    if (!connection) return false;

    return (
      connection.saveData === true ||
      ['slow-2g', '2g'].includes(connection.effectiveType) ||
      (connection.downlink && connection.downlink < 1.5) ||
      (connection.rtt && connection.rtt > 400)
    );
  } catch {
    return false;
  }
}
