import { DailyRecord } from '../types/habit';

export const getTodayRecord = (history: DailyRecord[]): DailyRecord | null => {
  const today = new Date().toDateString();
  return history.find(r => r.date === today) || null;
};

export const getStreak = (history: DailyRecord[]): number => {
  if (history.length === 0) return 0;

  // Sort by date descending
  const sorted = [...history].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < sorted.length; i++) {
    const recordDate = new Date(sorted[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    const isSameDay = recordDate.toDateString() === expectedDate.toDateString();
    const hasCompleted = sorted[i].completed > 0;

    if (isSameDay && hasCompleted) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const getLast7Days = (history: DailyRecord[]): DailyRecord[] => {
  const result: DailyRecord[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toDateString();
    const record = history.find(r => r.date === dateStr);
    result.push(record || { date: dateStr, total: 0, completed: 0 });
  }

  return result;
};

export const getBestDay = (history: DailyRecord[]): DailyRecord | null => {
  if (history.length === 0) return null;
  return history.reduce((best, current) => {
    const bestPct = best.total > 0 ? best.completed / best.total : 0;
    const currentPct = current.total > 0 ? current.completed / current.total : 0;
    return currentPct > bestPct ? current : best;
  });
};

export const getDailyAverage = (history: DailyRecord[]): number => {
  if (history.length === 0) return 0;
  const total = history.reduce((sum, r) => sum + r.completed, 0);
  return Math.round((total / history.length) * 10) / 10;
};