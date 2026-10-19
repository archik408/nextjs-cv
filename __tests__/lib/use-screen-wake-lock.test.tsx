import { act, renderHook } from '@testing-library/react';
import { useScreenWakeLock } from '@/lib/hooks/use-screen-wake-lock';
import { FALLBACK_VIDEO_SRC } from '@/lib/keep-screen-on';

type ReleaseListener = () => void;

function createFakeSentinel() {
  const listeners = new Map<string, ReleaseListener>();
  const sentinel = {
    released: false,
    release: jest.fn(async () => {
      sentinel.released = true;
      listeners.get('release')?.();
    }),
    addEventListener: jest.fn((type: string, listener: ReleaseListener) => {
      listeners.set(type, listener);
    }),
    removeEventListener: jest.fn(),
  };
  return sentinel;
}

function mockWakeLockRequest(implementation: () => Promise<WakeLockSentinel>) {
  const request = jest.fn(implementation);
  Object.defineProperty(navigator, 'wakeLock', {
    value: { request },
    configurable: true,
  });
  return request;
}

function removeWakeLock() {
  Reflect.deleteProperty(navigator, 'wakeLock');
}

describe('useScreenWakeLock', () => {
  let playSpy: jest.SpyInstance;

  beforeEach(() => {
    playSpy = jest.spyOn(HTMLMediaElement.prototype, 'play');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    removeWakeLock();
    document.body.innerHTML = '';
  });

  it('starts idle and reports no Wake Lock support', () => {
    const { result } = renderHook(() => useScreenWakeLock());

    expect(result.current.isWakeLockSupported).toBe(false);
    expect(result.current.isActive).toBe(false);
    expect(result.current.method).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('falls back to a hidden looping video when the API is missing', async () => {
    playSpy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useScreenWakeLock());

    await act(async () => {
      await result.current.activate();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.method).toBe('video-fallback');
    expect(result.current.error).toBeNull();

    const video = document.querySelector('video');
    expect(video).not.toBeNull();
    expect(video?.getAttribute('src')).toBe(FALLBACK_VIDEO_SRC);
    expect(video?.muted).toBe(true);
    expect(video?.loop).toBe(true);
    expect(video?.getAttribute('aria-hidden')).toBe('true');
    expect(document.body.contains(video)).toBe(true);
  });

  it('removes the fallback video on deactivate', async () => {
    playSpy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useScreenWakeLock());

    await act(async () => {
      await result.current.activate();
    });
    act(() => {
      result.current.deactivate();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.method).toBeNull();
    expect(document.querySelector('video')).toBeNull();
  });

  it('uses the Wake Lock API when available', async () => {
    const sentinels = [createFakeSentinel()];
    const request = mockWakeLockRequest(async () => sentinels[0] as unknown as WakeLockSentinel);
    const { result } = renderHook(() => useScreenWakeLock());

    expect(result.current.isWakeLockSupported).toBe(true);

    await act(async () => {
      await result.current.activate();
    });

    expect(request).toHaveBeenCalledTimes(1);
    expect(result.current.isActive).toBe(true);
    expect(result.current.method).toBe('wake-lock');
    expect(result.current.error).toBeNull();
    expect(document.querySelector('video')).toBeNull();

    await act(async () => {
      result.current.deactivate();
    });

    expect(sentinels[0].release).toHaveBeenCalledTimes(1);
    expect(result.current.method).toBeNull();
  });

  it('marks the lock suspended and re-acquires it on visibilitychange', async () => {
    const sentinels: ReturnType<typeof createFakeSentinel>[] = [];
    const request = mockWakeLockRequest(async () => {
      const sentinel = createFakeSentinel();
      sentinels.push(sentinel);
      return sentinel as unknown as WakeLockSentinel;
    });
    const { result } = renderHook(() => useScreenWakeLock());

    await act(async () => {
      await result.current.activate();
    });

    // Simulate the browser releasing the lock because the tab was hidden.
    const releaseListener = sentinels[0].addEventListener.mock.calls[0][1] as ReleaseListener;
    act(() => {
      releaseListener();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.isSuspended).toBe(true);
    expect(result.current.method).toBeNull();

    // Returning to the tab re-acquires the lock.
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(request).toHaveBeenCalledTimes(2);
    expect(result.current.isSuspended).toBe(false);
    expect(result.current.method).toBe('wake-lock');
  });

  it('falls back to video when the wake lock request is rejected', async () => {
    mockWakeLockRequest(async () => {
      throw new Error('NotAllowedError');
    });
    playSpy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useScreenWakeLock());

    await act(async () => {
      await result.current.activate();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.method).toBe('video-fallback');
    expect(result.current.error).toBeNull();
  });

  it('reports request-failed when both mechanisms fail', async () => {
    mockWakeLockRequest(async () => {
      throw new Error('NotAllowedError');
    });
    playSpy.mockRejectedValue(new Error('NotAllowedError'));
    const { result } = renderHook(() => useScreenWakeLock());

    await act(async () => {
      await result.current.activate();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.error).toBe('request-failed');
    expect(document.querySelector('video')).toBeNull();
  });

  it('reports autoplay-blocked when only the fallback fails', async () => {
    playSpy.mockRejectedValue(new Error('NotAllowedError'));
    const { result } = renderHook(() => useScreenWakeLock());

    await act(async () => {
      await result.current.activate();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.error).toBe('autoplay-blocked');
    expect(document.querySelector('video')).toBeNull();
  });

  it('cleans up the video on unmount', async () => {
    playSpy.mockResolvedValue(undefined);
    const { result, unmount } = renderHook(() => useScreenWakeLock());

    await act(async () => {
      await result.current.activate();
    });
    unmount();

    expect(document.querySelector('video')).toBeNull();
  });
});
