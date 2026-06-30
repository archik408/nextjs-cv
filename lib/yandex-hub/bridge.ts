import type { MicrobitCommand } from './types';

export type BridgeDispatchResult = 'sent' | 'queued' | 'failed';

function getBridgeUrl(): string | null {
  const url = process.env.MICROBIT_BRIDGE_URL?.trim();
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function dispatchMicrobitCommand(
  command: MicrobitCommand
): Promise<BridgeDispatchResult> {
  const bridgeUrl = getBridgeUrl();
  if (!bridgeUrl) {
    return 'queued';
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const bridgeSecret = process.env.MICROBIT_BRIDGE_SECRET?.trim();
    if (bridgeSecret) {
      headers.Authorization = `Bearer ${bridgeSecret}`;
    }

    const response = await fetch(bridgeUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ command, source: 'yandex-alice', skill: 'Мой microbit' }),
      signal: controller.signal,
    });

    return response.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  } finally {
    clearTimeout(timeout);
  }
}
