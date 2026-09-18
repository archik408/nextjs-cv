import { detectEdgeAiCapabilities } from '@/lib/edge-ai/capabilities';
import { drawPoseOverlay } from '@/lib/edge-ai/draw-pose';

describe('detectEdgeAiCapabilities', () => {
  const originalGpu = Object.getOwnPropertyDescriptor(Navigator.prototype, 'gpu');
  const originalMl = Object.getOwnPropertyDescriptor(Navigator.prototype, 'ml');
  const originalMediaDevices = Object.getOwnPropertyDescriptor(Navigator.prototype, 'mediaDevices');
  let originalSpeech: unknown;
  let originalWebkitSpeech: unknown;

  beforeEach(() => {
    originalSpeech = (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    originalWebkitSpeech = (window as unknown as { webkitSpeechRecognition?: unknown })
      .webkitSpeechRecognition;
  });

  afterEach(() => {
    if (originalGpu) {
      Object.defineProperty(Navigator.prototype, 'gpu', originalGpu);
    } else {
      delete (Navigator.prototype as { gpu?: unknown }).gpu;
    }
    if (originalMl) {
      Object.defineProperty(Navigator.prototype, 'ml', originalMl);
    } else {
      delete (Navigator.prototype as { ml?: unknown }).ml;
    }
    if (originalMediaDevices) {
      Object.defineProperty(Navigator.prototype, 'mediaDevices', originalMediaDevices);
    }

    const win = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    if (originalSpeech === undefined) delete win.SpeechRecognition;
    else win.SpeechRecognition = originalSpeech;
    if (originalWebkitSpeech === undefined) delete win.webkitSpeechRecognition;
    else win.webkitSpeechRecognition = originalWebkitSpeech;
  });

  it('returns capability flags as booleans', () => {
    const caps = detectEdgeAiCapabilities();
    expect(caps).toMatchObject({
      webgpu: expect.any(Boolean),
      webnn: expect.any(Boolean),
      camera: expect.any(Boolean),
      microphone: expect.any(Boolean),
      speechRecognition: expect.any(Boolean),
      canRunVision: expect.any(Boolean),
      canRunSpeech: expect.any(Boolean),
    });
  });

  it('enables vision when WebGPU is present', () => {
    Object.defineProperty(Navigator.prototype, 'gpu', {
      configurable: true,
      get: () => ({ requestAdapter: jest.fn() }),
    });
    Object.defineProperty(Navigator.prototype, 'mediaDevices', {
      configurable: true,
      get: () => ({ getUserMedia: jest.fn() }),
    });
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    delete (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    const caps = detectEdgeAiCapabilities();
    expect(caps.webgpu).toBe(true);
    expect(caps.canRunVision).toBe(true);
  });

  it('enables vision when only WebGL is available', () => {
    delete (Navigator.prototype as { gpu?: unknown }).gpu;
    delete (Navigator.prototype as { ml?: unknown }).ml;
    Object.defineProperty(Navigator.prototype, 'mediaDevices', {
      configurable: true,
      get: () => ({ getUserMedia: jest.fn() }),
    });

    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({})) as unknown as typeof getContext;

    const caps = detectEdgeAiCapabilities();
    expect(caps.webgl).toBe(true);
    expect(caps.canRunVision).toBe(true);

    HTMLCanvasElement.prototype.getContext = getContext;
  });

  it('enables speech when SpeechRecognition and mediaDevices exist', () => {
    Object.defineProperty(Navigator.prototype, 'mediaDevices', {
      configurable: true,
      get: () => ({ getUserMedia: jest.fn() }),
    });
    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition =
      function SpeechRecognition() {};

    const caps = detectEdgeAiCapabilities();
    expect(caps.speechRecognition).toBe(true);
    expect(caps.canRunSpeech).toBe(true);
  });
});

describe('drawPoseOverlay', () => {
  it('draws points and lines for high-confidence keypoints', () => {
    const calls: string[] = [];
    const ctx = {
      save: () => calls.push('save'),
      restore: () => calls.push('restore'),
      beginPath: () => calls.push('beginPath'),
      moveTo: () => calls.push('moveTo'),
      lineTo: () => calls.push('lineTo'),
      stroke: () => calls.push('stroke'),
      arc: () => calls.push('arc'),
      fill: () => calls.push('fill'),
      lineWidth: 0,
      lineCap: '',
      strokeStyle: '',
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;

    drawPoseOverlay(ctx, [
      { name: 'left_shoulder', x: 10, y: 10, score: 0.9 },
      { name: 'right_shoulder', x: 40, y: 10, score: 0.9 },
      { name: 'nose', x: 25, y: 0, score: 0.1 },
    ]);

    expect(calls).toContain('stroke');
    expect(calls).toContain('arc');
    expect(calls).toContain('restore');
  });
});
