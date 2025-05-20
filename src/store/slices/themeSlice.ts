import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

interface ThemeState {
  mode: 'light' | 'dark';
}

// Check if user has a theme preference in localStorage or prefers dark color scheme
const getUserThemePreference = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme as 'light' | 'dark';
    }
    
    // Check user's color scheme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  return 'light'; // Default to light mode
};

const initialState: ThemeState = {
  mode: getUserThemePreference(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode);
      }
    },
  },
});

// Export actions
export const { setTheme, toggleTheme } = themeSlice.actions;

// Export selectors
export const selectTheme = (state: RootState) => state.theme.mode;

export default themeSlice.reducer; 