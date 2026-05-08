import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'theme';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
};

export const lightColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  cardCompleted: '#e8f5e9',
  title: '#000000',
  subtitle: '#aaaaaa',
  text: '#000000',
  textCompleted: '#aaaaaa',
  input: '#000000',
  inputBorder: '#dddddd',
  emojiOptionBg: '#f0f0f0',
  emojiSelectedBg: '#c8e6c9',
  emojiSelectedBorder: '#4CAF50',
  btnConfirm: '#4CAF50',
  btnAdd: '#4CAF50',
  placeholder: '#aaaaaa',
};

export const darkColors: typeof lightColors = {
  background: '#121212',
  card: '#1e1e1e',
  cardCompleted: '#1b3a1f',
  title: '#ffffff',
  subtitle: '#666666',
  text: '#ffffff',
  textCompleted: '#555555',
  input: '#ffffff',
  inputBorder: '#333333',
  emojiOptionBg: '#2a2a2a',
  emojiSelectedBg: '#1b3a1f',
  emojiSelectedBorder: '#4CAF50',
  btnConfirm: '#4CAF50',
  btnAdd: '#4CAF50',
  placeholder: '#555555',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') setTheme(stored);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: theme === 'light' ? lightColors : darkColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);