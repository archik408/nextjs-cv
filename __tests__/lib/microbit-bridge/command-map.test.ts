import { mapAliceCommandToUart } from '@/lib/microbit-bridge/command-map';
import { MicrobitSimpleCommand } from '@/lib/microbit-connector/protocol';
import type { MicrobitCommand } from '@/lib/yandex-hub/types';

describe('mapAliceCommandToUart', () => {
  it.each<[MicrobitCommand, MicrobitSimpleCommand]>([
    ['smile', MicrobitSimpleCommand.Smile],
    ['sound', MicrobitSimpleCommand.Beep],
    ['sad', MicrobitSimpleCommand.Sad],
  ])('maps %s to %s', (command, expected) => {
    expect(mapAliceCommandToUart(command)).toBe(expected);
  });
});
