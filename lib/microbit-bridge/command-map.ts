import {
  MicrobitCommandKind,
  MicrobitIconName,
  MicrobitSimpleCommand,
  type MicrobitProtocolCommand,
} from '@/lib/microbit-connector/protocol';
import {
  MICROBIT_SIMPLE_ALICE_COMMANDS,
  type MicrobitCommand,
  type MicrobitSimpleAliceCommand,
} from '@/lib/yandex-hub/types';
import { resolveIconName } from '@/lib/yandex-hub/commands';

const SIMPLE_UART_MAP: Record<MicrobitSimpleAliceCommand, MicrobitSimpleCommand> = {
  smile: MicrobitSimpleCommand.Smile,
  sound: MicrobitSimpleCommand.Beep,
  sad: MicrobitSimpleCommand.Sad,
  logo: MicrobitSimpleCommand.Logo,
  clear: MicrobitSimpleCommand.Clear,
  heart: MicrobitSimpleCommand.Heart,
  yes: MicrobitSimpleCommand.Yes,
  no: MicrobitSimpleCommand.No,
  ping: MicrobitSimpleCommand.Ping,
  btn_a: MicrobitSimpleCommand.ButtonA,
  btn_b: MicrobitSimpleCommand.ButtonB,
};

export function isSimpleAliceCommand(value: unknown): value is MicrobitSimpleAliceCommand {
  return (
    typeof value === 'string' &&
    (MICROBIT_SIMPLE_ALICE_COMMANDS as readonly string[]).includes(value)
  );
}

/**
 * Maps Alice skill semantic commands to UART protocol payloads for micro:bit.
 */
export function mapAliceCommandToUart(command: MicrobitCommand): MicrobitProtocolCommand {
  if (typeof command === 'string') {
    return SIMPLE_UART_MAP[command];
  }

  if (command.type === 'text') {
    return {
      type: MicrobitCommandKind.Text,
      text: command.text,
    };
  }

  const iconName = resolveIconName(command.name) ?? MicrobitIconName.Happy;
  return {
    type: MicrobitCommandKind.Icon,
    name: iconName,
  };
}

export function isAliceMicrobitCommand(value: unknown): value is MicrobitCommand {
  if (isSimpleAliceCommand(value)) {
    return true;
  }

  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as { type?: unknown; text?: unknown; name?: unknown };

  if (candidate.type === 'text' && typeof candidate.text === 'string' && candidate.text.trim()) {
    return true;
  }

  if (candidate.type === 'icon' && typeof candidate.name === 'string') {
    return resolveIconName(candidate.name) !== null;
  }

  return false;
}
