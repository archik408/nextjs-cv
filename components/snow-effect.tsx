'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/use-theme';
import { ETheme } from '@/constants/enums';

/**
 * Проверяет, находится ли текущая дата в периоде с 20 декабря по 2 февраля включительно
 * Период: с 20 декабря текущего года по 2 февраля следующего года
 */
function isSnowPeriod(): boolean {
  const today = new Date();
  const month = today.getMonth(); // 0-11 (0 = январь, 11 = декабрь)
  const day = today.getDate();

  // Если мы в декабре, проверяем от 20 декабря текущего года
  if (month === 11 && day >= 20) {
    return true;
  }

  // Если мы в январе, всегда показываем снег
  if (month === 0) {
    return true;
  }

  // Если мы в феврале, проверяем до 2 февраля включительно
  if (month === 1 && day <= 2) {
    return true;
  }

  return false;
}

export function SnowEffect() {
  const { theme } = useTheme();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Показываем снег только в темной теме и в период снега
    setShouldShow(isSnowPeriod() && theme === ETheme.dark);
  }, [theme]);

  useEffect(() => {
    if (!shouldShow) return;

    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    snowContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(snowContainer);

    const numberOfSnowflakes = 50;
    const cleanupTimeouts: NodeJS.Timeout[] = [];

    // Создаем снежинки
    for (let i = 0; i < numberOfSnowflakes; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.innerHTML = '❄';
      const leftPosition = Math.random() * 100;
      const animationDuration = Math.random() * 3 + 2; // 2-5 секунд
      const animationDelay = Math.random() * 5;
      const fontSize = Math.random() * 10 + 10;
      const opacity = Math.random() * 0.5 + 0.5; // 0.5-1.0
      const horizontalDrift = (Math.random() - 0.5) * 50; // Дрейф влево-вправо

      // Начинаем снежинки за пределами видимой области
      snowflake.style.top = '-50px';
      snowflake.style.left = `${leftPosition}vw`;
      snowflake.style.animationDuration = `${animationDuration}s`;
      snowflake.style.animationDelay = `${animationDelay}s`;
      snowflake.style.fontSize = `${fontSize}px`;
      snowflake.style.opacity = `${opacity}`;
      snowflake.style.setProperty('--drift', `${horizontalDrift}vw`);
      snowContainer.appendChild(snowflake);

      // Удаляем снежинку через 3 секунды после завершения анимации
      const totalTime = (animationDelay + animationDuration + 3) * 1000; // задержка + длительность + 3 секунды
      const timeout = setTimeout(() => {
        if (snowflake.parentNode) {
          snowflake.parentNode.removeChild(snowflake);
        }
      }, totalTime);
      cleanupTimeouts.push(timeout);
    }

    return () => {
      // Очищаем все таймауты
      cleanupTimeouts.forEach((timeout) => clearTimeout(timeout));
      // Cleanup при размонтировании
      if (snowContainer.parentNode) {
        snowContainer.parentNode.removeChild(snowContainer);
      }
    };
  }, [shouldShow]);

  // Добавляем стили в head
  useEffect(() => {
    if (!shouldShow) return;

    const styleId = 'snow-effect-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .snow-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      }

      .snowflake {
        position: absolute;
        color: #fff;
        user-select: none;
        z-index: 10000;
        font-size: 1em;
        will-change: transform;
        animation-name: snow-fall;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
      }

      @keyframes snow-fall {
        from {
          transform: translateY(0) translateX(0) rotate(0deg);
        }
        to {
          transform: translateY(calc(100vh + 50px)) translateX(var(--drift, 0)) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [shouldShow]);

  return null;
}
