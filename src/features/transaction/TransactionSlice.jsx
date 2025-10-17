// features/transaction/transactionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import transactionService from '../../services/transaction/transactionService';

// Async thunks
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await transactionService.getTransactions();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async (transactionData, { rejectWithValue }) => {
        try {
            const response = await transactionService.createTransaction(transactionData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/updateTransaction',
    async ({ id, transactionData }, { rejectWithValue }) => {
        try {
            const response = await transactionService.updateTransaction(id, transactionData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async (id, { rejectWithValue }) => {
        try {
            await transactionService.deleteTransaction(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'transactions/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await transactionService.getCategories();
            // Return the categories array from the response
            return response.categories || response.data || response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Initial state
const initialState = {
    transactions: [],
    categories: [],
    currentTransaction: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
    }
};

// Transaction slice
const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentTransaction: (state, action) => {
            state.currentTransaction = action.payload;
        },
        clearCurrentTransaction: (state) => {
            state.currentTransaction = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch transactions
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;

                // Handle the API response structure
                if (action.payload && action.payload.transactions) {
                    state.transactions = action.payload.transactions;
                } else if (Array.isArray(action.payload)) {
                    state.transactions = action.payload;
                } else if (action.payload && Array.isArray(action.payload.data)) {
                    state.transactions = action.payload.data;
                } else {
                    state.transactions = [];
                }

                // Update pagination
                state.pagination = {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: state.transactions.length,
                    hasNext: false,
                    hasPrev: false
                };
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.transactions = [];
            })

            // Create transaction
            .addCase(createTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.loading = false;
                const newTransaction = action.payload.transaction || action.payload.data || action.payload;
                if (newTransaction) {
                    state.transactions.unshift(newTransaction);
                }
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update transaction
            .addCase(updateTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTransaction = action.payload.transaction || action.payload.data || action.payload;
                if (updatedTransaction) {
                    const index = state.transactions.findIndex(t => t.id === updatedTransaction.id);
                    if (index !== -1) {
                        state.transactions[index] = updatedTransaction;
                    }
                }
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete transaction
            .addCase(deleteTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = state.transactions.filter(t => t.id !== action.payload);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                // Set categories directly from the payload (which is the categories array)
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export actions and reducer
export const {
    clearError,
    setCurrentTransaction,
    clearCurrentTransaction
} = transactionSlice.actions;

export default transactionSlice.reducer;