import { renderHook } from '@testing-library/react';
import { useLanguage } from '@/lib/use-language';

describe('useLanguage Hook', () => {
  it('returns language context correctly', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('en');
  });

  it('provides setLanguage function', () => {
    const { result } = renderHook(() => useLanguage());
    expect(typeof result.current.setLanguage).toBe('function');
  });

  it('provides translations object', () => {
    const { result } = renderHook(() => useLanguage());
    expect(typeof result.current.t).toBe('object');
    expect(result.current.t).toHaveProperty('role');
    expect(result.current.t).toHaveProperty('subtitle');
  });
});
