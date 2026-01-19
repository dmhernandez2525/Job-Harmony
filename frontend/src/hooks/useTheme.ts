import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../types';

const THEME_STORAGE_KEY = 'novium-theme';

/**
 * Hook to manage theme (light/dark mode)
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to get theme from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Update the resolved theme based on system preference or stored preference
  const updateResolvedTheme = useCallback(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    updateResolvedTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, updateResolvedTheme]);

  // Apply class to document element
  useEffect(() => {
    const root = window.document.documentElement;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  // Set theme and persist to localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark'
  };
}

export default useTheme;
