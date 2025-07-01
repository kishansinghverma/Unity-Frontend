import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import customersReducer from './slices/customersSlice';
import themeReducer from './slices/themeSlice';
import { moneyTrailReducer } from '../apps/moneytrail/store';

export const store = configureStore({
  reducer: {
    app: appReducer,
    customers: customersReducer,
    theme: themeReducer,
    moneyTrail: moneyTrailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
