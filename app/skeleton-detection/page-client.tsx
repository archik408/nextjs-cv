'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { EdgeAiCapabilityPanel } from '@/components/edge-ai/capability-panel';
import { CameraViewport } from '@/components/edge-ai/camera-viewport';
import { detectEdgeAiCapabilities, type EdgeAiCapabilities } from '@/lib/edge-ai/capabilities';
import { startCameraStream, stopMediaStream, waitForVideoReady } from '@/lib/edge-ai/camera';
import { drawPoseOverlay } from '@/lib/edge-ai/draw-pose';
import { useLanguage } from '@/lib/hooks/use-language';
import { Loader2, Play, Square } from 'lucide-react';

type Detector = {
  estimatePoses: (
    input: HTMLVideoElement
  ) => Promise<
    Array<{ keypoints: Array<{ x: number; y: number; score?: number; name?: string }> }>
  >;
  dispose?: () => void;
};

export function SkeletonDetectionPageClient() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<Detector | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const [caps, setCaps] = useState<EdgeAiCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backend, setBackend] = useState<string | null>(null);

  useEffect(() => {
    setCaps(detectEdgeAiCapabilities());
  }, []);

  const stopLoop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopLoop();
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (detectorRef.current?.dispose) {
      detectorRef.current.dispose();
    }
    detectorRef.current = null;
    setIsRunning(false);
    setBackend(null);
  }, [stopLoop]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const detectFrame = useCallback(async () => {
    if (!runningRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = detectorRef.current;
    if (!video || !canvas || !detector || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(() => {
        void detectFrame();
      });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    try {
      const poses = await detector.estimatePoses(video);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const pose of poses) {
        drawPoseOverlay(ctx, pose.keypoints);
      }
    } catch {
      // Skip a failed frame; keep the loop alive.
    }

    if (runningRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        void detectFrame();
      });
    }
  }, []);

  const start = useCallback(async () => {
    if (!caps?.canRunVision || !caps.camera) return;
    setError(null);
    setIsLoading(true);

    try {
      const { initTfBackend } = await import('@/lib/edge-ai/tf-backend');
      const activeBackend = await initTfBackend(caps.webgpu ? 'webgpu' : 'webgl');
      setBackend(activeBackend);

      const poseDetection = await import('@tensorflow-models/pose-detection');
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      });
      detectorRef.current = detector;

      const stream = await startCameraStream();
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error('VideoMissing');
      video.srcObject = stream;
      await video.play();
      await waitForVideoReady(video);

      runningRef.current = true;
      setIsRunning(true);
      rafRef.current = requestAnimationFrame(() => {
        void detectFrame();
      });
    } catch (err) {
      stopCamera();
      const message =
        err instanceof Error && err.message === 'CameraUnavailable'
          ? t.edgeAiErrorCamera
          : err instanceof Error && err.name === 'NotAllowedError'
            ? t.edgeAiErrorPermission
            : t.skeletonDetectionErrorStart;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [caps, detectFrame, stopCamera, t]);

  const capabilityLabels = {
    title: t.edgeAiCapsTitle,
    unsupported: t.skeletonDetectionUnsupported,
    webgpu: t.edgeAiCapWebgpu,
    webnn: t.edgeAiCapWebnn,
    webgl: t.edgeAiCapWebgl,
    camera: t.edgeAiCapCamera,
    microphone: t.edgeAiCapMicrophone,
    speechRecognition: t.edgeAiCapSpeech,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <main id="main-content" className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.skeletonDetectionTitle}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t.skeletonDetectionDesc}</p>
          </header>

          {caps && (
            <EdgeAiCapabilityPanel
              capabilities={caps}
              labels={capabilityLabels}
              keys={['webgpu', 'webnn', 'webgl', 'camera']}
              canRun={caps.canRunVision && caps.camera}
            />
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6">
            <CameraViewport
              videoRef={videoRef}
              canvasRef={canvasRef}
              videoLabel={t.skeletonDetectionVideoLabel}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!isRunning ? (
                <button
                  type="button"
                  onClick={() => void start()}
                  disabled={!caps?.canRunVision || !caps.camera || isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Play className="h-4 w-4" aria-hidden />
                  )}
                  {isLoading ? t.edgeAiLoadingModel : t.skeletonDetectionStart}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <Square className="h-4 w-4" aria-hidden />
                  {t.skeletonDetectionStop}
                </button>
              )}
              {backend && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.edgeAiBackendLabel}: {backend}
                </p>
              )}
            </div>

            {error && (
              <p className="mt-3 text-sm text-rose-600 dark:text-rose-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <section
            role="region"
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:p-5 text-sm text-gray-600 dark:text-gray-400"
            aria-labelledby="skeleton-privacy-title"
          >
            <h2
              id="skeleton-privacy-title"
              className="font-semibold text-gray-900 dark:text-white mb-2"
            >
              {t.edgeAiPrivacyTitle}
            </h2>
            <p>{t.skeletonDetectionPrivacy}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
