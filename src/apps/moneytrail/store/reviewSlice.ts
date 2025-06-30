import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Fetchable, WithId } from '../../../commons/types';
import { Routes } from '../../../constants/constant';
import { FetchJson, handleError, handleJsonResponse } from '../../../commons/httpHelper';
import { FetchableDefault } from '../../../commons/defaults';
import { BankEntry, PhonepeEntry } from '../commons/types';

// Types for draft entries (replace with actual type if available)
type DraftEntry = any;

interface MoneytrailState {
  bankEntries: Fetchable<WithId<BankEntry>[]>;
  phonepeEntries: Fetchable<WithId<PhonepeEntry>[]>;
  draftEntries: DraftEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: MoneytrailState = {
  bankEntries: FetchableDefault,
  phonepeEntries: FetchableDefault,
  draftEntries: [],
  loading: false,
  error: null,
};


export const fetchBankEntries = createAsyncThunk<WithId<BankEntry>[]>(
  'moneytrail/fetchBankEntries',
  () => FetchJson(Routes.BankStatement)
);

export const fetchPhonePeEntries = createAsyncThunk<WithId<PhonepeEntry>[]>(
  'moneytrail/fetchPhonePeEntries',
  ()=> FetchJson(Routes.PhonePeStatement)
);

export const fetchDraftEntries = createAsyncThunk<DraftEntry[]>(
  'moneytrail/fetchDraftEntries',
  async () => {
    // Replace with actual API call
    const response = await fetch('/api/draft-entries');
    if (!response.ok) throw new Error('Failed to fetch draft entries');
    return response.json();
  }
);

const reviewSlice = createSlice({
  name: 'moneytrail',
  initialState,
  reducers: {},
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
        state.bankEntries.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch Bank entries'
      })
      .addCase(fetchPhonePeEntries.pending, (state) => {
        state.bankEntries.isLoading = true;
      })
      .addCase(fetchPhonePeEntries.fulfilled, (state, action: PayloadAction<WithId<PhonepeEntry>[]>) => {
        state.phonepeEntries.contents = action.payload;
        state.phonepeEntries.isLoading = false;
      })
      .addCase(fetchPhonePeEntries.rejected, (state, action) => {
        state.phonepeEntries.isLoading = false;
        state.phonepeEntries.error = action.error.message || 'Failed to fetch PhonePe entries';
      })
      .addCase(fetchDraftEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftEntries.fulfilled, (state, action: PayloadAction<DraftEntry[]>) => {
        state.draftEntries = action.payload;
        state.loading = false;
      })
      .addCase(fetchDraftEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch draft entries';
      });
  },
});

export default reviewSlice.reducer;
