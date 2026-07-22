import {
  MICROBIT_SIMPLE_ALICE_COMMANDS,
  type MicrobitCommand,
  type MicrobitSessionState,
  type MicrobitSimpleAliceCommand,
} from './types';
import { resolveIconName } from './commands';

export function createInitialSessionState(): MicrobitSessionState {
  return {};
}

function isSimpleAliceCommand(value: unknown): value is MicrobitSimpleAliceCommand {
  return (
    typeof value === 'string' &&
    (MICROBIT_SIMPLE_ALICE_COMMANDS as readonly string[]).includes(value)
  );
}

export function normalizeMicrobitCommand(value: unknown): MicrobitCommand | undefined {
  if (isSimpleAliceCommand(value)) {
    return value;
  }

  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const candidate = value as { type?: unknown; text?: unknown; name?: unknown };

  if (candidate.type === 'text' && typeof candidate.text === 'string') {
    const text = candidate.text
      .replace(/[\r\n]/g, ' ')
      .trim()
      .slice(0, 48);
    if (!text) {
      return undefined;
    }
    return { type: 'text', text };
  }

  if (candidate.type === 'icon' && typeof candidate.name === 'string') {
    const iconName = resolveIconName(candidate.name);
    if (!iconName) {
      return undefined;
    }
    return { type: 'icon', name: iconName };
  }

  return undefined;
}

export function normalizeSessionState(state: unknown): MicrobitSessionState {
  if (!state || typeof state !== 'object') {
    return createInitialSessionState();
  }

  const candidate = state as Partial<MicrobitSessionState>;

  return {
    lastCommand: normalizeMicrobitCommand(candidate.lastCommand),
    lastActionAt: typeof candidate.lastActionAt === 'string' ? candidate.lastActionAt : undefined,
    bridgeStatus:
      candidate.bridgeStatus === 'sent' ||
      candidate.bridgeStatus === 'queued' ||
      candidate.bridgeStatus === 'failed'
        ? candidate.bridgeStatus
        : undefined,
  };
}
