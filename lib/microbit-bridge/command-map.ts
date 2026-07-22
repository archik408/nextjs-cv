import { MicrobitSimpleCommand } from '@/lib/microbit-connector/protocol';
import type { MicrobitCommand } from '@/lib/yandex-hub/types';

/**
 * Maps Alice skill semantic commands to UART protocol lines for micro:bit.
 * smile → SMILE, sound → BEEP, sad → SAD
 */
export function mapAliceCommandToUart(command: MicrobitCommand): MicrobitSimpleCommand {
  switch (command) {
    case 'smile':
      return MicrobitSimpleCommand.Smile;
    case 'sound':
      return MicrobitSimpleCommand.Beep;
    case 'sad':
      return MicrobitSimpleCommand.Sad;
  }
}

export function isAliceMicrobitCommand(value: unknown): value is MicrobitCommand {
  return value === 'smile' || value === 'sound' || value === 'sad';
}
