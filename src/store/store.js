import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/DashoboardSlice';
import transactionReducer from '../features/transaction/TransactionSlice';
import testredux from '../features/testReduxSlice/TestReduxSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        transactions: transactionReducer,
        testredux: testredux

    },
});

export default store;