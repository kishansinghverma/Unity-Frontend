import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '..';

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  company?: string;
  lastContact?: string;
  notes?: string;
}

interface CustomersState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

// Sample initial data
const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    status: 'active',
    company: 'Acme Inc.',
    lastContact: '2023-05-15',
    notes: 'Premium customer, interested in new products'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    status: 'active',
    company: 'Tech Solutions Ltd',
    lastContact: '2023-06-02',
    notes: 'Recent upgrade to enterprise plan'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '(555) 456-7890',
    status: 'inactive',
    company: 'Global Services',
    lastContact: '2023-01-10',
    notes: 'Account dormant for 5 months'
  }
];

// Initial state
const initialState: CustomersState = {
  items: sampleCustomers,
  loading: false,
  error: null
};

// Async thunks (simulated API calls)
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For this demo, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return sampleCustomers;
    } catch (error) {
      return rejectWithValue('Failed to fetch customers');
    }
  }
);

// Slice
export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Omit<Customer, 'id'>>) => {
      const newCustomer = {
        ...action.payload,
        id: uuidv4()
      };
      state.items.push(newCustomer);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.items.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(customer => customer.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Export actions
export const { addCustomer, updateCustomer, deleteCustomer } = customersSlice.actions;

// Export selectors
export const selectAllCustomers = (state: RootState) => state.customers.items;
export const selectCustomerById = (id: string) => 
  (state: RootState) => 
    state.customers.items.find(customer => customer.id === id);
export const selectCustomersLoading = (state: RootState) => state.customers.loading;
export const selectCustomersError = (state: RootState) => state.customers.error;

export default customersSlice.reducer; 