import type { MicrobitSessionState } from './types';

export function createInitialSessionState(): MicrobitSessionState {
  return {};
}

export function normalizeSessionState(state: unknown): MicrobitSessionState {
  if (!state || typeof state !== 'object') {
    return createInitialSessionState();
  }

  const candidate = state as Partial<MicrobitSessionState>;

  return {
    lastCommand:
      candidate.lastCommand === 'smile' ||
      candidate.lastCommand === 'sound' ||
      candidate.lastCommand === 'sad'
        ? candidate.lastCommand
        : undefined,
    lastActionAt: typeof candidate.lastActionAt === 'string' ? candidate.lastActionAt : undefined,
    bridgeStatus:
      candidate.bridgeStatus === 'sent' ||
      candidate.bridgeStatus === 'queued' ||
      candidate.bridgeStatus === 'failed'
        ? candidate.bridgeStatus
        : undefined,
  };
}
