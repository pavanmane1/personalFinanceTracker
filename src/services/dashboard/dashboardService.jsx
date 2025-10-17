import apiClient from '../../config/apiClient';

const dashboardService = {
    // Get dashboard data
    getDashboardData: async () => {
        try {
            const response = await apiClient.get('/dashboard');
            console.log("Dashboard Data:", response.data.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    },

    // Get financial summary
    getFinancialSummary: async (period = 'monthly') => {
        const response = await apiClient.get(`/dashboard/summary?period=${period}`);
        return response.data;
    },

    // Get transaction statistics
    getTransactionStats: async (startDate, endDate) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get('/dashboard/stats', { params });
        return response.data;
    },

    // Get spending by category
    getSpendingByCategory: async (period = 'current_month') => {
        const response = await apiClient.get(`/dashboard/categories?period=${period}`);
        return response.data;
    },

    // Get recent transactions with pagination
    getRecentTransactions: async (limit = 10, page = 1) => {
        const response = await apiClient.get('/dashboard/transactions/recent', {
            params: { limit, page }
        });
        return response.data;
    },

    // Get monthly trends
    getMonthlyTrends: async (months = 12) => {
        const response = await apiClient.get(`/dashboard/trends/monthly?months=${months}`);
        return response.data;
    }
};

export default dashboardService;
