import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { moneyTrailReducer } from '../apps/moneytrail/store';
import { reviewApi } from '../apps/moneytrail/store/reviewSlice';
import appReducer from './slices/appSlice';
import customersReducer from './slices/customersSlice';

const combinedReducers = combineSlices(
  { app: appReducer },
  { customer: customersReducer },
  ...moneyTrailReducer
)

export const store = configureStore({
  reducer: combinedReducers,
  middleware: (getDefault) => getDefault().concat(reviewApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
