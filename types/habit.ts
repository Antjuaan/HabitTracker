export type Habit = {
  id: string;
  name: string;
  emoji: string;
  completed: boolean;
};

export type DailyRecord = {
  date: string;
  total: number;
  completed: number;
};