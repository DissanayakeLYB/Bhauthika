import { describe, expect, it } from 'vitest';
import { calculateStreak } from './streak';

const summary = (activeDays: string[], today = '2024-03-01') =>
  calculateStreak(activeDays, today);

describe('calculateStreak', () => {
  it('handles no data', () => {
    const result = summary([]);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.week.every((day) => !day.active)).toBe(true);
  });

  it('handles today only', () => {
    const result = summary(['2024-03-01']);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
    expect(result.todayActive).toBe(true);
  });

  it('keeps yesterday alive until today is active', () => {
    const result = summary(['2024-02-29']);
    expect(result.currentStreak).toBe(1);
    expect(result.todayActive).toBe(false);
  });

  it('breaks a current run across a one-day gap', () => {
    const result = summary(['2024-02-28', '2024-03-01']);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it('finds a long run', () => {
    const result = summary(['2024-02-26', '2024-02-27', '2024-02-28', '2024-02-29', '2024-03-01']);
    expect(result.currentStreak).toBe(5);
    expect(result.longestStreak).toBe(5);
  });

  it('finds the longest of two runs', () => {
    const result = summary(['2024-02-20', '2024-02-21', '2024-02-25', '2024-02-26', '2024-02-27']);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(3);
  });

  it('handles month and year boundaries', () => {
    const result = summary(['2023-12-31', '2024-01-01'], '2024-01-01');
    expect(result.currentStreak).toBe(2);
    expect(result.week[6].date).toBe('2024-01-01');
  });

  it('handles leap day', () => {
    const result = summary(['2024-02-28', '2024-02-29', '2024-03-01']);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });
});
