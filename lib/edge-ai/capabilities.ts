export type EdgeAiCapabilities = {
  webgpu: boolean;
  webnn: boolean;
  webgl: boolean;
  camera: boolean;
  microphone: boolean;
  speechRecognition: boolean;
  /** Vision tools (pose / emotion) can run on WebGPU, WebNN, or WebGL. */
  canRunVision: boolean;
  /** Speech tool requires SpeechRecognition + microphone APIs. */
  canRunSpeech: boolean;
};

type NavigatorWithGpu = Navigator & {
  gpu?: { requestAdapter?: () => Promise<unknown> };
  ml?: unknown;
};

type WindowWithSpeech = Window & {
  SpeechRecognition?: unknown;
  webkitSpeechRecognition?: unknown;
};

function hasMediaDevices(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
}

function detectWebGl(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function detectEdgeAiCapabilities(): EdgeAiCapabilities {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      webgpu: false,
      webnn: false,
      webgl: false,
      camera: false,
      microphone: false,
      speechRecognition: false,
      canRunVision: false,
      canRunSpeech: false,
    };
  }

  const nav = navigator as NavigatorWithGpu;
  const win = window as WindowWithSpeech;

  const webgpu = typeof nav.gpu?.requestAdapter === 'function';
  const webnn = 'ml' in nav && nav.ml != null;
  const webgl = detectWebGl();
  const media = hasMediaDevices();
  const speechRecognition =
    typeof win.SpeechRecognition === 'function' ||
    typeof win.webkitSpeechRecognition === 'function';

  return {
    webgpu,
    webnn,
    webgl,
    camera: media,
    microphone: media,
    speechRecognition,
    canRunVision: webgpu || webnn || webgl,
    canRunSpeech: speechRecognition && media,
  };
}

export async function probeWebGpuAdapter(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as NavigatorWithGpu;
  if (typeof nav.gpu?.requestAdapter !== 'function') return false;
  try {
    const adapter = await nav.gpu.requestAdapter();
    return adapter != null;
  } catch {
    return false;
  }
}
