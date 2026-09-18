export type PoseKeypoint = {
  x: number;
  y: number;
  score?: number;
  name?: string;
};

/** COCO-17 MoveNet skeleton connections by keypoint name. */
const SKELETON_EDGES: ReadonlyArray<readonly [string, string]> = [
  ['nose', 'left_eye'],
  ['nose', 'right_eye'],
  ['left_eye', 'left_ear'],
  ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

const MIN_SCORE = 0.35;

function byName(keypoints: PoseKeypoint[]): Map<string, PoseKeypoint> {
  const map = new Map<string, PoseKeypoint>();
  for (const kp of keypoints) {
    if (kp.name) map.set(kp.name, kp);
  }
  return map;
}

export function drawPoseOverlay(
  ctx: CanvasRenderingContext2D,
  keypoints: PoseKeypoint[],
  options?: { minScore?: number; pointColor?: string; lineColor?: string }
): void {
  const minScore = options?.minScore ?? MIN_SCORE;
  const pointColor = options?.pointColor ?? '#22d3ee';
  const lineColor = options?.lineColor ?? '#a78bfa';
  const named = byName(keypoints);

  ctx.save();
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.strokeStyle = lineColor;

  for (const [a, b] of SKELETON_EDGES) {
    const from = named.get(a);
    const to = named.get(b);
    if (!from || !to) continue;
    if ((from.score ?? 0) < minScore || (to.score ?? 0) < minScore) continue;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.fillStyle = pointColor;
  for (const kp of keypoints) {
    if ((kp.score ?? 0) < minScore) continue;
    ctx.beginPath();
    ctx.arc(kp.x, kp.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
