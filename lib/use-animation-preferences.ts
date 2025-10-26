'use client';

import { useState, useEffect } from 'react';

interface AnimationPreferences {
  prefersReducedMotion: boolean;
  isLowEndDevice: boolean;
  isSlowConnection: boolean;
  shouldAnimate: boolean;
}

export function useAnimationPreferences(): AnimationPreferences {
  const [preferences, setPreferences] = useState<AnimationPreferences>({
    prefersReducedMotion: false,
    isLowEndDevice: false,
    isSlowConnection: false,
    shouldAnimate: true,
  });

  useEffect(() => {
    // Проверяем prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Проверяем производительность устройства
    const isLowEndDevice = checkLowEndDevice();

    // Проверяем скорость соединения
    const isSlowConnection = checkSlowConnection();

    // Определяем, нужно ли анимировать
    const shouldAnimate = !prefersReducedMotion && !isLowEndDevice && !isSlowConnection;

    setPreferences({
      prefersReducedMotion,
      isLowEndDevice,
      isSlowConnection,
      shouldAnimate,
    });
  }, []);

  return preferences;
}

function checkLowEndDevice(): boolean {
  // Проверяем количество ядер процессора
  const cores = navigator.hardwareConcurrency || 4;

  // Проверяем память устройства (если доступно)
  const memory = (navigator as any).deviceMemory || 4;

  // Проверяем поддержку WebGL (индикатор производительности GPU)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const hasWebGL = !!gl;

  // Считаем устройство слабым если:
  // - Меньше 4 ядер ИЛИ
  // - Меньше 4GB памяти ИЛИ
  // - Нет поддержки WebGL
  return cores < 4 || memory < 4 || !hasWebGL;
}

function checkSlowConnection(): boolean {
  // Проверяем тип соединения (если доступно)
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (connection) {
    // Считаем соединение медленным если:
    // - 2G или медленнее
    // - Эффективный тип соединения медленный
    const slowTypes = ['slow-2g', '2g'];
    return (
      slowTypes.includes(connection.effectiveType) ||
      (connection.downlink && connection.downlink < 1.5)
    );
  }

  // Если информация о соединении недоступна, считаем нормальным
  return false;
}
