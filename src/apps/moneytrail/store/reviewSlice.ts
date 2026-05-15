import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Routes } from '../../../engine/constant';
import { WithId } from '../../../engine/models/types';
import { BankEntry, PaymentAppEntry, DraftEntry, SplitwiseGroupsResponse, SplitwiseCategoriesResponse } from '../pages/review/engine/contracts/models';

const initialState: {

} = {

};

export const reviewApi = createApi({
  reducerPath: 'review/fetch',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    bankEntry: builder.query<WithId<BankEntry>[], void>({ query: () => Routes.BankStatement }),
    paymentAppEntry: builder.query<WithId<PaymentAppEntry>[], void>({ query: () => Routes.PaymentAppStatement }),
    draftEntry: builder.query<WithId<DraftEntry>[], void>({ query: () => Routes.DraftExpenses }),
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
  useBankEntryQuery,
  usePaymentAppEntryQuery,
  useDraftEntryQuery,
  useExpensePredictionsQuery,
  useDescriptionsQuery,
  useGroupsQuery,
  useCategoriesQuery
} = reviewApi;
