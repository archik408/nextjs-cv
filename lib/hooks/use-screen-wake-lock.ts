'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FALLBACK_VIDEO_SRC,
  type ScreenAwakeError,
  type ScreenAwakeMethod,
} from '../keep-screen-on';

type UseScreenWakeLockResult = {
  /** Whether the browser exposes the Screen Wake Lock API. */
  isWakeLockSupported: boolean;
  /** User intent: a keep-awake session was started and not stopped yet. */
  isActive: boolean;
  /** The wake lock was released by the browser (tab hidden); re-acquires on visibility. */
  isSuspended: boolean;
  /** Which keep-awake mechanism is currently held. */
  method: ScreenAwakeMethod | null;
  error: ScreenAwakeError | null;
  activate: () => Promise<void>;
  deactivate: () => void;
};

function isWakeLockApiAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
}

/**
 * Keeps the screen awake while the page is visible. Uses the Screen Wake Lock
 * API and falls back to a hidden silent looping video where the API is missing.
 * The lock is re-acquired automatically when the tab becomes visible again.
 */
export function useScreenWakeLock(): UseScreenWakeLockResult {
  const [isWakeLockSupported, setIsWakeLockSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [method, setMethod] = useState<ScreenAwakeMethod | null>(null);
  const [error, setError] = useState<ScreenAwakeError | null>(null);

  const desiredRef = useRef(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsWakeLockSupported(isWakeLockApiAvailable());
  }, []);

  const handleSentinelRelease = useCallback(() => {
    sentinelRef.current = null;
    if (desiredRef.current) {
      setIsSuspended(true);
      setMethod(null);
    }
  }, []);

  const startFallbackVideo = useCallback(async (): Promise<boolean> => {
    let video = videoRef.current;
    if (!video) {
      video = document.createElement('video');
      video.src = FALLBACK_VIDEO_SRC;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('aria-hidden', 'true');
      video.style.position = 'fixed';
      video.style.width = '1px';
      video.style.height = '1px';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      document.body.appendChild(video);
      videoRef.current = video;
    }
    try {
      // jsdom's play() returns undefined instead of a Promise.
      const playback = video.play();
      if (playback && typeof playback.then === 'function') {
        await playback;
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  const releaseSentinel = useCallback(() => {
    const sentinel = sentinelRef.current;
    sentinelRef.current = null;
    if (sentinel) {
      sentinel.removeEventListener('release', handleSentinelRelease);
      if (!sentinel.released) {
        sentinel.release().catch(() => undefined);
      }
    }
  }, [handleSentinelRelease]);

  const stopFallbackVideo = useCallback(() => {
    const video = videoRef.current;
    videoRef.current = null;
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.remove();
    }
  }, []);

  const acquire = useCallback(async (): Promise<void> => {
    let wakeLockFailed = false;
    if (isWakeLockApiAvailable()) {
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        if (!desiredRef.current) {
          sentinel.release().catch(() => undefined);
          return;
        }
        releaseSentinel();
        sentinelRef.current = sentinel;
        sentinel.addEventListener('release', handleSentinelRelease);
        setMethod('wake-lock');
        setError(null);
        setIsSuspended(false);
        stopFallbackVideo();
        return;
      } catch {
        // Wake Lock request rejected (permissions policy, low battery, …) —
        // fall through to the video fallback before giving up.
        wakeLockFailed = true;
      }
    }
    const playing = await startFallbackVideo();
    if (playing) {
      releaseSentinel();
      setMethod('video-fallback');
      setError(null);
      setIsSuspended(false);
    } else {
      releaseSentinel();
      stopFallbackVideo();
      desiredRef.current = false;
      setIsActive(false);
      setIsSuspended(false);
      setMethod(null);
      setError(wakeLockFailed ? 'request-failed' : 'autoplay-blocked');
    }
  }, [handleSentinelRelease, releaseSentinel, startFallbackVideo, stopFallbackVideo]);

  const activate = useCallback(async () => {
    desiredRef.current = true;
    setIsActive(true);
    setIsSuspended(false);
    setError(null);
    await acquire();
  }, [acquire]);

  const deactivate = useCallback(() => {
    desiredRef.current = false;
    setIsActive(false);
    setIsSuspended(false);
    setError(null);
    setMethod(null);
    releaseSentinel();
    stopFallbackVideo();
  }, [releaseSentinel, stopFallbackVideo]);

  // Browsers release the wake lock when the tab is hidden; re-acquire on return.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || !desiredRef.current) return;
      if (sentinelRef.current && !sentinelRef.current.released) return;
      if (videoRef.current && !videoRef.current.paused) return;
      void acquire();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [acquire]);

  useEffect(() => deactivate, [deactivate]);

  return { isWakeLockSupported, isActive, isSuspended, method, error, activate, deactivate };
}
