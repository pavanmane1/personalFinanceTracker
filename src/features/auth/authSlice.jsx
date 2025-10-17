import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth/authService';

// 🔹 Login AsyncThunk
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            return response; // contains { message, token, user }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message || 'Login failed');
        }
    }
);

// 🔹 Login AsyncThunk
export const RegisterUser = createAsyncThunk(
    'auth/RegisterUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.register(credentials);
            return response; // contains { message, token, user }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message || 'Login failed');
        }
    }
);
// 🔹 Restore session from sessionStorage
export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (_, { dispatch }) => {
        const storedUser = sessionStorage.getItem('userInfo');
        if (storedUser) {
            const userInfo = JSON.parse(storedUser);
            const expiryTime = userInfo.expiry;
            const currentTime = Date.now();

            if (!expiryTime || expiryTime > currentTime) {
                dispatch(setAuth(userInfo));
                // Auto logout after expiry (if expiryTime exists)
                if (expiryTime) {
                    const remainingTime = expiryTime - currentTime;
                    setTimeout(() => {
                        sessionStorage.removeItem('userInfo');
                        dispatch(logout());
                        window.location.href = '/login';
                    }, remainingTime);
                }
                return userInfo;
            } else {
                sessionStorage.removeItem('userInfo');
                dispatch(logout());
                window.location.href = '/login';
            }
        }
        return null;
    }
);

const initialState = {
    userInfo: sessionStorage.getItem('userInfo')
        ? JSON.parse(sessionStorage.getItem('userInfo'))
        : null,
    isAuthenticated: !!sessionStorage.getItem('userInfo'),
    loading: {
        userInfo: false,
    },
    error: {
        userInfo: null,
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = true;
            state.userInfo = action.payload;
            state.loading.userInfo = false;
            state.error.userInfo = null;
        },
        logout: (state) => {
            sessionStorage.removeItem('userInfo');
            state.userInfo = null;
            state.isAuthenticated = false;
            state.loading.userInfo = false;
            state.error.userInfo = null;
        },
        clearAuthError: (state) => {
            state.error.userInfo = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Restore session
            .addCase(restoreSession.pending, (state) => {
                state.loading.userInfo = true;
            })
            .addCase(restoreSession.fulfilled, (state, action) => {
                if (action.payload) {
                    state.userInfo = action.payload;
                    state.isAuthenticated = true;
                }
                state.loading.userInfo = false;
            })
            .addCase(restoreSession.rejected, (state) => {
                state.loading.userInfo = false;
            })

            // Login user
            .addCase(loginUser.pending, (state) => {
                state.loading.userInfo = true;
                state.error.userInfo = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.userInfo = {
                    token: action.payload.token,
                    user: action.payload.user,
                    message: action.payload.message,
                };
                state.isAuthenticated = true;
                state.loading.userInfo = false;
                state.error.userInfo = null;

                // Save in sessionStorage
                const userInfo = {
                    token: action.payload.token,
                    user: action.payload.user,
                    loginTime: Date.now(),
                    expiry: Date.now() + 24 * 60 * 60 * 1000,
                };
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading.userInfo = false;
                state.error.userInfo = action.payload;
            });
    }
});

export const { setAuth, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
