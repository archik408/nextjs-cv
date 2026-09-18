'use client';

import type { RefObject } from 'react';

type CameraViewportProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  mirror?: boolean;
  videoLabel: string;
  className?: string;
};

/** Video + canvas overlay for real-time vision tools. */
export function CameraViewport({
  videoRef,
  canvasRef,
  mirror = true,
  videoLabel,
  className,
}: CameraViewportProps) {
  const mirrorClass = mirror ? 'scale-x-[-1]' : '';

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 aspect-video ${className ?? ''}`}
    >
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover ${mirrorClass}`}
        playsInline
        muted
        aria-label={videoLabel}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full pointer-events-none ${mirrorClass}`}
        aria-hidden="true"
      />
    </div>
  );
}
