import { mapAliceCommandToUart } from '@/lib/microbit-bridge/command-map';
import {
  MicrobitCommandKind,
  MicrobitIconName,
  MicrobitSimpleCommand,
} from '@/lib/microbit-connector/protocol';
import type { MicrobitCommand } from '@/lib/yandex-hub/types';

describe('mapAliceCommandToUart', () => {
  it.each<[Extract<MicrobitCommand, string>, MicrobitSimpleCommand]>([
    ['smile', MicrobitSimpleCommand.Smile],
    ['sound', MicrobitSimpleCommand.Beep],
    ['sad', MicrobitSimpleCommand.Sad],
    ['logo', MicrobitSimpleCommand.Logo],
    ['clear', MicrobitSimpleCommand.Clear],
    ['heart', MicrobitSimpleCommand.Heart],
    ['yes', MicrobitSimpleCommand.Yes],
    ['no', MicrobitSimpleCommand.No],
    ['ping', MicrobitSimpleCommand.Ping],
    ['btn_a', MicrobitSimpleCommand.ButtonA],
    ['btn_b', MicrobitSimpleCommand.ButtonB],
  ])('maps %s to %s', (command, expected) => {
    expect(mapAliceCommandToUart(command)).toBe(expected);
  });

  it('maps text command', () => {
    expect(mapAliceCommandToUart({ type: 'text', text: 'привет' })).toEqual({
      type: MicrobitCommandKind.Text,
      text: 'привет',
    });
  });

  it('maps icon command', () => {
    expect(mapAliceCommandToUart({ type: 'icon', name: 'heart' })).toEqual({
      type: MicrobitCommandKind.Icon,
      name: MicrobitIconName.Heart,
    });
  });
});
