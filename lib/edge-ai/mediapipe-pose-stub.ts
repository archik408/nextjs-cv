/**
 * Stub for @mediapipe/pose.
 * We only use MoveNet from @tensorflow-models/pose-detection; BlazePose/MediaPipe
 * is unused, but the package still statically imports @mediapipe/pose and Turbopack
 * fails because that package has no ESM exports.
 */
export class Pose {
  static VERSION = 'stub';
  initialize(): Promise<void> {
    return Promise.resolve();
  }
  async send(_inputs: unknown): Promise<void> {
    return;
  }
  reset(): void {
    // no-op
  }
  close(): void {
    // no-op
  }
  onResults(_callback: (results: unknown) => void): void {
    // no-op
  }
  setOptions(_options: unknown): void {
    // no-op
  }
}

export default Pose;
