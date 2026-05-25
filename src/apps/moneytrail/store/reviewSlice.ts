import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Routes } from '../../../engine/constant';
import { WithId } from '../../../engine/models/types';
import { AppRecord, BankRecord, LocationRecord, SplitwiseCategoriesResponse, SplitwiseGroupsResponse } from '../pages/review/engine/contracts/models';

const initialState: {

} = {

};

export const reviewApi = createApi({
  reducerPath: 'review/fetch',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    bankRecord: builder.query<WithId<BankRecord>[], void>({ query: () => Routes.BankRecordStatement }),
    appRecord: builder.query<WithId<AppRecord>[], void>({ query: () => Routes.AppRecordStatement }),
    locationRecord: builder.query<WithId<LocationRecord>[], void>({ query: () => Routes.LocationRecordExpenses }),
    expensePredictions: builder.query<unknown, void>({ query: () => Routes.ExpensePredictions }),
    descriptions: builder.query<{ value: string[] }, void>({ query: () => Routes.ExpenseDescriptions }),
    groups: builder.query<SplitwiseGroupsResponse, void>({ query: () => Routes.SplitWiseGroups }),
    categories: builder.query<SplitwiseCategoriesResponse, void>({ query: () => Routes.SplitWiseCategories }),
  }),
});

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
  }
});

export const {
  useBankRecordQuery,
  useAppRecordQuery,
  useLocationRecordQuery,
  useExpensePredictionsQuery,
  useDescriptionsQuery,
  useGroupsQuery,
  useCategoriesQuery
} = reviewApi;
