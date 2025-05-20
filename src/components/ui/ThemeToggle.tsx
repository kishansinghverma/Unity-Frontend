import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectTheme, toggleTheme } from '../../store/slices/themeSlice';

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectTheme);
  
  // Apply theme class to document when theme changes
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);
  
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
    >
      {themeMode === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
};

export default ThemeToggle; 