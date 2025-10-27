'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimationPreferences {
  prefersReducedMotion: boolean;
  isLowEndDevice: boolean;
  isSlowConnection: boolean;
  shouldAnimate: boolean;
}

interface GPUInfo {
  hasWebGL: boolean;
  renderer: string;
  isSoftwareRendering: boolean;
}

// Кеширование на уровне модуля для всей сессии
let cachedPreferences: AnimationPreferences | null = null;
let gpuInfoCache: GPUInfo | null = null;
let detectionRun = false;

// Дефолтные значения (консервативные - предполагаем хорошее устройство)
const DEFAULT_PREFERENCES: AnimationPreferences = {
  prefersReducedMotion: false,
  isLowEndDevice: false,
  isSlowConnection: false,
  shouldAnimate: true,
};

// Конфигурация thresholds
const CONFIG = {
  desktop: {
    minCores: 2,
    minMemory: 4, // GB
  },
  mobile: {
    minCores: 4,
    minMemory: 2, // GB
  },
  connection: {
    slowDownlink: 0.5, // Mbps
    slowEffectiveTypes: ['slow-2g', '2g'] as string[],
  },
} as const;

export function useAnimationPreferences(): AnimationPreferences {
  const [preferences, setPreferences] = useState<AnimationPreferences>(
    cachedPreferences || DEFAULT_PREFERENCES
  );

  const isInitialMount = useRef(true);

  useEffect(() => {
    // Предотвращаем множественные запуски
    if (isInitialMount.current && detectionRun) {
      isInitialMount.current = false;
      return;
    }

    const updatePreferences = (immediate = false) => {
      const update = () => {
        try {
          const newPreferences = calculatePreferences();
          setPreferences(newPreferences);
        } catch (error) {
          console.warn('Animation preferences detection failed, using defaults:', error);
          setPreferences(DEFAULT_PREFERENCES);
        }
      };

      if (immediate) {
        update();
      } else if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => update());
      } else {
        // Fallback
        setTimeout(update, 0);
      }
    };

    if (isInitialMount.current) {
      detectionRun = true;
      updatePreferences(true);
      isInitialMount.current = false;
    }

    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => updatePreferences();

    let connectionCleanup: (() => void) | undefined;

    try {
      motionMediaQuery.addEventListener('change', handleMotionChange);

      const connection = getNetworkConnection();
      if (connection) {
        connection.addEventListener('change', handleMotionChange);
        connectionCleanup = () => connection.removeEventListener('change', handleMotionChange);
      }
    } catch (error) {
      console.warn('Failed to setup preference listeners:', error);
    }

    return () => {
      try {
        motionMediaQuery.removeEventListener('change', handleMotionChange);
        connectionCleanup?.();
      } catch (error) {
        console.warn('Error cleaning up listeners:', error);
      }
    };
  }, []);

  return preferences;
}

function calculatePreferences(): AnimationPreferences {
  if (cachedPreferences) {
    return cachedPreferences;
  }

  try {
    const prefersReducedMotion = safelyCheckReducedMotion();
    const isLowEndDevice = safelyCheckLowEndDevice();
    const isSlowConnection = safelyCheckSlowConnection();
    const shouldAnimate = !prefersReducedMotion && !isLowEndDevice && !isSlowConnection;

    const result: AnimationPreferences = {
      prefersReducedMotion,
      isLowEndDevice,
      isSlowConnection,
      shouldAnimate,
    };

    cachedPreferences = result;
    return result;
  } catch (error) {
    console.warn('Preferences calculation failed, using defaults', error);
    return DEFAULT_PREFERENCES;
  }
}

function safelyCheckReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function safelyCheckLowEndDevice(): boolean {
  try {
    const isMobile = checkIsMobile();
    const config = isMobile ? CONFIG.mobile : CONFIG.desktop;

    const cores = safelyGetCoreCount();
    if (cores < config.minCores) {
      return true;
    }

    const memory = safelyGetMemoryInfo();
    if (memory < config.minMemory) {
      return true;
    }

    // Самые дорогие проверки - только если предыдущие не определили слабое устройство
    const gpuInfo = safelyGetGPUInfo();
    if (!gpuInfo.hasWebGL) {
      return true;
    }

    if (gpuInfo.isSoftwareRendering && !isMobile) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

function checkIsMobile(): boolean {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  } catch {
    return false;
  }
}

function safelyGetCoreCount(): number {
  try {
    return navigator.hardwareConcurrency || 4;
  } catch {
    return 4;
  }
}

function safelyGetMemoryInfo(): number {
  try {
    // Приоритет: performance.memory -> deviceMemory -> fallback
    if ('memory' in performance) {
      const perfMemory = (performance as any).memory;
      if (perfMemory && perfMemory.jsHeapSizeLimit) {
        return Math.round(perfMemory.jsHeapSizeLimit / (1024 * 1024 * 1024));
      }
    }

    if ('deviceMemory' in navigator) {
      return (navigator as any).deviceMemory || 8;
    }

    return 8; // Консервативный fallback
  } catch {
    return 8;
  }
}

function safelyGetGPUInfo(): GPUInfo {
  if (gpuInfoCache) {
    return gpuInfoCache;
  }

  const defaultGPUInfo: GPUInfo = {
    hasWebGL: false,
    renderer: '',
    isSoftwareRendering: false,
  };

  try {
    const canvas = document.createElement('canvas');
    let gl: WebGLRenderingContext | null = null;

    try {
      gl =
        canvas.getContext('webgl') ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext);
    } catch (glError) {
      console.error(glError);
      gl = null;
    }

    if (!gl) {
      gpuInfoCache = defaultGPUInfo;
      return gpuInfoCache;
    }

    let renderer = '';
    let isSoftwareRendering = false;

    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        isSoftwareRendering = /llvmpipe|software|swiftshader/i.test(renderer.toLowerCase());
      }
    } catch (debugError) {
      console.error(debugError);
    }

    gpuInfoCache = {
      hasWebGL: true,
      renderer,
      isSoftwareRendering,
    };

    return gpuInfoCache;
  } catch (error) {
    console.error(error);
    gpuInfoCache = defaultGPUInfo;
    return gpuInfoCache;
  }
}

function getNetworkConnection(): NetworkConnection | null {
  try {
    return (
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection ||
      null
    );
  } catch {
    return null;
  }
}

interface NetworkConnection {
  effectiveType: string;
  downlink: number;
  saveData?: boolean;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

function safelyCheckSlowConnection(): boolean {
  try {
    if (!navigator.onLine) {
      return true;
    }

    const connection = getNetworkConnection();
    if (!connection) {
      return false;
    }

    // Проверяем saveData в первую очередь - это явное указание пользователя
    if (connection.saveData) {
      return true;
    }

    // Проверяем тип соединения
    if (
      connection.effectiveType &&
      CONFIG.connection.slowEffectiveTypes.includes(connection.effectiveType)
    ) {
      return true;
    }

    // Проверяем скорость
    if (connection.downlink && connection.downlink < CONFIG.connection.slowDownlink) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
