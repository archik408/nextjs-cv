/**
 * Pusher Channels bridge for Alice → micro:bit connector.
 *
 * Env (Vercel):
 * - PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER — server publish
 * - NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER — browser subscribe
 * - MICROBIT_BRIDGE_URL, MICROBIT_BRIDGE_SECRET — optional HTTP forward
 */

import type { MicrobitCommand } from '@/lib/yandex-hub/types';

export const MICROBIT_PUSHER_CHANNEL = 'microbit';
export const MICROBIT_PUSHER_EVENT = 'command';

export type MicrobitBridgePayload = {
  command: MicrobitCommand;
  source: string;
  skill: string;
};
