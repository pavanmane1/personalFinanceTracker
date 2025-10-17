import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboard/dashboardService';


const initialState = {
    data: [],
    loading: false,
    error: null

}

// 🔹 Login AsyncThunk
export const getDahboardData = createAsyncThunk('testRedux/getDahboardData', async (_, { rejectWithValue }) => {
    try {
        const response = await dashboardService.getDashboardData();
        return response; // contains { message, token, user }
    } catch (error) {
        return rejectWithValue(error?.response?.data || error.message || 'Login failed');
    }
}
);

const testReduxSlice = createSlice({
    name: 'testRedux',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getDahboardData.pending, (state, action) => {
                state.loading = true;
            }).addCase(getDahboardData.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            }).addCase(getDahboardData.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default testReduxSlice.reducer;
