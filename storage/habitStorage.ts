import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../constants/habits';
import { Habit } from '../types/habit';

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
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