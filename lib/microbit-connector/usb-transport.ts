import {
  encodeCommand,
  MICROBIT_DAP_UART_WRITE,
  MICROBIT_UART_BAUD_RATE,
  MICROBIT_USB_PRODUCT_ID,
  MICROBIT_USB_VENDOR_ID,
  type MicrobitProtocolCommand,
} from './protocol';
import {
  MicrobitConnectionError,
  MicrobitConnectionErrorCode,
  MicrobitConnectionMethod,
  type MicrobitTransport,
} from './types';

type SerialPortLike = {
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
};

type SerialLike = {
  requestPort(options?: {
    filters?: Array<{ usbVendorId?: number; usbProductId?: number }>;
  }): Promise<SerialPortLike>;
};

type USBDeviceLike = {
  opened: boolean;
  configuration: { interfaces: Array<{ interfaceNumber: number; alternates: unknown[] }> } | null;
  open(): Promise<void>;
  close(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
  transferOut(endpointNumber: number, data: BufferSource): Promise<{ status: string }>;
};

type USBLike = {
  requestDevice(options: {
    filters: Array<{ vendorId: number; productId: number }>;
  }): Promise<USBDeviceLike>;
};

type UsbTransportMode = 'serial' | 'webusb';

function getSerial(): SerialLike | undefined {
  return (navigator as Navigator & { serial?: SerialLike }).serial;
}

function getUsb(): USBLike | undefined {
  return (navigator as Navigator & { usb?: USBLike }).usb;
}

export class UsbMicrobitTransport implements MicrobitTransport {
  readonly method = MicrobitConnectionMethod.Usb;

  private serialPort: SerialPortLike | null = null;
  private serialWriter: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private usbDevice: USBDeviceLike | null = null;
  private usbMode: UsbTransportMode | null = null;

  static isSerialSupported(): boolean {
    return typeof navigator !== 'undefined' && Boolean(getSerial());
  }

  static isWebUsbSupported(): boolean {
    return typeof navigator !== 'undefined' && Boolean(getUsb());
  }

  static isSupported(): boolean {
    return UsbMicrobitTransport.isSerialSupported() || UsbMicrobitTransport.isWebUsbSupported();
  }

  async connect(): Promise<void> {
    if (UsbMicrobitTransport.isSerialSupported()) {
      await this.connectViaSerial();
      return;
    }

    if (UsbMicrobitTransport.isWebUsbSupported()) {
      await this.connectViaWebUsb();
      return;
    }

    throw new MicrobitConnectionError(
      'Web USB / Web Serial is not supported',
      MicrobitConnectionErrorCode.Unsupported
    );
  }

  /** UART напрямую: браузер открывает виртуальный COM-порт и пишет текстовые команды. */
  private async connectViaSerial(): Promise<void> {
    const serial = getSerial();
    if (!serial) {
      throw new MicrobitConnectionError(
        'Web Serial is not supported',
        MicrobitConnectionErrorCode.Unsupported
      );
    }

    try {
      const port = await serial.requestPort({
        filters: [{ usbVendorId: MICROBIT_USB_VENDOR_ID, usbProductId: MICROBIT_USB_PRODUCT_ID }],
      });

      await port.open({ baudRate: MICROBIT_UART_BAUD_RATE });

      if (!port.writable) {
        throw new MicrobitConnectionError(
          'Serial port is not writable',
          MicrobitConnectionErrorCode.Unknown
        );
      }

      this.serialPort = port;
      this.serialWriter = port.writable.getWriter();
      this.usbMode = 'serial';
    } catch (error) {
      this.throwNormalizedConnectionError(error, 'USB serial connection failed');
    }
  }

  /** UART через DAP: команды упаковываются в CMSIS-DAP-пакет и уходят по WebUSB. */
  private async connectViaWebUsb(): Promise<void> {
    const usb = getUsb();
    if (!usb) {
      throw new MicrobitConnectionError(
        'WebUSB is not supported',
        MicrobitConnectionErrorCode.Unsupported
      );
    }

    try {
      const device = await usb.requestDevice({
        filters: [{ vendorId: MICROBIT_USB_VENDOR_ID, productId: MICROBIT_USB_PRODUCT_ID }],
      });

      await device.open();

      if (!device.configuration) {
        await device.selectConfiguration(1);
      }

      const iface = device.configuration?.interfaces[0];
      if (!iface) {
        throw new MicrobitConnectionError(
          'USB interface not found',
          MicrobitConnectionErrorCode.Unknown
        );
      }

      await device.claimInterface(iface.interfaceNumber);

      this.usbDevice = device;
      this.usbMode = 'webusb';
    } catch (error) {
      this.throwNormalizedConnectionError(error, 'WebUSB connection failed');
    }
  }

  private throwNormalizedConnectionError(error: unknown, fallbackMessage: string): never {
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
      error instanceof Error ? error.message : fallbackMessage,
      MicrobitConnectionErrorCode.Unknown
    );
  }

  async disconnect(): Promise<void> {
    if (this.serialWriter) {
      try {
        await this.serialWriter.close();
      } catch {
        // ignore close errors
      }
      this.serialWriter = null;
    }

    if (this.serialPort) {
      try {
        await this.serialPort.close();
      } catch {
        // ignore close errors
      }
      this.serialPort = null;
    }

    if (this.usbDevice?.opened) {
      try {
        await this.usbDevice.close();
      } catch {
        // ignore close errors
      }
    }

    this.usbDevice = null;
    this.usbMode = null;
  }

  isConnected(): boolean {
    if (this.usbMode === 'serial') {
      return Boolean(this.serialWriter);
    }

    if (this.usbMode === 'webusb') {
      return Boolean(this.usbDevice?.opened);
    }

    return false;
  }

  /**
   * DAP-пакет для UART:
   * [код команды][длина LSB][длина MSB][полезная нагрузка UART].
   */
  private buildDapUartPacket(payload: Uint8Array): Uint8Array {
    const packet = new Uint8Array(3 + payload.length);
    packet[0] = MICROBIT_DAP_UART_WRITE;
    packet[1] = payload.length & 0xff;
    packet[2] = (payload.length >> 8) & 0xff;
    packet.set(payload, 3);
    return packet;
  }

  async send(command: MicrobitProtocolCommand): Promise<void> {
    if (!this.isConnected()) {
      throw new MicrobitConnectionError(
        'Not connected to micro:bit',
        MicrobitConnectionErrorCode.NotConnected
      );
    }

    const payload = new Uint8Array(encodeCommand(command));

    try {
      if (this.usbMode === 'serial' && this.serialWriter) {
        await this.serialWriter.write(payload);
        return;
      }

      if (this.usbMode === 'webusb' && this.usbDevice) {
        const packet = this.buildDapUartPacket(payload);
        const transferData = packet.buffer.slice(
          packet.byteOffset,
          packet.byteOffset + packet.byteLength
        ) as ArrayBuffer;
        const result = await this.usbDevice.transferOut(1, transferData);
        if (result.status !== 'ok') {
          throw new MicrobitConnectionError(
            'WebUSB transfer failed',
            MicrobitConnectionErrorCode.TransferFailed
          );
        }
        return;
      }

      throw new MicrobitConnectionError(
        'Not connected to micro:bit',
        MicrobitConnectionErrorCode.NotConnected
      );
    } catch (error) {
      if (error instanceof MicrobitConnectionError) {
        throw error;
      }

      throw new MicrobitConnectionError(
        error instanceof Error ? error.message : 'Failed to send command',
        MicrobitConnectionErrorCode.TransferFailed
      );
    }
  }
}
