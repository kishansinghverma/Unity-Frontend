import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APPS } from '../../constants/apps';
import { AppInfo } from '../../types';

interface AppState {
  currentApp: AppInfo;
  availableApps: AppInfo[];
}

const initialState: AppState = {
  currentApp: APPS[0],
  availableApps: APPS,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentApp: (state, action: PayloadAction<AppInfo>) => {
      state.currentApp = action.payload;
    },
  },
});

export const { setCurrentApp } = appSlice.actions;

export default appSlice.reducer;