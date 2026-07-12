import {
  encodeCommand,
  MICROBIT_BLUETOOTH_NAME_PREFIX,
  MICROBIT_UART_RX_CHARACTERISTIC_UUID,
  MICROBIT_UART_SERVICE_UUID,
  type MicrobitProtocolCommand,
} from './protocol';
import {
  MicrobitConnectionError,
  MicrobitConnectionErrorCode,
  MicrobitConnectionMethod,
  type MicrobitTransport,
} from './types';

type Bluetooth = {
  requestDevice(options: {
    filters: Array<{ namePrefix: string }>;
    optionalServices: string[];
  }): Promise<BluetoothDeviceLike>;
};

type BluetoothCharacteristic = {
  writeValue(value: BufferSource): Promise<void>;
};

/** GATT-характеристика: поле «записать/прочитать байты» внутри BLE-сервиса. */
type BluetoothRemoteGATTCharacteristic = BluetoothCharacteristic & {
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
  removeEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
  value?: DataView;
};

/** GATT-сервис: группа характеристик (у нас — Nordic UART). */
type BluetoothRemoteGATTService = {
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
};

/**
 * GATT-сервер на micro:bit.
 * Браузер подключается к нему и получает доступ к сервисам/характеристикам.
 */
type BluetoothRemoteGATTServer = {
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
};

type BluetoothDeviceLike = {
  gatt?: BluetoothRemoteGATTServer;
  addEventListener(type: 'gattserverdisconnected', listener: () => void): void;
  removeEventListener(type: 'gattserverdisconnected', listener: () => void): void;
};

export class BluetoothMicrobitTransport implements MicrobitTransport {
  readonly method = MicrobitConnectionMethod.Bluetooth;

  private device: BluetoothDeviceLike | null = null;
  /** RX в терминах браузера: канал записи команд на плату (UART поверх GATT). */
  private rxCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private onDisconnect: (() => void) | null = null;

  static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  async connect(): Promise<void> {
    if (!BluetoothMicrobitTransport.isSupported()) {
      throw new MicrobitConnectionError(
        'Web Bluetooth is not supported',
        MicrobitConnectionErrorCode.Unsupported
      );
    }

    try {
      const bluetooth = (navigator as Navigator & { bluetooth: Bluetooth }).bluetooth;
      const device = (await bluetooth.requestDevice({
        filters: [{ namePrefix: MICROBIT_BLUETOOTH_NAME_PREFIX }],
        optionalServices: [MICROBIT_UART_SERVICE_UUID],
      })) as BluetoothDeviceLike;

      const server = await device.gatt?.connect();
      if (!server) {
        throw new MicrobitConnectionError(
          'GATT server unavailable',
          MicrobitConnectionErrorCode.Unknown
        );
      }

      const service = await server.getPrimaryService(MICROBIT_UART_SERVICE_UUID);
      const rx = await service.getCharacteristic(MICROBIT_UART_RX_CHARACTERISTIC_UUID);

      this.onDisconnect = () => {
        this.rxCharacteristic = null;
        this.device = null;
      };
      device.addEventListener('gattserverdisconnected', this.onDisconnect);

      this.device = device;
      this.rxCharacteristic = rx;
    } catch (error) {
      if (error instanceof MicrobitConnectionError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'NotFoundError') {
        throw new MicrobitConnectionError(
          'Device selection cancelled',
          MicrobitConnectionErrorCode.UserCancelled
        );
      }

      throw new MicrobitConnectionError(
        error instanceof Error ? error.message : 'Bluetooth connection failed',
        MicrobitConnectionErrorCode.Unknown
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }

    if (this.device && this.onDisconnect) {
      this.device.removeEventListener('gattserverdisconnected', this.onDisconnect);
    }

    this.device = null;
    this.rxCharacteristic = null;
    this.onDisconnect = null;
  }

  isConnected(): boolean {
    return Boolean(this.device?.gatt?.connected && this.rxCharacteristic);
  }

  async send(command: MicrobitProtocolCommand): Promise<void> {
    if (!this.rxCharacteristic || !this.isConnected()) {
      throw new MicrobitConnectionError(
        'Not connected to micro:bit',
        MicrobitConnectionErrorCode.NotConnected
      );
    }

    try {
      await this.rxCharacteristic.writeValue(new Uint8Array(encodeCommand(command)));
    } catch (error) {
      throw new MicrobitConnectionError(
        error instanceof Error ? error.message : 'Failed to send command',
        MicrobitConnectionErrorCode.TransferFailed
      );
    }
  }
}
