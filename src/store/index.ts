import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import customersReducer from './slices/customersSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    customers: customersReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
