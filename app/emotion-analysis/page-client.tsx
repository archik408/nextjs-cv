'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import NavigationButtons from '@/components/navigation-buttons';
import { EdgeAiCapabilityPanel } from '@/components/edge-ai/capability-panel';
import { CameraViewport } from '@/components/edge-ai/camera-viewport';
import { detectEdgeAiCapabilities, type EdgeAiCapabilities } from '@/lib/edge-ai/capabilities';
import { startCameraStream, stopMediaStream, waitForVideoReady } from '@/lib/edge-ai/camera';
import { useLanguage } from '@/lib/hooks/use-language';
import { Loader2, Play, Square } from 'lucide-react';

const FACE_API_MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model';

type ExpressionScores = Record<string, number>;

function topExpression(expressions: ExpressionScores): { label: string; score: number } | null {
  let best: { label: string; score: number } | null = null;
  for (const [label, score] of Object.entries(expressions)) {
    if (!best || score > best.score) best = { label, score };
  }
  return best;
}

export function EmotionAnalysisPageClient() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const modelsReadyRef = useRef(false);

  const [caps, setCaps] = useState<EdgeAiCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<{ label: string; score: number } | null>(null);
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
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsRunning(false);
    setEmotion(null);
    setBackend(null);
  }, [stopLoop]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const emotionLabel = useCallback(
    (key: string) => {
      const map: Record<string, string> = {
        neutral: t.emotionLabelNeutral,
        happy: t.emotionLabelHappy,
        sad: t.emotionLabelSad,
        angry: t.emotionLabelAngry,
        fearful: t.emotionLabelFearful,
        disgusted: t.emotionLabelDisgusted,
        surprised: t.emotionLabelSurprised,
      };
      return map[key] ?? key;
    },
    [t]
  );

  const detectFrame = useCallback(async () => {
    if (!runningRef.current || !modelsReadyRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(() => {
        void detectFrame();
      });
      return;
    }

    const faceapi = await import('@vladmandic/face-api');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    try {
      const result = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 })
        )
        .withFaceExpressions();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (result) {
        const box = result.detection.box;
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        const top = topExpression(result.expressions as unknown as ExpressionScores);
        if (top) {
          setEmotion(top);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
          const label = `${emotionLabel(top.label)} ${(top.score * 100).toFixed(0)}%`;
          ctx.font = '16px sans-serif';
          const textWidth = ctx.measureText(label).width;
          ctx.fillRect(box.x, Math.max(0, box.y - 28), textWidth + 12, 26);
          ctx.fillStyle = '#ecfdf5';
          ctx.fillText(label, box.x + 6, Math.max(18, box.y - 10));
        }
      } else {
        setEmotion(null);
      }
    } catch {
      // Skip failed frame.
    }

    if (runningRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        void detectFrame();
      });
    }
  }, [emotionLabel]);

  const start = useCallback(async () => {
    if (!caps?.canRunVision || !caps.camera) return;
    setError(null);
    setIsLoading(true);

    try {
      const { initTfBackend } = await import('@/lib/edge-ai/tf-backend');
      const active = await initTfBackend(caps.webgpu ? 'webgpu' : 'webgl');
      setBackend(active);

      const faceapi = await import('@vladmandic/face-api');
      if (!modelsReadyRef.current) {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(FACE_API_MODEL_URL),
        ]);
        modelsReadyRef.current = true;
      }

      const stream = await startCameraStream({ facingMode: 'user' });
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
        err instanceof Error && err.name === 'NotAllowedError'
          ? t.edgeAiErrorPermission
          : err instanceof Error && err.message === 'CameraUnavailable'
            ? t.edgeAiErrorCamera
            : t.emotionAnalysisErrorStart;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [caps, detectFrame, stopCamera, t]);

  const capabilityLabels = {
    title: t.edgeAiCapsTitle,
    unsupported: t.emotionAnalysisUnsupported,
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
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.emotionAnalysisTitle}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t.emotionAnalysisDesc}</p>
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
              videoLabel={t.emotionAnalysisVideoLabel}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!isRunning ? (
                <button
                  type="button"
                  onClick={() => void start()}
                  disabled={!caps?.canRunVision || !caps.camera || isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Play className="h-4 w-4" aria-hidden />
                  )}
                  {isLoading ? t.edgeAiLoadingModel : t.emotionAnalysisStart}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <Square className="h-4 w-4" aria-hidden />
                  {t.emotionAnalysisStop}
                </button>
              )}
              {backend && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.edgeAiBackendLabel}: {backend}
                </p>
              )}
            </div>

            {emotion && (
              <p
                className="mt-4 text-base font-medium text-gray-900 dark:text-white"
                aria-live="polite"
              >
                {t.emotionAnalysisResult}: {emotionLabel(emotion.label)}{' '}
                <span className="text-gray-500 dark:text-gray-400">
                  ({(emotion.score * 100).toFixed(0)}%)
                </span>
              </p>
            )}

            {error && (
              <p className="mt-3 text-sm text-rose-600 dark:text-rose-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <section
            role="region"
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:p-5 text-sm text-gray-600 dark:text-gray-400"
            aria-labelledby="emotion-privacy-title"
          >
            <h2
              id="emotion-privacy-title"
              className="font-semibold text-gray-900 dark:text-white mb-2"
            >
              {t.edgeAiPrivacyTitle}
            </h2>
            <p>{t.emotionAnalysisPrivacy}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
