import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BankEntry, PhonepeEntry } from '../commons/Types';
import { WithId } from '../../../commons/types';
import { Routes } from '../../../constants/constant';
import { handleError, handleJsonResponse } from '../../../commons/httpHelper';

// Types for draft entries (replace with actual type if available)
type DraftEntry = any;

interface MoneytrailState {
  bankEntries: WithId<BankEntry>[];
  phonepeEntries: WithId<PhonepeEntry>[];
  draftEntries: DraftEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: MoneytrailState = {
  bankEntries: [],
  phonepeEntries: [],
  draftEntries: [],
  loading: false,
  error: null,
};

// Async thunks for fetching data from APIs
export const fetchBankEntries = createAsyncThunk<WithId<BankEntry>[]>(
  'moneytrail/fetchBankEntries',
  async () => {
    return await fetch(Routes.BankStatement)
    .then(handleJsonResponse)
    .catch(handleError)
  }
);

export const fetchPhonePeEntries = createAsyncThunk<WithId<PhonepeEntry>[]>(
  'moneytrail/fetchPhonePeEntries',
  async () => {
    // Replace with actual API call
    const response = await fetch('/api/phonepe-entries');
    if (!response.ok) throw new Error('Failed to fetch PhonePe entries');
    return response.json();
  }
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankEntries.fulfilled, (state, action: PayloadAction<WithId<BankEntry>[]>) => {
        state.bankEntries = action.payload;
        state.loading = false;
      })
      .addCase(fetchBankEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bank entries';
      })
      .addCase(fetchPhonePeEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhonePeEntries.fulfilled, (state, action: PayloadAction<WithId<PhonepeEntry>[]>) => {
        state.phonepeEntries = action.payload;
        state.loading = false;
      })
      .addCase(fetchPhonePeEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch PhonePe entries';
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
