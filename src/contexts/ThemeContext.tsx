import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeName =
  | 'tokyo-night'
  | 'dracula'
  | 'one-dark'
  | 'nord'
  | 'catppuccin-mocha'
  | 'gruvbox-dark'
  | 'monokai'
  | 'catppuccin-latte'
  | 'gruvbox-light'
  | 'sepia';

export interface ThemeInfo {
  id: ThemeName;
  name: string;
  category: 'dark' | 'light';
}

export const themes: ThemeInfo[] = [
  // Dark themes
  { id: 'tokyo-night', name: 'Tokyo Night', category: 'dark' },
  { id: 'dracula', name: 'Dracula', category: 'dark' },
  { id: 'one-dark', name: 'One Dark Pro', category: 'dark' },
  { id: 'nord', name: 'Nord', category: 'dark' },
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', category: 'dark' },
  { id: 'gruvbox-dark', name: 'Gruvbox Dark', category: 'dark' },
  { id: 'monokai', name: 'Monokai', category: 'dark' },
  // Light themes
  { id: 'catppuccin-latte', name: 'Catppuccin Latte', category: 'light' },
  { id: 'gruvbox-light', name: 'Gruvbox Light', category: 'light' },
  { id: 'sepia', name: 'Sepia / Paper', category: 'light' },
];

const STORAGE_KEY = 'learn-by-typing-theme';
const DEFAULT_THEME: ThemeName = 'tokyo-night';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: ThemeInfo[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): ThemeName {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && themes.some((t) => t.id === stored)) {
    return stored as ThemeName;
  }
  
  return DEFAULT_THEME;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(getInitialTheme);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply initial theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', getInitialTheme());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
