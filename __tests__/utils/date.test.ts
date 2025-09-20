import { formatDate } from '@/utils/date';

describe('Date Utils', () => {
  it('formats date correctly', () => {
    const date = new Date('2023-12-25');
    const formatted = formatDate(date);
    expect(formatted).toBe('25.12.2023');
  });

  it('handles different date formats', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-06-15');
    const date3 = new Date('2023-12-31');

    expect(formatDate(date1)).toBe('01.01.2023');
    expect(formatDate(date2)).toBe('15.06.2023');
    expect(formatDate(date3)).toBe('31.12.2023');
  });

  it('handles invalid dates gracefully', () => {
    const invalidDate = new Date('invalid');
    expect(() => formatDate(invalidDate)).toThrow();
  });
});
