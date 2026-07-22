'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Bluetooth,
  Cable,
  Cpu,
  Loader2,
  PlugZap,
  Radio,
  Send,
  Unplug,
} from 'lucide-react';
import NavigationButtons from '@/components/navigation-buttons';
import { CodeBlock } from '@/components/code-block';
import {
  MicrobitBoard,
  type MicrobitBoardAction,
} from '@/components/microbit-connector/microbit-board';
import { BluetoothMicrobitTransport } from '@/lib/microbit-connector/bluetooth-transport';
import {
  MicrobitBoardActionKind,
  MicrobitCommandKind,
  QUICK_ICON_COMMANDS,
  QUICK_SIMPLE_COMMANDS,
  MICROBIT_MAKECODE_FIRMWARE_EXAMPLE,
  formatCommand,
  type MicrobitSimpleCommand,
} from '@/lib/microbit-connector/protocol';
import { UsbMicrobitTransport } from '@/lib/microbit-connector/usb-transport';
import {
  MicrobitConnectionError,
  MicrobitConnectionErrorCode,
  MicrobitConnectionMethod,
  MicrobitConnectionStatus,
  type MicrobitTransport,
} from '@/lib/microbit-connector/types';
import { useLanguage } from '@/lib/hooks/use-language';
import { useMicrobitBridge } from '@/lib/hooks/use-microbit-bridge';

type LastCommand = {
  label: string;
  at: string;
  source?: 'local' | 'alice';
};

export function MicrobitConnectorPageClient() {
  const { t } = useLanguage();
  const copy = t.microbitConnector;

  const transportRef = useRef<MicrobitTransport | null>(null);
  const [status, setStatus] = useState<MicrobitConnectionStatus>(
    MicrobitConnectionStatus.Disconnected
  );
  const [method, setMethod] = useState<MicrobitConnectionMethod | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastCommand, setLastCommand] = useState<LastCommand | null>(null);
  const [textValue, setTextValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const bluetoothSupported = useMemo(() => BluetoothMicrobitTransport.isSupported(), []);
  const usbSupported = useMemo(() => UsbMicrobitTransport.isSupported(), []);

  useEffect(() => {
    return () => {
      void transportRef.current?.disconnect();
      transportRef.current = null;
    };
  }, []);

  const connect = useCallback(
    async (nextMethod: MicrobitConnectionMethod) => {
      setErrorMessage(null);
      setStatus(MicrobitConnectionStatus.Connecting);

      try {
        if (transportRef.current) {
          await transportRef.current.disconnect();
          transportRef.current = null;
        }

        const transport =
          nextMethod === MicrobitConnectionMethod.Bluetooth
            ? new BluetoothMicrobitTransport()
            : new UsbMicrobitTransport();

        await transport.connect();
        transportRef.current = transport;
        setMethod(nextMethod);
        setStatus(MicrobitConnectionStatus.Connected);
      } catch (error) {
        transportRef.current = null;
        setMethod(null);

        if (
          error instanceof MicrobitConnectionError &&
          error.code === MicrobitConnectionErrorCode.UserCancelled
        ) {
          setStatus(MicrobitConnectionStatus.Disconnected);
          return;
        }

        setStatus(MicrobitConnectionStatus.Error);
        setErrorMessage(error instanceof Error ? error.message : copy.errors.connectionFailed);
      }
    },
    [copy.errors.connectionFailed]
  );

  const disconnect = useCallback(async () => {
    setErrorMessage(null);
    try {
      await transportRef.current?.disconnect();
    } catch {
      // ignore disconnect errors
    }
    transportRef.current = null;
    setMethod(null);
    setStatus(MicrobitConnectionStatus.Disconnected);
  }, []);

  const sendCommand = useCallback(
    async (action: MicrobitBoardAction, source: 'local' | 'alice' = 'local') => {
      if (!transportRef.current?.isConnected()) {
        setErrorMessage(copy.errors.notConnected);
        return;
      }

      if (typeof action === 'object' && action.type === MicrobitBoardActionKind.TextPrompt) {
        const text = textValue.trim();
        if (!text) {
          setErrorMessage(copy.errors.emptyText);
          return;
        }
        action = { type: MicrobitCommandKind.Text, text };
      }

      setIsSending(true);
      setErrorMessage(null);

      try {
        await transportRef.current.send(action);
        setLastCommand({
          label: formatCommand(action).trim(),
          at: new Date().toLocaleTimeString(),
          source,
        });
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : copy.errors.sendFailed);
      } finally {
        setIsSending(false);
      }
    },
    [copy.errors.emptyText, copy.errors.notConnected, copy.errors.sendFailed, textValue]
  );

  const handleBoardAction = useCallback(
    (action: MicrobitBoardAction) => {
      void sendCommand(action);
    },
    [sendCommand]
  );

  const handleAliceCommand = useCallback(
    (uartCommand: MicrobitSimpleCommand) => {
      void sendCommand(uartCommand, 'alice');
    },
    [sendCommand]
  );

  const handleAliceCommandWhileDisconnected = useCallback(
    (uartCommand: MicrobitSimpleCommand) => {
      setErrorMessage(`${copy.errors.bridgeNotConnected} (${formatCommand(uartCommand).trim()})`);
    },
    [copy.errors.bridgeNotConnected]
  );

  const isDeviceConnected = useCallback(() => Boolean(transportRef.current?.isConnected()), []);

  const bridgeStatus = useMicrobitBridge({
    onCommand: handleAliceCommand,
    onCommandWhileDisconnected: handleAliceCommandWhileDisconnected,
    isDeviceConnected,
  });

  const bridgeStatusLabel =
    bridgeStatus === 'listening'
      ? copy.bridge.listening
      : bridgeStatus === 'connecting'
        ? copy.bridge.connecting
        : bridgeStatus === 'offline'
          ? copy.bridge.offline
          : copy.bridge.disabled;

  const bridgeStatusColor =
    bridgeStatus === 'listening'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : bridgeStatus === 'connecting'
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        : bridgeStatus === 'offline'
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

  const statusLabel =
    status === MicrobitConnectionStatus.Connected
      ? copy.status.connected
      : status === MicrobitConnectionStatus.Connecting
        ? copy.status.connecting
        : status === MicrobitConnectionStatus.Error
          ? copy.status.error
          : copy.status.disconnected;

  const statusColor =
    status === MicrobitConnectionStatus.Connected
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : status === MicrobitConnectionStatus.Connecting
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        : status === MicrobitConnectionStatus.Error
          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-teal-600 dark:text-teal-400">
              <Cpu className="w-6 h-6" aria-hidden />
            </div>
            <h1 className="text-3xl font-bold" id="main-content">
              {copy.title}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">{copy.description}</p>

          <div
            role="alert"
            className="mb-8 rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40 p-5"
          >
            <div className="flex gap-3">
              <AlertCircle
                className="w-5 h-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5"
                aria-hidden
              />
              <div className="space-y-3 text-sm text-amber-950 dark:text-amber-100">
                <h2 className="font-semibold text-base">{copy.protocolAlert.title}</h2>
                <p>{copy.protocolAlert.intro}</p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-xs sm:text-sm">
                  {copy.protocolAlert.commands.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <p className="font-medium">{copy.protocolAlert.firmwareExampleLabel}</p>
                  <CodeBlock language="typescript" code={MICROBIT_MAKECODE_FIRMWARE_EXAMPLE} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr] items-start">
            <section className="space-y-4">
              <MicrobitBoard
                connected={status === MicrobitConnectionStatus.Connected}
                onAction={handleBoardAction}
                labels={{
                  buttonA: copy.board.buttonA,
                  buttonB: copy.board.buttonB,
                  reset: copy.board.reset,
                  display: copy.board.display,
                  speaker: copy.board.speaker,
                  logo: copy.board.logo,
                  disconnectedHint: copy.board.disconnectedHint,
                }}
              />

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {copy.connectionLabel}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                  >
                    {statusLabel}
                    {status === MicrobitConnectionStatus.Connecting && (
                      <Loader2 className="w-3 h-3 ml-1 animate-spin" aria-hidden />
                    )}
                  </span>
                </div>

                {method && status === MicrobitConnectionStatus.Connected && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {method === MicrobitConnectionMethod.Bluetooth
                      ? copy.viaBluetooth
                      : copy.viaUsb}
                  </p>
                )}

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => void connect(MicrobitConnectionMethod.Bluetooth)}
                    disabled={
                      !bluetoothSupported ||
                      status === MicrobitConnectionStatus.Connecting ||
                      status === MicrobitConnectionStatus.Connected
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                  >
                    <Bluetooth className="w-4 h-4" aria-hidden />
                    {copy.connectBluetooth}
                  </button>

                  <button
                    type="button"
                    onClick={() => void connect(MicrobitConnectionMethod.Usb)}
                    disabled={
                      !usbSupported ||
                      status === MicrobitConnectionStatus.Connecting ||
                      status === MicrobitConnectionStatus.Connected
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                  >
                    <Cable className="w-4 h-4" aria-hidden />
                    {copy.connectUsb}
                  </button>

                  {status === MicrobitConnectionStatus.Connected && (
                    <button
                      type="button"
                      onClick={() => void disconnect()}
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                    >
                      <Unplug className="w-4 h-4" aria-hidden />
                      {copy.disconnect}
                    </button>
                  )}
                </div>

                {!bluetoothSupported && (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    {copy.unsupportedBluetooth}
                  </p>
                )}
                {!usbSupported && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {copy.unsupportedUsb}
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 inline-flex items-center gap-2">
                    <Radio className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden />
                    {copy.bridge.label}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bridgeStatusColor}`}
                  >
                    {bridgeStatusLabel}
                    {bridgeStatus === 'connecting' && (
                      <Loader2 className="w-3 h-3 ml-1 animate-spin" aria-hidden />
                    )}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{copy.bridge.hint}</p>
              </div>
            </section>

            <section className="space-y-6">
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30 px-4 py-3 text-sm text-red-800 dark:text-red-200"
                >
                  {errorMessage}
                </div>
              )}

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <PlugZap className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden />
                  {copy.commandsTitle}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{copy.commandsHint}</p>

                <div className="flex flex-wrap gap-2">
                  {QUICK_SIMPLE_COMMANDS.map((command) => (
                    <button
                      key={command}
                      type="button"
                      disabled={status !== MicrobitConnectionStatus.Connected || isSending}
                      onClick={() => void sendCommand(command)}
                      className="rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-sm font-mono hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      {command}
                    </button>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {copy.iconCommandsTitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_ICON_COMMANDS.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        disabled={status !== MicrobitConnectionStatus.Connected || isSending}
                        onClick={() => void sendCommand(item.command)}
                        className="rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-sm font-mono hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        ICON:{item.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {copy.textLabel}
                    </span>
                    <input
                      type="text"
                      value={textValue}
                      onChange={(event) => setTextValue(event.target.value)}
                      disabled={status !== MicrobitConnectionStatus.Connected}
                      placeholder={copy.textPlaceholder}
                      className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={
                      status !== MicrobitConnectionStatus.Connected ||
                      isSending ||
                      !textValue.trim()
                    }
                    onClick={() =>
                      void sendCommand({ type: MicrobitCommandKind.Text, text: textValue })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Send className="w-4 h-4" aria-hidden />
                    {copy.sendText}
                  </button>
                </div>

                {lastCommand && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {copy.lastCommand}:{' '}
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {lastCommand.label}
                    </span>{' '}
                    ({lastCommand.at}
                    {lastCommand.source === 'alice' ? ` · ${copy.bridge.fromAlice}` : ''})
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                <h2 className="text-lg font-semibold mb-3">{copy.requirementsTitle}</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {copy.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
