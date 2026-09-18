export type CameraStreamOptions = {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
};

export async function startCameraStream(options: CameraStreamOptions = {}): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('CameraUnavailable');
  }

  const { facingMode = 'user', width = 640, height = 480 } = options;

  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode,
      width: { ideal: width },
      height: { ideal: height },
    },
  });
}

export async function startMicrophoneStream(): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('MicrophoneUnavailable');
  }

  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
}

export function stopMediaStream(stream: MediaStream | null | undefined): void {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

export async function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= 2 && video.videoWidth > 0) return;

  await new Promise<void>((resolve, reject) => {
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('VideoLoadFailed'));
    };
    const cleanup = () => {
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('error', onError);
    };
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('error', onError);
  });
}
