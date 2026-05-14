import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { APPS } from '../../constants/apps';
import { AppInfo } from '../../types';

interface AppState {
  currentApp: AppInfo | null;
  availableApps: AppInfo[];
}

const initialState: AppState = {
  currentApp: (() => {
    const path = window.location.pathname;
    return APPS.find(app => path.startsWith(`/${app.id}`)) || null;
  })(),
  availableApps: APPS,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentApp: (state, action: PayloadAction<AppInfo>) => {
      state.currentApp = action.payload;
    },
  },
});

// Export actions
export const { setCurrentApp } = appSlice.actions;

// Export selectors
export const selectCurrentApp = (state: RootState) => state.app.currentApp;
export const selectAvailableApps = (state: RootState) => state.app.availableApps;

export default appSlice.reducer;
