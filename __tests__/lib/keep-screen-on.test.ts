import {
  FALLBACK_VIDEO_SRC,
  clampCustomMinutes,
  formatElapsed,
  presetToMinutes,
} from '@/lib/keep-screen-on';

describe('keep-screen-on helpers', () => {
  describe('formatElapsed', () => {
    it('formats zero as 00:00:00', () => {
      expect(formatElapsed(0)).toBe('00:00:00');
    });

    it('formats seconds below a minute', () => {
      expect(formatElapsed(59_999)).toBe('00:00:59');
    });

    it('formats hours, minutes and seconds', () => {
      expect(formatElapsed(((2 * 60 + 3) * 60 + 4) * 1000)).toBe('02:03:04');
    });

    it('clamps negative values to zero', () => {
      expect(formatElapsed(-1000)).toBe('00:00:00');
    });
  });

  describe('clampCustomMinutes', () => {
    it('keeps values inside the supported range', () => {
      expect(clampCustomMinutes(20)).toBe(20);
    });

    it('rounds to whole minutes', () => {
      expect(clampCustomMinutes(10.4)).toBe(10);
      expect(clampCustomMinutes(10.6)).toBe(11);
    });

    it('clamps below-range values to the minimum', () => {
      expect(clampCustomMinutes(0)).toBe(1);
      expect(clampCustomMinutes(-5)).toBe(1);
    });

    it('clamps above-range values to the maximum', () => {
      expect(clampCustomMinutes(2000)).toBe(1440);
    });

    it('falls back to the minimum for non-finite input', () => {
      expect(clampCustomMinutes(Number.NaN)).toBe(1);
    });
  });

  describe('presetToMinutes', () => {
    it('maps fixed presets to minutes', () => {
      expect(presetToMinutes('15m', 30)).toBe(15);
      expect(presetToMinutes('30m', 30)).toBe(30);
      expect(presetToMinutes('1h', 30)).toBe(60);
      expect(presetToMinutes('2h', 30)).toBe(120);
    });

    it('maps no-limit to null', () => {
      expect(presetToMinutes('no-limit', 30)).toBeNull();
    });

    it('clamps custom values', () => {
      expect(presetToMinutes('custom', 90)).toBe(90);
      expect(presetToMinutes('custom', 0)).toBe(1);
      expect(presetToMinutes('custom', 9999)).toBe(1440);
    });
  });

  describe('FALLBACK_VIDEO_SRC', () => {
    it('is a webm data URI', () => {
      expect(FALLBACK_VIDEO_SRC.startsWith('data:video/webm;base64,')).toBe(true);
    });

    it('carries a decodable payload', () => {
      const base64 = FALLBACK_VIDEO_SRC.slice('data:video/webm;base64,'.length);
      expect(Buffer.from(base64, 'base64').byteLength).toBeGreaterThan(1000);
    });
  });
});
