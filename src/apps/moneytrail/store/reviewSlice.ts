import { createSlice } from '@reduxjs/toolkit';
import { Routes } from '../../../engine/constant';
import { BankEntry, DraftEntry, PhonepeEntry, SplitwiseGroupsResponse } from '../engine/models/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WithId } from '../../../engine/models/types';

const initialState: {

} = {

};

export const reviewApi = createApi({
  reducerPath: 'review/fetch',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    bankEntry: builder.query<WithId<BankEntry>[], void>({ query: () => Routes.BankStatement }),
    phonepeEntry: builder.query<WithId<PhonepeEntry>[], void>({ query: () => Routes.PhonePeStatement }),
    draftEntry: builder.query<WithId<DraftEntry>[], void>({ query: () => Routes.DraftExpenses }),
    descriptions: builder.query<{ value: string[] }, void>({ query: () => Routes.ExpenseDescriptions }),
    groups: builder.query<SplitwiseGroupsResponse, void>({ query: () => Routes.SplitWiseGroups }),
    categories: builder.query<any, void>({ query: () => Routes.SplitWiseCategories }),
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
  usePhonepeEntryQuery,
  useDraftEntryQuery,
  useDescriptionsQuery,
  useGroupsQuery,
  useCategoriesQuery
} = reviewApi;