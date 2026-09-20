import { act, render, screen } from '../utils/test-utils';
import TypingReplaceOnce from '@/components/typing-replace-once';

jest.mock('@/lib/use-animation-preferences', () => ({
  useAnimationPreferences: () => ({
    shouldAnimate: true,
    detectionComplete: true,
    prefersReducedMotion: false,
    isLowEndDevice: false,
    isSlowConnection: false,
  }),
}));

function getTypedText(): string {
  const wrap = document.querySelector('.wrap');
  return wrap?.textContent ?? '';
}

function advanceUntil(target: string, stepMs: number, maxSteps = 80) {
  for (let i = 0; i < maxSteps; i += 1) {
    if (getTypedText() === target) return;
    act(() => {
      jest.advanceTimersByTime(stepMs);
    });
  }
  throw new Error(`Timed out waiting for "${target}", got "${getTypedText()}"`);
}

describe('TypingReplaceOnce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('types the mistake, backspaces it, then types the final word once', () => {
    const prefix = 'Делаю веб для ';
    const wrongWord = 'машин';
    const finalWord = 'людей';
    const onComplete = jest.fn();

    render(
      <TypingReplaceOnce
        prefix={prefix}
        wrongWord={wrongWord}
        finalWord={finalWord}
        typingSpeedMs={50}
        deletingSpeedMs={40}
        pauseAfterMistakeMs={100}
        onComplete={onComplete}
      />
    );

    const mistakeText = `${prefix}${wrongWord}`;
    const finalText = `${prefix}${finalWord}`;

    act(() => {
      jest.advanceTimersByTime(120);
    });

    advanceUntil(mistakeText, 50);
    expect(getTypedText()).toBe(mistakeText);

    act(() => {
      jest.advanceTimersByTime(100);
    });
    advanceUntil(prefix, 40);
    expect(getTypedText()).toBe(prefix);

    advanceUntil(finalText, 50);
    expect(getTypedText()).toBe(finalText);
    expect(screen.getByText(finalText)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(getTypedText()).toBe(finalText);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
