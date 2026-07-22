'use client';

import { useEffect, useRef, useState } from 'react';
import Pusher, { type Channel } from 'pusher-js';
import {
  MICROBIT_PUSHER_CHANNEL,
  MICROBIT_PUSHER_EVENT,
  type MicrobitBridgePayload,
} from '@/lib/microbit-bridge/constants';
import { isAliceMicrobitCommand, mapAliceCommandToUart } from '@/lib/microbit-bridge/command-map';
import type { MicrobitProtocolCommand } from '@/lib/microbit-connector/protocol';

export type MicrobitBridgeStatus = 'disabled' | 'connecting' | 'listening' | 'offline';

type UseMicrobitBridgeOptions = {
  enabled?: boolean;
  onCommand: (uartCommand: MicrobitProtocolCommand) => void;
  onCommandWhileDisconnected?: (uartCommand: MicrobitProtocolCommand) => void;
  isDeviceConnected: () => boolean;
};

function getPublicPusherConfig(): { key: string; cluster: string } | null {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY?.trim();
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER?.trim();
  if (!key || !cluster) {
    return null;
  }
  return { key, cluster };
}

function isBridgePayload(value: unknown): value is MicrobitBridgePayload {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<MicrobitBridgePayload>;
  return isAliceMicrobitCommand(candidate.command);
}

/**
 * Subscribes to Alice → micro:bit commands via Pusher Channels (WebSocket).
 * Requires NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER.
 */
export function useMicrobitBridge({
  enabled = true,
  onCommand,
  onCommandWhileDisconnected,
  isDeviceConnected,
}: UseMicrobitBridgeOptions): MicrobitBridgeStatus {
  const [status, setStatus] = useState<MicrobitBridgeStatus>(() =>
    getPublicPusherConfig() ? 'connecting' : 'disabled'
  );

  const onCommandRef = useRef(onCommand);
  const onDisconnectedRef = useRef(onCommandWhileDisconnected);
  const isConnectedRef = useRef(isDeviceConnected);

  useEffect(() => {
    onCommandRef.current = onCommand;
    onDisconnectedRef.current = onCommandWhileDisconnected;
    isConnectedRef.current = isDeviceConnected;
  }, [onCommand, onCommandWhileDisconnected, isDeviceConnected]);

  useEffect(() => {
    if (!enabled) {
      setStatus(getPublicPusherConfig() ? 'offline' : 'disabled');
      return;
    }

    const config = getPublicPusherConfig();
    if (!config) {
      setStatus('disabled');
      return;
    }

    setStatus('connecting');

    const pusher = new Pusher(config.key, {
      cluster: config.cluster,
    });

    const channel: Channel = pusher.subscribe(MICROBIT_PUSHER_CHANNEL);

    const handleStateChange = ({ current }: { current: string }) => {
      if (current === 'connected') {
        setStatus('listening');
        return;
      }
      if (current === 'connecting' || current === 'unavailable') {
        setStatus(current === 'connecting' ? 'connecting' : 'offline');
        return;
      }
      if (current === 'failed' || current === 'disconnected') {
        setStatus('offline');
      }
    };

    pusher.connection.bind('state_change', handleStateChange);
    if (pusher.connection.state === 'connected') {
      setStatus('listening');
    }

    const handleCommand = (data: unknown) => {
      if (!isBridgePayload(data)) {
        return;
      }

      const uartCommand = mapAliceCommandToUart(data.command);
      if (isConnectedRef.current()) {
        onCommandRef.current(uartCommand);
        return;
      }
      onDisconnectedRef.current?.(uartCommand);
    };

    channel.bind(MICROBIT_PUSHER_EVENT, handleCommand);

    return () => {
      channel.unbind(MICROBIT_PUSHER_EVENT, handleCommand);
      pusher.connection.unbind('state_change', handleStateChange);
      pusher.unsubscribe(MICROBIT_PUSHER_CHANNEL);
      pusher.disconnect();
    };
  }, [enabled]);

  return status;
}
