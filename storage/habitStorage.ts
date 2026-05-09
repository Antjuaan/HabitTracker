import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../constants/habits';
import { DailyRecord, Habit } from '../types/habit';

const LAST_RESET_KEY = 'last_reset';
const HISTORY_KEY = 'history';

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const habits: Habit[] = JSON.parse(stored);
    const lastReset = await AsyncStorage.getItem(LAST_RESET_KEY);
    const today = new Date().toDateString();

    if (lastReset !== today) {
      // Save yesterday's record before resetting
      if (lastReset) {
        await saveDailyRecord(lastReset, habits);
      }

      const reset = habits.map(h => ({ ...h, completed: false }));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
      await AsyncStorage.setItem(LAST_RESET_KEY, today);
      return reset;
    }

    return habits;
  } catch (e) {
    console.error('Failed to load habits', e);
    return [];
  }
};

export const saveHabits = async (habits: Habit[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    // Update today's record every time habits change
    const today = new Date().toDateString();
    await saveDailyRecord(today, habits);
  } catch (e) {
    console.error('Failed to save habits', e);
  }
};

const saveDailyRecord = async (date: string, habits: Habit[]): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    const history: DailyRecord[] = stored ? JSON.parse(stored) : [];

    const record: DailyRecord = {
      date,
      total: habits.length,
      completed: habits.filter(h => h.completed).length,
    };

    // Replace existing record for this date or add new one
    const index = history.findIndex(r => r.date === date);
    if (index >= 0) {
      history[index] = record;
    } else {
      history.push(record);
    }

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save daily record', e);
  }
};

export const loadHistory = async (): Promise<DailyRecord[]> => {
  try {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
};