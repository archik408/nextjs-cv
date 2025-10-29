'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import Image from 'next/image';
import { useAnimationPreferences } from '@/lib/use-animation-preferences';

const LottieDynamic = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((m) => m.Player),
  { ssr: false }
);

interface LottiePlayerProps extends React.ComponentProps<typeof LottieDynamic> {
  fallbackSrc?: string;
  fallbackAlt?: string;
}

// Simple passthrough to ensure no SSR usage of lottie library
export default function LottiePlayer({
  fallbackSrc,
  fallbackAlt = 'Animation preview',
  ...props
}: LottiePlayerProps) {
  const { shouldAnimate, detectionComplete } = useAnimationPreferences();

  // Пока не определили настройки, не показываем ничего (или можно показать скелетон)
  if (!detectionComplete) {
    return <div style={props.style} className={props.className} />;
  }

  // Если анимации отключены и есть fallback изображение
  if (!shouldAnimate && fallbackSrc) {
    return (
      <div style={{ ...props.style, position: 'relative' }} className={props.className}>
        <Image src={fallbackSrc} alt={fallbackAlt} fill style={{ objectFit: 'contain' }} priority />
      </div>
    );
  }

  // Показываем Lottie анимацию
  return <LottieDynamic {...props} />;
}
