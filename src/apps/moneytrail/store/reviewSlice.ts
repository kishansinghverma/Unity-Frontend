import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Fetchable, WithId } from '../../../engine/models/types';
import { Routes } from '../../../engine/constant';
import { FetchableDefault } from '../../../engine/defaults';
import { fetchJson } from '../../../engine/helpers/httpHelper';
import { BankEntry, DraftEntry, PhonepeEntry } from '../engine/models/types';

interface ReviewPageState {
  bankEntries: Fetchable<WithId<BankEntry>[]>;
  phonepeEntries: Fetchable<WithId<PhonepeEntry>[]>;
  draftEntries: Fetchable<WithId<DraftEntry>[]>;
}

const initialState: ReviewPageState = {
  bankEntries: FetchableDefault,
  phonepeEntries: FetchableDefault,
  draftEntries: FetchableDefault
};

export const fetchBankEntries = createAsyncThunk<WithId<BankEntry>[]>(
  'fetch/bankEntries',
  () => fetchJson(Routes.BankStatement)
);

export const fetchPhonePeEntries = createAsyncThunk<WithId<PhonepeEntry>[]>(
  'fetch/phonePeEntries',
  () => fetchJson(Routes.PhonePeStatement)
);

export const fetchDraftEntries = createAsyncThunk<WithId<DraftEntry>[]>(
  'fetch/draftEntries',
  () => fetchJson(Routes.DraftExpenses)
);

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankEntries.pending, (state) => {
        state.bankEntries.isLoading = true;
      })
      .addCase(fetchBankEntries.fulfilled, (state, action: PayloadAction<WithId<BankEntry>[]>) => {
        state.bankEntries.contents = action.payload;
        state.bankEntries.isLoading = false;
      })
      .addCase(fetchBankEntries.rejected, (state, action) => {
        state.bankEntries.error = action.error.message ?? 'Failed to fetch Bank entries'
        state.bankEntries.isLoading = false;
      })
      .addCase(fetchPhonePeEntries.pending, (state) => {
        state.bankEntries.isLoading = true;
      })
      .addCase(fetchPhonePeEntries.fulfilled, (state, action: PayloadAction<WithId<PhonepeEntry>[]>) => {
        state.phonepeEntries.contents = action.payload;
        state.phonepeEntries.isLoading = false;
      })
      .addCase(fetchPhonePeEntries.rejected, (state, action) => {
        state.phonepeEntries.error = action.error.message || 'Failed to fetch PhonePe entries';
        state.phonepeEntries.isLoading = false;
      })
      .addCase(fetchDraftEntries.pending, (state) => {
        state.draftEntries.isLoading = true;
      })
      .addCase(fetchDraftEntries.fulfilled, (state, action: PayloadAction<WithId<DraftEntry>[]>) => {
        state.draftEntries.contents = action.payload;
        state.draftEntries.isLoading = false;
      })
      .addCase(fetchDraftEntries.rejected, (state, action) => {
        state.draftEntries.error = action.error.message || 'Failed to fetch draft entries';
        state.draftEntries.isLoading = false;
      });
  }
});