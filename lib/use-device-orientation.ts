'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface DeviceOrientationState {
  /** Rotation around Z axis (0-360) - compass heading */
  alpha: number;
  /** Rotation around X axis (-180 to 180) - front/back tilt */
  beta: number;
  /** Rotation around Y axis (-90 to 90) - left/right tilt */
  gamma: number;
  /** Whether orientation is being tracked */
  isTracking: boolean;
  /** Whether we're on a supported mobile device */
  isMobileDevice: boolean;
  /** Whether permission has been granted */
  permissionGranted: boolean;
  /** Whether permission is required (iOS 13+) */
  permissionRequired: boolean;
  /** Error message if any */
  error: string | null;
}

interface UseDeviceOrientationOptions {
  /** Whether to use base orientation (relative to initial position) */
  useRelativeOrientation?: boolean;
  /** Smoothing factor for orientation values (0-1, higher = smoother) */
  smoothingFactor?: number;
}

const DEFAULT_STATE: DeviceOrientationState = {
  alpha: 0,
  beta: 0,
  gamma: 0,
  isTracking: false,
  isMobileDevice: false,
  permissionGranted: false,
  permissionRequired: false,
  error: null,
};

/**
 * Hook to access device orientation data from mobile accelerometer/gyroscope.
 * Handles permission requests for iOS 13+ and provides smoothed orientation values.
 *
 * Based on: https://frontendmasters.com/blog/beyond-the-mouse-animating-with-mobile-accelerometers/
 */
export function useDeviceOrientation(
  options: UseDeviceOrientationOptions = {}
): [DeviceOrientationState, () => Promise<boolean>] {
  const { useRelativeOrientation = true, smoothingFactor = 0.15 } = options;

  const [state, setState] = useState<DeviceOrientationState>(DEFAULT_STATE);

  // Refs for tracking base orientation and smoothing
  const baseOrientation = useRef<{ alpha: number; beta: number; gamma: number } | null>(null);
  const smoothedValues = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const latestEvent = useRef<{ alpha: number; beta: number; gamma: number } | null>(null);

  // Check if device supports motion and is a touch device
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for prefers-reduced-motion preference
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      setState((prev) => ({
        ...prev,
        isMobileDevice: false,
        error: 'Reduced motion preference detected',
      }));
      return;
    }

    const supportsOrientation = typeof DeviceOrientationEvent !== 'undefined';
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileDevice = supportsOrientation && isTouchDevice;

    // Check if permission API exists (iOS 13+)
    const permissionRequired =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function';

    setState((prev) => ({
      ...prev,
      isMobileDevice,
      permissionRequired,
      // On Android and other non-iOS devices, permission is granted by default
      permissionGranted: isMobileDevice && !permissionRequired,
    }));

    // If we're on a mobile device and don't need permission, start listening
    if (isMobileDevice && !permissionRequired) {
      startListening();
    }

    return () => {
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (event.alpha === null || event.beta === null || event.gamma === null) {
        return;
      }

      let { alpha, beta, gamma } = event;

      // Capture base orientation on first valid event if using relative orientation
      if (useRelativeOrientation && !baseOrientation.current) {
        baseOrientation.current = { alpha, beta, gamma };
      }

      // Calculate relative orientation if base is set
      if (useRelativeOrientation && baseOrientation.current) {
        alpha = alpha - baseOrientation.current.alpha;
        beta = beta - baseOrientation.current.beta;
        gamma = gamma - baseOrientation.current.gamma;

        // Normalize alpha to stay within reasonable bounds
        if (alpha > 180) alpha -= 360;
        if (alpha < -180) alpha += 360;
      }

      // Store latest event for animation frame processing
      latestEvent.current = { alpha, beta, gamma };
    },
    [useRelativeOrientation]
  );

  // Use animation frame for smooth updates
  const updateLoop = useCallback(() => {
    if (latestEvent.current) {
      const { alpha, beta, gamma } = latestEvent.current;

      // Apply smoothing using exponential moving average
      smoothedValues.current.alpha += (alpha - smoothedValues.current.alpha) * smoothingFactor;
      smoothedValues.current.beta += (beta - smoothedValues.current.beta) * smoothingFactor;
      smoothedValues.current.gamma += (gamma - smoothedValues.current.gamma) * smoothingFactor;

      setState((prev) => ({
        ...prev,
        alpha: smoothedValues.current.alpha,
        beta: smoothedValues.current.beta,
        gamma: smoothedValues.current.gamma,
      }));
    }

    animationFrameRef.current = requestAnimationFrame(updateLoop);
  }, [smoothingFactor]);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('deviceorientation', handleOrientation);
    animationFrameRef.current = requestAnimationFrame(updateLoop);

    setState((prev) => ({
      ...prev,
      isTracking: true,
    }));
  }, [handleOrientation, updateLoop]);

  const stopListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    window.removeEventListener('deviceorientation', handleOrientation);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isTracking: false,
    }));
  }, [handleOrientation]);

  /**
   * Request permission to access device orientation.
   * Must be called from a user gesture (click, tap) on iOS.
   * Returns true if permission was granted.
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    // Check if permission API exists (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();

        if (permissionState === 'granted') {
          setState((prev) => ({
            ...prev,
            permissionGranted: true,
            error: null,
          }));

          // Reset base orientation when permission is granted
          baseOrientation.current = null;
          smoothedValues.current = { alpha: 0, beta: 0, gamma: 0 };

          startListening();
          return true;
        } else {
          setState((prev) => ({
            ...prev,
            permissionGranted: false,
            error: 'Permission denied by user',
          }));
          return false;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to request permission';
        setState((prev) => ({
          ...prev,
          permissionGranted: false,
          error: errorMessage,
        }));
        console.error('DeviceOrientation permission request failed:', error);
        return false;
      }
    } else {
      // Non-iOS devices don't need explicit permission
      setState((prev) => ({
        ...prev,
        permissionGranted: true,
        error: null,
      }));

      // Reset base orientation
      baseOrientation.current = null;
      smoothedValues.current = { alpha: 0, beta: 0, gamma: 0 };

      startListening();
      return true;
    }
  }, [startListening]);

  return [state, requestPermission];
}

// Re-export the reset function if needed separately
export function createOrientationResetHandler(callback: () => void): () => void {
  return callback;
}
