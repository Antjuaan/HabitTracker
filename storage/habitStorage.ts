import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../constants/habits';
import { Habit } from '../types/habit';

const LAST_RESET_KEY = 'last_reset';

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const habits: Habit[] = JSON.parse(stored);
    const lastReset = await AsyncStorage.getItem(LAST_RESET_KEY);
    const today = new Date().toDateString();

    // await AsyncStorage.setItem(LAST_RESET_KEY, 'yesterday');
    // Reset habits if it's a new day
    if (lastReset !== today) {
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
  } catch (e) {
    console.error('Failed to save habits', e);
  }
};