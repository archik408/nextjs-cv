describe('dispatchMicrobitCommand', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.PUSHER_APP_ID;
    delete process.env.PUSHER_KEY;
    delete process.env.PUSHER_SECRET;
    delete process.env.PUSHER_CLUSTER;
    delete process.env.MICROBIT_BRIDGE_URL;
    delete process.env.MICROBIT_BRIDGE_SECRET;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns queued when no Pusher and no HTTP bridge are configured', async () => {
    const { dispatchMicrobitCommand } = await import('@/lib/yandex-hub/bridge');
    await expect(dispatchMicrobitCommand('sad')).resolves.toBe('queued');
  });
});
