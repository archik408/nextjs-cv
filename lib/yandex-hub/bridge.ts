import Pusher from 'pusher';
import {
  MICROBIT_PUSHER_CHANNEL,
  MICROBIT_PUSHER_EVENT,
  type MicrobitBridgePayload,
} from '@/lib/microbit-bridge/constants';
import type { MicrobitCommand } from './types';

export type BridgeDispatchResult = 'sent' | 'queued' | 'failed';

/**
 * Pusher Channels env for server-side publish (Vercel):
 * PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER
 *
 * Optional HTTP forward:
 * MICROBIT_BRIDGE_URL, MICROBIT_BRIDGE_SECRET
 */
function getPusherConfig(): {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
} | null {
  const appId = process.env.PUSHER_APP_ID?.trim();
  const key = process.env.PUSHER_KEY?.trim();
  const secret = process.env.PUSHER_SECRET?.trim();
  const cluster = process.env.PUSHER_CLUSTER?.trim();

  if (!appId || !key || !secret || !cluster) {
    return null;
  }

  return { appId, key, secret, cluster };
}

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

function buildPayload(command: MicrobitCommand): MicrobitBridgePayload {
  return {
    command,
    source: 'yandex-alice',
    skill: 'Мой Микробит',
  };
}

async function publishViaPusher(command: MicrobitCommand): Promise<boolean | null> {
  const config = getPusherConfig();
  if (!config) {
    return null;
  }

  try {
    const pusher = new Pusher({
      appId: config.appId,
      key: config.key,
      secret: config.secret,
      cluster: config.cluster,
      useTLS: true,
    });

    await pusher.trigger(MICROBIT_PUSHER_CHANNEL, MICROBIT_PUSHER_EVENT, buildPayload(command));
    return true;
  } catch {
    return false;
  }
}

async function publishViaHttp(command: MicrobitCommand): Promise<boolean | null> {
  const bridgeUrl = getBridgeUrl();
  if (!bridgeUrl) {
    return null;
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
      body: JSON.stringify(buildPayload(command)),
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function dispatchMicrobitCommand(
  command: MicrobitCommand
): Promise<BridgeDispatchResult> {
  const [pusherResult, httpResult] = await Promise.all([
    publishViaPusher(command),
    publishViaHttp(command),
  ]);

  const attempted = pusherResult !== null || httpResult !== null;
  if (!attempted) {
    return 'queued';
  }

  const anySent = pusherResult === true || httpResult === true;
  return anySent ? 'sent' : 'failed';
}
