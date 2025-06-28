import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import customersReducer from './slices/customersSlice';
import themeReducer from './slices/themeSlice';
import reviewSlice from '../apps/moneytrail/store/reviewSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    customers: customersReducer,
    theme: themeReducer,
    moneytrail: reviewSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
