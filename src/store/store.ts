import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './slices/customerSlice';
import appReducer from './slices/appSlice';

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;