import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Theme } from '../../types';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false
}) => {
  const { theme, setTheme, isDark } = useTheme();

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as Theme);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Theme
        </span>
      )}

      {/* Simple Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-secondary-500 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-target transition-colors"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Sun Icon */}
        <svg
          className={`h-5 w-5 transition-all ${isDark ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`absolute h-5 w-5 transition-all ${isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>

      {/* Optional Theme Selector */}
      {showLabel && (
        <select
          value={theme}
          onChange={handleSelectChange}
          className="select text-sm py-1.5 w-24"
          aria-label="Select theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      )}
    </div>
  );
};

export default ThemeToggle;
