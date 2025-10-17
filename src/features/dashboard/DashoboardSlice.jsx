import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboard/dashboardService';

// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_, thunkAPI) => {
        try {
            return await dashboardService.getDashboardData();
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch dashboard data';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    summary: {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
    },
    monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        income: new Array(12).fill(0),
        expenses: new Array(12).fill(0)
    },
    recentTransactions: [],
    allTransactionsCount: 0,
    loading: false,
    error: null,
    lastUpdated: null
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateTransaction: (state, action) => {
            // Update transaction in recentTransactions if it exists
            const updatedTransaction = action.payload;
            const index = state.recentTransactions.findIndex(
                t => t.id === updatedTransaction.id
            );
            if (index !== -1) {
                state.recentTransactions[index] = updatedTransaction;
                // Recalculate summary if needed
                if (updatedTransaction.category_name === 'Income') {
                    state.summary.totalIncome += parseFloat(updatedTransaction.amount) -
                        parseFloat(state.recentTransactions[index].amount);
                } else {
                    state.summary.totalExpense += parseFloat(updatedTransaction.amount) -
                        parseFloat(state.recentTransactions[index].amount);
                }
                state.summary.balance = state.summary.totalIncome - state.summary.totalExpense;
            }
        },

        addTransaction: (state, action) => {
            const newTransaction = action.payload;
            state.recentTransactions.unshift(newTransaction);

            if (newTransaction.category_name === 'Income') {
                state.summary.totalIncome += parseFloat(newTransaction.amount);
            } else {
                state.summary.totalExpense += parseFloat(newTransaction.amount);
            }
            state.summary.balance = state.summary.totalIncome - state.summary.totalExpense;
            state.allTransactionsCount += 1;
        },

        deleteTransaction: (state, action) => {
            const transactionId = action.payload;
            const transaction = state.recentTransactions.find(t => t.id === transactionId);

            if (transaction) {
                if (transaction.category_name === 'Income') {
                    state.summary.totalIncome -= parseFloat(transaction.amount);
                } else {
                    state.summary.totalExpense -= parseFloat(transaction.amount);
                }
                state.summary.balance = state.summary.totalIncome - state.summary.totalExpense;
                state.recentTransactions = state.recentTransactions.filter(
                    t => t.id !== transactionId
                );
                state.allTransactionsCount -= 1;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.summary = action.payload.summary;
                state.recentTransactions = action.payload.recentTransactions;
                state.monthlyData = action.payload.monthlyData; // Add this line

                state.allTransactionsCount = action.payload.allTransactionsCount;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, updateTransaction, addTransaction, deleteTransaction } = dashboardSlice.actions;
export default dashboardSlice.reducer;