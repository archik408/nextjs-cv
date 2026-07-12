/** Простые UART-команды: одна строка без аргументов (например `SMILE\n`). */
export enum MicrobitSimpleCommand {
  Smile = 'SMILE',
  Logo = 'LOGO',
  Sad = 'SAD',
  Clear = 'CLEAR',
  Heart = 'HEART',
  Yes = 'YES',
  No = 'NO',
  Beep = 'BEEP',
  Ping = 'PING',
  ButtonA = 'BTN_A',
  ButtonB = 'BTN_B',
}

/** Имена встроенных иконок для команды `ICON:<name>\n`. */
export enum MicrobitIconName {
  Happy = 'happy',
  Sad = 'sad',
  Heart = 'heart',
  Yes = 'yes',
  No = 'no',
  Surprised = 'surprised',
  Asleep = 'asleep',
  ArrowUp = 'arrow_up',
  ArrowDown = 'arrow_down',
  ArrowLeft = 'arrow_left',
  ArrowRight = 'arrow_right',
}

/** Типы составных UART-команд с параметрами. */
export enum MicrobitCommandKind {
  Text = 'TEXT',
  Icon = 'ICON',
}

/** Действие на SVG-плате: запросить текст у пользователя перед отправкой. */
export enum MicrobitBoardActionKind {
  TextPrompt = 'TEXT_PROMPT',
}

export type MicrobitTextCommand = {
  type: MicrobitCommandKind.Text;
  text: string;
};

export type MicrobitIconCommand = {
  type: MicrobitCommandKind.Icon;
  name: MicrobitIconName;
};

/** Команда, которую браузер кодирует и отправляет на micro:bit по UART. */
export type MicrobitProtocolCommand =
  | MicrobitSimpleCommand
  | MicrobitTextCommand
  | MicrobitIconCommand;

export type MicrobitBoardAction =
  | MicrobitProtocolCommand
  | { type: MicrobitBoardActionKind.TextPrompt };

/**
 * GATT-сервис Nordic UART (NUS) на micro:bit.
 * Появляется после `bluetooth.startUartService()` в прошивке.
 */
export const MICROBIT_UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';

/**
 * GATT RX с точки зрения браузера: сюда пишем байты (команды на плату).
 * На схеме Nordic это «NUS RX», UUID заканчивается на `...003`.
 */
export const MICROBIT_UART_RX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

/**
 * GATT TX с точки зрения браузера: отсюда читаем ответы с платы.
 * На схеме Nordic это «NUS TX», UUID заканчивается на `...002`.
 */
export const MICROBIT_UART_TX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

/** USB Vendor ID Micro:bit Educational Foundation (для фильтра Web Serial / WebUSB). */
export const MICROBIT_USB_VENDOR_ID = 0x0d28;

/** USB Product ID стандартной платы BBC micro:bit. */
export const MICROBIT_USB_PRODUCT_ID = 0x0204;

/** Скорость UART при открытии виртуального COM-порта через Web Serial. */
export const MICROBIT_UART_BAUD_RATE = 115200;

/** Код CMSIS-DAP: «записать полезную нагрузку в UART» (обёртка для WebUSB). */
export const MICROBIT_DAP_UART_WRITE = 0x83;

/** Префикс BLE-имени платы в диалоге выбора устройства. */
export const MICROBIT_BLUETOOTH_NAME_PREFIX = 'BBC micro:bit';

const COMMAND_LINE_SUFFIX = '\n';
const TEXT_COMMAND_PREFIX = `${MicrobitCommandKind.Text}:`;
const ICON_COMMAND_PREFIX = `${MicrobitCommandKind.Icon}:`;

/** Пример прошивки MakeCode: слушатель UART-команд (одна строка = одна команда). */
export const MICROBIT_MAKECODE_FIRMWARE_EXAMPLE = `bluetooth.startUartService()
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
  let cmd = serial.readUntil(serial.delimiters(Delimiters.NewLine))
  if (cmd == "SMILE") { basic.showIcon(IconNames.Happy) }
  else if (cmd == "LOGO") { basic.showIcon(IconNames.Yes) }
  else if (cmd == "CLEAR") { basic.clearScreen() }
  else if (cmd.substr(0, 5) == "TEXT:") { basic.showString(cmd.substr(5)) }
})`;

export const QUICK_SIMPLE_COMMANDS: MicrobitSimpleCommand[] = [
  MicrobitSimpleCommand.Smile,
  MicrobitSimpleCommand.Sad,
  MicrobitSimpleCommand.Clear,
  MicrobitSimpleCommand.Heart,
  MicrobitSimpleCommand.Yes,
  MicrobitSimpleCommand.No,
  MicrobitSimpleCommand.Beep,
  MicrobitSimpleCommand.Ping,
];

export const PROTOCOL_ICON_NAMES = Object.values(MicrobitIconName);

export const PROTOCOL_COMMAND_LINES = [
  ...Object.values(MicrobitSimpleCommand),
  `${MicrobitCommandKind.Text}:<message>`,
  `${MicrobitCommandKind.Icon}:<name>`,
] as const;

export function isSimpleCommand(
  command: MicrobitProtocolCommand
): command is MicrobitSimpleCommand {
  return Object.values(MicrobitSimpleCommand).includes(command as MicrobitSimpleCommand);
}

export function parseBoardAction(raw: string): MicrobitBoardAction | null {
  if (raw === MicrobitBoardActionKind.TextPrompt) {
    return { type: MicrobitBoardActionKind.TextPrompt };
  }

  if (isSimpleCommand(raw as MicrobitSimpleCommand)) {
    return raw as MicrobitSimpleCommand;
  }

  return null;
}

export function formatCommand(command: MicrobitProtocolCommand): string {
  if (isSimpleCommand(command)) {
    return `${command}${COMMAND_LINE_SUFFIX}`;
  }

  if (command.type === MicrobitCommandKind.Text) {
    const sanitized = command.text.replace(/[\r\n]/g, ' ').trim();
    return `${TEXT_COMMAND_PREFIX}${sanitized}${COMMAND_LINE_SUFFIX}`;
  }

  return `${ICON_COMMAND_PREFIX}${command.name}${COMMAND_LINE_SUFFIX}`;
}

export function encodeCommand(command: MicrobitProtocolCommand): Uint8Array {
  return new TextEncoder().encode(formatCommand(command));
}

export const QUICK_ICON_COMMANDS: Array<{
  name: MicrobitIconName;
  command: MicrobitProtocolCommand;
}> = [
  { name: MicrobitIconName.Happy, command: MicrobitSimpleCommand.Smile },
  { name: MicrobitIconName.Sad, command: MicrobitSimpleCommand.Sad },
  { name: MicrobitIconName.Heart, command: MicrobitSimpleCommand.Heart },
  { name: MicrobitIconName.Yes, command: MicrobitSimpleCommand.Yes },
  { name: MicrobitIconName.No, command: MicrobitSimpleCommand.No },
  {
    name: MicrobitIconName.Surprised,
    command: { type: MicrobitCommandKind.Icon, name: MicrobitIconName.Surprised },
  },
  {
    name: MicrobitIconName.Asleep,
    command: { type: MicrobitCommandKind.Icon, name: MicrobitIconName.Asleep },
  },
  {
    name: MicrobitIconName.ArrowUp,
    command: { type: MicrobitCommandKind.Icon, name: MicrobitIconName.ArrowUp },
  },
  {
    name: MicrobitIconName.ArrowDown,
    command: { type: MicrobitCommandKind.Icon, name: MicrobitIconName.ArrowDown },
  },
  {
    name: MicrobitIconName.ArrowLeft,
    command: { type: MicrobitCommandKind.Icon, name: MicrobitIconName.ArrowLeft },
  },
  {
    name: MicrobitIconName.ArrowRight,
    command: { type: MicrobitCommandKind.Icon, name: MicrobitIconName.ArrowRight },
  },
];
