import {
  MicrobitCommandKind,
  MicrobitIconName,
  MicrobitSimpleCommand,
  encodeCommand,
  formatCommand,
  PROTOCOL_COMMAND_LINES,
} from '@/lib/microbit-connector/protocol';

describe('microbit connector protocol', () => {
  it('formats simple commands with trailing newline', () => {
    expect(formatCommand(MicrobitSimpleCommand.Smile)).toBe('SMILE\n');
    expect(formatCommand(MicrobitSimpleCommand.Logo)).toBe('LOGO\n');
    expect(formatCommand(MicrobitSimpleCommand.Clear)).toBe('CLEAR\n');
  });

  it('formats TEXT and ICON commands', () => {
    expect(formatCommand({ type: MicrobitCommandKind.Text, text: 'Hello' })).toBe('TEXT:Hello\n');
    expect(formatCommand({ type: MicrobitCommandKind.Icon, name: MicrobitIconName.Heart })).toBe(
      'ICON:heart\n'
    );
  });

  it('sanitizes multiline TEXT payloads', () => {
    expect(formatCommand({ type: MicrobitCommandKind.Text, text: 'Hi\nthere' })).toBe(
      'TEXT:Hi there\n'
    );
  });

  it('encodes commands as UTF-8 bytes', () => {
    const bytes = encodeCommand(MicrobitSimpleCommand.Ping);
    expect(Array.from(bytes)).toEqual([80, 73, 78, 71, 10]);
  });

  it('documents the supported command lines', () => {
    expect(PROTOCOL_COMMAND_LINES).toContain(MicrobitSimpleCommand.Smile);
    expect(PROTOCOL_COMMAND_LINES).toContain(MicrobitSimpleCommand.Logo);
    expect(PROTOCOL_COMMAND_LINES).toContain('TEXT:<message>');
  });
});
