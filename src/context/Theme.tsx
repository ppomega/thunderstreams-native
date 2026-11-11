import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { darkColors, lightColors } from '../lib/theme';

type ThemeMode = 'dark' | 'light';
type ThemeContextValue = { mode: ThemeMode; colors: typeof darkColors; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue>({ mode: 'dark', colors: darkColors, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const value = useMemo(() => ({ mode, colors: mode === 'dark' ? darkColors : lightColors, toggleTheme: () => setMode((current) => current === 'dark' ? 'light' : 'dark') }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
