import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgpu';
import '@tensorflow/tfjs-backend-webgl';

export type TfBackendId = 'webgpu' | 'webgl';

/**
 * Prefer WebGPU for Edge AI acceleration; fall back to WebGL only when probing fails
 * after WebGPU was advertised (rare adapter issues). Callers that require WebGPU
 * should gate UI with detectEdgeAiCapabilities().canRunVision first.
 */
export async function initTfBackend(prefer: TfBackendId = 'webgpu'): Promise<TfBackendId> {
  const order: TfBackendId[] = prefer === 'webgpu' ? ['webgpu', 'webgl'] : ['webgl', 'webgpu'];

  for (const backend of order) {
    try {
      const ok = await tf.setBackend(backend);
      if (!ok) continue;
      await tf.ready();
      if (tf.getBackend() === backend) return backend;
    } catch {
      // try next
    }
  }

  throw new Error('TfBackendUnavailable');
}

export { tf };
