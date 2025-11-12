import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { ColorPalette, darkColors, lightColors, setCurrentColors } from '../constants/colors';

export type ThemeName = 'dark' | 'light';

interface ThemeContextValue {
  theme: ThemeName;
  colors: ColorPalette;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  initialTheme?: ThemeName;
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ initialTheme = 'light', children }) => {
  const [theme, setTheme] = useState<ThemeName>(initialTheme);

  const palette = useMemo(() => (theme === 'dark' ? darkColors : lightColors), [theme]);

  useEffect(() => {
    setCurrentColors(palette);

    if (Platform.OS !== 'android') {
      return;
    }

    const applyNavigationBarStyle = async () => {
      try {
        await NavigationBar.setBackgroundColorAsync(palette.white);
        await NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
      } catch (error) {
        console.warn('Failed to update navigation bar appearance', error);
      }
    };

    void applyNavigationBarStyle();
  }, [palette, theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    colors: palette,
    setTheme,
    toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
  }), [palette, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
