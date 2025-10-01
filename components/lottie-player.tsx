'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const LottieDynamic = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((m) => m.Player),
  { ssr: false }
);

// Simple passthrough to ensure no SSR usage of lottie library
export default function LottiePlayer(props: React.ComponentProps<typeof LottieDynamic>) {
  // Ensure consistent sizing via className passthrough
  return <LottieDynamic {...props} />;
}
