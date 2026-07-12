import type { MicrobitProtocolCommand } from './protocol';

/** Способ подключения браузера к micro:bit. */
export enum MicrobitConnectionMethod {
  Bluetooth = 'bluetooth',
  Usb = 'usb',
}

/** Состояние UI-сессии подключения. */
export enum MicrobitConnectionStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Error = 'error',
}

/** Коды ошибок транспорта для единообразной обработки в UI. */
export enum MicrobitConnectionErrorCode {
  Unsupported = 'unsupported',
  UserCancelled = 'user-cancelled',
  NotConnected = 'not-connected',
  TransferFailed = 'transfer-failed',
  Unknown = 'unknown',
}

/** Общий контракт BLE/USB-транспорта: открыть канал UART и отправить команду. */
export interface MicrobitTransport {
  readonly method: MicrobitConnectionMethod;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(command: MicrobitProtocolCommand): Promise<void>;
  isConnected(): boolean;
}

export class MicrobitConnectionError extends Error {
  constructor(
    message: string,
    public readonly code: MicrobitConnectionErrorCode
  ) {
    super(message);
    this.name = 'MicrobitConnectionError';
  }
}
