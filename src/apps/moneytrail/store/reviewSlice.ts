import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Routes } from '../../../engine/constant';
import { WithId } from '../../../engine/models/types';
import { BankEntry, DraftEntry, PhonePeEntry, SplitwiseGroupsResponse, SplitwiseCategoriesResponse } from '../engine/models/types';

const initialState: {

} = {

};

export const reviewApi = createApi({
  reducerPath: 'review/fetch',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    bankEntry: builder.query<WithId<BankEntry>[], void>({ query: () => Routes.BankStatement }),
    phonePeEntry: builder.query<WithId<PhonePeEntry>[], void>({ query: () => Routes.PhonePeStatement }),
    draftEntry: builder.query<WithId<DraftEntry>[], void>({ query: () => Routes.DraftExpenses }),
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
  usePhonePeEntryQuery,
  useDraftEntryQuery,
  useDescriptionsQuery,
  useGroupsQuery,
  useCategoriesQuery
} = reviewApi;