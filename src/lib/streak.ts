export interface StreakDay {
  date: string;
  active: boolean;
  isToday: boolean;
}

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  todayActive: boolean;
  week: StreakDay[];
}

function parseDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Three-letter English weekday for a YYYY-MM-DD date. */
export function weekdayShort(date: string): string {
  return WEEKDAY_SHORT[parseDate(date).getDay()];
}

function addDays(date: string, amount: number): string {
  const value = parseDate(date);
  value.setDate(value.getDate() + amount);
  return localDateString(value);
}

export function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreak(activeDays: readonly string[], today: string): StreakSummary {
  const active = new Set(activeDays);
  const todayActive = active.has(today);
  const yesterdayActive = active.has(addDays(today, -1));

  let currentStreak = 0;
  if (todayActive || yesterdayActive) {
    let date = todayActive ? today : addDays(today, -1);
    while (active.has(date)) {
      currentStreak += 1;
      date = addDays(date, -1);
    }
  }

  let longestStreak = 0;
  for (const date of active) {
    if (active.has(addDays(date, -1))) continue;
    let length = 1;
    while (active.has(addDays(date, length))) length += 1;
    longestStreak = Math.max(longestStreak, length);
  }

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    return { date, active: active.has(date), isToday: date === today };
  });

  return { currentStreak, longestStreak, todayActive, week };
}
