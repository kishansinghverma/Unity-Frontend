import { combineSlices, configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import customersReducer from './slices/customersSlice';
import { moneyTrailReducer } from '../apps/moneytrail/store';
import { reviewApi } from '../apps/moneytrail/store/reviewSlice';

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
